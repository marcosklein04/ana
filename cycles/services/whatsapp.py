import logging

from django.conf import settings
from django.utils import timezone
from twilio.rest import Client

from cycles.models import NotificationLog

logger = logging.getLogger("cycles")


def _get_twilio_client():
    return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


def build_reminder_message(profile):
    """Construye el mensaje de recordatorio personalizado."""
    return (
        f"Hola {profile.name} 💜\n\n"
        f"Te recuerdo que tu próximo período está estimado para mañana "
        f"({profile.next_predicted_period.strftime('%d/%m/%Y')}).\n\n"
        f"¡Preparate con todo lo que necesites! 🌸"
    )


def send_whatsapp_message(phone_number, message):
    """Envía un mensaje por WhatsApp usando Twilio. Retorna el SID o None si falla."""
    client = _get_twilio_client()
    to = f"whatsapp:{phone_number}" if not phone_number.startswith("whatsapp:") else phone_number

    twilio_message = client.messages.create(
        from_=settings.TWILIO_WHATSAPP_FROM,
        body=message,
        to=to,
    )
    logger.info("WhatsApp enviado a %s — SID: %s", phone_number, twilio_message.sid)
    return {"sid": twilio_message.sid, "status": twilio_message.status}


def send_reminder_for_profile(profile):
    """Envía recordatorio para un perfil y registra el log. Retorna el NotificationLog."""
    today = timezone.localdate()
    message = build_reminder_message(profile)

    # Verificar duplicado
    existing = NotificationLog.objects.filter(
        profile=profile,
        scheduled_for=today,
        status=NotificationLog.Status.SENT,
    ).exists()
    if existing:
        logger.info("Recordatorio ya enviado hoy para %s, omitiendo.", profile.name)
        return None

    log = NotificationLog.objects.create(
        profile=profile,
        message=message,
        scheduled_for=today,
        status=NotificationLog.Status.PENDING,
    )

    try:
        response = send_whatsapp_message(profile.whatsapp_phone, message)
        log.status = NotificationLog.Status.SENT
        log.sent_at = timezone.now()
        log.provider_response = response
        log.save()
        logger.info("Recordatorio enviado exitosamente a %s", profile.name)
    except Exception:
        log.status = NotificationLog.Status.FAILED
        log.save()
        logger.exception("Error enviando recordatorio a %s", profile.name)

    return log

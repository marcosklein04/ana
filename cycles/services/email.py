import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from cycles.models import NotificationLog

logger = logging.getLogger("cycles")


def _when_text(days_before):
    """Texto natural según los días de anticipación."""
    if days_before <= 0:
        return "hoy"
    if days_before == 1:
        return "mañana"
    return f"en {days_before} días"


def build_reminder_subject():
    return "Ana 💜 Tu próximo período se acerca"


def build_reminder_body(profile, days_before):
    """Construye el cuerpo del recordatorio personalizado."""
    when = _when_text(days_before)
    fecha = profile.next_predicted_period.strftime("%d/%m/%Y")
    return (
        f"Hola {profile.name} 💜\n\n"
        f"Te recordamos que tu próximo período está estimado para {when} "
        f"({fecha}).\n\n"
        f"¡Preparate con todo lo que necesites! 🌸\n\n"
        f"— Ana"
    )


def send_reminder_email_for_profile(profile, days_before=None):
    """Envía el recordatorio por email y registra el log. Retorna el NotificationLog
    (o None si ya se había enviado hoy / no hay email)."""
    if not profile.email:
        logger.warning("Perfil %s sin email, omitiendo recordatorio.", profile.name)
        return None

    if days_before is None:
        days_before = settings.REMINDER_DAYS_BEFORE

    today = timezone.localdate()

    # Ya enviado hoy → no duplicar.
    if NotificationLog.objects.filter(
        profile=profile,
        scheduled_for=today,
        status=NotificationLog.Status.SENT,
    ).exists():
        logger.info("Recordatorio ya enviado hoy para %s, omitiendo.", profile.name)
        return None

    message = build_reminder_body(profile, days_before)

    # update_or_create respeta la constraint unique(profile, scheduled_for):
    # si un intento previo de hoy quedó FAILED/PENDING, se reutiliza esa fila
    # en vez de violar la constraint (fix del 500 al reintentar).
    log, _ = NotificationLog.objects.update_or_create(
        profile=profile,
        scheduled_for=today,
        defaults={
            "message": message,
            "status": NotificationLog.Status.PENDING,
            "sent_at": None,
            "provider_response": None,
        },
    )

    try:
        sent = send_mail(
            subject=build_reminder_subject(),
            message=message,
            from_email=None,  # usa DEFAULT_FROM_EMAIL
            recipient_list=[profile.email],
            fail_silently=False,
        )
        log.status = NotificationLog.Status.SENT
        log.sent_at = timezone.now()
        log.provider_response = {"sent": sent, "backend": settings.EMAIL_BACKEND}
        log.save()
        logger.info("Recordatorio enviado por email a %s (%s)", profile.name, profile.email)
    except Exception:
        log.status = NotificationLog.Status.FAILED
        log.save()
        logger.exception("Error enviando recordatorio por email a %s", profile.name)

    return log

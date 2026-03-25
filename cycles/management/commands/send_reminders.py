import logging
from datetime import timedelta

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from cycles.models import CycleProfile
from cycles.services.whatsapp import send_reminder_for_profile

logger = logging.getLogger("cycles")


class Command(BaseCommand):
    help = "Envía recordatorios de período por WhatsApp a los perfiles activos que correspondan hoy."

    def handle(self, *args, **options):
        today = timezone.localdate()
        days_before = settings.REMINDER_DAYS_BEFORE
        reminder_target = today + timedelta(days=days_before)

        self.stdout.write(f"Buscando perfiles con período estimado para {reminder_target}...")

        profiles = CycleProfile.objects.filter(
            is_active=True,
            next_predicted_period=reminder_target,
        )

        if not profiles.exists():
            self.stdout.write(self.style.WARNING("No hay recordatorios para enviar hoy."))
            return

        sent = 0
        skipped = 0
        failed = 0

        for profile in profiles:
            log = send_reminder_for_profile(profile)
            if log is None:
                skipped += 1
            elif log.status == "sent":
                sent += 1
            else:
                failed += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Resultado: {sent} enviados, {skipped} omitidos, {failed} fallidos."
            )
        )

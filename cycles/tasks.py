import logging

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django.conf import settings
from django.core.management import call_command
from django_apscheduler.jobstores import DjangoJobStore

logger = logging.getLogger("cycles")

scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)
scheduler.add_jobstore(DjangoJobStore(), "default")


def daily_send_reminders():
    """Tarea diaria: enviar recordatorios pendientes."""
    logger.info("Ejecutando tarea diaria de recordatorios...")
    call_command("send_reminders")


def start_scheduler():
    if scheduler.running:
        return

    scheduler.add_job(
        daily_send_reminders,
        trigger=CronTrigger(hour=9, minute=0),
        id="daily_send_reminders",
        max_instances=1,
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler iniciado — recordatorios programados para las 09:00 diariamente.")


# Iniciar solo si no estamos en un comando de management (migrate, makemigrations, etc.)
import sys

if "runserver" in sys.argv:
    start_scheduler()

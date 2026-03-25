import logging
import sys

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django.conf import settings
from django.core.management import call_command
from django_apscheduler.jobstores import DjangoJobStore

logger = logging.getLogger("cycles")


def daily_send_reminders():
    """Tarea diaria: enviar recordatorios pendientes."""
    logger.info("Ejecutando tarea diaria de recordatorios...")
    call_command("send_reminders")


def start_scheduler():
    scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)
    scheduler.add_jobstore(DjangoJobStore(), "default")
    scheduler.add_job(
        daily_send_reminders,
        trigger=CronTrigger(hour=9, minute=0),
        id="daily_send_reminders",
        max_instances=1,
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler iniciado — recordatorios programados para las 09:00 diariamente.")


# Iniciar con runserver o gunicorn
_management_commands = {"migrate", "makemigrations", "collectstatic", "check", "createsuperuser", "shell"}
if not _management_commands.intersection(sys.argv):
    try:
        start_scheduler()
    except Exception:
        logger.exception("No se pudo iniciar el scheduler")

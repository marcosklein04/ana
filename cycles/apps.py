from django.apps import AppConfig


class CyclesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cycles"
    verbose_name = "Ciclos menstruales"

    def ready(self):
        from cycles import tasks  # noqa: F401

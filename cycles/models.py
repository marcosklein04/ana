from datetime import timedelta

from django.db import models


class CycleProfile(models.Model):
    name = models.CharField("Nombre", max_length=120)
    whatsapp_phone = models.CharField(
        "Teléfono WhatsApp",
        max_length=20,
        help_text="Formato internacional, ej: +5491155551234",
    )
    last_period_start = models.DateField("Último inicio de período", null=True, blank=True)
    cycle_length = models.PositiveSmallIntegerField("Duración del ciclo (días)", default=28)
    next_predicted_period = models.DateField("Próximo período estimado", null=True, blank=True)
    is_active = models.BooleanField("Activa", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de ciclo"
        verbose_name_plural = "Perfiles de ciclo"
        ordering = ["-updated_at"]

    def __str__(self):
        return self.name

    def recalculate_next_period(self):
        if self.last_period_start:
            self.next_predicted_period = self.last_period_start + timedelta(days=self.cycle_length)
        else:
            self.next_predicted_period = None

    def save(self, *args, **kwargs):
        self.recalculate_next_period()
        super().save(*args, **kwargs)


class PeriodRecord(models.Model):
    profile = models.ForeignKey(
        CycleProfile,
        on_delete=models.CASCADE,
        related_name="period_records",
        verbose_name="Perfil",
    )
    start_date = models.DateField("Fecha de inicio")
    notes = models.TextField("Notas", blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Registro de período"
        verbose_name_plural = "Registros de período"
        ordering = ["-start_date"]
        constraints = [
            models.UniqueConstraint(
                fields=["profile", "start_date"],
                name="unique_period_per_profile_date",
            ),
        ]

    def __str__(self):
        return f"{self.profile.name} — {self.start_date}"


class NotificationLog(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pendiente"
        SENT = "sent", "Enviado"
        FAILED = "failed", "Fallido"

    profile = models.ForeignKey(
        CycleProfile,
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name="Perfil",
    )
    message = models.TextField("Mensaje")
    scheduled_for = models.DateField("Programado para")
    sent_at = models.DateTimeField("Enviado a las", null=True, blank=True)
    status = models.CharField(
        "Estado",
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    provider_response = models.JSONField("Respuesta del proveedor", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Log de notificación"
        verbose_name_plural = "Logs de notificación"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["profile", "scheduled_for"],
                name="unique_notification_per_profile_date",
            ),
        ]

    def __str__(self):
        return f"{self.profile.name} — {self.scheduled_for} [{self.status}]"

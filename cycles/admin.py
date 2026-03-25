from django.contrib import admin

from cycles.models import CycleProfile, NotificationLog, PeriodRecord


@admin.register(CycleProfile)
class CycleProfileAdmin(admin.ModelAdmin):
    list_display = ["name", "whatsapp_phone", "last_period_start", "next_predicted_period", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["name", "whatsapp_phone"]


@admin.register(PeriodRecord)
class PeriodRecordAdmin(admin.ModelAdmin):
    list_display = ["profile", "start_date", "created_at"]
    list_filter = ["start_date"]
    search_fields = ["profile__name"]


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ["profile", "scheduled_for", "status", "sent_at"]
    list_filter = ["status", "scheduled_for"]
    search_fields = ["profile__name"]

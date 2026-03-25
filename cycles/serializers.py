from rest_framework import serializers

from cycles.models import CycleProfile, NotificationLog, PeriodRecord


class CycleProfileSerializer(serializers.ModelSerializer):
    whatsapp = serializers.CharField(source="whatsapp_phone")
    reminders_enabled = serializers.BooleanField(source="is_active")

    class Meta:
        model = CycleProfile
        fields = [
            "id",
            "name",
            "whatsapp",
            "last_period_start",
            "cycle_length",
            "next_predicted_period",
            "reminders_enabled",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "next_predicted_period", "created_at", "updated_at"]


class PeriodRecordSerializer(serializers.ModelSerializer):
    profile_id = serializers.PrimaryKeyRelatedField(source="profile", read_only=True)

    class Meta:
        model = PeriodRecord
        fields = ["id", "profile_id", "start_date", "notes", "created_at"]
        read_only_fields = ["id", "profile_id", "created_at"]


class NextPeriodSerializer(serializers.Serializer):
    next_period_date = serializers.DateField()
    days_remaining = serializers.IntegerField()
    days_elapsed = serializers.IntegerField()
    cycle_length = serializers.IntegerField()
    current_phase = serializers.CharField()
    reminder_date = serializers.DateField()


class NotificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationLog
        fields = [
            "id",
            "profile",
            "message",
            "scheduled_for",
            "sent_at",
            "status",
            "provider_response",
            "created_at",
        ]
        read_only_fields = fields

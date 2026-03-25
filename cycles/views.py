import logging
from datetime import timedelta

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from cycles.models import CycleProfile, PeriodRecord
from cycles.serializers import (
    CycleProfileSerializer,
    NextPeriodSerializer,
    NotificationLogSerializer,
    PeriodRecordSerializer,
)
from cycles.services.cycle_calculator import calculate_reminder_date, calculate_phase
from cycles.services.whatsapp import send_reminder_for_profile

logger = logging.getLogger("cycles")


class CycleProfileViewSet(viewsets.ModelViewSet):
    queryset = CycleProfile.objects.all()
    serializer_class = CycleProfileSerializer

    @action(detail=True, methods=["get", "post"], url_path="periods")
    def periods(self, request, pk=None):
        profile = self.get_object()

        if request.method == "GET":
            records = profile.period_records.all()
            serializer = PeriodRecordSerializer(records, many=True)
            return Response(serializer.data)

        serializer = PeriodRecordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        record = serializer.save(profile=profile)

        # Actualizar last_period_start si es la fecha más reciente
        if profile.last_period_start is None or record.start_date > profile.last_period_start:
            profile.last_period_start = record.start_date
            profile.save()

        return Response(PeriodRecordSerializer(record).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], url_path="next-period")
    def next_period(self, request, pk=None):
        profile = self.get_object()

        if not profile.next_predicted_period:
            return Response(
                {"detail": "No hay fecha de período registrada para calcular la predicción."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        today = timezone.localdate()
        days_remaining = max(0, (profile.next_predicted_period - today).days)
        days_elapsed = (today - profile.last_period_start).days
        reminder_date = calculate_reminder_date(profile.next_predicted_period)
        phase = calculate_phase(days_elapsed)

        serializer = NextPeriodSerializer(
            {
                "next_period_date": profile.next_predicted_period,
                "days_remaining": days_remaining,
                "days_elapsed": days_elapsed,
                "cycle_length": profile.cycle_length,
                "current_phase": phase,
                "reminder_date": reminder_date,
            }
        )
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="send-test-reminder")
    def send_test_reminder(self, request, pk=None):
        profile = self.get_object()

        if not profile.is_active:
            return Response(
                {"detail": "El perfil está inactivo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not profile.next_predicted_period:
            return Response(
                {"detail": "No hay próximo período calculado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        log = send_reminder_for_profile(profile)
        if log is None:
            return Response({"detail": "Recordatorio ya enviado hoy."})

        return Response(NotificationLogSerializer(log).data, status=status.HTTP_201_CREATED)

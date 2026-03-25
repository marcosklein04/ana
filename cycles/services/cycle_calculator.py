from datetime import timedelta


def calculate_next_period(last_period_start, cycle_length=28):
    """Calcula la próxima fecha estimada de período."""
    return last_period_start + timedelta(days=cycle_length)


def calculate_reminder_date(next_period_date, days_before=1):
    """Calcula la fecha en que se debe enviar el recordatorio."""
    return next_period_date - timedelta(days=days_before)


def calculate_phase(days_elapsed):
    """Determina la fase del ciclo según los días transcurridos."""
    if days_elapsed <= 5:
        return "menstrual"
    elif days_elapsed <= 13:
        return "follicular"
    elif days_elapsed <= 16:
        return "ovulation"
    else:
        return "luteal"

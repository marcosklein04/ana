# Generated for the email reminder channel.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cycles", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="cycleprofile",
            name="email",
            field=models.EmailField(
                blank=True,
                default="",
                help_text="Dirección a la que se envía el recordatorio.",
                max_length=254,
                verbose_name="Email",
            ),
        ),
    ]

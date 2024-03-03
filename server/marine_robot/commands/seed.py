# type: ignore
import os
import shutil
from pathlib import Path

import pandas as pd
from accounts.models import CustomUser
from django.core.management import call_command
from django.core.management.base import BaseCommand
from model_bakery import baker

from server.models import AuthToken, Conversation, Word

# from server.recipes import message_recipe


class Command(BaseCommand):
    help = "Resets the database and populates it with sample data"

    def handle(self, *args, **options):
        if "DATABASE_URL" in os.environ:
            self.stdout.write(self.style.ERROR("DATABASE_URL is defined. Aborting."))
            return

        # Delete migrations
        current_dir = os.path.dirname(os.path.abspath(__file__))
        migrations_dir = os.path.join(current_dir, "../../migrations/")
        for filename in os.listdir(migrations_dir):
            if filename != "__init__.py":
                file_path = os.path.join(migrations_dir, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)

        call_command("reset_db", "--noinput")
        call_command("makemigrations")
        call_command("migrate")

        words = pd.read_csv(
            "~/repos/nugget/project/data/10000-russian-words-cyrillic-only.txt"
        )
        for word in words.iloc[:1000, 0].values.tolist():
            Word.objects.get_or_create(word=word, language="RU")

        CustomUser.objects.create_superuser(
            username="newuser", password="a92e7965-3927-45e0-b34c-60c6884c4efd"
        )
        # AuthToken.objects.create(user=CustomUser.objects.first(), token="a92e7965-3927-45e0-b34c-60c6884c4efd")

        Conversation.objects.create(
            name="Test Conversation",
            language="RU",
            uuid="a92e7965-3927-45e0-b34c-60c6884c4efd",
        )

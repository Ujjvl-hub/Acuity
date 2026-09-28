
from django.db import migrations


def repair_score_columns(apps, schema_editor):
    InterviewAnswer = apps.get_model(
        "interview_sessions",
        "InterviewAnswer",
    )

    table_name = InterviewAnswer._meta.db_table

    with schema_editor.connection.cursor() as cursor:
        existing_columns = {
            column.name
            for column in schema_editor.connection.introspection
            .get_table_description(cursor, table_name)
        }

    missing_fields = [
        "technical_score",
        "communication_score",
        "problem_solving_score",
    ]

    for field_name in missing_fields:
        if field_name not in existing_columns:
            field = InterviewAnswer._meta.get_field(field_name)
            schema_editor.add_field(InterviewAnswer, field)


class Migration(migrations.Migration):
    dependencies = [
        ("interview_sessions", "0002_interviewsession_interview_type_and_more"),
    ]

    operations = [
        migrations.RunPython(
            repair_score_columns,
            migrations.RunPython.noop,
        ),
    ]
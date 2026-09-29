from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='categorie',
            field=models.CharField(blank=True, default='Autre', max_length=50),
        ),
    ]

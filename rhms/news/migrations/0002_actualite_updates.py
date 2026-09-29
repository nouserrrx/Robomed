# Generated manually for Actualite model updates

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='actualite',
            name='categorie',
            field=models.CharField(choices=[('Actualité', 'Actualité'), ('Rapport', 'Rapport'), ('Événement', 'Événement'), ('Communiqué', 'Communiqué'), ('Témoignage', 'Témoignage')], default='Actualité', max_length=50),
        ),
        migrations.AddField(
            model_name='actualite',
            name='commentaires',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='actualite',
            name='image_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='actualite',
            name='resume',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='actualite',
            name='vues',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='actualite',
            name='auteur',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='actualites', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='actualite',
            name='contenu',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='actualite',
            name='statut',
            field=models.CharField(choices=[('brouillon', 'Brouillon'), ('publie', 'Publié')], default='publie', max_length=20),
        ),
    ]

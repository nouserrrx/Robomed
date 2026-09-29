from django.db import models


class Campagne(models.Model):
    STATUT_CHOICES = [
        ('active', 'Active'),
        ('terminee', 'Terminée'),
        ('a_venir', 'À venir'),
    ]
    projet = models.ForeignKey('projects.Projet', on_delete=models.CASCADE, null=True, blank=True, related_name='campagnes')
    titre = models.CharField(max_length=200)
    description = models.TextField()
    objectif = models.DecimalField(max_digits=12, decimal_places=2)
    collecte = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    date_debut = models.DateField()
    date_fin = models.DateField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='a_venir')
    image = models.ImageField(upload_to='campaigns/', blank=True, null=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return str(self.titre)


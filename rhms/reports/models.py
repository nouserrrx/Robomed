from django.db import models


class Rapport(models.Model):
    TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    titre = models.CharField(max_length=200)
    fichier = models.FileField(upload_to='rapports/', blank=True, null=True)
    date_generation = models.DateTimeField(auto_now_add=True)
    parametres = models.JSONField(default=dict, blank=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return str(self.titre)


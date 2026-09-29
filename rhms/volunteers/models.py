from django.db import models


class Benevole(models.Model):
    utilisateur = models.OneToOneField('accounts.CustomUser', on_delete=models.CASCADE, related_name='benevole')
    competences = models.TextField(blank=True)
    disponibilites = models.TextField(blank=True)
    date_inscription = models.DateTimeField(auto_now_add=True)
    statut = models.BooleanField(default=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.utilisateur.get_full_name() or self.utilisateur.username}"


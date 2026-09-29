from django.db import models


class Contact(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    categorie = models.CharField(max_length=50, default='Autre', blank=True)
    sujet = models.CharField(max_length=200)
    message = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.nom} - {self.sujet}"


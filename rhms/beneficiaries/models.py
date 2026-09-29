from django.db import models


class Beneficiaire(models.Model):
    TYPE_AIDE_CHOICES = [
        ('alimentaire', 'Aide alimentaire'),
        ('medicale', 'Aide médicale'),
        ('educative', 'Aide éducative'),
        ('logement', 'Aide au logement'),
        ('autre', 'Autre'),
    ]
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    telephone = models.CharField(max_length=20)
    adresse = models.TextField(blank=True)
    photo = models.ImageField(upload_to='beneficiaires/', blank=True, null=True)
    type_aide = models.CharField(max_length=20, choices=TYPE_AIDE_CHOICES, default='autre')
    date_enregistrement = models.DateTimeField(auto_now_add=True)
    statut = models.BooleanField(default=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.prenom} {self.nom}"


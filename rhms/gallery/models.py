from django.db import models


class Media(models.Model):
    TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Vidéo'),
    ]
    titre = models.CharField(max_length=200)
    fichier = models.FileField(upload_to='gallery/', blank=True, null=True)
    url = models.URLField(max_length=500, blank=True, null=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='image')
    categorie = models.CharField(max_length=100, blank=True, default='Général')
    date_upload = models.DateTimeField(auto_now_add=True)
    statut = models.BooleanField(default=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return str(self.titre)


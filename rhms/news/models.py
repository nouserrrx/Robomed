from django.db import models



class Actualite(models.Model):
    STATUT_CHOICES = [
        ('brouillon', 'Brouillon'),
        ('publie', 'Publié'),
    ]
    CATEGORIE_CHOICES = [
        ('Actualité', 'Actualité'),
        ('Rapport', 'Rapport'),
        ('Événement', 'Événement'),
        ('Communiqué', 'Communiqué'),
        ('Témoignage', 'Témoignage'),
    ]
    titre = models.CharField(max_length=200)
    categorie = models.CharField(max_length=50, choices=CATEGORIE_CHOICES, default='Actualité')
    resume = models.TextField(blank=True, null=True)
    contenu = models.TextField(blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='actualites/', blank=True, null=True)
    date_publication = models.DateTimeField(auto_now_add=True)
    auteur = models.ForeignKey('accounts.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='actualites')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='publie')
    vues = models.PositiveIntegerField(default=0)
    commentaires = models.PositiveIntegerField(default=0)

    objects = models.Manager()

    def __str__(self) -> str:
        return str(self.titre)


class Evenement(models.Model):
    STATUT_CHOICES = [
        ('a_venir', 'À venir'),
        ('en_cours', 'En cours'),
        ('termine', 'Terminé'),
    ]
    titre = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='evenements/', blank=True, null=True)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    lieu = models.CharField(max_length=200, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='a_venir')

    objects = models.Manager()

    def __str__(self) -> str:
        return str(self.titre)



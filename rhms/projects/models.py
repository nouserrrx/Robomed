from django.db import models


class Projet(models.Model):
    STATUT_CHOICES = [
        ('en_cours', 'En cours'),
        ('termine', 'Terminé'),
        ('a_venir', 'À venir'),
    ]
    titre = models.CharField(max_length=200)
    description = models.TextField()
    budget = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    date_debut = models.DateField()
    date_fin = models.DateField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='a_venir')
    progression = models.IntegerField(default=0)
    date_creation = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return str(self.titre)


class Mission(models.Model):
    STATUT_CHOICES = [
        ('a_faire', 'À faire'),
        ('en_cours', 'En cours'),
        ('terminee', 'Terminée'),
    ]
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='missions')
    benevole = models.ForeignKey('volunteers.Benevole', on_delete=models.SET_NULL, null=True, blank=True, related_name='missions')
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date_debut = models.DateField()
    date_fin = models.DateField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='a_faire')

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.titre} - {self.projet.titre}"


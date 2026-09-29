from django.db import models


class Produit(models.Model):
    nom = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    categorie = models.CharField(max_length=100, blank=True)
    unite_mesure = models.CharField(max_length=50, default='unité')

    objects = models.Manager()

    def __str__(self) -> str:
        return str(self.nom)


class Stock(models.Model):
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='stocks')
    quantite = models.DecimalField(max_digits=10, decimal_places=2)
    seuil_alerte = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    location = models.CharField(max_length=150, default="🇹🇩 N'Djamena (Tchad)", blank=True)
    date_mise_a_jour = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.produit.nom} - {self.quantite}"


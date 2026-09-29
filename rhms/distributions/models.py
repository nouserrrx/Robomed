from django.db import models, transaction
from django.core.exceptions import ValidationError


class Distribution(models.Model):
    produit = models.ForeignKey('stocks.Produit', on_delete=models.CASCADE, related_name='distributions')
    beneficiaire = models.ForeignKey('beneficiaries.Beneficiaire', on_delete=models.CASCADE, related_name='distributions')
    quantite = models.DecimalField(max_digits=10, decimal_places=2)
    date_distribution = models.DateTimeField(auto_now_add=True)
    lieu = models.CharField(max_length=200, blank=True)
    coordonnee = models.ForeignKey('accounts.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='distributions')
    notes = models.TextField(blank=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"Distribution {self.produit.nom} - {self.beneficiaire}"


    def clean(self):
        super().clean()
        if self.quantite is not None and self.quantite <= 0:
            raise ValidationError({'quantite': 'La quantité distribuée doit être supérieure à zéro.'})

    def save(self, *args, **kwargs):
        with transaction.atomic():
            is_new = self.pk is None
            old_quantity = 0
            if not is_new:
                try:
                    old_instance = Distribution.objects.select_for_update().get(pk=self.pk)
                    old_quantity = old_instance.quantite
                except Distribution.DoesNotExist:
                    pass

            from stocks.models import Stock
            stock, _ = Stock.objects.select_for_update().get_or_create(
                produit=self.produit,
                defaults={'quantite': 0}
            )

            diff = self.quantite - old_quantity
            if stock.quantite - diff < 0:
                raise ValidationError({
                    'quantite': f"Stock insuffisant pour '{self.produit.nom}'. Stock disponible: {stock.quantite}, quantité supplémentaire demandée: {diff}."
                })

            stock.quantite -= diff
            stock.save()
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        with transaction.atomic():
            from stocks.models import Stock
            try:
                stock = Stock.objects.select_for_update().get(produit=self.produit)
                stock.quantite += self.quantite
                stock.save()
            except Stock.DoesNotExist:
                pass
            super().delete(*args, **kwargs)


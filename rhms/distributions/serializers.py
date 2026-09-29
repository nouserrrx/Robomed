from rest_framework import serializers
from rest_framework.exceptions import ValidationError as DRFValidationError
from .models import Distribution
from stocks.models import Stock


class DistributionSerializer(serializers.ModelSerializer):
    produit_nom = serializers.ReadOnlyField(source='produit.nom')
    beneficiaire_nom = serializers.ReadOnlyField(source='beneficiaire.__str__')

    class Meta:
        model = Distribution
        fields = '__all__'

    def validate(self, attrs):
        produit = attrs.get('produit', getattr(self.instance, 'produit', None))
        quantite = attrs.get('quantite', getattr(self.instance, 'quantite', None))

        if quantite is not None and quantite <= 0:
            raise DRFValidationError({'quantite': 'La quantité distribuée doit être supérieure à zéro.'})

        if produit and quantite is not None:
            old_quantity = getattr(self.instance, 'quantite', 0) if self.instance else 0
            diff = quantite - old_quantity

            stock = Stock.objects.filter(produit=produit).first()
            stock_qty = stock.quantite if stock else 0

            if stock_qty - diff < 0:
                raise DRFValidationError({
                    'quantite': f"Stock insuffisant pour '{produit.nom}'. Stock disponible : {stock_qty}, quantité demandée : {diff}."
                })

        return attrs

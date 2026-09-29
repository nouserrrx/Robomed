from rest_framework import serializers
from .models import Produit, Stock


class StockSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source='produit.nom', read_only=True)
    categorie = serializers.CharField(source='produit.categorie', read_only=True)
    unite_mesure = serializers.CharField(source='produit.unite_mesure', read_only=True)

    nom = serializers.CharField(write_only=True, required=False)
    unite = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Stock
        fields = [
            'id', 'produit', 'produit_nom', 'categorie', 'unite_mesure',
            'quantite', 'seuil_alerte', 'location', 'date_mise_a_jour',
            'nom', 'unite'
        ]
        extra_kwargs = {
            'produit': {'required': False, 'allow_null': True}
        }

    def create(self, validated_data):
        nom = validated_data.pop('nom', None)
        unite = validated_data.pop('unite', 'unités')
        categorie = self.initial_data.get('categorie', 'Humanitaire')
        produit = validated_data.pop('produit', None)

        if not produit and nom:
            produit, _ = Produit.objects.get_or_create(
                nom=nom,
                defaults={'categorie': categorie, 'unite_mesure': unite}
            )

        if not produit:
            produit, _ = Produit.objects.get_or_create(
                nom="Article sans nom",
                defaults={'categorie': "Humanitaire", 'unite_mesure': "unités"}
            )

        validated_data['produit'] = produit
        return super().create(validated_data)


class ProduitSerializer(serializers.ModelSerializer):
    stocks = StockSerializer(many=True, read_only=True)

    class Meta:
        model = Produit
        fields = '__all__'

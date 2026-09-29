from rest_framework import serializers
from .models import Don


class DonSerializer(serializers.ModelSerializer):
    donateur_nom = serializers.SerializerMethodField(read_only=True)
    campagne_titre = serializers.CharField(source='campagne.titre', read_only=True)

    class Meta:
        model = Don
        fields = '__all__'

    def get_donateur_nom(self, obj):
        if obj.donateur:
            return f"{obj.donateur.first_name} {obj.donateur.last_name}".strip() or obj.donateur.username
        return "Donateur Anonyme"

    def validate_montant(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le montant du don doit être supérieur à zéro.")
        return value

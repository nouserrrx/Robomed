from rest_framework import serializers
from .models import Campagne


class CampagneSerializer(serializers.ModelSerializer):
    projet_titre = serializers.CharField(source='projet.titre', read_only=True)
    taux_completion = serializers.SerializerMethodField()
    nb_dons = serializers.SerializerMethodField()

    class Meta:
        model = Campagne
        fields = '__all__'

    def get_taux_completion(self, obj) -> float:
        if obj.objectif and obj.objectif > 0:
            return round(min(100.0, float((obj.collecte / obj.objectif) * 100)), 1)
        return 0.0

    def get_nb_dons(self, obj) -> int:
        return obj.dons.filter(statut='confirme').count()

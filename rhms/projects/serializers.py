from rest_framework import serializers
from .models import Projet, Mission


class MissionSerializer(serializers.ModelSerializer):
    projet_titre = serializers.CharField(source='projet.titre', read_only=True)
    benevole_nom = serializers.SerializerMethodField()

    class Meta:
        model = Mission
        fields = '__all__'

    def get_benevole_nom(self, obj) -> str:
        if obj.benevole and obj.benevole.utilisateur:
            u = obj.benevole.utilisateur
            full = f"{u.first_name} {u.last_name}".strip()
            return full or u.username
        return "Non assigné"


class ProjetSerializer(serializers.ModelSerializer):
    missions = MissionSerializer(many=True, read_only=True)

    class Meta:
        model = Projet
        fields = '__all__'

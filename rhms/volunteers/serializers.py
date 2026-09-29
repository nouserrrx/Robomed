from rest_framework import serializers
from .models import Benevole


class BenevoleSerializer(serializers.ModelSerializer):
    nom = serializers.SerializerMethodField()
    email = serializers.CharField(source='utilisateur.email', read_only=True)
    telephone = serializers.CharField(source='utilisateur.phone', read_only=True)
    username = serializers.CharField(source='utilisateur.username', read_only=True)

    applicant_name = serializers.CharField(write_only=True, required=False)
    applicant_email = serializers.EmailField(write_only=True, required=False)
    applicant_phone = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Benevole
        fields = '__all__'
        extra_kwargs = {
            'utilisateur': {'required': False, 'allow_null': True}
        }

    def get_nom(self, obj) -> str:
        if obj.utilisateur:
            full = f"{obj.utilisateur.first_name} {obj.utilisateur.last_name}".strip()
            return full or obj.utilisateur.username
        return "Candidat Bénévole"


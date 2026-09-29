from rest_framework import serializers
from .models import Beneficiaire


class BeneficiaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiaire
        fields = '__all__'

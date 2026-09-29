from rest_framework import serializers
from .models import Actualite, Evenement




class ActualiteSerializer(serializers.ModelSerializer):
    auteur_name = serializers.ReadOnlyField(source='auteur.get_full_name')

    class Meta:
        model = Actualite
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            ret['image_url'] = request.build_absolute_uri(instance.image.url) if request else instance.image.url
        return ret


class EvenementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evenement
        fields = '__all__'


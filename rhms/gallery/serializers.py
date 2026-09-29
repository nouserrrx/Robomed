from rest_framework import serializers
from .models import Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.fichier and not instance.url:
            request = self.context.get('request')
            ret['url'] = request.build_absolute_uri(instance.fichier.url) if request else instance.fichier.url
        return ret

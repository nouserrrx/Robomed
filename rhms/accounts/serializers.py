from rest_framework import serializers
from .models import CustomUser, Profile, IncidentLog, TeamMember


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class CustomUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'photo', 'address', 'statut',
            'is_approved', 'date_creation', 'profile'
        ]


class IncidentLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = IncidentLog
        fields = ['id', 'level', 'message', 'source', 'created_at', 'user', 'user_name']


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            'id', 'nom', 'role', 'branch', 'photo', 'photo_url',
            'email', 'tags', 'bio', 'missions', 'icon_type',
            'color_theme', 'color', 'ordre', 'actif', 'created_at'
        ]

    def to_internal_value(self, data):
        import json
        from django.http import QueryDict

        if isinstance(data, QueryDict):
            clean_data = {k: data.get(k) for k in data.keys()}
        elif hasattr(data, 'copy'):
            clean_data = dict(data)
        else:
            clean_data = dict(data)

        for field in ['tags', 'missions']:
            val = clean_data.get(field)
            if isinstance(val, str):
                try:
                    clean_data[field] = json.loads(val)
                except Exception:
                    clean_data[field] = [s.strip() for s in val.split(',') if s.strip()]

        return super().to_internal_value(clean_data)

    def update(self, instance, validated_data):
        # Si une nouvelle URL de photo externe/statique est fournie sans fichier de photo,
        # réinitialiser le champ de fichier photo pour que photo_url prenne la main
        if 'photo_url' in validated_data and 'photo' not in validated_data:
            new_photo_url = validated_data.get('photo_url')
            if new_photo_url and instance.photo:
                instance.photo = None
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Assurer que 'photo' est une URL exploitable pour le frontend
        if instance.photo:
            request = self.context.get('request')
            ret['photo'] = request.build_absolute_uri(instance.photo.url) if request else instance.photo.url
        else:
            ret['photo'] = instance.photo_url or None
        # Rétrocompatibilité avec les composants attendant 'name'
        ret['name'] = instance.nom
        return ret


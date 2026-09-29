from rest_framework.viewsets import ModelViewSet
from .models import Media
from .serializers import MediaSerializer
from accounts.permissions import IsAdminOrReadOnly


class MediaViewSet(ModelViewSet):
    """
    Galerie multimédia :
    - Consultation publique (GET).
    - Téléversement et suppression strictement réservés aux administrateurs/coordinateurs.
    """
    queryset = Media.objects.all().order_by('-date_upload')
    serializer_class = MediaSerializer
    permission_classes = [IsAdminOrReadOnly]

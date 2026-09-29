from rest_framework.routers import DefaultRouter
from .views import MediaViewSet

router = DefaultRouter()
router.register('medias', MediaViewSet)
router.register('', MediaViewSet, basename='media-root')

urlpatterns = router.urls

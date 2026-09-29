from rest_framework.routers import DefaultRouter
from .views import ProjetViewSet, MissionViewSet

router = DefaultRouter()
router.register('projets', ProjetViewSet)
router.register('missions', MissionViewSet)
router.register('', ProjetViewSet, basename='projet-root')

urlpatterns = router.urls

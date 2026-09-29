from rest_framework.routers import DefaultRouter
from .views import CampagneViewSet

router = DefaultRouter()
router.register('campagnes', CampagneViewSet)
router.register('', CampagneViewSet, basename='campagne-root')

urlpatterns = router.urls

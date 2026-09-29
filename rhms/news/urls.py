from rest_framework.routers import DefaultRouter
from .views import ActualiteViewSet, EvenementViewSet

router = DefaultRouter()
router.register('actualites', ActualiteViewSet)
router.register('evenements', EvenementViewSet)
router.register('', ActualiteViewSet, basename='actualite-root')

urlpatterns = router.urls

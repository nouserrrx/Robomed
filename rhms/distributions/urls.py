from rest_framework.routers import DefaultRouter
from .views import DistributionViewSet

router = DefaultRouter()
router.register('distributions', DistributionViewSet)
router.register('', DistributionViewSet, basename='distribution-root')

urlpatterns = router.urls

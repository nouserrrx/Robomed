from rest_framework.routers import DefaultRouter
from .views import DonViewSet

router = DefaultRouter()
router.register('dons', DonViewSet)
router.register('', DonViewSet, basename='don-root')

urlpatterns = router.urls

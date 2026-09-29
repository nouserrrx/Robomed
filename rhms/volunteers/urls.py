from rest_framework.routers import DefaultRouter
from .views import BenevoleViewSet

router = DefaultRouter()
router.register('benevoles', BenevoleViewSet)
router.register('', BenevoleViewSet, basename='benevole-root')

urlpatterns = router.urls

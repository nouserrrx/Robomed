from rest_framework.routers import DefaultRouter
from .views import BeneficiaireViewSet

router = DefaultRouter()
router.register('beneficiaires', BeneficiaireViewSet)
router.register('', BeneficiaireViewSet, basename='beneficiaire-root')

urlpatterns = router.urls

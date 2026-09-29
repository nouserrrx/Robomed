from rest_framework.routers import DefaultRouter
from .views import ProduitViewSet, StockViewSet

router = DefaultRouter()
router.register('produits', ProduitViewSet)
router.register('stocks', StockViewSet)
router.register('', StockViewSet, basename='stock-root')

urlpatterns = router.urls

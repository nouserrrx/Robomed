from rest_framework.routers import DefaultRouter
from .views import ContactViewSet

router = DefaultRouter()
router.register('contacts', ContactViewSet, basename='contacts-alias')
router.register('', ContactViewSet, basename='contact-root')

urlpatterns = router.urls

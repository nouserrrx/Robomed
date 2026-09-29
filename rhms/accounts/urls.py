from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, ProfileViewSet, IncidentLogViewSet, TeamMemberViewSet, api_login, api_me

router = DefaultRouter()
router.register('users', CustomUserViewSet)
router.register('profiles', ProfileViewSet)
router.register('logs', IncidentLogViewSet)
router.register('team', TeamMemberViewSet, basename='team')

urlpatterns = [
    path('login/', api_login, name='api_login'),
    path('me/', api_me, name='api_me'),
    path('', include(router.urls)),
]


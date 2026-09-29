from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RapportViewSet, ImpactStatsView, export_activity_pdf, export_excel

router = DefaultRouter()
router.register('rapports', RapportViewSet)

urlpatterns = [
    path('stats/', ImpactStatsView.as_view(), name='impact-stats'),
    path('export/pdf/', export_activity_pdf, name='export-pdf'),
    path('export/excel/', export_excel, name='export-excel'),
] + router.urls


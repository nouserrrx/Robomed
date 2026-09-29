from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum, Q

from .models import Rapport
from .serializers import RapportSerializer
from accounts.permissions import IsAdminOrCoordinator

from beneficiaries.models import Beneficiaire
from donations.models import Don
from distributions.models import Distribution
from projects.models import Projet
from volunteers.models import Benevole
from accounts.models import CustomUser


class RapportViewSet(ModelViewSet):
    queryset = Rapport.objects.all()
    serializer_class = RapportSerializer
    permission_classes = [IsAdminOrCoordinator]


class ImpactStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        nb_beneficiaires = Beneficiaire.objects.count()
        nb_dons = Don.objects.filter(statut='confirme').count()
        nb_distributions = Distribution.objects.count()
        nb_projets = Projet.objects.count()

        # Calcul sans doublon des bénévoles (fiches et comptes bénévoles unifiés)
        benevole_user_ids = set(Benevole.objects.values_list('utilisateur_id', flat=True))
        user_benevole_ids = set(CustomUser.objects.filter(role='benevole').values_list('id', flat=True))
        nb_benevoles = len(benevole_user_ids | user_benevole_ids)

        quantite_distribuee = Distribution.objects.aggregate(total=Sum('quantite'))['total'] or 0

        # Points d'eau sans doublon
        nb_points_eau = Projet.objects.filter(Q(titre__icontains='puits') | Q(titre__icontains='eau')).count()
        nb_enfants = Beneficiaire.objects.filter(type_aide='educative').count()

        return Response({
            'beneficiaires': nb_beneficiaires,
            'dons': nb_dons,
            'distributions': nb_distributions,
            'points_eau': nb_points_eau,
            'articles_distribues': int(quantite_distribuee),
            'vetements': int(quantite_distribuee),
            'enfants': nb_enfants,
            'benevoles': nb_benevoles,
            'projets': nb_projets,
        })


from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from .generators import build_activity_pdf_report, build_excel_report


@api_view(['GET'])
@permission_classes([IsAdminOrCoordinator])
def export_activity_pdf(request):
    """Génère et télécharge le rapport d'activité officiel en PDF."""
    pdf_buffer = build_activity_pdf_report()
    response = HttpResponse(pdf_buffer.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="Rapport_Activite_RoBomed.pdf"'
    return response


@api_view(['GET'])
@permission_classes([IsAdminOrCoordinator])
def export_excel(request):
    """Génère et télécharge le classeur consolidé Excel multi-feuilles."""
    excel_buffer = build_excel_report()
    response = HttpResponse(
        excel_buffer.read(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="Donnees_Consolidees_RoBomed.xlsx"'
    return response



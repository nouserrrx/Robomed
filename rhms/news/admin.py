from django.contrib import admin  # type: ignore
from .models import Actualite, Evenement


@admin.register(Actualite)
class ActualiteAdmin(admin.ModelAdmin):
    list_display = ('titre', 'categorie', 'statut', 'date_publication', 'vues')  # type: ignore
    list_filter = ('statut', 'categorie', 'date_publication')
    search_fields = ('titre', 'resume', 'contenu')


@admin.register(Evenement)
class EvenementAdmin(admin.ModelAdmin):
    list_display = ('titre', 'lieu', 'statut', 'date_debut', 'date_fin')  # type: ignore
    list_filter = ('statut', 'date_debut')
    search_fields = ('titre', 'description', 'lieu')




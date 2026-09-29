from django.contrib import admin  # type: ignore
from .models import Media


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('titre', 'type', 'categorie', 'statut', 'date_upload')  # type: ignore
    list_filter = ('type', 'categorie', 'statut', 'date_upload')
    search_fields = ('titre', 'categorie')


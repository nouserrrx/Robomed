from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/donations/', include('donations.urls')),
    path('api/beneficiaries/', include('beneficiaries.urls')),
    path('api/volunteers/', include('volunteers.urls')),
    path('api/campaigns/', include('campaigns.urls')),
    path('api/stocks/', include('stocks.urls')),
    path('api/distributions/', include('distributions.urls')),
    path('api/news/', include('news.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/contacts/', include('contacts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


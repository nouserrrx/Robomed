from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('visiteur', 'Visiteur'),
        ('donateur', 'Donateur'),
        ('benevole', 'Bénévole'),
        ('coordinateur', 'Coordinateur'),
        ('administrateur', 'Administrateur'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='visiteur')
    phone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='users/', blank=True, null=True)
    address = models.TextField(blank=True)
    statut = models.BooleanField(default=True)
    is_approved = models.BooleanField(
        default=False,
        help_text="Compte approuvé par l'administrateur. Requis pour se connecter."
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    def __str__(self) -> str:
        return str(self.username)


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"Profil de {self.user.username}"


class IncidentLog(models.Model):
    LEVEL_CHOICES = [
        ('INFO', 'Info'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('CRITICAL', 'Critical'),
    ]
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='INFO')
    message = models.TextField()
    source = models.CharField(max_length=100, default='system')
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"[{self.level}] {self.message[:50]} ({self.created_at})"


class TeamMember(models.Model):
    nom = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    branch = models.CharField(max_length=50, default='Canada')
    photo = models.ImageField(upload_to='team/', blank=True, null=True)
    photo_url = models.CharField(max_length=500, blank=True, default='', help_text="Chemin statique ou URL d'image")
    email = models.EmailField(blank=True, default='')
    tags = models.JSONField(default=list, blank=True)
    bio = models.TextField(blank=True, default='')
    missions = models.JSONField(default=list, blank=True)
    icon_type = models.CharField(max_length=50, blank=True, default='shield')
    color_theme = models.CharField(max_length=50, blank=True, default='yellow')
    color = models.CharField(max_length=100, blank=True, default='')
    ordre = models.PositiveIntegerField(default=0)
    actif = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    class Meta:
        ordering = ['ordre', 'id']

    def __str__(self) -> str:
        return f"{self.nom} ({self.role})"



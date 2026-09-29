from django.db import models


class Don(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirme', 'Confirmé'),
        ('annule', 'Annulé'),
    ]
    donateur = models.ForeignKey('accounts.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='dons')
    campagne = models.ForeignKey('campaigns.Campagne', on_delete=models.SET_NULL, null=True, blank=True, related_name='dons')
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    date_don = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    reference = models.CharField(max_length=100, unique=True)
    recu_pdf = models.FileField(upload_to='recus/', blank=True, null=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"Don {self.reference} - {self.montant}"


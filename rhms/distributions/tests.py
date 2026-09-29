from django.test import TestCase
from django.core.exceptions import ValidationError
from beneficiaries.models import Beneficiaire
from stocks.models import Produit, Stock
from distributions.models import Distribution


class DistributionStockLogicTests(TestCase):
    def setUp(self):
        self.beneficiaire = Beneficiaire.objects.create(
            nom="Touré",
            prenom="Fatima",
            telephone="+23566000000",
            type_aide="alimentaire"
        )
        self.produit = Produit.objects.create(
            nom="Riz 50kg",
            categorie="Aide alimentaire",
            unite_mesure="sacs"
        )
        self.stock = Stock.objects.create(
            produit=self.produit,
            quantite=100,
            seuil_alerte=20,
            location="N'Djamena"
        )

    def test_distribution_deducts_stock(self):
        dist = Distribution.objects.create(
            produit=self.produit,
            beneficiaire=self.beneficiaire,
            quantite=25,
            lieu="N'Djamena Centre"
        )
        self.stock.refresh_from_db()
        self.assertEqual(self.stock.quantite, 75)

    def test_distribution_exceeding_stock_raises_error(self):
        with self.assertRaises(ValidationError):
            dist = Distribution(
                produit=self.produit,
                beneficiaire=self.beneficiaire,
                quantite=150,
                lieu="N'Djamena"
            )
            dist.save()

    def test_distribution_deletion_restores_stock(self):
        dist = Distribution.objects.create(
            produit=self.produit,
            beneficiaire=self.beneficiaire,
            quantite=30,
            lieu="N'Djamena"
        )
        self.stock.refresh_from_db()
        self.assertEqual(self.stock.quantite, 70)
        dist.delete()
        self.stock.refresh_from_db()
        self.assertEqual(self.stock.quantite, 100)

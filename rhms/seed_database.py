import os
import sys
import django
from datetime import datetime, date, timedelta
from decimal import Decimal

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import CustomUser, TeamMember, IncidentLog
from projects.models import Projet, Mission
from campaigns.models import Campagne
from donations.models import Don
from beneficiaries.models import Beneficiaire
from volunteers.models import Benevole
from stocks.models import Produit, Stock
from distributions.models import Distribution
from news.models import Actualite
from gallery.models import Media


def run_seed():
    print("🌱 Démarrage de l'injection des données de démonstration RoBomed (RHMS)...")

    # ─────────────────────────────────────────────────────────────
    # 1. UTILISATEURS POUR LES 5 PROFILS
    # ─────────────────────────────────────────────────────────────
    print("\n1. Création des comptes utilisateurs pour les 5 profils...")
    users_data = [
        {
            'username': 'admin_robomed',
            'email': 'admin@robomed.org',
            'first_name': 'Nouradine',
            'last_name': 'Mahamat',
            'role': 'administrateur',
            'phone': '+1 514 555 0101',
            'address': 'Montréal, QC, Canada',
            'is_staff': True,
            'is_superuser': True,
            'password': 'RobomedAdmin2026!'
        },
        {
            'username': 'sarah_coord',
            'email': 'coordinateur@robomed.org',
            'first_name': 'Sarah',
            'last_name': 'Tremblay',
            'role': 'coordinateur',
            'phone': '+1 514 555 0102',
            'address': 'Montréal / N\'Djamena',
            'is_staff': False,
            'is_superuser': False,
            'password': 'Coordinateur2026!'
        },
        {
            'username': 'moussa_benevole',
            'email': 'benevole@robomed.org',
            'first_name': 'Moussa',
            'last_name': 'Hassan',
            'role': 'benevole',
            'phone': '+235 66 12 34 56',
            'address': 'N\'Djamena, Tchad',
            'is_staff': False,
            'is_superuser': False,
            'password': 'Benevole2026!'
        },
        {
            'username': 'jeanmarc_donateur',
            'email': 'donateur@robomed.org',
            'first_name': 'Jean-Marc',
            'last_name': 'Dubois',
            'role': 'donateur',
            'phone': '+1 438 555 0199',
            'address': 'Québec, QC, Canada',
            'is_staff': False,
            'is_superuser': False,
            'password': 'Donateur2026!'
        },
        {
            'username': 'awa_visiteur',
            'email': 'visiteur@robomed.org',
            'first_name': 'Awa',
            'last_name': 'Ousmane',
            'role': 'visiteur',
            'phone': '+235 99 88 77 66',
            'address': 'Abéché, Tchad',
            'is_staff': False,
            'is_superuser': False,
            'password': 'Visiteur2026!'
        }
    ]

    created_users = {}
    for u_info in users_data:
        pwd = u_info.pop('password')
        user, created = CustomUser.objects.get_or_create(
            email=u_info['email'],
            defaults={**u_info, 'is_approved': True, 'statut': True}
        )
        user.set_password(pwd)
        user.role = u_info['role']
        user.is_approved = True
        user.is_staff = u_info['is_staff']
        user.is_superuser = u_info['is_superuser']
        user.save()
        created_users[user.role] = user
        action_txt = "créé" if created else "mis à jour"
        print(f"   ✓ Compte {user.role.upper()} : {user.email} (mdp: {pwd}) [{action_txt}]")

    # Création fiche bénévole pour le compte benevole
    benevole_user = created_users['benevole']
    Benevole.objects.get_or_create(
        utilisateur=benevole_user,
        defaults={
            'competences': 'Logistique de terrain, animation jeunesse, secourisme de base, trilingue Arabe/Français/Anglais',
            'disponibilites': 'Week-ends et missions d\'été (juillet-août)',
            'statut': True
        }
    )

    # ─────────────────────────────────────────────────────────────
    # 2. PROJETS HUMANITAIRES
    # ─────────────────────────────────────────────────────────────
    print("\n2. Création des Projets Humanitaires majeurs...")
    projets_data = [
        {
            'titre': "Puits d'eau potable solaires (Mandélia & Chari-Baguirmi)",
            'description': "Installation de forages à pompage solaire photovoltaïque fournissant de l'eau potable propre et durable à plus de 3 500 villageois.",
            'budget': Decimal('15000.00'),
            'date_debut': date(2025, 1, 15),
            'date_fin': date(2025, 12, 20),
            'statut': 'en_cours',
            'progression': 75,
        },
        {
            'titre': "Distribution de fournitures et manuels scolaires (Mongo - Guéra)",
            'description': "Fourniture de sacs, cahiers, stylos et livres d'apprentissage pour 1 200 élèves d'écoles primaires rurales au Tchad.",
            'budget': Decimal('8500.00'),
            'date_debut': date(2024, 9, 1),
            'date_fin': date(2025, 2, 28),
            'statut': 'termine',
            'progression': 100,
        },
        {
            'titre': "Fleurs au crochet & Lettres de réconfort en soins palliatifs (Montréal)",
            'description': "Ateliers solidaires de création de fleurs durables en crochet accompagnées de courriers manuscrits pour les personnes âgées et patients en fin de vie.",
            'budget': Decimal('4000.00'),
            'date_debut': date(2025, 2, 1),
            'date_fin': date(2025, 11, 30),
            'statut': 'en_cours',
            'progression': 60,
        },
        {
            'titre': "Friandises solidaires & Réconfort en oncologie pédiatrique (Québec)",
            'description': "Colis surprises, peluches et activités récréatives pour apporter de la joie aux enfants hospitalisés en oncologie pédiatrique.",
            'budget': Decimal('5500.00'),
            'date_debut': date(2025, 3, 1),
            'date_fin': date(2025, 12, 15),
            'statut': 'en_cours',
            'progression': 45,
        },
        {
            'titre': "Clinique mobile & Sensibilisation à la santé communautaire",
            'description': "Campagne itinérante de dépistage, distribution de kits d'hygiène et sensibilisation des populations vulnérables aux bonnes pratiques d'eau et santé.",
            'budget': Decimal('12000.00'),
            'date_debut': date(2025, 10, 1),
            'date_fin': date(2026, 6, 30),
            'statut': 'a_venir',
            'progression': 10,
        }
    ]

    saved_projects = []
    for p_info in projets_data:
        p, _ = Projet.objects.get_or_create(
            titre=p_info['titre'],
            defaults=p_info
        )
        saved_projects.append(p)
        print(f"   ✓ Projet : {p.titre} ({p.progression}% - {p.statut})")

    # ─────────────────────────────────────────────────────────────
    # 3. CAMPAGNES DE FINANCEMENT (LEVÉE DE FONDS)
    # ─────────────────────────────────────────────────────────────
    print("\n3. Création des Campagnes de Collecte...")
    campagnes_data = [
        {
            'projet': saved_projects[0],
            'titre': "Campagne Puits Solaire Mandélia 2025",
            'description': "Financez l'infrastructure du château d'eau et les panneaux solaires pour le village de Mandélia.",
            'objectif': Decimal('15000.00'),
            'collecte': Decimal('11250.00'),
            'date_debut': date(2025, 1, 15),
            'date_fin': date(2025, 7, 31),
            'statut': 'active',
        },
        {
            'projet': saved_projects[1],
            'titre': "Objectif 1000 Cartables & Manuels Scolaires",
            'description': "Achetez un kit scolaire complet pour un élève du Guéra et soutenez la scolarisation des jeunes filles.",
            'objectif': Decimal('8500.00'),
            'collecte': Decimal('8500.00'),
            'date_debut': date(2024, 9, 1),
            'date_fin': date(2025, 2, 28),
            'statut': 'terminee',
        },
        {
            'projet': saved_projects[2],
            'titre': "Mille Fleurs d'Espoir pour nos Aînés",
            'description': "Soutien aux bénévoles confectionnant des fleurs et cartes réconfortantes dans les hôpitaux québécois.",
            'objectif': Decimal('4000.00'),
            'collecte': Decimal('2450.00'),
            'date_debut': date(2025, 2, 1),
            'date_fin': date(2025, 11, 30),
            'statut': 'active',
        },
        {
            'projet': saved_projects[3],
            'titre': "Sourires d'Enfants en Hôpital Pédiatrique",
            'description': "Offrez une boîte de réconfort et des friandises solidaires aux enfants suivis en oncologie.",
            'objectif': Decimal('5500.00'),
            'collecte': Decimal('2800.00'),
            'date_debut': date(2025, 3, 1),
            'date_fin': date(2025, 12, 15),
            'statut': 'active',
        }
    ]

    saved_campagnes = []
    for c_info in campagnes_data:
        c, _ = Campagne.objects.get_or_create(
            titre=c_info['titre'],
            defaults=c_info
        )
        saved_campagnes.append(c)
        print(f"   ✓ Campagne : {c.titre} ({c.collecte} / {c.objectif})")

    # ─────────────────────────────────────────────────────────────
    # 4. MISSIONS DE TERRAIN
    # ─────────────────────────────────────────────────────────────
    print("\n4. Création des Missions de terrain...")
    benevole_obj = Benevole.objects.filter(utilisateur=benevole_user).first()
    missions_data = [
        {
            'projet': saved_projects[0],
            'benevole': benevole_obj,
            'titre': "Suivi technique et test de débit du forage",
            'description': "Contrôle de conformité de la pompe immergée et analyse bactériologique de l'eau.",
            'date_debut': date(2025, 4, 1),
            'date_fin': date(2025, 4, 10),
            'statut': 'en_cours',
        },
        {
            'projet': saved_projects[1],
            'benevole': benevole_obj,
            'titre': "Distribution des cartables à l'école primaire de Mongo",
            'description': "Remise en main propre des fournitures scolaires aux élèves de CP et CE1.",
            'date_debut': date(2024, 11, 15),
            'date_fin': date(2024, 11, 20),
            'statut': 'terminee',
        },
        {
            'projet': saved_projects[2],
            'benevole': None,
            'titre': "Atelier de confection collective de fleurs crochetées",
            'description': "Encadrement d'un groupe d'étudiants pour crocheter 100 fleurs durables sur le campus.",
            'date_debut': date(2025, 5, 5),
            'date_fin': date(2025, 5, 7),
            'statut': 'a_faire',
        },
        {
            'projet': saved_projects[3],
            'benevole': None,
            'titre': "Visite d'animation & distribution de jeux en pédiatrie",
            'description': "Animation ludique avec les éducateurs de l'hôpital pour les enfants hospitalisés.",
            'date_debut': date(2025, 6, 12),
            'date_fin': date(2025, 6, 13),
            'statut': 'a_faire',
        }
    ]

    for m_info in missions_data:
        m, _ = Mission.objects.get_or_create(
            titre=m_info['titre'],
            projet=m_info['projet'],
            defaults=m_info
        )
        print(f"   ✓ Mission : {m.titre} [{m.statut}]")

    # ─────────────────────────────────────────────────────────────
    # 5. PRODUITS ET STOCKS DE RÉSERVE
    # ─────────────────────────────────────────────────────────────
    print("\n5. Création des Produits et Niveaux de Stock...")
    stocks_seed = [
        {
            'nom': "Kits scolaires complets (cahiers, stylos, cartable)",
            'categorie': "Éducation",
            'unite_mesure': "kits",
            'quantite': Decimal('450.00'),
            'seuil_alerte': Decimal('50.00'),
            'location': "🇹🇩 Entrepôt Central N'Djamena"
        },
        {
            'nom': "Sacs de riz 50kg (Aide alimentaire d'urgence)",
            'categorie': "Alimentaire",
            'unite_mesure': "sacs",
            'quantite': Decimal('180.00'),
            'seuil_alerte': Decimal('40.00'),
            'location': "🇹🇩 Entrepôt Mandélia"
        },
        {
            'nom': "Cartons de savon antiseptique & Kits d'hygiène",
            'categorie': "Santé & Hygiène",
            'unite_mesure': "cartons",
            'quantite': Decimal('220.00'),
            'seuil_alerte': Decimal('30.00'),
            'location': "🇹🇩 Entrepôt Central N'Djamena"
        },
        {
            'nom': "Fleurs solidaires au crochet & Cartes manuscrites",
            'categorie': "Soutien & Soins",
            'unite_mesure': "unités",
            'quantite': Decimal('320.00'),
            'seuil_alerte': Decimal('35.00'),
            'location': "🇨🇦 Antenne Montréal (Campus)"
        },
        {
            'nom': "Peluches et coffrets de friandises pédiatriques",
            'categorie': "Enfance",
            'unite_mesure': "boîtes",
            'quantite': Decimal('140.00'),
            'seuil_alerte': Decimal('20.00'),
            'location': "🇨🇦 Antenne Québec"
        }
    ]

    saved_stocks = []
    for s_info in stocks_seed:
        prod, _ = Produit.objects.get_or_create(
            nom=s_info['nom'],
            defaults={'categorie': s_info['categorie'], 'unite_mesure': s_info['unite_mesure']}
        )
        stk, _ = Stock.objects.get_or_create(
            produit=prod,
            defaults={
                'quantite': s_info['quantite'],
                'seuil_alerte': s_info['seuil_alerte'],
                'location': s_info['location']
            }
        )
        saved_stocks.append(stk)
        print(f"   ✓ Stock : {prod.nom} ({stk.quantite} {prod.unite_mesure})")

    # ─────────────────────────────────────────────────────────────
    # 6. BÉNÉFICIAIRES
    # ─────────────────────────────────────────────────────────────
    print("\n6. Enregistrement des Bénéficiaires...")
    beneficiaires_data = [
        {
            'nom': "Al-Hadj",
            'prenom': "Mariam",
            'telephone': "+235 66 40 11 22",
            'email': "mariam.alhadj@example.com",
            'adresse': "Village de Mandélia, Région du Chari-Baguirmi",
            'type_aide': "alimentaire",
            'statut': True
        },
        {
            'nom': "Brahim",
            'prenom': "Youssouf",
            'telephone': "+235 99 33 44 55",
            'email': "",
            'adresse': "Quartier Diguel, N'Djamena",
            'type_aide': "educative",
            'statut': True
        },
        {
            'nom': "Tremblay",
            'prenom': "Monique",
            'telephone': "+1 514 555 7890",
            'email': "m.tremblay@example.ca",
            'adresse': "Centre Hospitalier Soins Palliatifs, Montréal",
            'type_aide': "medicale",
            'statut': True
        },
        {
            'nom': "Bélanger",
            'prenom': "Lucas",
            'telephone': "+1 418 555 4567",
            'email': "famille.belanger@example.ca",
            'adresse': "Unité d'Oncologie Pédiatrique, Québec",
            'type_aide': "medicale",
            'statut': True
        },
        {
            'nom': "Khamis",
            'prenom': "Halimé",
            'telephone': "+235 62 10 90 80",
            'email': "",
            'adresse': "Canton Mongo, Région du Guéra",
            'type_aide': "educative",
            'statut': True
        }
    ]

    saved_beneficiaires = []
    for b_info in beneficiaires_data:
        b, _ = Beneficiaire.objects.get_or_create(
            nom=b_info['nom'],
            prenom=b_info['prenom'],
            defaults=b_info
        )
        saved_beneficiaires.append(b)
        print(f"   ✓ Bénéficiaire : {b.prenom} {b.nom} ({b.type_aide})")

    # ─────────────────────────────────────────────────────────────
    # 7. HISTORIQUE DES DISTRIBUTIONS
    # ─────────────────────────────────────────────────────────────
    print("\n7. Enregistrement des Distributions réalisées...")
    # Ne pas décrémenter de nouveau si déjà présent
    if Distribution.objects.count() < 4:
        distributions_to_seed = [
            (saved_stocks[0].produit, saved_beneficiaires[1], Decimal('2.00'), "École Primaire Diguel", "Remise des manuels de mathématiques et cartable"),
            (saved_stocks[1].produit, saved_beneficiaires[0], Decimal('1.00'), "Mandélia Centre", "Dotation alimentaire d'urgence pour famille vulnérable"),
            (saved_stocks[3].produit, saved_beneficiaires[2], Decimal('5.00'), "Hôpital de Montréal", "Bouquet de fleurs au crochet et cartes poétiques"),
            (saved_stocks[4].produit, saved_beneficiaires[3], Decimal('2.00'), "Pavillon Mère-Enfant", "Peluches et jeux d'éveil pour le patient"),
        ]
        for prod, ben, qty, lieu, notes in distributions_to_seed:
            try:
                Distribution.objects.create(
                    produit=prod,
                    beneficiaire=ben,
                    quantite=qty,
                    lieu=lieu,
                    notes=notes,
                    coordonnee=created_users['coordinateur']
                )
                print(f"   ✓ Distribution : {qty} {prod.unite_mesure} de {prod.nom} remis à {ben.prenom} {ben.nom}")
            except Exception as e:
                print(f"   ⚠ Distribution passée : {e}")

    # ─────────────────────────────────────────────────────────────
    # 8. DONS ET REÇUS FISCAUX
    # ─────────────────────────────────────────────────────────────
    print("\n8. Enregistrement des Dons d'exemple...")
    donateur_user = created_users['donateur']
    dons_data = [
        {
            'donateur': donateur_user,
            'campagne': saved_campagnes[0],
            'montant': Decimal('250.00'),
            'message': "Avec tout mon soutien pour les forages d'eau potable. Bravo pour votre travail !",
            'statut': 'confirme',
            'reference': 'RBM-2025-DON-1001'
        },
        {
            'donateur': donateur_user,
            'campagne': saved_campagnes[2],
            'montant': Decimal('100.00'),
            'message': "Pour égayer le quotidien de nos aînés en soins de confort.",
            'statut': 'confirme',
            'reference': 'RBM-2025-DON-1002'
        },
        {
            'donateur': None,
            'campagne': saved_campagnes[0],
            'montant': Decimal('500.00'),
            'message': "Don d'une fondation partenaire pour le réseau de tuyauterie.",
            'statut': 'confirme',
            'reference': 'RBM-2025-DON-1003'
        },
        {
            'donateur': None,
            'campagne': saved_campagnes[1],
            'montant': Decimal('25000.00'), # FCFA
            'message': "Vente de gâteaux solidaires sur le campus de N'Djamena.",
            'statut': 'confirme',
            'reference': 'RBM-2025-DON-1004'
        },
        {
            'donateur': donateur_user,
            'campagne': saved_campagnes[3],
            'montant': Decimal('75.00'),
            'message': "Pour les sourires des enfants en oncologie pédiatrique.",
            'statut': 'confirme',
            'reference': 'RBM-2025-DON-1005'
        }
    ]

    for d_info in dons_data:
        d, created = Don.objects.get_or_create(
            reference=d_info['reference'],
            defaults=d_info
        )
        print(f"   ✓ Don : {d.reference} - {d.montant} ({d.statut})")

    # ─────────────────────────────────────────────────────────────
    # 9. ACTUALITÉS & ARTICLES OFFICIELS
    # ─────────────────────────────────────────────────────────────
    print("\n9. Création des Actualités et Articles de presse...")
    actualites_data = [
        {
            'titre': "Inauguration du forage solaire de Mandélia : l'eau potable coule enfin !",
            'categorie': "Actualité",
            'resume': "Après deux semaines de travaux intensifs, les villageois de Mandélia ont célébré l'ouverture de leur premier château d'eau solaire entièrement automatisé.",
            'contenu': "Ce projet, financé grâce à la générosité de plus de 150 donateurs individuels du Canada et du Tchad, met fin aux longues marches quotidiennes pour puiser de l'eau insalubre dans le fleuve. L'eau a été certifiée sans risque biologique par le laboratoire national d'analyse des eaux.",
            'image_url': "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=1000",
            'statut': 'publie',
            'vues': 428,
            'commentaires': 19,
        },
        {
            'titre': "Bilan de la rentrée solidaire : 1 200 cartables distribués aux écoliers du Guéra",
            'categorie': "Rapport",
            'resume': "Notre équipe de bénévoles a parcouru 8 villages isolés pour remettre des fournitures scolaires neuves aux élèves du primaire.",
            'contenu': "Chaque kit contient 6 cahiers grand format, une trousse complète, des règles géométriques et des livres de lecture en français et arabe dialectal. Les maîtres d'école ont salué un impact immédiat sur l'assiduité des jeunes élèves.",
            'image_url': "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000",
            'statut': 'publie',
            'vues': 312,
            'commentaires': 12,
        },
        {
            'titre': "Ateliers Crochet & Réconfort : 300 fleurs durables offertes dans les CHSLD",
            'categorie': "Événement",
            'resume': "Les étudiants bénévoles de Montréal se sont mobilisés pour confectionner des fleurs colorées accompagnées de mots chaleureux pour les patients hospitalisés.",
            'contenu': "En soins palliatifs, les fleurs naturelles sont souvent restreintes pour des motifs d'hygiène. Les fleurs au crochet offrent une présence douce, colorée et permanente au chevet des patients. Un immense merci à toutes les mains créatrices !",
            'image_url': "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000",
            'statut': 'publie',
            'vues': 264,
            'commentaires': 8,
        },
        {
            'titre': "Lancement officiel de la plateforme numérique RHMS de RoBomed",
            'categorie': "Communiqué",
            'resume': "RoBomed franchit un jalon historique dans sa gouvernance avec le déploiement de sa plateforme intégrée de gestion humanitaire.",
            'contenu': "Le RHMS permet désormais une traçabilité intégrale de chaque euro ou franc CFA collecté, un suivi des stocks en temps réel entre le Canada et le Tchad, et l'émission instantanée des reçus fiscaux certifiés pour tous les donateurs.",
            'image_url': "https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&q=80&w=1000",
            'statut': 'publie',
            'vues': 512,
            'commentaires': 27,
        }
    ]

    for a_info in actualites_data:
        a, _ = Actualite.objects.get_or_create(
            titre=a_info['titre'],
            defaults={**a_info, 'auteur': created_users['administrateur']}
        )
        print(f"   ✓ Actualité : {a.titre[:45]}... ({a.statut})")

    # ─────────────────────────────────────────────────────────────
    # 10. MÉDIAS DE LA GALERIE
    # ─────────────────────────────────────────────────────────────
    print("\n10. Remplissage de la Galerie Média...")
    galerie_data = [
        {
            'titre': "Chantier d'installation des panneaux solaires",
            'type': 'image',
            'categorie': "Eau Potable & Énergie",
            'url': "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=1000",
            'statut': True,
        },
        {
            'titre': "Sourires des écolières à la remise des cartables",
            'type': 'image',
            'categorie': "Éducation",
            'url': "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000",
            'statut': True,
        },
        {
            'titre': "Confection minutieuse des fleurs en laine",
            'type': 'image',
            'categorie': "Santé & Réconfort",
            'url': "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000",
            'statut': True,
        },
        {
            'titre': "Distribution des vivres alimentaires d'urgence",
            'type': 'image',
            'categorie': "Aide Alimentaire",
            'url': "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=1000",
            'statut': True,
        }
    ]

    for g_info in galerie_data:
        Media.objects.get_or_create(
            titre=g_info['titre'],
            defaults=g_info
        )
        print(f"   ✓ Média galerie : {g_info['titre']}")

    print("\n🎉 Injection des données de démonstration terminée avec succès !")


if __name__ == '__main__':
    run_seed()

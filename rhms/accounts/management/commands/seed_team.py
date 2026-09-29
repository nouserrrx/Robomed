from django.core.management.base import BaseCommand
from accounts.models import TeamMember

DEFAULT_MEMBERS = [
    {
        'nom': 'Aïcha Baradine',
        'role': 'Présidente & Fondatrice',
        'branch': '🇨🇦 Canada',
        'photo_url': '/aicha.jpeg',
        'email': 'aicha@robomed.org',
        'tags': ['Leadership', 'Humanitaire'],
        'color': 'bg-amber-50 border-amber-200',
        'icon_type': 'shield',
        'color_theme': 'yellow',
        'bio': 'Piloter la vision globale et représenter RoBomed auprès des institutions (écoles, partenaires).',
        'missions': [
            'Prendre les décisions stratégiques.',
            'Signer les certificats de leadership des ambassadeurs.',
            'Assurer la cohésion internationale Canada-Tchad.',
        ],
        'ordre': 1,
    },
    {
        'nom': 'Khatera Amiri',
        'role': 'Rédactrice & Communication',
        'branch': '🇨🇦 Canada',
        'photo_url': '/khatera.jpeg',
        'email': 'khatera@robomed.org',
        'tags': ['Rédaction', 'Communication'],
        'color': 'bg-purple-50 border-purple-200',
        'icon_type': 'book',
        'color_theme': 'yellow',
        'bio': 'Produire du contenu écrit et des documents stratégiques pour RoBomed.',
        'missions': [
            'Rédaction des documents stratégiques et institutionnels.',
            'Coordination avec les équipes pour les reportages terrain.',
            'Amélioration continue de la communication écrite de l\'organisation.',
        ],
        'ordre': 2,
    },
    {
        'nom': 'Fatime Salim Ossou',
        'role': 'Marketing et gestion des réseaux sociaux',
        'branch': '🇨🇦 Canada',
        'photo_url': '/fatime.jpeg',
        'email': 'salimossoufatime@gmail.com',
        'tags': ['Marketing', 'Gestion'],
        'color': 'bg-emerald-50 border-emerald-200',
        'icon_type': 'pie',
        'color_theme': 'yellow',
        'bio': 'Garantir la gestion saine et honnête des fonds et la gestion de la communication.',
        'missions': [
            'Suivi rigoureux des entrées et sorties de fonds.',
            'Production des rapports de transparence.',
            'Gestion et animation des réseaux sociaux de l\'organisation.',
        ],
        'ordre': 3,
    },
    {
        'nom': 'Zamra Mohammed Thassim',
        'role': 'Designer Graphique',
        'branch': '🇨🇦 Canada',
        'photo_url': '',
        'email': 'zamra@robomed.org',
        'tags': ['Design', 'Créativité'],
        'color': 'bg-pink-50 border-pink-200',
        'icon_type': 'settings',
        'color_theme': 'green',
        'bio': 'Créer une identité visuelle cohérente et attrayante pour RoBomed.',
        'missions': [
            'Conception des visuels et illustrations pour les réseaux sociaux.',
            'Design des supports de communication (affiches, newsletter).',
            'Création des éléments visuels pour le site web et les campagnes.',
        ],
        'ordre': 4,
    },
    {
        'nom': 'Nouradine Zakaria Mahamat',
        'role': 'Responsable Technique & Digital',
        'branch': '🇹🇩 Tchad',
        'photo_url': '/nour.jpeg',
        'email': 'nouradinezakariamahamat18@gmail.com',
        'tags': ['Tech', 'Digital'],
        'color': 'bg-blue-50 border-blue-200',
        'icon_type': 'globe',
        'color_theme': 'blue',
        'bio': 'Développer et maintenir les outils numériques de l\'organisation.',
        'missions': [
            'Maintenance et Gestion du site web.',
            'Optimisation des formulaires de dons.',
            'Gestion des outils collaboratifs (GitHub, Notion) et les réseaux sociaux.',
        ],
        'ordre': 5,
    },
    {
        'nom': 'Oumarou Billy',
        'role': 'Responsable Support & Technique',
        'branch': '🇹🇩 Tchad',
        'photo_url': '/billy.jpeg',
        'email': 'billy@robomed.org',
        'tags': ['Logistique', 'Terrain'],
        'color': 'bg-cyan-50 border-cyan-200',
        'icon_type': 'shield',
        'color_theme': 'green',
        'bio': 'Assurer le support technique et la maintenance des outils et équipements.',
        'missions': [
            'Support technique pour les utilisateurs et membres.',
            'Maintenance des serveurs et infrastructure numérique.',
            'Gestion des problèmes techniques et mise à jour des systèmes.',
        ],
        'ordre': 6,
    },
    {
        'nom': 'Ahmat Fawas',
        'role': 'Coordinateur des événements',
        'branch': '🇹🇩 Tchad',
        'photo_url': '',
        'email': 'ahmat@robomed.org',
        'tags': ['Terrain', 'Coordination'],
        'color': 'bg-indigo-50 border-indigo-200',
        'icon_type': 'target',
        'color_theme': 'green',
        'bio': 'Piloter la vision globale et coordonner les événements terrain de RoBomed.',
        'missions': [
            'Coordination des événements et actions terrain.',
            'Développement des partenariats locaux.',
            'Mobilisation des équipes sur le terrain.',
        ],
        'ordre': 7,
    },
    {
        'nom': 'Zenaba',
        'role': 'Responsable de la Communication',
        'branch': '🇨🇦 Canada',
        'photo_url': '',
        'email': 'zenaba@robomed.org',
        'tags': ['Communication'],
        'color': 'bg-purple-50 border-purple-200',
        'icon_type': 'book',
        'color_theme': 'yellow',
        'bio': 'Piloter la stratégie de communication globale et la relation publique.',
        'missions': [
            'Gestion de la communication externe.',
            'Coordination des campagnes d\'information.',
            'Relations presse et partenariats médias.',
        ],
        'ordre': 8,
    },
]


class Command(BaseCommand):
    help = "Initialise les membres fondateurs de l'équipe RoBomed dans la base de données."

    def handle(self, *args, **options):
        count = 0
        for data in DEFAULT_MEMBERS:
            member, created = TeamMember.objects.get_or_create(
                nom=data['nom'],
                defaults={
                    'role': data['role'],
                    'branch': data['branch'],
                    'photo_url': data['photo_url'],
                    'email': data['email'],
                    'tags': data['tags'],
                    'color': data['color'],
                    'icon_type': data['icon_type'],
                    'color_theme': data['color_theme'],
                    'bio': data['bio'],
                    'missions': data['missions'],
                    'ordre': data['ordre'],
                    'actif': True,
                }
            )
            if created:
                count += 1
                self.stdout.write(self.style.SUCCESS(f"Membre créé : {member.nom}"))
            else:
                self.stdout.write(f"Membre déjà existant : {member.nom}")

        self.stdout.write(self.style.SUCCESS(f"Terminé. {count} membre(s) ajouté(s)."))

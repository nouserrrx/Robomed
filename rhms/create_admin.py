"""
Script de création/mise à jour du compte administrateur RoBomed.
À exécuter une seule fois après les migrations :
    python create_admin.py

Le mot de passe est saisi de manière interactive (non stocké dans le code).
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import CustomUser


def create_admin():
    print("=== Création du compte administrateur RoBomed ===\n")
    username = input("Nom d'utilisateur : ").strip() or 'admin'
    email = input("Email : ").strip()
    first_name = input("Prénom : ").strip()
    last_name = input("Nom : ").strip()

    import getpass
    password = getpass.getpass("Mot de passe (min 8 car.) : ")
    if len(password) < 8:
        print("❌ Mot de passe trop court (minimum 8 caractères).")
        sys.exit(1)

    try:
        user = CustomUser.objects.filter(email=email).first() or CustomUser.objects.filter(username=username).first()

        if not user:
            user = CustomUser(username=username, email=email, first_name=first_name, last_name=last_name)
            created = True
        else:
            created = False

        user.set_password(password)
        user.role = 'administrateur'
        user.is_staff = True
        user.is_superuser = True
        user.is_approved = True
        user.statut = True
        user.save()

        action = "créé" if created else "mis à jour"
        print(f"\n✅ Compte administrateur {action} avec succès !")
        print(f"   Username : {user.username}")
        print(f"   Email    : {user.email}")
        print(f"\nVous pouvez maintenant vous connecter sur /admin/login")

    except Exception as e:
        print(f"❌ Erreur : {e}")
        sys.exit(1)


if __name__ == '__main__':
    create_admin()

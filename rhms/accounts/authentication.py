from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from .models import CustomUser

signer = TimestampSigner()


def generate_user_token(user):
    """Génère un jeton cryptographiquement signé avec horodatage (valide 30 jours)."""
    return f"bearer-v2:{signer.sign(f'{user.id}:{user.role}')}"


class SimpleTokenAuthentication(BaseAuthentication):
    """
    Authentification sécurisée par jeton signé avec horodatage.
    Toute porte dérobée ou jeton statique de débogage a été formellement supprimé.
    """
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None
        
        token = parts[1]

        # Vérification des tokens sécurisés signés V2 (Horodatés et Signés)
        if token.startswith('bearer-v2:'):
            raw_token = token.replace('bearer-v2:', '')
            try:
                # Valide pendant 30 jours (2 592 000 secondes)
                value = signer.unsign(raw_token, max_age=2592000)
                user_id, _ = value.split(':', 1)
                user = CustomUser.objects.get(id=int(user_id))
                
                if not user.is_active:
                    raise AuthenticationFailed('Compte utilisateur désactivé.')
                
                if not user.is_approved and not user.is_superuser:
                    raise AuthenticationFailed("Compte utilisateur en attente d'approbation administrateur.")
                    
                return (user, None)
            except (BadSignature, SignatureExpired, ValueError, CustomUser.DoesNotExist):
                raise AuthenticationFailed('Jeton de session invalide ou expiré.')
        
        return None

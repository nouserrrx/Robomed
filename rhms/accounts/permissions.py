from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """
    Autorise uniquement les utilisateurs ayant le rôle 'administrateur' ou is_superuser.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'administrateur' or request.user.is_superuser or request.user.is_staff)
        )


class IsAdminOrCoordinator(BasePermission):
    """
    Autorise les administrateurs et les coordinateurs de missions.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in ['administrateur', 'coordinateur'] or request.user.is_superuser or request.user.is_staff)
        )


class IsAdminOrReadOnly(BasePermission):
    """
    Autorise la lecture (GET, HEAD, OPTIONS) à tous,
    mais réserve les modifications (POST, PUT, PATCH, DELETE) aux administrateurs/coordinateurs.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in ['administrateur', 'coordinateur'] or request.user.is_superuser or request.user.is_staff)
        )


class IsSelfOrAdmin(BasePermission):
    """
    Autorise un utilisateur à voir/modifier son propre compte ou profil,
    et permet à l'administrateur de gérer tous les comptes.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'administrateur' or request.user.is_superuser or request.user.is_staff:
            return True
        target_user = getattr(obj, 'user', obj)
        return target_user == request.user

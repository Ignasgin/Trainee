from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow authenticated users to write,
    but allow read-only access to everyone.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class CanViewPost(permissions.BasePermission):
    """
    Permission class to control post visibility based on user type.
    - Guests: only approved public posts
    - Authenticated users: all posts
    - Admins: all posts
    """
    def has_permission(self, request, view):
        return True  # Basic permission check
    
    def has_object_permission(self, request, view, obj):
        # Admin can see everything
        if request.user.is_staff:
            return True
            
        # Authenticated users can see all posts
        if request.user.is_authenticated:
            return True
            
        # Guests can only see approved public posts
        return obj.is_public and obj.is_approved


class CanManageContent(permissions.BasePermission):
    """
    Permission for content management:
    - Admins can manage all content
    - Users can manage only their own content
    - Guests cannot manage content
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can manage everything
        if request.user.is_staff:
            return True
            
        # Users can manage only their own content
        return obj.user == request.user
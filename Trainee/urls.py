from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse, Http404
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView
from core.jwt_serializers import CustomTokenObtainPairView
from core.frontend_views import index, serve_static
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    
    # JWT Authentication endpoints
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # OpenAPI schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # OpenAPI UI
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Serve frontend static assets with proper MIME types
    re_path(r'^assets/(?P<path>.*)$', serve_static, name='frontend-assets'),
]

# React frontend - catch all routes (must be last)
urlpatterns += [
    re_path(r'^', index, name='index'),
]
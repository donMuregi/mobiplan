"""
URL configuration for mobiplan project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/store/', include('store.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/financing/', include('financing.urls')),
    path('api/v1/blog/', include('blog.urls')),
    path('api/v1/accounts/', include('accounts.urls')),
    
    # JWT Authentication
    path('api/v1/auth/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'blog/categories', views.BlogCategoryViewSet)
router.register(r'blog/posts', views.BlogPostViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

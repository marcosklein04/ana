from django.urls import include, path
from rest_framework.routers import DefaultRouter

from cycles.views import CycleProfileViewSet

router = DefaultRouter()
router.register(r"profiles", CycleProfileViewSet, basename="profile")

urlpatterns = [
    path("", include(router.urls)),
]

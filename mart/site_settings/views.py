from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import SiteSettings
from .serializers import SiteSettingsSerializer

class SiteSettingsView(generics.RetrieveAPIView):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return SiteSettings.objects.first()
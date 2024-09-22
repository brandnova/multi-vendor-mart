# site_settings/admin.py

from django.contrib import admin
from .models import SiteSettings, SocialLink

class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1
    fields = ['platform', 'url', 'icon']

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    inlines = [SocialLinkInline]
    list_display = ('site_name', 'contact_email', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions
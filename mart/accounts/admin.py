from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin.forms import AdminAuthenticationForm
from django.contrib.auth.views import LoginView
from .models import User, EmailVerificationToken, TermsAndConditionsAcceptance

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_vendor', 'is_email_verified', 'is_staff')
    list_filter = ('is_vendor', 'is_email_verified', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('is_vendor', 'is_email_verified', 'accepted_terms')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('is_vendor', 'is_email_verified', 'accepted_terms')}),
    )

class CustomAdminAuthenticationForm(AdminAuthenticationForm):
    def confirm_login_allowed(self, user):
        if not user.is_active or not user.is_staff:
            raise forms.ValidationError(
                self.error_messages['invalid_login'],
                code='invalid_login',
            )
        if not user.is_superuser:
            raise forms.ValidationError(
                "Only superusers are allowed to access the admin interface.",
                code='not_superuser',
            )

class CustomAdminLoginView(LoginView):
    template_name = 'admin/login.html'
    form_class = CustomAdminAuthenticationForm

# Override the default admin login view
admin.site.login = CustomAdminLoginView.as_view()

admin.site.register(User, CustomUserAdmin)

@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at')
    search_fields = ('user__email', 'user__username')

admin.site.register(TermsAndConditionsAcceptance)
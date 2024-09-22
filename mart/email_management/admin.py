from django.contrib import admin
from django.core.mail import send_mass_mail
from django.contrib import messages
from django.shortcuts import render
from django import forms
from .models import EmailTemplate, EmailLog
from accounts.models import User

class VendorSelectForm(forms.Form):
    vendors = forms.ModelMultipleChoiceField(
        queryset=User.objects.filter(is_vendor=True, is_email_verified=True),
        widget=forms.CheckboxSelectMultiple
    )

@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'created_at', 'updated_at')
    search_fields = ('name', 'subject', 'body')

    actions = ['send_to_all_vendors', 'send_to_selected_vendors']

    def send_to_all_vendors(self, request, queryset):
        for template in queryset:
            vendors = User.objects.filter(is_vendor=True, is_email_verified=True)
            self._send_emails(request, template, vendors)
    send_to_all_vendors.short_description = "Send selected template to all vendors"

    def send_to_selected_vendors(self, request, queryset):
        if 'apply' in request.POST:
            form = VendorSelectForm(request.POST)
            if form.is_valid():
                template = queryset.first()
                selected_vendors = form.cleaned_data['vendors']
                self._send_emails(request, template, selected_vendors)
                return None
        else:
            form = VendorSelectForm()

        return render(
            request,
            'admin/send_emails_form.html',
            context={'form': form, 'templates': queryset}
        )
    send_to_selected_vendors.short_description = "Send selected template to specific vendors"

    def _send_emails(self, request, template, recipients):
        emails = [(template.subject, template.body, None, [user.email]) for user in recipients]
        send_mass_mail(emails, fail_silently=False)
        email_log = EmailLog.objects.create(template=template, subject=template.subject, body=template.body)
        email_log.recipients.set(recipients)
        self.message_user(request, f"Emails sent successfully to {recipients.count()} vendors.", messages.SUCCESS)

@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ('template', 'sent_at', 'recipient_count')
    list_filter = ('sent_at', 'template')
    search_fields = ('subject', 'body')

    def recipient_count(self, obj):
        return obj.recipients.count()
    recipient_count.short_description = 'Number of Recipients'
from django.contrib import admin
from .models import AdConfiguration, AdsFreeSubscription, PaymentSession

admin.site.register(AdConfiguration)
admin.site.register(AdsFreeSubscription)
admin.site.register(PaymentSession)

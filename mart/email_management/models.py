from django.db import models
from django.conf import settings

class EmailTemplate(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class EmailLog(models.Model):
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True)
    recipients = models.ManyToManyField(settings.AUTH_USER_MODEL)
    sent_at = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=200)
    body = models.TextField()

    def __str__(self):
        return f"Email sent on {self.sent_at}"
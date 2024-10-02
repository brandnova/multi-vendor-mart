# orders/utils.py

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

def send_order_confirmation_email(order):
    subject = f'Order Confirmation - {order.tracking_number}'
    message = render_to_string('emails/order_confirmation.html', {
        'order': order,
    })
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.customer_email],
        html_message=message,
    )
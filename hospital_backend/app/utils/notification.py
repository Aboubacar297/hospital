def send_email_notification(email: str, subject: str, content: str):
    # Logique pour envoyer un email via SMTP ou un service comme SendGrid/Mailgun
    print(f"Envoi d'un email à {email} : {subject}")
    return True

def send_sms_notification(phone: str, message: str):
    # Logique pour Twilio ou autre service SMS
    print(f"Envoi d'un SMS au {phone} : {message}")
    return True
import re
from django.core.exceptions import ValidationError

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if not re.search(r"[A-Z]", password):
            raise ValidationError("password_no_uppercase")
        if not re.search(r"[a-z]", password):
            raise ValidationError("password_no_lowercase")
        if not re.search(r"[0-9]", password):
            raise ValidationError("password_no_number")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValidationError("password_no_special")

    def get_help_text(self):
        return "Password must include uppercase, lowercase, number, and special character."
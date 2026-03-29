import jwt
from datetime import datetime, timedelta
from django.conf import settings

SECRET = settings.SECRET_KEY


def create_token(user):
    payload = {
        'id': user.id,
        'exp': datetime.now() + timedelta(hours=1)  # token expiration time
    }
    return jwt.encode(payload, SECRET, algorithm='HS256')


def decode_token(token):
    return jwt.decode(token, SECRET, algorithms=['HS256'])
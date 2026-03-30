FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY auth_server/ ./auth_server/

WORKDIR /app/auth_server

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

CMD ["sh", "-c", "python manage.py migrate --noinput && exec gunicorn --bind ${WEB_BIND:-0.0.0.0:8080} --workers ${WEB_WORKERS:-3} --timeout ${WEB_TIMEOUT:-120} auth_server.wsgi:application"]

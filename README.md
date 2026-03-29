# minimal_auth

A small full-stack authentication sample: **Django REST** issues JWTs after signup/sign-in, and a **React (Vite)** app stores the token, protects routes, and loads the current user profile.

## Stack

| Layer | Technologies |
|--------|----------------|
| API | Django 5.x, Django REST Framework, PyJWT, `django-cors-headers` |
| Database | MySQL 8 (Docker Compose service) |
| Frontend | React 19, TypeScript, Vite, React Router, Axios |

## Repository layout

```
minimal_auth/
├── backend/
│   ├── requirements.txt
│   └── auth_server/          # Django project (manage.py here)
│       ├── auth_server/      # settings, urls
│       └── authapp/          # User model, auth views, serializers, tests
├── frontend/                 # Vite + React SPA
└── docker-compose.yml        # MySQL (current)
```

## API (baseline paths)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/signup` | Create user; returns `{ "token": "..." }` |
| `POST` | `/api/auth/signin` | Returns `{ "token": "..." }` or 401 |
| `GET` | `/api/me` | Current user; header `Authorization: Bearer <token>` |
| `POST` | `/api/auth/signout` | Acknowledges logout (client clears token) |

The SPA is configured to call the API at `http://localhost:8080` (`frontend/src/api/auth.ts`). Run the Django server on port **8080** so the UI can reach it without changes.

## Prerequisites

- Python 3.11+ (typical for current Django)
- Node.js 20+ (for Vite 8)
- Docker (optional, for MySQL via Compose)

Install MySQL client libraries for your OS so `mysqlclient` can build (e.g. MySQL/MariaDB dev packages).

## 1. Start MySQL

From the repo root:

```bash
docker compose up -d
```

This starts MySQL with database `auth_db`, root password `password`, port `3306` (see `docker-compose.yml`).

`backend/auth_server/auth_server/settings.py` uses `HOST: host.docker.internal` so a **Django process on your machine** can reach the containerized DB on macOS/Windows. If you run Django inside Docker or use a local MySQL instead, set `HOST` (and credentials) to match your setup—e.g. `127.0.0.1` for a MySQL daemon on the host.

## 2. Backend
### 2.1 Run Django development server
#### a. Local environment
```bash
cd backend/auth_server
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver 0:8080
```
#### b. Docker
```bash
docker run -it -p 8080:8080 -v $(pwd):/app --name backend python:3.11-slim bash
apt-get update
apt-get install -y build-essential default-libmysqlclient-dev pkg-config libssl-dev
cd app/backend
pip install -r requirements.txt
cd auth_server
python manage.py migrate
python manage.py runserver 0:8080
```

### 2.2 Unit test
Run tests:

```bash
python manage.py test authapp
```

Password rules include Django’s defaults plus a custom validator (uppercase, lowercase, number, special character); see `authapp/validators.py` and serializers.


## 3. Frontend
### 3.1 Run Vite development server
#### a. Local environment
```bash
cd frontend
npm install
npm install axios react-router-dom
npm run dev -- --host
```

#### b. Docker
```bash
docker run -it -p 5173:5173 -v $(pwd):/app --name frontend node:20 bash
cd app/frontend
npm install
npm install axios react-router-dom
npm run dev -- --host
```

Open the URL Vite prints (`http://localhost:5173`). Use sign-up and sign-in; the profile page uses the stored JWT for `/api/me`.

## Security note

Settings use `DEBUG = True`, a checked-in `SECRET_KEY`, and JWT signing with that key. This layout is for **local learning and demos only**, not production.

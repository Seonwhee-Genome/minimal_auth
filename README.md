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
│   ├── Dockerfile            # Gunicorn image
│   ├── requirements.txt
│   └── auth_server/          # Django project (manage.py here)
│       ├── auth_server/      # settings, urls
│       └── authapp/          # User model, auth views, serializers, tests
├── frontend/                 # Vite + React SPA
│   ├── Dockerfile            # build → nginx static image
│   └── nginx.default.conf    # SPA routing for production image
└── docker-compose.yml        # MySQL + API + frontend (production-style)
```

## API (baseline paths)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/signup` | Create user; returns `{ "token": "..." }` |
| `POST` | `/api/auth/signin` | Returns `{ "token": "..." }` or 401 |
| `GET` | `/api/me` | Current user; header `Authorization: Bearer <token>` |
| `POST` | `/api/auth/signout` | Acknowledges logout (client clears token) |

The SPA calls the API at `http://localhost:8080` (`frontend/src/api/axios.ts`). For local Django, listen on **8080** so the browser can reach the API without changing the client.

## Prerequisites

- Python 3.11+ (typical for current Django)
- Node.js 20+ (for Vite 8)
- Docker and Docker Compose (for MySQL alone or the full container stack)

Install MySQL client libraries on your OS if you build the backend outside Docker (e.g. packages for `mysqlclient`).

## Production-style stack (Docker Compose)

From the repo root, build and start **MySQL**, the **Django API** (Gunicorn), and the **static frontend** (nginx):

```bash
docker compose up --build
```

| Service | Image / build | What it runs | Host port |
|---------|----------------|--------------|-----------|
| `db` | `mysql:8` | MySQL with `auth_db`, persisted in volume `mysql_data` | `3306` |
| `web` | `backend/Dockerfile` | `gunicorn --bind 0.0.0.0:8080 --workers 3`; runs `migrate` before workers | `8080` |
| `frontend` | `frontend/Dockerfile` | nginx serves the Vite `dist/` build (SPA fallback to `index.html`) | `80` |

After startup:

- **UI:** [http://localhost/](http://localhost/)
- **API:** [http://localhost:8080](http://localhost:8080)

**Database connectivity:** `settings.py` uses `HOST: host.docker.internal` so the API container can talk to MySQL **without** editing Django settings. Compose publishes MySQL on `3306` and adds `extra_hosts: host.docker.internal:host-gateway` on `web` (needed on Linux; Docker Desktop usually provides this hostname too). A tighter setup would use the Compose service name `db` as `HOST` and **not** expose MySQL on the host.

**Frontend build:** The production image runs `npm ci` and `npm run build` (TypeScript + Vite). No runtime Node process; only nginx serves files.

To stop and remove containers (volume kept):

```bash
docker compose down
```

## 1. MySQL only (local development)

If you run Django and Vite on the host but want MySQL in Docker:

```bash
docker compose up -d db
```

This uses the same `db` service as the full stack (credentials and port `3306` as in `docker-compose.yml`).

`backend/auth_server/auth_server/settings.py` uses `HOST: host.docker.internal` so a **Django process on your machine** can reach the database container on macOS/Windows. For a MySQL daemon on the same machine without Docker, use `127.0.0.1` (and adjust user/password if needed).

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

### 2.2 Unit tests

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
npm run dev -- --host
```

#### b. Docker
```bash
docker run -it -p 5173:5173 -v $(pwd):/app --name frontend node:22 bash
cd app/frontend
npm install
npm run dev -- --host
```

Open the URL Vite prints (`http://localhost:5173`). Use sign-up and sign-in; the profile flow uses the stored JWT for `/api/me`.

## Security note

The repo ships with a fixed `SECRET_KEY` and JWT signing from that key. `DEBUG` may be off in settings, but this project is still intended for **learning and demos**, not a hardened production deployment. Use environment-specific secrets, HTTPS, strict `ALLOWED_HOSTS` / CORS, and non-default DB credentials for real environments.

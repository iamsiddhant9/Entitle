# ENTITLE — Backend

> Agentic civic rights engine for Indian citizens. Discovers every government scheme, benefit, and unclaimed asset a person is entitled to.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Django 4.2 + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| AI | Groq API (with mock fallback) |
| Task Queue | Celery 5 + Redis |
| Database | PostgreSQL (SQLite for local dev) |
| CORS | django-cors-headers |

---

## Project Structure

```
entitle-backend/
├── manage.py
├── requirements.txt
├── .env
├── entitle/
│   ├── settings/
│   │   ├── base.py          # Shared settings
│   │   ├── development.py   # Dev (SQLite fallback, DEBUG=True)
│   │   └── production.py    # Prod (SSL, strict security)
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── users/               # Auth: register, login, JWT
│   ├── profiles/            # CivicProfile + FamilyMember
│   ├── schemes/             # Government schemes + EligibilityEngine
│   │   └── eligibility/
│   │       ├── engine.py    # Core rule evaluator
│   │       └── rules/       # PM-KISAN, PMJAY, Scholarships
│   ├── entitlements/        # Matched scheme records
│   ├── assets/              # Unclaimed financial assets
│   ├── chat/
│   │   ├── models.py        # Conversation + ChatMessage
│   │   └── agents/
│   │       ├── coordinator.py     # Primary chat agent (Claude)
│   │       ├── profile_agent.py   # NLP field extractor
│   │       ├── eligibility_agent.py
│   │       ├── formfill_agent.py  # Application pre-fill
│   │       └── asset_hunter.py    # Unclaimed asset discovery
│   └── notifications/
└── tasks/
    ├── celery.py
    ├── scheme_monitor.py    # Every 6h: check for new schemes
    ├── eligibility_rescan.py # Re-scan profiles
    └── tracker_poll.py      # Every 2h: poll application status
```

---

## Setup

### 1. Create & activate virtualenv

```bash
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
# or: venv\Scripts\activate  (Windows)
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

> **Note:** The `development.py` settings also import `dj_database_url` if a `DATABASE_URL` is set. Install it if using PostgreSQL:
> ```bash
> pip install dj-database-url
> ```

### 3. Configure environment

Copy `.env` and fill in your values:

```bash
cp .env .env.local   # optional: keep a local override
```

Key variables:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | `True` for development |
| `DATABASE_URL` | PostgreSQL URL — leave blank to use SQLite |
| `GROQ_API_KEY` | Your Groq API key (optional — falls back to mock) |
| `REDIS_URL` | Redis connection for Celery |
| `CORS_ALLOWED_ORIGINS` | Frontend origin(s), comma-separated |

### 4. Create PostgreSQL database (optional, recommended for production)

```bash
psql -U postgres
CREATE USER entitle_user WITH PASSWORD 'entitle_pass';
CREATE DATABASE entitle_db OWNER entitle_user;
\q
```

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Seed schemes (required)

```bash
python manage.py seed_schemes
```

This creates 10 core government schemes in the database.

### 7. Create superuser (optional)

```bash
python manage.py createsuperuser
```

### 8. Run development server

```bash
python manage.py runserver
```

API is live at `http://localhost:8000/api/`

---

## Running Celery

### Start Celery worker

```bash
celery -A tasks.celery worker --loglevel=info
```

### Start Celery Beat (scheduled tasks)

```bash
celery -A tasks.celery beat --loglevel=info
```

### Scheduled tasks

| Task | Schedule | Description |
|---|---|---|
| `monitor_schemes` | Every 6 hours | Checks for new government schemes |
| `poll_application_status` | Every 2 hours | Updates in-flight application statuses |

---

## API Reference

### Auth — `/api/auth/`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `register/` | None | Register new user |
| POST | `login/` | None | Login, returns JWT tokens |
| POST | `logout/` | Bearer | Blacklist refresh token |
| GET | `me/` | Bearer | Get current user |
| PATCH | `me/` | Bearer | Update current user |
| POST | `token/refresh/` | None | Refresh access token |

**Register / Login response:**
```json
{
  "user": { "id": 1, "username": "...", "email": "..." },
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

---

### Profiles — `/api/profiles/`

| Method | Endpoint | Description |
|---|---|---|
| POST | `` | Create civic profile |
| GET | `<pk>/` | Get profile |
| PATCH | `<pk>/` | Update profile |
| POST | `<pk>/scan/` | Run eligibility + asset scan |
| GET | `<pk>/summary/` | Get financial summary totals |

**Scan response:**
```json
{
  "profile_id": 1,
  "entitlements_found": 7,
  "assets_found": 2,
  "entitlements": [...],
  "assets": [...]
}
```

---

### Schemes — `/api/schemes/`

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `` | `?category=`, `?state=`, `?level=` | List active schemes |
| GET | `<pk>/` | — | Scheme detail |

---

### Entitlements — `/api/entitlements/`

| Method | Endpoint | Description |
|---|---|---|
| GET | `?profile=<id>` | List entitlements for profile |
| GET | `<pk>/` | Entitlement detail |
| PATCH | `<pk>/` | Update status |
| POST | `<pk>/apply/` | Pre-fill and apply to scheme |

**Apply response:**
```json
{
  "entitlement_id": 5,
  "scheme": "PM-KISAN Samman Nidhi",
  "status": "applied",
  "application_ref": "ENTITLE-A1B2C3D4",
  "portal_url": "https://pmkisan.gov.in"
}
```

---

### Assets — `/api/assets/`

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `` | `?profile=<id>`, `?claimed=false` | List unclaimed assets |
| POST | `<pk>/claim/` | — | Get claim instructions |

---

### Chat — `/api/chat/`

| Method | Endpoint | Description |
|---|---|---|
| POST | `message/` | Send message to ENTITLE agent |
| GET | `history/?profile=<id>` | Get conversation history |

**Message request:**
```json
{
  "profile_id": 1,
  "message": "Hello, I am Ramesh, 48 years old"
}
```

**Message response:**
```json
{
  "id": 12,
  "role": "agent",
  "content": "Namaste Ramesh! ...",
  "message_type": "text",
  "result_data": null,
  "created_at": "2024-01-15T10:30:00+05:30"
}
```

When profile is complete, `message_type` becomes `result_card` and `result_data` contains:
```json
{
  "total_amount": 636000,
  "scheme_count": 7,
  "asset_count": 2,
  "entitlements": [...],
  "unclaimed_assets": [...]
}
```

---

### Notifications — `/api/notifications/`

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `` | `?profile=<id>`, `?all=true` | List notifications (unread by default) |
| POST | `<pk>/read/` | — | Mark notification as read |

---

## Environment Variables Reference

```env
SECRET_KEY=django-insecure-...        # Django secret
DEBUG=True                             # Debug mode
DATABASE_URL=postgres://user:pass@localhost:5432/db  # Leave blank for SQLite
GROQ_API_KEY=gsk_...                   # Groq API (optional)
REDIS_URL=redis://localhost:6379/0     # Celery broker
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## Notes

- **Groq API optional:** If `GROQ_API_KEY` is not set or is the placeholder value, the chat agent falls back to a scripted mock conversation that still triggers a full eligibility scan.
- **SQLite fallback:** If `DATABASE_URL` is not set, development uses SQLite. Suitable for prototyping; use PostgreSQL for production.
- **Seeding is required:** Run `python manage.py seed_schemes` before testing the eligibility scan — without schemes in the DB, scans return empty results.

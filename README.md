# Carbon Platform MVP

Hackathon-ready platform to calculate and track the carbon footprint of physical sites.

## Stack
- Backend: Java 21, Spring Boot 3, Spring Security JWT, JPA, Flyway
- Database: PostgreSQL 15
- Web: React + Vite + Tailwind CSS + DaisyUI + Recharts
- Mobile: React Native Expo
- Infra: Docker Compose

## Repository structure
- `backend/` Spring Boot REST API
- `frontend-web/` React web dashboard
- `mobile/` Expo mobile app
- `docs/` architecture and demo guide

## Quick start with Docker (backend + web + db)
1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Start stack:
   ```bash
   docker compose up --build
   ```
3. Open:
- Web: `http://localhost:5174`
- Backend: `http://localhost:8088/api/v1`

## Local run (without Docker)
### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Web
```bash
cd frontend-web
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm run start
```

Set API URL for Expo in shell if needed:
```bash
export EXPO_PUBLIC_API_BASE_URL=http://localhost:8088/api/v1
```

## First connection
- No account is pre-created.
- On the first visit to the login page, create the initial admin account.
- After creating this account, coherent demo data is seeded automatically (3 sites + initial calculations).

## API highlights
- Auth: `/api/v1/auth/bootstrap/status`, `/api/v1/auth/bootstrap/register`, `/api/v1/auth/login`, `/api/v1/auth/me`
- Sites: `/api/v1/sites`
- Calculations: `/api/v1/sites/{siteId}/calculations`
- Dashboard: `/api/v1/dashboard/*`
- Comparison: `/api/v1/comparisons/sites`

## Emission factors
MVP uses a local mock factor set (`backend/src/main/resources/factors/mock-emission-factors.json`) inspired by public ADEME Base Carbone references.

The abstraction `EmissionFactorProvider` is already in place to add:
- local mock provider
- ADEME provider
- external API provider

## Hackathon demo
See [docs/demo-scenario.md](docs/demo-scenario.md) for a full presentation flow.

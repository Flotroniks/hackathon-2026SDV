# MVP Architecture

## Overview
- `backend`: Spring Boot API REST with JWT auth, PostgreSQL persistence, Flyway migrations, carbon calculation engine.
- `frontend-web`: React + Vite + Tailwind + DaisyUI dashboard.
- `mobile`: Expo React Native app for field usage.
- `docker-compose.yml`: local stack for PostgreSQL + backend + web.

## Backend layers
- `controller`: API endpoints and request/response handling.
- `service`: business logic (auth, site CRUD, calculation, dashboard, comparison).
- `domain/model`: JPA entities and enums.
- `repository`: Spring Data access.
- `dto`: contract models for API.
- `mapper`: entity to DTO translation.
- `security`: JWT filter, token provider, Spring Security config.
- `provider`: `EmissionFactorProvider` abstraction and mock implementation.

## Data flow
1. User authenticates with `/api/v1/auth/login` and receives JWT.
2. User creates/updates a site with materials and energy data.
3. Calculation endpoint computes construction + operation emissions using factor provider.
4. Result is persisted with immutable material snapshots in `calculations` and `calculation_material_snapshots`.
5. Dashboard and comparison read latest calculations per site.

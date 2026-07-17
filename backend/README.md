# Social League API

API REST + WebSocket que reemplaza el uso directo de Supabase desde el cliente. Construida con FastAPI + SQLAlchemy (async, driver `psycopg` 3) + Alembic sobre Postgres.

## Por qué FastAPI y no Django

El dominio actual es una sola entidad (`Post`, auto-referenciada para respuestas/quotes), sin autenticación de usuarios, sin admin panel, sin relaciones complejas. Django aporta ORM síncrono, auth, admin y un sistema de apps que no se usarían acá — puro overhead. FastAPI + SQLAlchemy async da lo que se necesita (endpoints tipados, validación con Pydantic, websockets nativos) sin capas de más. Si en el futuro se agrega autenticación de usuarios "real" con lógica de negocio pesada (ligas, equipos, permisos), vale la pena reevaluar.

## Setup con Docker (recomendado para dev)

```bash
docker compose up --build
```

Levanta Postgres + la API con hot-reload (bind mount del código, `uvicorn --reload`). Corre `alembic upgrade head` automáticamente al arrancar. API en `http://localhost:8000`, Postgres expuesto en `localhost:5432` (user/pass/db: `postgres`/`postgres`/`social_league`).

- `Dockerfile.dev`: imagen de desarrollo, monta el código como volumen, reload automático.
- `Dockerfile`: build multi-stage para producción, corre como usuario no-root (`appuser`), `uvicorn` con 4 workers y sin `--reload`. Se buildea con `docker build -f Dockerfile -t social-league-api .` y espera `DATABASE_URL` por variable de entorno (no corre migraciones automáticamente — eso debe ser un paso explícito del deploy, `alembic upgrade head`, antes de levantar el contenedor).

## Setup local sin Docker

```bash
python -m venv .venv
.venv/Scripts/activate  # o source .venv/bin/activate en Linux/Mac
pip install -r requirements.txt
cp .env.example .env  # y completar DATABASE_URL con tu Postgres local
alembic upgrade head
uvicorn app.main:app --reload
```

> El driver es `psycopg[binary]` (no `asyncpg`): publica wheels precompilados al día para versiones nuevas de Python (incluyendo 3.14), así que no hace falta compilador ni headers de Postgres instalados localmente.

Docs interactivas en `http://localhost:8000/docs`.

## Tests

```bash
pip install -r requirements-dev.txt
pytest
```

La suite (`tests/`) corre contra SQLite en memoria (vía `aiosqlite`), no requiere Postgres levantado, y es rápida (~1s para 25 tests). Cubre:

- `tests/test_crud.py` — lógica de conteo de respuestas/quotes a nivel de query (incluye un test de regresión para un bug real que encontramos durante el desarrollo: una subquery sin correlacionar contaba mal los hijos de cada post).
- `tests/test_posts_api.py` — endpoints REST: creación, validación (contenido vacío, de más de 280 caracteres, `champion_id` faltante), filtros, paginación, 404s, orden.
- `tests/test_websocket.py` — que `/ws/posts` efectivamente notifica a los clientes conectados cuando se crea un post.

Si en algún momento se agrega CI, correr esta misma suite además contra Postgres real (usando el `docker-compose.yml`) confirmaría que no hay divergencias de dialecto entre SQLite y Postgres (tipos UUID, JSON, etc. — hoy no las hay).

## Modelo de datos

Una sola tabla, `posts`, auto-referenciada tres veces:

- `response_of` → si está seteado, el post es una respuesta a otro post (ON DELETE CASCADE: si se borra el post original, se borran sus respuestas).
- `quote_of` → si está seteado, el post es una cita de otro post (ON DELETE SET NULL: la cita sobrevive aunque se borre el post citado).
- `repost_of` → existe en el esquema por paridad con el modelo original de Supabase, pero **no tiene endpoint** — la app original tampoco lo implementó nunca. Se deja documentado por si se decide construir la feature.

`responses_count` y `quotes_count` se calculan con subqueries correlacionadas en cada lectura (reemplazan el `posts_v2!response_of(count)` embebido de PostgREST).

## Endpoints

| Método | Path | Descripción |
|---|---|---|
| GET | `/api/v1/posts` | Posts raíz (sin `response_of`). Filtro opcional `champion_id`. Incluye quotes standalone. |
| GET | `/api/v1/posts/{id}` | Un post con sus counts. |
| POST | `/api/v1/posts` | Crea un post raíz. |
| GET | `/api/v1/posts/{id}/responses` | Respuestas de un post. |
| POST | `/api/v1/posts/{id}/responses` | Crea una respuesta. |
| GET | `/api/v1/posts/{id}/quotes` | Quotes de un post. |
| POST | `/api/v1/posts/{id}/quotes` | Crea una quote. |
| GET | `/api/v1/champions/{champion_id}/posts` | Posts raíz de un campeón. |
| GET | `/api/v1/champions/{champion_id}/responses` | Respuestas hechas "como" un campeón. |
| GET | `/api/v1/champions/{champion_id}/quotes` | Quotes hechas "como" un campeón. |
| WS | `/ws/posts` | Reemplaza el `channel('new_posts')` de Supabase Realtime — emite `{"event": "new_post", "post_id": "..."}` en cada post/respuesta/quote nuevo. |
| GET | `/health` | Healthcheck. |

## Decisiones de diseño frente al código Angular original

- **`created_at` lo genera Postgres** (`server_default=now()`), no el cliente. El código Angular original armaba la fecha con `Intl.DateTimeFormat` en el navegador, duplicado en tres componentes y dependiente del reloj/huso horario del cliente — se elimina esa clase de bug de raíz.
- **`content` limitado a 280 caracteres** vía Pydantic (`POST_MAX_LENGTH` configurable). El formulario original solo validaba `required`, sin límite de longitud.
- **`responses_count`/`quotes_count` como enteros planos**, no como `[{count: number}]` (así venía de la sintaxis embed de PostgREST). El frontend nuevo puede consumirlos directo.
- **Todas las escrituras pasan por la API** — ya no hay una anon key de Supabase con acceso de escritura directo desde el navegador (la que estaba hardcodeada en `supa.service.ts`). Repensar el acceso público a `POST /api/v1/posts` cuando se decida si va a haber autenticación de usuarios o no; hoy, igual que la app original, es anónimo.
- **Fetch de campeones (Data Dragon) se mantiene 100% en el frontend**, sin proxy. Es un CDN público sin API key — no es la Riot API autenticada, así que no hay nada que el backend deba ocultar o proteger ahí. Si en el futuro se agrega la Riot API real (partidas, invocadores), esa sí requiere proxy por este backend porque no se puede exponer la key en el cliente.
- **Contrato HTTP en camelCase, código Python en snake_case.** Todos los schemas (`app/schemas.py`) heredan de `CamelModel`, que usa `alias_generator=to_camel`: los bodies de request/response y el query param `championId` van en camelCase (`championId`, `createdAt`, `responsesCount`, etc.), mientras que el código interno (modelos SQLAlchemy, `crud.py`, tests de la capa CRUD) sigue en snake_case. `populate_by_name=True` hace que la API también acepte el nombre de campo en snake_case como fallback — si se prefiere que solo acepte camelCase estricto, se saca ese flag.

FROM python:3.12-bullseye AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt


FROM python:3.12-slim

RUN useradd --create-home --uid 1000 appuser

WORKDIR /app

COPY --from=builder /root/.local /home/appuser/.local
COPY . .

RUN chown -R appuser:appuser /app
USER appuser

ENV PATH="/home/appuser/.local/bin:${PATH}" \
    PYTHONUNBUFFERED=1

EXPOSE 8000

# Shell form so $PORT expands -- hosting platforms (Railway, Render, ...)
# assign a dynamic port at runtime and route traffic to it. Migrations run
# here (not as a separate deploy step) so the schema is never out of sync
# with what a fresh container expects.
CMD alembic upgrade head && exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 4

#!/usr/bin/env bash
set -euo pipefail

# Render free tier: run API + Celery worker in a single web service
# (background workers are not available on the free plan).

echo "[*] Starting Celery worker..."
celery -A app.tasks.celery_app worker --loglevel=info --concurrency=1 &
CELERY_PID=$!

cleanup() {
  kill "${CELERY_PID}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

PORT="${PORT:-8000}"
echo "[*] Starting FastAPI on port ${PORT}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"

#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"

if [ "${ENABLE_CELERY_WORKER:-false}" = "true" ]; then
  echo "[*] Starting Celery worker..."
  celery -A app.tasks.celery_app worker --loglevel=info --concurrency=1 &
  CELERY_PID=$!
  trap 'kill "${CELERY_PID}" 2>/dev/null || true' EXIT INT TERM
else
  echo "[*] Celery worker disabled — file scans run in API background threads."
fi

echo "[*] Starting FastAPI on port ${PORT}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"

#!/bin/sh
set -e
mkdir -p "${UPLOAD_DIR:-/app/uploads}"
node scripts/migrate.mjs
exec node server.js

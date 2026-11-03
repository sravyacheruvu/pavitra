#!/bin/bash
cd "$(dirname "$0")" || exit 1
clear
echo "======================================"
echo "  Pavitra  ·  The Digital Veranda"
echo "======================================"
echo "Folder: $(pwd)"
echo
if ! command -v npm >/dev/null 2>&1; then
  echo "❌  Node.js / npm was not found. Install the LTS from https://nodejs.org and retry."
  read -n 1 -s; exit 1
fi
echo "✅  Node $(node -v),  npm $(npm -v)"
echo
echo "📦  Syncing dependencies (installs anything new, skips what's current)…"
npm install || { echo; echo "❌  npm install failed — see errors above."; read -n 1 -s; exit 1; }
echo "✅  Dependencies ready."
echo
echo "🚀  Starting Expo (web) at http://localhost:8081 — leave this window open, Ctrl+C to stop."
echo
exec npx expo start --web

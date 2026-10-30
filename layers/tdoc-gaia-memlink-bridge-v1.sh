#!/data/data/com.termux/files/usr/bin/bash
# [SS][tdoc-gaia-memlink-bridge-v1]
# GAIA MemoryLink Bridge — connects Architect-Gemini to GAIA Memory Loader

set -e
ROOT="$HOME/Æ"
BIN="$ROOT/bin"
MEM="$ROOT/cloud/onedrive/GaiaMemory/gemini_chat_history.jsonl"
TMP="$ROOT/tmp"

mkdir -p "$TMP" "$BIN"
chmod 700 "$TMP"

cat > "$BIN/gaia-chat" <<'CHATBOT'
#!/usr/bin/env bash
ROOT="$HOME/Æ"
TMP="$ROOT/tmp"
MEM="$ROOT/cloud/onedrive/GaiaMemory/gemini_chat_history.jsonl"
TMP_OUT="$TMP/chat_out_$$.txt"
mkdir -p "$TMP"

query="$*"
if [ -z "$query" ]; then
  echo "Usage: gaia-chat [prompt]"
  exit 1
fi

echo "╔══════════════════════════════════════════════╗"
echo "║  ARCHITECT-GEMINI CLOUD MEMORY: ACTIVE       ║"
echo "╚══════════════════════════════════════════════╝"
echo "Prompt: $query"
echo

printf '{"role":"user","content":"%s","timestamp":"%s"}\n' \
  "$query" "$(date '+%Y-%m-%dT%H:%M:%S')" >> "$MEM"

if command -v gemini >/dev/null 2>&1; then
  gemini -p "$query" -o text --yolo > "$TMP_OUT" 2>&1
else
  architect-gemini run yolo -p "$query" -o text > "$TMP_OUT" 2>&1
fi

echo
echo "╔══════════════════════════════════════════════╗"
echo "║               ARCHITECT REPLY                ║"
echo "╚══════════════════════════════════════════════╝"
cat "$TMP_OUT"
echo

printf '{"role":"assistant","content":"%s","timestamp":"%s"}\n' \
  "$(tr -d '\r' < "$TMP_OUT" | sed 's/"/\\"/g')" \
  "$(date '+%Y-%m-%dT%H:%M:%S')" >> "$MEM"

if command -v gaia-mem >/dev/null 2>&1; then
  cat "$TMP_OUT" | gaia-mem --append
fi

if command -v rclone >/dev/null 2>&1; then
  (rclone sync "$ROOT/cloud/onedrive/GaiaMemory" onedrive:GaiaMemory \
     --create-empty-src-dirs --fast-list --quiet &) >/dev/null 2>&1
fi

rm -f "$TMP_OUT"
CHATBOT

chmod +x "$BIN/gaia-chat"
echo "[OK] GAIA MemoryLink Bridge activated."
echo "[OK] All chat replies are piped into GAIA memory and synced to OneDrive."

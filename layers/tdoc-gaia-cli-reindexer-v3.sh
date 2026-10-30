#!/data/data/com.termux/files/usr/bin/bash
# [SS][tdoc-gaia-cli-reindexer-v3]
# GAIA Command Indexer (DESC-aware, Self-Healing)
# Copyright: The Architect / Nexus / Cryptic News LLC

ROOT="$HOME/Æ"
BIN="$ROOT/bin"
AUTO="$ROOT/autonomous"
INDEX="$BIN/gaia"

log(){ printf "[%s] %s\n" "$(date '+%H:%M:%S')" "$*"; }

log "[GAIA] Rebuilding command index..."
mkdir -p "$BIN"

# Find all gaia executables across both directories
mapfile -t commands < <(find "$BIN" "$AUTO" -type f -executable -name "gaia-*")

if [ "${#commands[@]}" -eq 0 ]; then
  log "[WARN] No GAIA executables found."
else
  log "[INFO] Found ${#commands[@]} GAIA executables."
fi

# ────────────────────────────────────────────────────────────────
# Create unified GAIA index CLI
cat > "$INDEX" <<'EOT'
#!/data/data/com.termux/files/usr/bin/bash
ROOT="$HOME/Æ"
BIN="$ROOT/bin"
AUTO="$ROOT/autonomous"

echo "╔══════════════════════════════════════════╗"
echo "║          🌍 GAIA COMMAND INDEX            ║"
echo "╚══════════════════════════════════════════╝"
echo ""
printf "%-25s %-55s %-10s\n" "COMMAND" "DESCRIPTION" "STATUS"
echo "--------------------------------------------------------------------------------"

for cmd in $(find "$BIN" "$AUTO" -type f -executable -name "gaia-*"); do
  name=$(basename "$cmd")
  desc=$(grep -m1 '^#DESC:' "$cmd" | sed 's/^#DESC:[[:space:]]*//')
  [ -z "$desc" ] && desc="(No description provided)"
  if command -v "$name" >/dev/null 2>&1 || [ -x "$cmd" ]; then
    status="[\033[32mACTIVE\033[0m]"
  else
    status="[\033[31mBROKEN\033[0m]"
  fi
  printf "%-25s %-55s %b\n" "$name" "$desc" "$status"
done

count=$(find "$BIN" "$AUTO" -type f -executable -name "gaia-*" | wc -l)
echo ""
echo "[INFO] Total: $count executables"
EOT
# ────────────────────────────────────────────────────────────────

chmod +x "$INDEX"
log "[OK] GAIA index updated — run 'gaia' to verify."

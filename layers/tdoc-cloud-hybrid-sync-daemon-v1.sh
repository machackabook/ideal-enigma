#!/data/data/com.termux/files/usr/bin/bash
#───────────────────────────────────────────────────────────────
# [SS][TDOC-0003-CLOUD-HYBRID-SYNC-DAEMON-V1]
# GAIA • Architect Systems Division | Build: 2026-01-22
#───────────────────────────────────────────────────────────────
# PURPOSE:
#   Launches a continuous hybrid sync daemon between Termux and
#   OneDrive. Tracks all changes in key directories and updates
#   OneDrive mirrors automatically. Optimized for low I/O.
#───────────────────────────────────────────────────────────────

set -euo pipefail

AE="$HOME/Æ"
CLOUD="$AE/cloud/onedrive"
LOG_DIR="$AE/logs"
LOG="$LOG_DIR/cloud_daemon_$(date +%Y%m%d_%H%M%S).log"
SYNC_INTERVAL=45  # seconds between passive sync cycles
WATCH_DIRS=("$AE/projects" "$AE/memory" "$HOME/Documents" "$HOME/Downloads")

mkdir -p "$LOG_DIR" "$CLOUD/SystemLogs"

echo "───────────────────────────────────────────────"
echo "[TDOC-0003] Starting GAIA Cloud Hybrid Sync Daemon..."
echo "[CLOUD] $CLOUD"
echo "[LOG]   $LOG"
echo "───────────────────────────────────────────────"

#───────────────────────────────────────────────────────────────
# Function: Passive sync cycle
#───────────────────────────────────────────────────────────────
sync_cycle() {
  echo "[SYNC] $(date '+%H:%M:%S') Checking directories..." | tee -a "$LOG"
  for dir in "${WATCH_DIRS[@]}"; do
    if [ -d "$dir" ]; then
      base=$(basename "$dir")
      dest="$CLOUD/NexusHybrid/$base"
      mkdir -p "$dest"
      rsync -a --update --delete --exclude=".git/" --exclude="__pycache__/" "$dir/" "$dest/" >>"$LOG" 2>&1
      echo "[SYNC] $dir → $dest" | tee -a "$LOG"
    fi
  done
  cp "$LOG" "$CLOUD/SystemLogs/" 2>/dev/null || true
  echo "[OK] Sync cycle complete." | tee -a "$LOG"
  echo "───────────────────────────────────────────────" | tee -a "$LOG"
}

#───────────────────────────────────────────────────────────────
# Function: Loop daemon
#───────────────────────────────────────────────────────────────
daemon_loop() {
  while true; do
    sync_cycle
    sleep "$SYNC_INTERVAL"
  done
}

#───────────────────────────────────────────────────────────────
# Function: Background auto-run handler
#───────────────────────────────────────────────────────────────
start_daemon() {
  if pgrep -f "tdoc-cloud-hybrid-sync-daemon-v1.sh" >/dev/null; then
    echo "[WARN] Daemon already running." | tee -a "$LOG"
    return
  fi
  nohup bash -c "daemon_loop" >/dev/null 2>&1 &
  echo "[OK] Cloud Sync Daemon launched (PID: $!)." | tee -a "$LOG"
}

#───────────────────────────────────────────────────────────────
# Main runtime
#───────────────────────────────────────────────────────────────
case "${1:-start}" in
  start)
    start_daemon
    ;;
  run)
    daemon_loop
    ;;
  stop)
    pkill -f "tdoc-cloud-hybrid-sync-daemon-v1.sh" && echo "[STOP] Daemon terminated."
    ;;
  status)
    pgrep -fa "tdoc-cloud-hybrid-sync-daemon-v1.sh" || echo "[STATUS] Not running."
    ;;
  *)
    echo "Usage: gaia-cloud-daemon {start|run|stop|status}"
    ;;
esac

exit 0

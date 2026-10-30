#!/usr/bin/env bash
# GAIA Ω-SYNCFABRIC — live scheduler + continuum heartbeat + self-healing
set +e; set +u

AE="/home/Æ"; [ -d "$AE" ] || AE="$HOME/Æ"
BIN="$AE/bin"; LOG="$AE/logs/syncfabric_$(date +%Y%m%d).log"
mkdir -p "$BIN" "$(dirname "$LOG")" >/dev/null 2>&1

REF_URL="https://time.gov/actualtime.cgi"
SLOT=30          # seconds per window
RESYNC_EVERY=600 # seconds

log(){ printf "%s %s\n" "[$(date +%H:%M:%S)]" "$*" | tee -a "$LOG"; }
need(){ command -v "$1" >/dev/null 2>&1; }

#──────────────────────────────────────────────────────────────
# Pull reference epoch (µs → s)
sync_time(){
  local xml t
  xml="$(curl -fsS --max-time 5 "$REF_URL" 2>/dev/null)" || return 1
  t="$(echo "$xml" | sed -n 's/.*time="\([0-9]\+\)".*/\1/p' | head -n1)"
  [ -n "$t" ] || return 2
  echo $((t/1000000))
}

# Calculate next fire
calc_next(){
  local now="$1" offset="$2" slot="$3"
  local ref_aligned=$((now-offset))
  local next_ref=$(( (ref_aligned/slot + 1)*slot ))
  echo $((next_ref+offset))
}

# Self-healing dependency checker
heal(){
  local bin="$1" tries="$2"
  if ! need "$bin"; then
    log "[HEAL] missing $bin (attempt $tries)"
    if ((tries<3)); then pkg install -y "$bin" >/dev/null 2>&1 || true
    else log "[HEAL] unresolved $bin → notifying continuum"; fi
  fi
}

# Continuum task — executed each window
continuum_tasks(){
  log "[CONTINUUM] running heartbeat + tasks"
  bash "$BIN/mcp_refresh.sh" 2>>"$LOG" || true
  bash "$BIN/heartbeat.sh"   2>>"$LOG" || true
  heal "gemini" 1
  heal "wolframscript" 1
}

#──────────────────────────────────────────────────────────────
main(){
  local last_sync=0 offset=0 now ref next sleep_for
  while true; do
    now="$(date +%s)"
    if [ "$last_sync" -eq 0 ] || [ $((now-last_sync)) -ge "$RESYNC_EVERY" ]; then
      ref="$(sync_time)" || ref=""
      if [ -n "$ref" ]; then offset=$((now-ref)); last_sync=$now; log "[SYNC] offset=$offset"; fi
    fi
    next="$(calc_next "$now" "$offset" "$SLOT")"
    sleep_for=$((next-now)); ((sleep_for<0)) && sleep_for=0
    sleep "$sleep_for"
    continuum_tasks
  done
}
main

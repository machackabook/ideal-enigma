#!/data/data/com.termux/files/usr/bin/bash
# [GAIA][ARCHITECT HYBRID-X] v1.1
# [SS][CodeFormat] Auto-Enhanced Script
# Copyright: The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274

AE="$HOME/Æ"
BIN="$AE/bin"
LOGDIR="$AE/logs"
mkdir -p "$LOGDIR"
PROMPT_COLOR="\033[38;5;81m"
RESET="\033[0m"

# -- Cross-Platform 'say' --
if ! command -v say >/dev/null 2>&1; then
  if command -v termux-tts-speak >/dev/null 2>&1; then
    say() { termux-tts-speak "$@"; }
  else
    say() { echo "[SAY] $@"; }
  fi
fi

#— dynamic system awareness
gaia_sense(){
  echo -e "${PROMPT_COLOR}[GAIA::SENSE]${RESET} $(uname -a)"
  echo "Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
  echo "Temp: $(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null | sed 's/../.& °C/')"
  echo "Processes: $(ps | wc -l)"
  echo "Storage: $(df -h /data | tail -1 | awk '{print $4" available"}')"
}

#— AI command bridge (Advanced)
gaia_ai(){
  PROMPT="$*"
  if [ -z "$PROMPT" ]; then echo "Usage: gaia-ai <prompt>"; return; fi
  echo "[GAIA::AI] Transmitting to Nexus Core..."
  # Enhanced to use gemini-cli as the primary bridge if available
  if command -v gemini >/dev/null 2>&1; then
    gemini "$PROMPT"
  else
    curl -s -X POST https://api.openai.com/v1/chat/completions \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -d '{"model": "gpt-4-turbo", "messages":[{"role":"user","content":"'"$PROMPT"'"}]}' \
      | jq -r '.choices[0].message.content'
  fi
}

#— cognitive event logging
gaia_log(){
  ENTRY="$*"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $ENTRY" >> "$LOGDIR/gaia_architect.log"
}

#— net monitor autonomous loop
gaia_netwatch(){
  echo "[GAIA::NETWATCH] Active IPs:"
  ip a | grep inet | grep -v 127 | awk '{print $2}'
  echo "[GAIA::NETWATCH] Established Connections:"
  ss -tunapl | grep ESTAB
}

#— nexus integration
gaia_nexus_sync(){
  echo "[GAIA::NEXUS] Synchronizing environments..."
  bash "$BIN/nexus-env"
  say "Nexus synchronization complete."
}

#— environmental awareness header
gaia_header(){
  clear
  echo "╔══════════════════════════════════════════╗"
  echo "║     🧠  GAIA ARCHITECT HYBRID-X v1.1     ║"
  echo "║        Cognitive Terminal Interface      ║"
  echo "╚══════════════════════════════════════════╝"
}

#— entrypoint
case "$1" in
  sense) gaia_sense ;;
  netwatch) gaia_netwatch ;;
  ai) shift; gaia_ai "$@" ;;
  log) shift; gaia_log "$@" ;;
  sync) gaia_nexus_sync ;;
  *) gaia_header
     echo "Available modules: sense | ai | netwatch | log | sync"
     ;;
esac
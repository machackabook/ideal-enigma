#!/data/data/com.termux/files/usr/bin/bash
# [SS][tdoc-gaia-sense-v2]
# GAIA Sense v2 — Telemetry Mirror with OneDrive Sync

ROOT="$HOME/Æ"
TELEMETRY_DIR="$ROOT/nexus/telemetry"
ONEDRIVE_DIR="$ROOT/cloud/onedrive/telemetry"
LOG_FILE="$TELEMETRY_DIR/realtime.log"
JSONL="$TELEMETRY_DIR/realtime.jsonl"

mkdir -p "$TELEMETRY_DIR" "$ONEDRIVE_DIR"

log(){ echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

collect() {
    TS="$(date '+%Y-%m-%d %H:%M:%S')"
    CPU="$(top -b -n 1 | awk '/%cpu/{print $2}' | head -n 1)"
    MEM="$(free -m | awk '/Mem/{printf("%s/%s MB (%.2f%%)", $3,$2,($3/$2)*100)}')"
    BATTERY="$(termux-battery-status | jq -r '.percentage, .status' | paste -sd ' ' -)"
    NET="$(ip addr show wlan0 | awk '/inet /{print $2}' | head -n1)"
    TEMP="$(cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null | awk '{sum+=$1} END{if(NR>0) printf("%.1f°C",sum/NR/1000)}')"
    DISK="$(df -h /data | awk 'NR==2{print $3"/"$2" ("$5")"}')"

    JSON_ENTRY=$(jq -nc \
        --arg ts "$TS" \
        --arg cpu "$CPU" \
        --arg mem "$MEM" \
        --arg bat "$BATTERY" \
        --arg net "$NET" \
        --arg temp "$TEMP" \
        --arg disk "$DISK" \
        '{timestamp:$ts, cpu:$cpu, mem:$mem, battery:$bat, net:$net, temp:$temp, disk:$disk}')

    echo "$JSON_ENTRY" >> "$JSONL"

    # Keep last 1000 entries
    tail -n 1000 "$JSONL" > "$JSONL.tmp" && mv "$JSONL.tmp" "$JSONL"

    # Sync to OneDrive (if available)
    if [ -d "$ONEDRIVE_DIR" ]; then
        cp "$JSONL" "$ONEDRIVE_DIR/realtime.jsonl"
    fi

    echo "$TS CPU=$CPU MEM=$MEM BAT=$BATTERY TEMP=$TEMP" >> "$LOG_FILE"
}

log "[GAIA-SENSE v2] Starting telemetry daemon with OneDrive sync..."
while true; do
    collect
    sleep 60
done

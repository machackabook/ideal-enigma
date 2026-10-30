#!/data/data/com.termux/files/usr/bin/bash
# [SS][tdoc-gaia-cloud-mount-v3]
# GAIA Cloud Auto-Mount — OneDrive + Google Drive (non-redundant / no pkg installs)
# Copyright: The Architect / Nexus / Cryptic News LLC
# SERIES: The Nexus of Gaia

LOG_DIR="$HOME/Æ/logs"
CLOUD_DIR="$HOME/Æ/cloud"
STAMP="$(date +%Y%m%d_%H%M%S)"
LOG_FILE="$LOG_DIR/gaia_cloud_mount_$STAMP.log"

mkdir -p "$LOG_DIR" "$CLOUD_DIR/onedrive" "$CLOUD_DIR/gdrive" "$CLOUD_DIR/tree"

log() {
    echo -e "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log "──────────────────────────────────────────────"
log "[GAIA-CLOUD] Starting cloud mount process..."
log "──────────────────────────────────────────────"

# --- Unmount old sessions safely ---
unmount_if_mounted() {
    local path="$1"
    if mount | grep -q "$path"; then
        log "[WARN] Unmounting stale mount at $path"
        termux-umount "$path" 2>/dev/null || fusermount -u "$path" 2>/dev/null
    fi
}

unmount_if_mounted "$CLOUD_DIR/onedrive"
unmount_if_mounted "$CLOUD_DIR/gdrive"

# --- Keep session alive ---
termux-wake-lock

# --- Mount OneDrive ---
if rclone listremotes | grep -q '^onedrive'; then
    log "[INFO] Mounting OneDrive..."
    rclone mount onedrive: "$CLOUD_DIR/onedrive" --vfs-cache-mode writes --daemon \
        && log "[OK] OneDrive mounted successfully." \
        || log "[FAIL] Could not mount OneDrive."
else
    log "[WARN] No OneDrive remote found in rclone config."
fi

# --- Mount Google Drive ---
if rclone listremotes | grep -q '^gdrive'; then
    log "[INFO] Mounting Google Drive..."
    rclone mount gdrive: "$CLOUD_DIR/gdrive" --vfs-cache-mode writes --daemon \
        && log "[OK] Google Drive mounted successfully." \
        || log "[FAIL] Could not mount Google Drive."
else
    log "[WARN] No Google Drive remote found in rclone config."
fi

# --- Verify mounts ---
log "[CHECK] Active cloud mounts:"
df -h | grep Æ/cloud | tee -a "$LOG_FILE" || log "[WARN] No active mounts detected."

# --- Optional Snapshot (if 'tree' exists) ---
if command -v tree >/dev/null 2>&1; then
    SNAPSHOT="$CLOUD_DIR/tree/env_snapshot.txt"
    tree -L 4 ~/storage/downloads > "$SNAPSHOT"
    log "[OK] Snapshot created: $SNAPSHOT"
else
    log "[WARN] 'tree' command not found; skipping snapshot."
fi

log "──────────────────────────────────────────────"
log "[GAIA-CLOUD] Cloud mount sequence complete."
log "──────────────────────────────────────────────"

# --- Self-save integration ---
SELF="$HOME/Æ/autonomous/tdoc-gaia-cloud-mount-v3.sh"
cp "$0" "$SELF" 2>/dev/null
chmod +x "$SELF"
ln -sf "$SELF" "$HOME/Æ/bin/gaia-cloud"
log "[SS][tdoc-gaia-cloud-mount-v3] saved to $SELF and linked as gaia-cloud"

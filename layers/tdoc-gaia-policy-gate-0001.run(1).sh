#!/usr/bin/env bash
# [SS][tdoc-gaia-policy-gate-0001] Clipboard Gate: TDOC+Copyright => Save+Scriptures+Execute+Gemini
# Copyright: The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274
set +e; set +u

AE="/home/Æ"; [ -d "$AE" ] || AE="$HOME/Æ"
LOG_DIR="$AE/logs"; BIN_DIR="$AE/bin"; AUTO_DIR="$AE/autonomous"; DL_DIR="$AE/downloads"
mkdir -p "$LOG_DIR" "$BIN_DIR" "$AUTO_DIR" "$DL_DIR" >/dev/null 2>&1
LOG="$LOG_DIR/tdoc-gaia-policy-gate-0001_$(date +%Y%m%d_%H%M%S 2>/dev/null || echo now).log"
LEDGER="$LOG_DIR/gaia_gate_ledger.jsonl"

CANON_COPYRIGHT='The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274'

have(){ command -v "$1" >/dev/null 2>&1; }

ledger(){
  local kind="$1"; local status="$2"; local msg="$3"
  local ts
  ts="$(date -Is 2>/dev/null || date)"
  printf '{"ts":"%s","kind":"%s","status":"%s","msg":"%s"}\n' \
    "$ts" "$kind" "$status" "$(printf "%s" "$msg" | tr '\n' ' ' | sed 's/"/\\"/g')" >>"$LEDGER" 2>/dev/null || true
}

sha256(){
  if have sha256sum; then printf "%s" "$1" | sha256sum | awk '{print $1}'
elif have openssl; then printf "%s" "$1" | openssl dgst -sha256 | awk '{print $2}'
else echo "nohash"
fi
}

clip_get(){
  if have termux-clipboard-get; then termux-clipboard-get 2>/dev/null || true
  else
    # fallback (non-termux shells): read stdin
    cat
  fi
}

# Extract first fenced ```...``` block if present; else extract from first shebang to end.
extract_code(){
  # stdin -> stdout
  local s
  s="$(cat)"

  # 1) fenced block
  if printf "%s" "$s" | grep -q "```"; then
    printf "%s" "$s" | awk '
      BEGIN{in=0}
      /^```/{ if(in==0){in=1; next} else {exit} }
      { if(in==1) print }
    '
    return 0
  fi

  # 2) shebang onward
  if printf "%s" "$s" | grep -q "^#!/"; then
    printf "%s" "$s" | awk 'BEGIN{on=0} /^#!/{on=1} {if(on==1) print}'
    return 0
  fi

  # 3) nothing extractable
  return 1
}

has_gate_markers(){
  # $1 = full clipboard text
  local txt="$1"
  printf "%s" "$txt" | grep -Eqi '(\ [SS\]\[tdoc-|TDOC="?tdoc-|tdoc-[0-9a-zA-Z._-]+)' || return 1
  printf "%s" "$txt" | grep -Fqi "$CANON_COPYRIGHT" || return 1
  return 0
}

infer_tdoc(){
  # $1 = text; prints a tdoc id or fallback
  local txt="$1"
  local t
  t="$(printf "%s" "$txt" | grep -Eo '\[SS\]\[(tdoc-[^]]+)\]' | head -n 1 | sed -E 's/^\ \[SS\]\[//; s/\]$//')"
  [ -n "$t" ] && { printf "%s" "$t"; return 0; }

  t="$(printf "%s" "$txt" | grep -Eo 'TDOC="?tdoc-[A-Za-z0-9._-]+' | head -n 1 | sed -E 's/^TDOC="?//')"
  [ -n "$t" ] && { printf "%s" "$t"; return 0; }

  printf "tdoc-clipboard-unnamed"
}

save_ss(){
  # $1=tdoc $2=code
  local tdoc="$1"
  local code="$2"
  local stamp; stamp="$(date +%Y%m%d_%H%M%S 2>/dev/null || echo now)"
  local path="$AUTO_DIR/${tdoc}.from_clip.${stamp}.run.sh"
  printf "%s\n" "$code" >"$path" 2>/dev/null || return 1
  chmod +x "$path" 2>/dev/null || true
  printf "%s" "$path"
}

export_copy(){
  local path="$1"
  local stamp; stamp="$(date +%Y%m%d_%H%M%S 2>/dev/null || echo now)"
  local out="$DL_DIR/$(basename "$path").export.${stamp}.sh"
  cp -f "$path" "$out" 2>/dev/null || true
  printf "%s" "$out"
}

scriptures_capture(){
  # relies on gaia-scriptures from prior install; capture current clipboard too
  # $1 = tag ; $2 = rawFlag (0/1)
  local tag="$1" raw="$2"
  if have gaia-scriptures; then
    if [ "$raw" = "1" ]; then gaia-scriptures capture --raw --tag "$tag" >/dev/null 2>&1 || true
    else gaia-scriptures capture --tag "$tag" >/dev/null 2>&1 || true
    fi
  fi
}

send_to_gemini(){
  # send clipboard through gemini-clip (already hooked in your scriptures install)
  if have gemini-clip; then
    gemini-clip >/dev/null 2>&1
    return $?
  fi
  if have nexus; then
    # fallback: send extracted code
    cat | nexus gemini >/dev/null 2>&1
    return $?
  fi
  return 2
}

gate_run(){
  # args:
  #   --raw        store exact payload in scriptures capture
  #   --no-exec    do not execute even if gate passes
  #   --no-send    do not send to gemini
  local RAW=0 NOEXEC=0 NOSEND=0
  while [ $# -gt 0 ]; do
    case "$1" in
      --raw) RAW=1 ;;
      --no-exec) NOEXEC=1 ;;
      --no-send) NOSEND=1 ;;
    esac
    shift
  done

  local clip; clip="$(clip_get)"
  [ -z "$clip" ] && { ledger "gate" "skip" "clipboard empty"; echo "clipboard empty"; return 1; }

  local hash; hash="$(sha256 "$clip")"
  local tdoc; tdoc="$(infer_tdoc "$clip")"

  if ! has_gate_markers "$clip"; then
    ledger "gate" "skip" "no TDOC+copyright markers (tdoc=$tdoc sha=$hash)"
    echo "[GAIA-GATE] skip: missing TDOC+copyright markers"
    # still allow Gemini send if desired
    if [ "$NOSEND" -ne 1 ]; then
      if have gemini-clip; then gemini-clip >/dev/null 2>&1 || true; fi
    fi
    return 0
  fi

  # Extract code
  local code
  code="$(printf "%s" "$clip" | extract_code 2>/dev/null)" || {
    ledger "gate" "fail" "passed markers but could not extract code (tdoc=$tdoc sha=$hash)"
    echo "[GAIA-GATE] fail: cannot extract code"
    return 2
  }

  # Save SS
  local path; path="$(save_ss "$tdoc" "$code")" || {
    ledger "save" "fail" "could not save file (tdoc=$tdoc sha=$hash)"
    echo "[GAIA-GATE] fail: cannot save"
    return 3
  }
  local out; out="$(export_copy "$path")"
  ledger "save" "ok" "saved=$path export=$out tdoc=$tdoc sha=$hash"

  # Scriptures capture (clipboard at send-time)
  scriptures_capture "$tdoc" "$RAW"

  # Syntax check then execute (if allowed)
  local syn=0
  if have bash; then
    bash -n "$path" >/dev/null 2>&1; syn=$?
  fi

  if [ "$syn" -ne 0 ]; then
    ledger "exec" "skip" "bash -n failed (tdoc=$tdoc file=$path)"
    echo "[GAIA-GATE] saved, but not executed: bash -n failed"
  else
    if [ "$NOEXEC" -eq 1 ]; then
      ledger "exec" "skip" "no-exec flag set (tdoc=$tdoc file=$path)"
      echo "[GAIA-GATE] saved, not executed: --no-exec"
    else
      ledger "exec" "run" "executing (tdoc=$tdoc file=$path)"
      echo "[GAIA-GATE] executing: $path"
      bash "$path" >/dev/null 2>&1 || true
      ledger "exec" "done" "executed (tdoc=$tdoc file=$path)"
    fi
  fi

  # Send to Gemini (optional)
  if [ "$NOSEND" -ne 1 ]; then
    ledger "send" "run" "sending to gemini (tdoc=$tdoc)"
    if have gemini-clip; then
      gemini-clip >/dev/null 2>&1 || true
    else
      printf "%s" "$code" | send_to_gemini >/dev/null 2>&1 || true
    fi
    ledger "send" "done" "sent (tdoc=$tdoc)"
  fi

  echo "[GAIA-GATE] ok: saved=$path export=$out"
  return 0
}

install_cmds(){
  cat >"$BIN_DIR/gaia-gate-send" <<'GGS'
#!/usr/bin/env bash
# gaia-gate-send: clipboard → TDOC+copyright gate → save/scriptures/exec → gemini
# Copyright: The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274
set +e; set +u
AE="/home/Æ"; [ -d "$AE" ] || AE="$HOME/Æ"
RUN="$AE/autonomous/tdoc-gaia-policy-gate-0001.run.sh"
[ -x "$RUN" ] || { echo "missing: $RUN"; exit 2; }
bash "$RUN" __gate "$@"
GGS
  chmod +x "$BIN_DIR/gaia-gate-send" 2>/dev/null || true
}

case "${1:-}" in
  __gate) shift; gate_run "$@"; exit $? ;;
esac

install_cmds
echo "OK: gaia-gate-send installed"
echo "Use:"
echo "  gaia-gate-send            # default (redacted scriptures capture)"
echo "  gaia-gate-send --raw      # exact scripture payload"
echo "  gaia-gate-send --no-exec  # save/scriptures only"
echo "  gaia-gate-send --no-send  # save/exec only"

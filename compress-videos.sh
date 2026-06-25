#!/usr/bin/env bash
# One-off helper: re-encode public/*.mp4 with H.264 CRF 26 (audio stripped,
# faststart for progressive playback). Originals are moved to .video_backup/
# only after a smaller re-encode is produced; files that don't shrink are left
# untouched. Safe to re-run.
set -uo pipefail

FF="$(pwd)/node_modules/ffmpeg-static/ffmpeg"
BACKUP=".video_backup"
mkdir -p "$BACKUP"

total_before=0
total_after=0

for src in public/*.mp4; do
  name="$(basename "$src")"
  tmp="$BACKUP/_tmp_$name"
  before=$(stat -f%z "$src")

  if ! "$FF" -nostdin -y -i "$src" \
      -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p \
      -movflags +faststart -an "$tmp" >/dev/null 2>&1; then
    echo "FAIL encode: $name (left as-is)"
    rm -f "$tmp"
    total_before=$((total_before + before))
    total_after=$((total_after + before))
    continue
  fi

  after=$(stat -f%z "$tmp")
  total_before=$((total_before + before))

  if [ "$after" -lt "$before" ]; then
    mv "$src" "$BACKUP/$name"   # keep original as backup
    mv "$tmp" "$src"
    total_after=$((total_after + after))
    printf "OK   %-32s %6sK -> %6sK\n" "$name" $((before/1024)) $((after/1024))
  else
    rm -f "$tmp"
    total_after=$((total_after + before))
    printf "SKIP %-32s already small (%sK)\n" "$name" $((before/1024))
  fi
done

echo "----"
echo "TOTAL before: $((total_before/1024/1024))M  after: $((total_after/1024/1024))M"
echo "DONE"

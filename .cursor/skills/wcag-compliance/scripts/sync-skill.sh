#!/usr/bin/env bash
# Sync wcag-compliance skill between project and global Cursor skills.
#
# Usage:
#   sync-skill.sh              # project → ~/.cursor/skills (default, source of truth: project)
#   sync-skill.sh --from-global # global → project
#   sync-skill.sh --dry-run     # preview without copying
#   sync-skill.sh --help

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_SKILL="$(cd "$SCRIPT_DIR/.." && pwd)"
GLOBAL_SKILL="${HOME}/.cursor/skills/wcag-compliance"

DRY_RUN=false
DIRECTION="to-global"

usage() {
  cat <<'EOF'
Sync wcag-compliance skill between project and global installs.

Locations:
  Project:  .cursor/skills/wcag-compliance/  (in this repo)
  Global:   ~/.cursor/skills/wcag-compliance/

Options:
  (default)       Sync project → global (project is source of truth)
  --from-global   Sync global → project
  --dry-run       Show what would change without copying
  --help          Show this help

Examples:
  .cursor/skills/wcag-compliance/scripts/sync-skill.sh
  .cursor/skills/wcag-compliance/scripts/sync-skill.sh --dry-run
  .cursor/skills/wcag-compliance/scripts/sync-skill.sh --from-global
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from-global) DIRECTION="to-project" ;;
    --dry-run) DRY_RUN=true ;;
    --help|-h) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

case "$DIRECTION" in
  to-global)
    SRC="$PROJECT_SKILL"
    DST="$GLOBAL_SKILL"
  ;;
  to-project)
    SRC="$GLOBAL_SKILL"
    DST="$PROJECT_SKILL"
  ;;
esac

if [[ ! -d "$SRC" ]]; then
  echo "Error: source not found: $SRC" >&2
  exit 1
fi

RSYNC_OPTS=(-a --delete --exclude '.DS_Store')
if $DRY_RUN; then
  RSYNC_OPTS+=(-vn)
else
  RSYNC_OPTS+=(-v)
  mkdir -p "$DST"
fi

echo "Sync: $SRC/ → $DST/"
rsync "${RSYNC_OPTS[@]}" "$SRC/" "$DST/"

if $DRY_RUN; then
  echo "(dry run — no files changed)"
else
  echo "Done."
fi

# P4 overlay patch — apply only over P3 Free Local OCR (15 Nov 2026)

Read P4_DELIVERY.md. This patch has no new dependencies or SQL migrations.
Keep a backup of your current project and compare local modifications before copying over files.
Run `node tools/verify-p4-source.mjs .`, `npx tsc --noEmit`, `npm test`, and `npm run build`.
This overlay **does not remove** the old paid OCR Edge Function file if it already exists in your project; do not deploy it. The complete P4 project ZIP archives it outside the active functions folder.

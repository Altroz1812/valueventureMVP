# Archived paid OCR provider — disabled in P4

The original Google Cloud Vision Edge Function is preserved here for code-history only.
It is NOT used by the browser OCR and is outside `supabase/functions/`, so ordinary
function-deployment commands will not deploy it from this source tree.

If you previously deployed `vp-ocr-document` to your Supabase project, removing
this local source does NOT automatically undeploy that remote function. Review
its status in the Supabase Dashboard. The active screens call `extractLocally`
through the authenticated private-document storage client, not this Edge Function.
No paid OCR credentials are needed for P4.

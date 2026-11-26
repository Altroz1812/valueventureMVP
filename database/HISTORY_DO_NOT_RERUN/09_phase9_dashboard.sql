-- ValuationPro Phase 9 | LIVE DASHBOARD CARD WIRING
-- BIGINT only. Additive: ONE function; NO table/column/FK/check/trigger/UI workflow edits.
-- Depends on Phases 3-8 and the verified Phase 8 tenant/branch permission functions.
-- Run as database owner, in a NEW blank SQL Editor tab AFTER a backup and preflight.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.cases') IS NULL
    OR to_regclass('public.vp_branches') IS NULL
    OR to_regclass('public.vp_qc_tasks') IS NULL
    OR to_regclass('public.vp_site_visits') IS NULL
    OR to_regclass('public.vp_report_versions') IS NULL
    OR to_regclass('public.vp_invoice_records') IS NULL
    OR to_regclass('public.vp_invoice_payments') IS NULL
    OR to_regclass('public.vp_alert_inbox') IS NULL
    OR to_regprocedure('public.vp8_check_filters(bigint,date,date)') IS NULL
    OR to_regprocedure('public.vp8_branch_visible(text)') IS NULL
    OR to_regprocedure('public.vp_billing_can(text)') IS NULL THEN
   RAISE EXCEPTION 'Phase 9 prerequisites missing. Run 00_preflight_readonly.sql first.';
 END IF;
END $$;

CREATE OR REPLACE FUNCTION public.vp9_dashboard_snapshot(p_branch_id bigint DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_org bigint := public.vp_current_org_id();
 v_actor bigint := public.vp_field_my_user_id();
 v_today date := (now() AT TIME ZONE 'Asia/Kolkata')::date;
 v_month date := date_trunc('month',now() AT TIME ZONE 'Asia/Kolkata')::date;
 v_active bigint := 0;
 v_overdue bigint := 0;
 v_pending bigint := 0;
 v_visits_today bigint := 0;
 v_visits_completed_mtd bigint := 0;
 v_reports_due bigint := 0;
 v_released_mtd bigint := 0;
 v_unread bigint := 0;
 v_billed_mtd numeric := NULL;
 v_receipts_mtd numeric := NULL;
 v_finance boolean := false;
 v_branches jsonb := '[]'::jsonb;
 v_recent jsonb := '[]'::jsonb;
 v_oldest jsonb := NULL;
BEGIN
 -- Phase 8 controls active membership, first login, analytics.View,
 -- valid same-tenant branch selection and assigned branch visibility.
 PERFORM public.vp8_check_filters(p_branch_id,NULL,NULL);
 IF v_org IS NULL OR v_actor IS NULL THEN
   RAISE EXCEPTION 'An active ValuationPro user is required'; END IF;

 -- CURRENT pipeline, not cases created in a selected historical cohort.
 SELECT count(*) FILTER(WHERE c.stage NOT IN ('Approved','Submitted','Invoiced')),
        count(*) FILTER(WHERE c.stage NOT IN ('Approved','Submitted','Invoiced') AND c.due<v_today)
   INTO v_active,v_overdue
 FROM public.cases c
 WHERE c.org_id=v_org AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
   AND public.vp8_branch_visible(c.meta->>'branch_id');

 -- Branch-scoped recent cases and oldest overdue case use the SAME trusted
 -- filter as the summary; no broad client-side cases table read is needed.
 SELECT coalesce(jsonb_agg(jsonb_build_object(
   'num',x.num,'case_no',x.case_no,'property',x.addr,'bank',x.bank,
   'stage',x.ui_stage,'days_left',x.days_left) ORDER BY x.created DESC,x.num DESC),'[]'::jsonb)
 INTO v_recent
 FROM (
   SELECT c.num,coalesce(nullif(c.meta->>'case_no',''),'#'||c.num::text) AS case_no,
     c.addr,c.bank,coalesce(nullif(c.meta->>'ui_stage',''),c.stage) AS ui_stage,
     (c.due-v_today)::integer AS days_left,c.created
   FROM public.cases c
   WHERE c.org_id=v_org
     AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
     AND public.vp8_branch_visible(c.meta->>'branch_id')
   ORDER BY c.created DESC,c.num DESC LIMIT 8
 ) x;

 SELECT jsonb_build_object(
  'case_no',coalesce(nullif(c.meta->>'case_no',''),'#'||c.num::text),
  'days_overdue',(v_today-c.due)::integer)
 INTO v_oldest
 FROM public.cases c
 WHERE c.org_id=v_org AND c.stage NOT IN ('Approved','Submitted','Invoiced')
   AND c.due<v_today
   AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
   AND public.vp8_branch_visible(c.meta->>'branch_id')
 ORDER BY c.due ASC,c.num ASC LIMIT 1;

 -- CURRENT pending tasks; one pending task per case by Phase 4 unique index.
 SELECT count(*) INTO v_pending
 FROM public.vp_qc_tasks q JOIN public.cases c ON c.org_id=q.org_id AND c.num=q.num
 WHERE q.org_id=v_org AND q.status='Pending'
   AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
   AND public.vp8_branch_visible(c.meta->>'branch_id');

 -- Inspections SCHEDULED for today, including those already checked out.
 -- Cancelled inspections are not counted.
 SELECT count(*) FILTER(WHERE (v.scheduled_at AT TIME ZONE 'Asia/Kolkata')::date=v_today AND v.status<>'Cancelled'),
        count(*) FILTER(WHERE v.status='Completed' AND
          (v.checkout_at AT TIME ZONE 'Asia/Kolkata')::date>=v_month AND
          (v.checkout_at AT TIME ZONE 'Asia/Kolkata')::date<=v_today)
   INTO v_visits_today,v_visits_completed_mtd
 FROM public.vp_site_visits v JOIN public.cases c ON c.org_id=v.org_id AND c.num=v.num
 WHERE v.org_id=v_org
   AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
   AND public.vp8_branch_visible(c.meta->>'branch_id');

 -- Existing card text says 'Reports Due This Week'. The only confirmed due
 -- date is cases.due, so this is UNRELEASED CASES due in next 7 calendar days,
 -- not a separately invented contractual bank report deadline.
 SELECT count(*) INTO v_reports_due
 FROM public.cases c
 WHERE c.org_id=v_org AND c.due BETWEEN v_today AND (v_today + 6)
   AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
   AND public.vp8_branch_visible(c.meta->>'branch_id')
   AND NOT EXISTS (
     SELECT 1 FROM public.vp_report_versions r
     WHERE r.org_id=c.org_id AND r.num=c.num AND r.status='Released');

 SELECT count(*) INTO v_released_mtd
 FROM public.vp_report_versions r JOIN public.cases c
  ON c.org_id=r.org_id AND c.num=r.num
 WHERE r.org_id=v_org AND r.status='Released' AND
   (r.released_at AT TIME ZONE 'Asia/Kolkata')::date BETWEEN v_month AND v_today
   AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
   AND public.vp8_branch_visible(c.meta->>'branch_id');

 -- Finances are completely hidden, not reported as zero, without Billing View.
 v_finance := public.vp_billing_can('View');
 IF v_finance THEN
   SELECT coalesce(sum(i.tot),0) INTO v_billed_mtd
   FROM public.vp_invoice_records r JOIN public.invoices i
     ON i.org_id=r.org_id AND i.id=r.invoice_id
   WHERE r.org_id=v_org AND i.created BETWEEN v_month AND v_today
     AND (p_branch_id IS NULL OR r.branch_id=p_branch_id)
     AND public.vp8_branch_visible(r.branch_id::text);

   SELECT coalesce(sum(p.amount),0) INTO v_receipts_mtd
   FROM public.vp_invoice_payments p JOIN public.vp_invoice_records r
     ON r.org_id=p.org_id AND r.invoice_id=p.invoice_id
   WHERE p.org_id=v_org AND p.payment_date BETWEEN v_month AND v_today
     AND (p_branch_id IS NULL OR r.branch_id=p_branch_id)
     AND public.vp8_branch_visible(r.branch_id::text);
 END IF;

 -- Notification count is ALWAYS for this signed-in recipient, for all branches.
 -- It does not claim delivery to external WhatsApp/email providers.
 SELECT count(*) INTO v_unread FROM public.vp_alert_inbox a
 WHERE a.org_id=v_org AND a.recipient_user_id=v_actor AND a.read_at IS NULL;

 -- Active cases per accessible branch; no fabricated branch counts.
 SELECT coalesce(jsonb_agg(jsonb_build_object(
   'branch_id',z.branch_id,'branch_name',z.branch_name,'active_cases',z.active_cases)
   ORDER BY z.active_cases DESC,z.branch_name),'[]'::jsonb) INTO v_branches
 FROM (
   SELECT b.id::text AS branch_id,b.name AS branch_name,
     count(c.num) FILTER(WHERE c.stage NOT IN ('Approved','Submitted','Invoiced')) AS active_cases
   FROM public.vp_branches b
   LEFT JOIN public.cases c ON c.org_id=b.org_id AND c.meta->>'branch_id'=b.id::text
   WHERE b.org_id=v_org AND (p_branch_id IS NULL OR b.id=p_branch_id)
     AND public.vp8_branch_visible(b.id::text)
   GROUP BY b.id,b.name
   ORDER BY active_cases DESC,b.name LIMIT 100
 ) z;

 RETURN jsonb_build_object(
  'as_of',now(), 'timezone','Asia/Kolkata', 'branch_filter',p_branch_id::text,
  'active_cases',v_active,'overdue_cases',v_overdue,'pending_qc',v_pending,
  'field_visits_today',v_visits_today,'field_visits_completed_mtd',v_visits_completed_mtd,
  'reports_due_this_week',v_reports_due,'reports_released_mtd',v_released_mtd,
  'billing_access',v_finance,'billing_mtd',v_billed_mtd,'receipts_mtd',v_receipts_mtd,
  'unread_alerts_all_branches',v_unread,'branch_performance',v_branches,
  'recent_cases',v_recent,'oldest_overdue_case',v_oldest
 );
END; $$;

REVOKE ALL ON FUNCTION public.vp9_dashboard_snapshot(bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.vp9_dashboard_snapshot(bigint) TO authenticated;
COMMIT;

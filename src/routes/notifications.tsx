import { createFileRoute } from '@tanstack/react-router';
import { AppShell, PageHeader } from '@/components/app-shell';
import { VpNotificationCenter } from '@/components/notifications/vp-notification-center';
export const Route = createFileRoute('/notifications')({component: NotificationsPage});
function NotificationsPage(){return <AppShell><PageHeader title="Notifications & TAT" description="Live alerts for your organization; no demo counts."/><VpNotificationCenter/></AppShell>}

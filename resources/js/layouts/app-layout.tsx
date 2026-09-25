import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { usePage } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { useSessionDraftCleanup } from '@/hooks/use-session-draft';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const page = usePage().props as { errors?: Record<string, string>; auth?: { draftScope?: string | null } };
    const errors = page.errors ?? {};
    useSessionDraftCleanup(page.auth?.draftScope);
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {Object.keys(errors).length > 0 && <div role="alert" className="m-4 rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-900"><strong>Confira os dados informados:</strong><ul className="list-disc pl-5">{Object.entries(errors).map(([field, message]) => <li key={field}>{message}</li>)}</ul></div>}
            {children}
        </AppLayoutTemplate>
    );
}

import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import AuthCardLayout from '@/layouts/auth/auth-card-layout';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { usePage } from '@inertiajs/react';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    const { auth_layout } = usePage().props as { auth_layout?: string | null };

    const LayoutComponent =
        auth_layout === 'card'
            ? AuthCardLayout
            : auth_layout === 'split'
              ? AuthSplitLayout
              : AuthSimpleLayout;

    return (
        <LayoutComponent title={title} description={description}>
            {children}
        </LayoutComponent>
    );
}

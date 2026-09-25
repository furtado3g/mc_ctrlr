import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    Shield,
    CalendarDays,
    Wallet,
    FileBarChart,
    Settings,
    UserRound,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as unknown as {
        auth: {
            permissions: { area: string; action: string }[];
            hasMemberProfile: boolean;
        };
    };
    const can = (area: string) =>
        auth.permissions?.some((p) => p.area === area && p.action === 'view');
    const items: NavItem[] = [...mainNavItems];
    if (auth.hasMemberProfile)
        items.push({
            title: 'Meu perfil',
            href: '/me/profile',
            icon: UserRound,
        });
    if (can('cadastros'))
        items.push(
            { title: 'Membros', href: '/members', icon: Users },
            { title: 'Hierarquia', href: '/club-roles', icon: Shield },
        );
    if (can('cobrancas'))
        items.push({
            title: 'Mensalidades',
            href: '/fees',
            icon: CalendarDays,
        });
    if (can('caixa'))
        items.push({ title: 'Caixa', href: '/cash', icon: Wallet });
    if (can('relatorios'))
        items.push({
            title: 'Relatórios',
            href: '/reports/fees',
            icon: FileBarChart,
        });
    if (can('administracao'))
        items.push({ title: 'Usuários', href: '/admin/users', icon: Settings });
    if (can('administracao'))
        items.push({
            title: 'Grupos de acesso',
            href: '/access-groups',
            icon: Shield,
        });
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

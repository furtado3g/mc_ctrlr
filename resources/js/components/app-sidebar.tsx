import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    FileBarChart,
    LayoutGrid,
    PanelsTopLeft,
    Settings,
    Shield,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';
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

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as unknown as {
        auth: {
            permissions?: { area: string; action: string }[];
            hasMemberProfile?: boolean;
        };
    };

    const can = (area: string) =>
        auth?.permissions?.some((p) => p.area === area && p.action === 'view') ?? false;

    const items: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (auth?.hasMemberProfile) {
        items.push({
            title: 'Meu perfil',
            href: '/me/profile',
            icon: UserRound,
        });
    }

    // Subnível: Gestão do Clube
    const clubItems: NavItem[] = [];
    if (can('cadastros')) {
        clubItems.push(
            { title: 'Membros', href: '/members', icon: Users },
            { title: 'Hierarquia & Cargos', href: '/club-roles', icon: Shield },
        );
    }
    if (clubItems.length > 0) {
        items.push({
            title: 'Gestão do Clube',
            icon: Users,
            items: clubItems,
        });
    }

    // Subnível: Financeiro
    const financialItems: NavItem[] = [];
    if (can('cobrancas')) {
        financialItems.push({
            title: 'Mensalidades',
            href: '/fees',
            icon: CalendarDays,
        });
    }
    if (can('caixa')) {
        financialItems.push({
            title: 'Caixa',
            href: '/cash',
            icon: Wallet,
        });
    }
    if (can('relatorios')) {
        financialItems.push({
            title: 'Relatórios',
            href: '/reports/fees',
            icon: FileBarChart,
        });
    }
    if (financialItems.length > 0) {
        items.push({
            title: 'Financeiro',
            icon: Wallet,
            items: financialItems,
        });
    }

    // Institucional / Landing page
    if (can('institucional')) {
        items.push({
            title: 'Página institucional',
            href: '/institutional-page',
            icon: PanelsTopLeft,
        });
    }

    // Subnível: Administração
    const adminItems: NavItem[] = [];
    if (can('administracao')) {
        adminItems.push(
            { title: 'Usuários', href: '/admin/users', icon: Users },
            { title: 'Grupos de acesso', href: '/access-groups', icon: Shield },
        );
    }
    if (adminItems.length > 0) {
        items.push({
            title: 'Administração',
            icon: Settings,
            items: adminItems,
        });
    }

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

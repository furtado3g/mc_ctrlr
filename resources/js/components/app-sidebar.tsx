import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Cake,
    CalendarDays,
    CalendarRange,
    FileBarChart,
    FileText,
    LayoutGrid,
    MessageSquareShare,
    PanelsTopLeft,
    Receipt,
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
import { RegionalBadge } from '@/components/regional-badge';
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
            user?: { is_global?: boolean };
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
        {
            title: 'Feed Social',
            href: '/feed',
            icon: MessageSquareShare,
        },
        {
            title: 'Aniversariantes',
            href: '/birthdays',
            icon: Cake,
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
        financialItems.push(
            {
                title: 'Mensalidades',
                href: '/fees',
                icon: CalendarDays,
            },
            {
                title: 'Períodos de Cobrança',
                href: '/billing-periods',
                icon: CalendarRange,
            },
        );
    }
    if (can('caixa')) {
        financialItems.push({
            title: 'Livro Caixa',
            href: '/cash',
            icon: Wallet,
        });
    }
    if (financialItems.length > 0) {
        items.push({
            title: 'Financeiro',
            icon: Wallet,
            items: financialItems,
        });
    }

    // Subnível: Relatórios
    const reportItems: NavItem[] = [];
    if (can('relatorios')) {
        reportItems.push(
            {
                title: 'Mensalidades',
                href: '/reports/fees',
                icon: FileBarChart,
            },
            {
                title: 'Livro Caixa',
                href: '/reports/cash',
                icon: FileText,
            },
            {
                title: 'Prestação Fiscal',
                href: '/reports/fiscal',
                icon: Receipt,
            },
        );
    }
    if (reportItems.length > 0) {
        items.push({
            title: 'Relatórios',
            icon: FileBarChart,
            items: reportItems,
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
        if (auth?.user?.is_global) {
            adminItems.push({
                title: 'Divisões Regionais',
                href: '/admin/regionals',
                icon: Building2,
            });
        }
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
                <div className="px-2 pt-1">
                    <RegionalBadge />
                </div>
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

import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    CheckCircle2,
    FileBarChart,
    Globe,
    KeyRound,
    Lock,
    Mail,
    Plus,
    RotateCcw,
    Search,
    Settings,
    Shield,
    ShieldCheck,
    UserCheck,
    UserPlus,
    UserX,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { DataTable } from '@/components/tables/data-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';
import type { TableQuery } from '@/types/dynamic-ui';

type Grant = { area: string; action: string };
type User = {
    id: number;
    name: string;
    email: string;
    active: boolean;
    permission_grants: Grant[];
};

const moduleConfig: Record<
    string,
    { label: string; desc: string; icon: React.ComponentType<{ className?: string }> }
> = {
    cadastros: {
        label: 'Cadastros',
        desc: 'Membros e estrutura de cargos',
        icon: Users,
    },
    cobrancas: {
        label: 'Cobranças',
        desc: 'Mensalidades e geração de taxas',
        icon: CalendarDays,
    },
    caixa: {
        label: 'Caixa',
        desc: 'Movimentações e fluxo financeiro',
        icon: Wallet,
    },
    relatorios: {
        label: 'Relatórios',
        desc: 'Extratos financeiros e fiscais',
        icon: FileBarChart,
    },
    administracao: {
        label: 'Administração',
        desc: 'Usuários e grupos de permissão',
        icon: Settings,
    },
    institucional: {
        label: 'Institucional',
        desc: 'Landing page e identidade pública',
        icon: Globe,
    },
};

const areaKeys = Object.keys(moduleConfig);

export default function AdminUsers({
    users,
    tableQuery,
}: {
    users: { data: User[]; total: number };
    tableQuery: TableQuery;
}) {
    const { auth } = usePage().props as {
        auth: { draftScope?: string | null };
    };

    const draft = useSessionDraft<{
        name: string;
        email: string;
        password: string;
    }>({
        scope: auth.draftScope,
        formKey: 'admin-users:create',
        recordKey: 'new',
        initialValues: { name: '', email: '', password: '' },
    });
    const { form } = draft;

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <Head title="Usuários" />

            {/* Cabeçalho da página */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Shield className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Usuários Administrativos
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Gerenciamento de credenciais e permissões granulares de acesso.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
                        {users.total} {users.total === 1 ? 'usuário' : 'usuários'}
                    </Badge>
                    <Button
                        onClick={() => setIsCreateOpen(!isCreateOpen)}
                        className="gap-2"
                        variant={isCreateOpen ? 'secondary' : 'default'}
                    >
                        {isCreateOpen ? (
                            <>
                                <X className="size-4" />
                                Fechar formulário
                            </>
                        ) : (
                            <>
                                <UserPlus className="size-4" />
                                Novo usuário
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Card de criação expansível */}
            {isCreateOpen && (
                <Card className="border-primary/20 bg-card/60 shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <UserPlus className="size-4 text-primary" />
                            Cadastrar Novo Usuário Administrativo
                        </CardTitle>
                        <CardDescription>
                            Informe os dados iniciais. As permissões específicas poderão ser configuradas após o cadastro.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminForm
                            form={form}
                            submitLabel="Criar usuário"
                            draftRestored={draft.draftRestored}
                            connectionError={draft.connectionError}
                            onDiscardDraft={draft.discardDraft}
                            onSubmit={(e) => {
                                e.preventDefault();
                                draft.submit('post', '/admin/users', {
                                    onSuccess: () => {
                                        setIsCreateOpen(false);
                                    },
                                });
                            }}
                            className="space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-3">
                                <FormField
                                    id="admin-user-name"
                                    label="Nome completo"
                                    required
                                    error={form.errors.name}
                                >
                                    <Input
                                        id="admin-user-name"
                                        autoComplete="name"
                                        placeholder="Ex: João da Silva"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                </FormField>
                                <FormField
                                    id="admin-user-email"
                                    label="E-mail de acesso"
                                    required
                                    error={form.errors.email}
                                >
                                    <Input
                                        id="admin-user-email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Ex: joao@motoclube.com"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                    />
                                </FormField>
                                <FormField
                                    id="admin-user-password"
                                    label="Senha inicial temporária"
                                    required
                                    error={form.errors.password}
                                >
                                    <Input
                                        id="admin-user-password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Mínimo 8 caracteres"
                                        value={form.data.password}
                                        onChange={(e) =>
                                            form.setData('password', e.target.value)
                                        }
                                    />
                                </FormField>
                            </div>
                        </AdminForm>
                    </CardContent>
                </Card>
            )}

            {/* Listagem em DataTable moderno */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        Lista de Usuários do Sistema
                    </CardTitle>
                    <CardDescription>
                        Filtre e gerencie a situação e as permissões ativas de cada conta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <DataTable
                        table="admin_users"
                        rows={users.data}
                        total={users.total}
                        query={tableQuery}
                        rowKey={(user) => user.id}
                        columns={[
                            {
                                key: 'name',
                                label: 'Usuário',
                                sortable: true,
                                render: (user) => {
                                    const initials = user.name
                                        .split(' ')
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((part) => part[0]?.toUpperCase())
                                        .join('');

                                    return (
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-8 rounded-full border bg-muted">
                                                <AvatarFallback className="text-xs font-semibold">
                                                    {initials || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <span className="font-semibold text-sm block">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    ID #{user.id}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                },
                            },
                            {
                                key: 'email',
                                label: 'E-mail',
                                sortable: true,
                                priority: 'secondary',
                                render: (user) => (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Mail className="size-3.5" />
                                        <span>{user.email}</span>
                                    </div>
                                ),
                            },
                            {
                                key: 'active',
                                label: 'Situação',
                                sortable: true,
                                render: (user) =>
                                    user.active ? (
                                        <Badge
                                            variant="secondary"
                                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1"
                                        >
                                            <UserCheck className="size-3" />
                                            Ativo
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="secondary"
                                            className="bg-muted text-muted-foreground text-xs gap-1"
                                        >
                                            <UserX className="size-3" />
                                            Inativo
                                        </Badge>
                                    ),
                            },
                            {
                                key: 'permissions',
                                label: 'Permissões & Acesso',
                                priority: 'secondary',
                                render: (user) => <UserPermissionsModal user={user} />,
                            },
                        ]}
                        filters={({ setFilter }) => (
                            <label className="flex items-center gap-2 text-xs font-medium">
                                <span>Situação:</span>
                                <select
                                    className="h-8 rounded-md border border-input bg-background px-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={String(tableQuery.filters.active ?? '')}
                                    onChange={(e) =>
                                        setFilter(
                                            'active',
                                            e.target.value === ''
                                                ? null
                                                : e.target.value === 'true',
                                        )
                                    }
                                >
                                    <option value="">Todas</option>
                                    <option value="true">Apenas Ativos</option>
                                    <option value="false">Apenas Inativos</option>
                                </select>
                            </label>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

function UserPermissionsModal({ user }: { user: User }) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        active: user.active,
        permissions: user.permission_grants.map((p) => `${p.area}.${p.action}`),
    });

    const accessError = (form.errors as Record<string, string>).access;

    const toggle = (key: string) => {
        form.setData(
            'permissions',
            form.data.permissions.includes(key)
                ? form.data.permissions.filter((p) => p !== key)
                : [...form.data.permissions, key],
        );
    };

    const grantAll = () => {
        const allKeys: string[] = [];
        areaKeys.forEach((area) => {
            allKeys.push(`${area}.view`, `${area}.edit`);
        });
        form.setData('permissions', allKeys);
    };

    const clearAll = () => {
        form.setData('permissions', []);
    };

    const activeCount = form.data.permissions.length;
    const totalPossible = areaKeys.length * 2;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 gap-1.5 hover:border-primary/50"
                    >
                        <KeyRound className="size-3 text-primary" />
                        Gerenciar permissões
                    </Button>
                </DialogTrigger>

                <Badge
                    variant="outline"
                    className="text-[11px] font-mono shrink-0"
                >
                    {user.permission_grants.length} / {totalPossible}
                </Badge>
            </div>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <ShieldCheck className="size-5 text-primary" />
                        Permissões de {user.name}
                    </DialogTitle>
                    <DialogDescription>
                        Controle granular de acesso por área do sistema para {user.email}.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.patch(`/admin/users/${user.id}/permissions`, {
                            onSuccess: () => {
                                form.setDefaults();
                                setOpen(false);
                            },
                        });
                    }}
                    className="space-y-6 pt-2"
                >
                    {accessError && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                            {accessError}
                        </div>
                    )}

                    {/* Status da Conta */}
                    <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                        <div>
                            <span className="font-semibold text-sm block">
                                Situação da Conta
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Usuários inativos não conseguem entrar no sistema nem realizar ações.
                            </span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                            <input
                                type="checkbox"
                                checked={form.data.active}
                                className="size-4 rounded border-input text-primary focus:ring-primary"
                                onChange={(e) => form.setData('active', e.target.checked)}
                            />
                            <span>{form.data.active ? 'Ativo' : 'Inativo'}</span>
                        </label>
                    </div>

                    {/* Barra de atalhos */}
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            <strong>{activeCount}</strong> de {totalPossible} permissões ativas
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="text-xs text-primary hover:underline font-medium"
                                onClick={grantAll}
                            >
                                Selecionar todas
                            </button>
                            <span className="text-muted-foreground">·</span>
                            <button
                                type="button"
                                className="text-xs text-muted-foreground hover:text-foreground font-medium"
                                onClick={clearAll}
                            >
                                Limpar
                            </button>
                        </div>
                    </div>

                    {/* Grid de permissões por módulo */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {areaKeys.map((areaKey) => {
                            const config = moduleConfig[areaKey];
                            const Icon = config.icon;
                            const hasView = form.data.permissions.includes(`${areaKey}.view`);
                            const hasEdit = form.data.permissions.includes(`${areaKey}.edit`);

                            return (
                                <div
                                    key={areaKey}
                                    className="rounded-lg border bg-card p-3.5 shadow-2xs space-y-3"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                            <Icon className="size-3.5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold block leading-tight">
                                                {config.label}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {config.desc}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <label
                                            className={`flex items-center gap-2 p-2 rounded border text-xs cursor-pointer transition-colors ${
                                                hasView
                                                    ? 'bg-primary/5 border-primary/30 text-foreground font-medium'
                                                    : 'bg-muted/10 border-input text-muted-foreground'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={hasView}
                                                className="size-3.5 rounded border-input text-primary focus:ring-primary"
                                                onChange={() => toggle(`${areaKey}.view`)}
                                            />
                                            Consultar
                                        </label>

                                        <label
                                            className={`flex items-center gap-2 p-2 rounded border text-xs cursor-pointer transition-colors ${
                                                hasEdit
                                                    ? 'bg-primary/5 border-primary/30 text-foreground font-medium'
                                                    : 'bg-muted/10 border-input text-muted-foreground'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={hasEdit}
                                                className="size-3.5 rounded border-input text-primary focus:ring-primary"
                                                onChange={() => toggle(`${areaKey}.edit`)}
                                            />
                                            Alterar
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <DialogFooter className="pt-2 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Salvar permissões
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

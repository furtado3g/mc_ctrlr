import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CalendarDays,
    Check,
    CheckCircle2,
    Edit2,
    FileBarChart,
    Globe,
    Layers,
    Plus,
    RotateCcw,
    Settings,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    UserCheck,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Permission = { area: string; action: string };
type SpecialPermission = { area: string; action: string; label: string };
type Group = {
    id: number;
    name: string;
    active: boolean;
    permissions: Permission[];
    roles_count: number;
};
type Role = {
    id: number;
    name: string;
    active: boolean;
    access_group_id: number | null;
    access_group: Group | null;
};

const areaLabels: Record<
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
        desc: 'Mensalidades e cobranças',
        icon: CalendarDays,
    },
    caixa: {
        label: 'Caixa',
        desc: 'Movimentações e fluxo financeiro',
        icon: Wallet,
    },
    relatorios: {
        label: 'Relatórios',
        desc: 'Extratos e relatórios fiscais',
        icon: FileBarChart,
    },
    administracao: {
        label: 'Administração',
        desc: 'Usuários e permissões do sistema',
        icon: Settings,
    },
    institucional: {
        label: 'Institucional',
        desc: 'Landing page e identidade pública',
        icon: Globe,
    },
};

export default function AccessGroups({
    groups,
    roles,
    areas,
    actions,
    specialPermissions,
}: {
    groups: Group[];
    roles: Role[];
    areas: string[];
    actions: string[];
    specialPermissions: SpecialPermission[];
}) {
    const [editing, setEditing] = useState<number | null>(null);

    const form = useForm<{
        name: string;
        active: boolean;
        permissions: Permission[];
    }>({ name: '', active: true, permissions: [] });

    const accessError = (form.errors as Record<string, string>).access;

    const permissionLabel = ({ area, action }: Permission) =>
        specialPermissions.find(
            (permission) =>
                permission.area === area && permission.action === action,
        )?.label ?? `${area}.${action}`;

    const toggle = (area: string, action: string) => {
        const exists = form.data.permissions.some(
            (permission) =>
                permission.area === area && permission.action === action,
        );
        form.setData(
            'permissions',
            exists
                ? form.data.permissions.filter(
                      (permission) =>
                          permission.area !== area ||
                          permission.action !== action,
                  )
                : [...form.data.permissions, { area, action }],
        );
    };

    const grantAllStandard = () => {
        const all: Permission[] = [];
        areas.forEach((area) => {
            actions.forEach((action) => {
                all.push({ area, action });
            });
        });
        form.setData('permissions', all);
    };

    const clearAllPermissions = () => {
        form.setData('permissions', []);
    };

    const load = (group: Group) => {
        setEditing(group.id);
        form.setData({
            name: group.name,
            active: group.active,
            permissions: group.permissions.map(({ area, action }) => ({
                area,
                action,
            })),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        form.reset();
        setEditing(null);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const options = {
            onSuccess: () => {
                form.reset();
                setEditing(null);
            },
        };
        if (editing) form.patch(`/access-groups/${editing}`, options);
        else form.post('/access-groups', options);
    };

    const activeGroupsCount = groups.filter((g) => g.active).length;
    const linkedRolesCount = roles.filter((r) => r.access_group_id !== null).length;

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <Head title="Grupos de acesso" />

            {/* Cabeçalho da Página */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Shield className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Grupos de Acesso & Permissões
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Defina perfis de acesso e vincule privilégios aos cargos do motoclube.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 text-xs">
                        {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'} ({activeGroupsCount} ativos)
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                        {linkedRolesCount} / {roles.length} cargos vinculados
                    </Badge>
                </div>
            </div>

            {/* Formulário de Criação / Edição de Grupo */}
            <Card className="border-primary/20 bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                {editing ? (
                                    <>
                                        <Edit2 className="size-4 text-primary" />
                                        Editar Grupo de Acesso
                                    </>
                                ) : (
                                    <>
                                        <Plus className="size-4 text-primary" />
                                        Novo Grupo de Acesso
                                    </>
                                )}
                            </CardTitle>
                            <CardDescription>
                                {editing
                                    ? 'Atualize os dados e os módulos permitidos para este grupo.'
                                    : 'Crie um grupo de permissões para associar a um ou mais cargos.'}
                            </CardDescription>
                        </div>

                        {editing && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={cancelEdit}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5 mr-1" />
                                Cancelar edição
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pt-5">
                    <form onSubmit={submit} className="space-y-6">
                        {accessError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                                <AlertCircle className="size-4 shrink-0" />
                                {accessError}
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-3">
                            <label className="grid gap-1.5 text-xs font-medium sm:col-span-2">
                                Nome do grupo de acesso
                                <Input
                                    required
                                    maxLength={120}
                                    placeholder="Ex: Diretoria Executiva, Conselho Fiscal, Secretaria"
                                    value={form.data.name}
                                    onChange={(event) =>
                                        form.setData('name', event.target.value)
                                    }
                                />
                                {form.errors.name && (
                                    <span className="text-xs text-destructive">
                                        {form.errors.name}
                                    </span>
                                )}
                            </label>

                            <div className="flex flex-col justify-end">
                                <label className="flex items-center gap-2 h-9 p-2 rounded-md border bg-muted/20 text-xs font-medium cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.active}
                                        className="size-4 rounded border-input text-primary focus:ring-primary"
                                        onChange={(event) =>
                                            form.setData('active', event.target.checked)
                                        }
                                    />
                                    <span>Grupo de acesso ativo</span>
                                </label>
                            </div>
                        </div>

                        {/* Matriz de Permissões */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                                <div>
                                    <span className="font-semibold text-xs block">
                                        Permissões por Área do Sistema
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        Marque quais operações este perfil poderá executar.
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="text-xs text-primary hover:underline font-medium"
                                        onClick={grantAllStandard}
                                    >
                                        Selecionar todas
                                    </button>
                                    <span className="text-muted-foreground">·</span>
                                    <button
                                        type="button"
                                        className="text-xs text-muted-foreground hover:text-foreground font-medium"
                                        onClick={clearAllPermissions}
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {areas.map((area) => {
                                    const config = areaLabels[area] || {
                                        label: area,
                                        desc: 'Acesso às rotas do módulo',
                                        icon: Layers,
                                    };
                                    const Icon = config.icon;

                                    return (
                                        <div
                                            key={area}
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
                                                {actions.map((action) => {
                                                    const checked = form.data.permissions.some(
                                                        (p) =>
                                                            p.area === area &&
                                                            p.action === action,
                                                    );

                                                    return (
                                                        <label
                                                            key={action}
                                                            className={`flex items-center gap-2 p-2 rounded border text-xs cursor-pointer transition-colors ${
                                                                checked
                                                                    ? 'bg-primary/5 border-primary/30 text-foreground font-medium'
                                                                    : 'bg-muted/10 border-input text-muted-foreground'
                                                            }`}
                                                        >
                                                            <input
                                                                aria-label={`${area} ${action}`}
                                                                type="checkbox"
                                                                checked={checked}
                                                                className="size-3.5 rounded border-input text-primary focus:ring-primary"
                                                                onChange={() => toggle(area, action)}
                                                            />
                                                            {action === 'view' ? 'Consultar' : 'Alterar'}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Permissões Especiais de Membro */}
                        {specialPermissions.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <div className="border-b pb-2">
                                    <span className="font-semibold text-xs block">
                                        Permissões Específicas do Membro
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        Ações com escopo restrito aplicadas a perfis específicos.
                                    </span>
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {specialPermissions.map((permission) => {
                                        const checked = form.data.permissions.some(
                                            (item) =>
                                                item.area === permission.area &&
                                                item.action === permission.action,
                                        );

                                        return (
                                            <label
                                                key={`${permission.area}.${permission.action}`}
                                                className={`flex items-center gap-2 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                                                    checked
                                                        ? 'bg-primary/5 border-primary/30 text-foreground font-medium'
                                                        : 'bg-muted/10 border-input text-muted-foreground'
                                                }`}
                                            >
                                                <input
                                                    aria-label={permission.label}
                                                    type="checkbox"
                                                    checked={checked}
                                                    className="size-4 rounded border-input text-primary focus:ring-primary"
                                                    onChange={() =>
                                                        toggle(permission.area, permission.action)
                                                    }
                                                />
                                                <span>{permission.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t">
                            <Button type="submit" disabled={form.processing}>
                                {editing ? 'Salvar alterações' : 'Criar grupo de acesso'}
                            </Button>
                            {editing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelEdit}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Listagem de Grupos Cadastrados */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Layers className="size-4 text-muted-foreground" />
                        Grupos Cadastrados
                    </CardTitle>
                    <CardDescription>
                        Perfis de acesso disponíveis para associação com os cargos.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4 p-0 sm:p-4">
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-xs">
                            <thead className="bg-muted/50 text-muted-foreground border-b">
                                <tr>
                                    <th className="p-3 text-left font-medium">Nome do Grupo</th>
                                    <th className="p-3 text-center font-medium">Situação</th>
                                    <th className="p-3 text-center font-medium">Cargos Vinculados</th>
                                    <th className="p-3 text-left font-medium">Permissões Ativas</th>
                                    <th className="p-3 text-right font-medium">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {groups.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-muted-foreground">
                                            Nenhum grupo de acesso cadastrado. Crie um grupo no formulário acima.
                                        </td>
                                    </tr>
                                ) : (
                                    groups.map((group) => (
                                        <tr key={group.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-3 font-semibold text-sm">
                                                {group.name}
                                            </td>
                                            <td className="p-3 text-center">
                                                {group.active ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px]"
                                                    >
                                                        Ativo
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-muted text-muted-foreground text-[11px]"
                                                    >
                                                        Inativo
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-3 text-center font-medium">
                                                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs">
                                                    <Users className="size-3 text-muted-foreground" />
                                                    {group.roles_count}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap gap-1 max-w-lg">
                                                    {group.permissions.length === 0 ? (
                                                        <span className="text-muted-foreground">Nenhuma permissão</span>
                                                    ) : (
                                                        group.permissions.map((p) => (
                                                            <span
                                                                key={`${p.area}.${p.action}`}
                                                                className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                                                            >
                                                                {permissionLabel(p)}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-xs gap-1"
                                                        onClick={() => load(group)}
                                                    >
                                                        <Edit2 className="size-3" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="h-7 text-xs gap-1"
                                                        disabled={group.roles_count > 0}
                                                        title={
                                                            group.roles_count > 0
                                                                ? 'Remova a associação com cargos antes de excluir'
                                                                : 'Excluir grupo'
                                                        }
                                                        onClick={() =>
                                                            router.delete(`/access-groups/${group.id}`)
                                                        }
                                                    >
                                                        <Trash2 className="size-3" />
                                                        Excluir
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Mapeamento de Cargos & Permissões Efetivas */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        Permissões por Cargo do Motoclube
                    </CardTitle>
                    <CardDescription>
                        Vincule cada cargo a um grupo de acesso para conceder as permissões correspondentes aos membros.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4 p-0 sm:p-4">
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-xs">
                            <thead className="bg-muted/50 text-muted-foreground border-b">
                                <tr>
                                    <th className="p-3 text-left font-medium">Cargo</th>
                                    <th className="p-3 text-left font-medium w-64">Grupo de Acesso</th>
                                    <th className="p-3 text-left font-medium">Permissões Efetivas do Cargo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {roles.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-6 text-center text-muted-foreground">
                                            Nenhum cargo cadastrado no sistema.
                                        </td>
                                    </tr>
                                ) : (
                                    roles.map((role) => (
                                        <tr key={role.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-3 font-semibold text-sm">
                                                {role.name}
                                                {!role.active && (
                                                    <span className="text-xs text-muted-foreground font-normal ml-1.5">
                                                        (inativo)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    value={role.access_group_id ?? ''}
                                                    onChange={(event) =>
                                                        router.patch(
                                                            `/club-roles/${role.id}/access-group`,
                                                            {
                                                                access_group_id: event.target.value
                                                                    ? Number(event.target.value)
                                                                    : null,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <option value="">Sem grupo (sem acesso)</option>
                                                    {groups.map((group) => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.name}
                                                            {group.active ? '' : ' (inativo)'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap gap-1 max-w-xl">
                                                    {role.active && role.access_group?.active && role.access_group.permissions.length > 0 ? (
                                                        role.access_group.permissions.map((p) => (
                                                            <span
                                                                key={`${p.area}.${p.action}`}
                                                                className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-mono font-medium"
                                                            >
                                                                {permissionLabel(p)}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">
                                                            Nenhuma permissão concedida
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

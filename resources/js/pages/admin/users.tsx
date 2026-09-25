import { Head, usePage, useForm } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';
import { DataTable } from '@/components/tables/data-table';
import type { TableQuery } from '@/types/dynamic-ui';

type Grant = { area: string; action: string };
type User = {
    id: number;
    name: string;
    email: string;
    active: boolean;
    permission_grants: Grant[];
};
const areas = [
    'cadastros',
    'cobrancas',
    'caixa',
    'relatorios',
    'administracao',
    'institucional',
];

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
    return (
        <div className="space-y-6 p-6">
            <Head title="Usuários" />
            <h1 className="text-2xl font-semibold">Usuários administrativos</h1>
            <AdminForm
                form={form}
                submitLabel="Criar usuário"
                draftRestored={draft.draftRestored}
                connectionError={draft.connectionError}
                onDiscardDraft={draft.discardDraft}
                onSubmit={(e) => {
                    e.preventDefault();
                    draft.submit('post', '/admin/users');
                }}
                className="grid gap-3 rounded-lg border p-4 md:grid-cols-3"
            >
                <FormField
                    id="admin-user-name"
                    label="Nome"
                    required
                    error={form.errors.name}
                >
                    <Input
                        id="admin-user-name"
                        autoComplete="name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                    />
                </FormField>
                <FormField
                    id="admin-user-email"
                    label="Email"
                    required
                    error={form.errors.email}
                >
                    <Input
                        id="admin-user-email"
                        type="email"
                        autoComplete="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                    />
                </FormField>
                <FormField
                    id="admin-user-password"
                    label="Senha inicial"
                    required
                    error={form.errors.password}
                >
                    <Input
                        id="admin-user-password"
                        type="password"
                        autoComplete="new-password"
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData('password', e.target.value)
                        }
                    />
                </FormField>
            </AdminForm>
            <DataTable
                table="admin_users"
                rows={users.data}
                total={users.total}
                query={tableQuery}
                rowKey={(user) => user.id}
                columns={[
                    {
                        key: 'name',
                        label: 'Nome',
                        sortable: true,
                        render: (user) => (
                            <span className="font-medium">{user.name}</span>
                        ),
                    },
                    {
                        key: 'email',
                        label: 'Email',
                        sortable: true,
                        priority: 'secondary',
                        render: (user) => user.email,
                    },
                    {
                        key: 'active',
                        label: 'Situação',
                        sortable: true,
                        render: (user) => (user.active ? 'Ativo' : 'Inativo'),
                    },
                    {
                        key: 'permissions',
                        label: 'Permissões',
                        priority: 'secondary',
                        render: (user) => <UserPermissions user={user} />,
                    },
                ]}
                filters={({ setFilter }) => (
                    <label className="grid gap-1 text-sm">
                        Situação
                        <select
                            className="h-9 rounded-md border bg-background px-2"
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
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>
                        </select>
                    </label>
                )}
            />
        </div>
    );
}

function UserPermissions({ user }: { user: User }) {
    const form = useForm({
        active: user.active,
        permissions: user.permission_grants.map((p) => `${p.area}.${p.action}`),
    });
    const accessError = (form.errors as Record<string, string>).access;
    const toggle = (key: string) =>
        form.setData(
            'permissions',
            form.data.permissions.includes(key)
                ? form.data.permissions.filter((p) => p !== key)
                : [...form.data.permissions, key],
        );
    return (
        <details className="space-y-3 rounded-lg border p-4">
            <summary className="cursor-pointer font-medium">
                Gerenciar permissões
            </summary>
            <AdminForm
                form={form}
                submitLabel="Salvar permissões"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.patch(`/admin/users/${user.id}/permissions`, {
                        onSuccess: () => form.setDefaults(),
                    });
                }}
            >
                {accessError && (
                    <p role="alert" className="text-sm text-destructive">
                        {accessError}
                    </p>
                )}
                <label className="flex gap-2">
                    <input
                        type="checkbox"
                        checked={form.data.active}
                        onChange={(e) =>
                            form.setData('active', e.target.checked)
                        }
                    />
                    Ativo
                </label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {areas.map((area) => (
                        <div key={area}>
                            <strong className="capitalize">{area}</strong>
                            {['view', 'edit'].map((action) => (
                                <label className="flex gap-2" key={action}>
                                    <input
                                        type="checkbox"
                                        checked={form.data.permissions.includes(
                                            `${area}.${action}`,
                                        )}
                                        onChange={() =>
                                            toggle(`${area}.${action}`)
                                        }
                                    />
                                    {action === 'view'
                                        ? 'Consultar'
                                        : 'Alterar'}
                                </label>
                            ))}
                        </div>
                    ))}
                </div>
            </AdminForm>
        </details>
    );
}

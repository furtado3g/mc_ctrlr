import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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

    return (
        <div className="space-y-6 p-6">
            <Head title="Grupos de acesso" />
            <h1 className="text-2xl font-semibold">Grupos de acesso</h1>
            <form onSubmit={submit} className="space-y-4 rounded-lg border p-4">
                {accessError && (
                    <p role="alert" className="text-sm text-destructive">
                        {accessError}
                    </p>
                )}
                <div className="grid gap-3 md:grid-cols-3">
                    <label className="grid gap-1 text-sm">
                        Nome
                        <Input
                            required
                            maxLength={120}
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                        />
                        {form.errors.name && (
                            <span className="text-destructive">
                                {form.errors.name}
                            </span>
                        )}
                    </label>
                    <label className="flex items-center gap-2 self-end pb-2">
                        <input
                            type="checkbox"
                            checked={form.data.active}
                            onChange={(event) =>
                                form.setData('active', event.target.checked)
                            }
                        />
                        Grupo ativo
                    </label>
                </div>
                <fieldset className="space-y-2">
                    <legend className="font-medium">Permissões por área</legend>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2 text-left">Área</th>
                                    {actions.map((action) => (
                                        <th key={action} className="p-2">
                                            {action === 'view'
                                                ? 'Consultar'
                                                : 'Alterar'}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {areas.map((area) => (
                                    <tr key={area} className="border-t">
                                        <td className="p-2">{area}</td>
                                        {actions.map((action) => (
                                            <td
                                                key={action}
                                                className="p-2 text-center"
                                            >
                                                <input
                                                    aria-label={`${area} ${action}`}
                                                    type="checkbox"
                                                    checked={form.data.permissions.some(
                                                        (permission) =>
                                                            permission.area ===
                                                                area &&
                                                            permission.action ===
                                                                action,
                                                    )}
                                                    onChange={() =>
                                                        toggle(area, action)
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
                <fieldset className="space-y-2">
                    <legend className="font-medium">
                        Permissões específicas do membro
                    </legend>
                    {specialPermissions.map((permission) => (
                        <label
                            key={`${permission.area}.${permission.action}`}
                            className="flex items-center gap-2"
                        >
                            <input
                                aria-label={permission.label}
                                type="checkbox"
                                checked={form.data.permissions.some(
                                    (item) =>
                                        item.area === permission.area &&
                                        item.action === permission.action,
                                )}
                                onChange={() =>
                                    toggle(permission.area, permission.action)
                                }
                            />
                            {permission.label}
                        </label>
                    ))}
                </fieldset>
                <div className="flex gap-2">
                    <Button disabled={form.processing}>
                        {editing ? 'Salvar grupo' : 'Criar grupo'}
                    </Button>
                    {editing && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                form.reset();
                                setEditing(null);
                            }}
                        >
                            Cancelar
                        </Button>
                    )}
                </div>
            </form>
            <section className="space-y-2">
                <h2 className="text-xl font-semibold">Grupos cadastrados</h2>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3 text-left">Grupo</th>
                                <th className="p-3">Situação</th>
                                <th className="p-3">Cargos</th>
                                <th className="p-3">Permissões</th>
                                <th className="p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group) => (
                                <tr className="border-b" key={group.id}>
                                    <td className="p-3">{group.name}</td>
                                    <td className="p-3 text-center">
                                        {group.active ? 'Ativo' : 'Inativo'}
                                    </td>
                                    <td className="p-3 text-center">
                                        {group.roles_count}
                                    </td>
                                    <td className="p-3">
                                        {group.permissions
                                            .map(permissionLabel)
                                            .join(', ') || 'Nenhuma'}
                                    </td>
                                    <td className="p-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => load(group)}
                                        >
                                            Editar
                                        </Button>{' '}
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            disabled={group.roles_count > 0}
                                            onClick={() =>
                                                router.delete(
                                                    `/access-groups/${group.id}`,
                                                )
                                            }
                                        >
                                            Excluir
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <section className="space-y-2">
                <h2 className="text-xl font-semibold">Permissões por cargo</h2>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3 text-left">Cargo</th>
                                <th className="p-3 text-left">
                                    Grupo de acesso
                                </th>
                                <th className="p-3 text-left">
                                    Permissões efetivas
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr className="border-b" key={role.id}>
                                    <td className="p-3">
                                        {role.name}
                                        {!role.active && ' (inativo)'}
                                    </td>
                                    <td className="p-3">
                                        <select
                                            className="h-9 rounded-md border bg-background px-2"
                                            value={role.access_group_id ?? ''}
                                            onChange={(event) =>
                                                router.patch(
                                                    `/club-roles/${role.id}/access-group`,
                                                    {
                                                        access_group_id: event
                                                            .target.value
                                                            ? Number(
                                                                  event.target
                                                                      .value,
                                                              )
                                                            : null,
                                                    },
                                                )
                                            }
                                        >
                                            <option value="">Sem grupo</option>
                                            {groups.map((group) => (
                                                <option
                                                    key={group.id}
                                                    value={group.id}
                                                >
                                                    {group.name}
                                                    {group.active
                                                        ? ''
                                                        : ' (inativo)'}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        {role.active &&
                                        role.access_group?.active
                                            ? role.access_group.permissions
                                                  .map(permissionLabel)
                                                  .join(', ') || 'Nenhuma'
                                            : 'Nenhuma'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

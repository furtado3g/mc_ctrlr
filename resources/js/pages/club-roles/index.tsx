import { Head, usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';
import { DataTable } from '@/components/tables/data-table';
import type { TableColumn, TableQuery } from '@/types/dynamic-ui';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Role = { id: number; name: string; sort_order: number; active: boolean };
type Values = { name: string; sort_order: number; active: boolean };

export default function ClubRoles({ roles, formOrder, tableQuery }: { roles: { data: Role[]; total: number }; formOrder: number; tableQuery: TableQuery }) {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const draft = useSessionDraft<Values>({ scope: auth.draftScope, formKey: 'club-roles:create', recordKey: 'new', initialValues: { name: '', sort_order: formOrder, active: true } });
    const { form } = draft;
    const columns: TableColumn<Role>[] = [
        { key: 'sort_order', label: 'Ordem', sortable: true, render: role => role.sort_order },
        { key: 'name', label: 'Cargo', sortable: true, render: role => role.name },
        { key: 'active', label: 'Situação', sortable: true, priority: 'secondary', render: role => role.active ? 'Ativo' : 'Inativo' },
        { key: 'edit', label: 'Editar', priority: 'secondary', render: role => <RoleEdit role={role} scope={auth.draftScope} /> },
    ];
    return <div className="space-y-6 p-6"><Head title="Hierarquia" /><h1 className="text-2xl font-semibold">Hierarquia</h1>
        <AdminForm form={form} submitLabel="Adicionar cargo" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={e => { e.preventDefault(); draft.submit('post', '/club-roles'); }} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
            <FormField id="role-name" label="Cargo" required error={form.errors.name}><Input id="role-name" placeholder="Cargo" value={form.data.name} onChange={e => form.setData('name', e.target.value)} /></FormField>
            <FormField id="role-order" label="Ordem" required error={form.errors.sort_order}><Input id="role-order" type="number" min="1" value={form.data.sort_order} onChange={e => form.setData('sort_order', Number(e.target.value))} /></FormField>
        </AdminForm>
        <DataTable table="roles" rows={roles.data} total={roles.total} query={tableQuery} columns={columns} rowKey={role => role.id} filters={({ setFilter }) => <label className="grid gap-1 text-sm">Situação<select className="h-9 rounded-md border bg-background px-2" value={String(tableQuery.filters.active ?? '')} onChange={e => setFilter('active', e.target.value === '' ? null : e.target.value === 'true')}><option value="">Todas</option><option value="true">Ativo</option><option value="false">Inativo</option></select></label>} />
    </div>;
}

function RoleEdit({ role, scope }: { role: Role; scope?: string | null }) {
    const [open, setOpen] = useState(false);
    const draft = useSessionDraft<Values>({ scope, formKey: 'club-roles:edit', recordKey: role.id, initialValues: { name: role.name, sort_order: role.sort_order, active: role.active } });
    const { form } = draft;
    return <div className="space-y-2"><Button type="button" variant="outline" size="sm" onClick={() => setOpen(!open)}>{open ? 'Fechar edição' : 'Editar cargo'}</Button>{open && <AdminForm form={form} submitLabel="Salvar cargo" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={event => { event.preventDefault(); draft.submit('patch', `/club-roles/${role.id}`); }}>
        <FormField id={`role-edit-name-${role.id}`} label="Nome" required error={form.errors.name}><Input id={`role-edit-name-${role.id}`} value={form.data.name} onChange={event => form.setData('name', event.target.value)} /></FormField>
        <FormField id={`role-edit-order-${role.id}`} label="Ordem" required error={form.errors.sort_order}><Input id={`role-edit-order-${role.id}`} type="number" min="1" value={form.data.sort_order} onChange={event => form.setData('sort_order', Number(event.target.value))} /></FormField>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.data.active} onChange={event => form.setData('active', event.target.checked)} />Ativo</label>
    </AdminForm>}</div>;
}

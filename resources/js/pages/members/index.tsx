import { Head, Link, usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { DataTable } from '@/components/tables/data-table';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';
import type { TableColumn, TableQuery } from '@/types/dynamic-ui';

type Member = { id: number; name: string; email: string | null; phone: string | null; status: string; joined_at: string };
type MemberValues = { name: string; email: string; phone: string; joined_at: string; status: string };
type Props = { members: { data: Member[]; total: number }; tableQuery: TableQuery };

export default function Members({ members, tableQuery }: Props) {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const draft = useSessionDraft<MemberValues>({
        scope: auth.draftScope,
        formKey: 'members:create',
        recordKey: 'new',
        initialValues: { name: '', email: '', phone: '', joined_at: new Date().toISOString().slice(0, 10), status: 'active' },
    });
    const { form } = draft;
    const columns: TableColumn<Member>[] = [
        { key: 'name', label: 'Nome', sortable: true, render: member => <Link href={`/members/${member.id}`} className="font-medium underline">{member.name}</Link> },
        { key: 'email', label: 'Email', priority: 'secondary', sortable: false, render: member => member.email || '—' },
        { key: 'phone', label: 'Telefone', priority: 'secondary', sortable: false, render: member => member.phone || '—' },
        { key: 'joined_at', label: 'Ingresso', priority: 'secondary', sortable: true, render: member => member.joined_at?.slice(0, 10) || '—' },
        { key: 'status', label: 'Situação', sortable: true, render: member => member.status === 'active' ? 'Ativo' : 'Desligado' },
        { key: 'actions', label: 'Ação', render: member => <Link href={`/members/${member.id}`} className="underline">Abrir</Link> },
    ];

    return <div className="space-y-6 p-6">
        <Head title="Membros" />
        <h1 className="text-2xl font-semibold">Membros</h1>
        <AdminForm form={form} submitLabel="Cadastrar" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={event => { event.preventDefault(); draft.submit('post', '/members'); }} className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
            <FormField id="member-name" label="Nome" required error={form.errors.name}><Input id="member-name" autoComplete="name" value={form.data.name} onChange={event => form.setData('name', event.target.value)} aria-invalid={Boolean(form.errors.name)} /></FormField>
            <FormField id="member-email" label="Email" error={form.errors.email}><Input id="member-email" type="email" autoComplete="email" value={form.data.email} onChange={event => form.setData('email', event.target.value)} aria-invalid={Boolean(form.errors.email)} /></FormField>
            <FormField id="member-phone" label="Telefone" error={form.errors.phone}><Input id="member-phone" autoComplete="tel" value={form.data.phone} onChange={event => form.setData('phone', event.target.value)} aria-invalid={Boolean(form.errors.phone)} /></FormField>
            <FormField id="member-joined-at" label="Data de ingresso" required error={form.errors.joined_at}><Input id="member-joined-at" type="date" value={form.data.joined_at} onChange={event => form.setData('joined_at', event.target.value)} aria-invalid={Boolean(form.errors.joined_at)} /></FormField>
            <input type="hidden" name="status" value={form.data.status} />
        </AdminForm>
        <DataTable table="members" rows={members.data} total={members.total} query={tableQuery} columns={columns} rowKey={member => member.id}
            filters={({ setFilter }) => <label className="grid gap-1 text-sm">Situação<select className="h-9 rounded-md border bg-background px-2" value={String(tableQuery.filters.status ?? '')} onChange={event => setFilter('status', event.target.value || null)}><option value="">Todas</option><option value="active">Ativo</option><option value="left">Desligado</option></select></label>} />
    </div>;
}

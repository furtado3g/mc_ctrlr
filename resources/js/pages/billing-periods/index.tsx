import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';
import { DataTable } from '@/components/tables/data-table';
import type { TableColumn, TableQuery } from '@/types/dynamic-ui';
import { useState } from 'react';

type Period = { id: number; competence: string; due_at: string; default_amount_cents: number; status: string };
type PeriodValues = { competence: string; due_at: string; default_amount_cents: number; status: string };
const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

function PeriodActions({ period, scope }: { period: Period; scope?: string | null }) {
    const form = useForm({ competence: period.competence, due_at: period.due_at.slice(0, 10), default_amount_cents: period.default_amount_cents, status: period.status });
    const [editing, setEditing] = useState(false);
    const draft = useSessionDraft<PeriodValues>({ scope, formKey: 'billing-periods:edit', recordKey: period.id, initialValues: { competence: period.competence, due_at: period.due_at.slice(0, 10), default_amount_cents: period.default_amount_cents, status: period.status } });
    const editForm = draft.form;
    return <div className="flex flex-wrap gap-2">
        {period.status === 'open' && <>
            <Button size="sm" type="button" disabled={form.processing} onClick={() => router.post('/billing-periods/' + period.id + '/generate')}>Gerar mensalidades</Button>
            <Button size="sm" variant="outline" type="button" disabled={form.processing} onClick={() => form.patch('/billing-periods/' + period.id, { onSuccess: () => form.setData('status', 'closed') })}>Encerrar</Button>
        </>}
        <Button size="sm" type="button" variant="outline" onClick={() => setEditing(!editing)}>{editing ? 'Cancelar' : 'Editar'}</Button>
        <Button size="sm" variant="link" type="button" onClick={() => router.post('/table-query', { table: 'fees', query: { search: '', filters: { period: period.id }, sort: 'id', direction: 'desc', page: 1, per_page: 30 } }, { onSuccess: () => router.visit('/fees') })}>Ver mensalidades</Button>
        {editing && <AdminForm form={editForm} submitLabel="Salvar alterações" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={event => { event.preventDefault(); draft.submit('patch', `/billing-periods/${period.id}`, { onSuccess: () => setEditing(false) }); }} className="grid w-full gap-3 md:grid-cols-3">
            <FormField id={`edit-competence-${period.id}`} label="Competência" required error={editForm.errors.competence}><Input id={`edit-competence-${period.id}`} type="month" value={editForm.data.competence} onChange={event => editForm.setData('competence', event.target.value)} /></FormField>
            <FormField id={`edit-due-${period.id}`} label="Vencimento" required error={editForm.errors.due_at}><Input id={`edit-due-${period.id}`} type="date" value={editForm.data.due_at} onChange={event => editForm.setData('due_at', event.target.value)} /></FormField>
            <FormField id={`edit-amount-${period.id}`} label="Valor (centavos)" required error={editForm.errors.default_amount_cents}><Input id={`edit-amount-${period.id}`} type="number" min="1" value={editForm.data.default_amount_cents} onChange={event => editForm.setData('default_amount_cents', Number(event.target.value))} /></FormField>
        </AdminForm>}
    </div>;
}

export default function BillingPeriods({ periods, tableQuery }: { periods: { data: Period[]; total: number }; tableQuery: TableQuery }) {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const draft = useSessionDraft<PeriodValues>({
        scope: auth.draftScope,
        formKey: 'billing-periods:create',
        recordKey: 'new',
        initialValues: { competence: new Date().toISOString().slice(0, 7), due_at: '', default_amount_cents: 0, status: 'open' },
    });
    const { form } = draft;
    const columns: TableColumn<Period>[] = [
        { key: 'competence', label: 'Competência', sortable: true, render: period => <strong>{period.competence}</strong> },
        { key: 'due_at', label: 'Vencimento', sortable: true, priority: 'secondary', render: period => period.due_at.slice(0, 10) },
        { key: 'default_amount_cents', label: 'Valor', priority: 'secondary', render: period => money(period.default_amount_cents) },
        { key: 'status', label: 'Situação', sortable: true, render: period => period.status === 'open' ? 'Aberto' : 'Encerrado' },
            { key: 'actions', label: 'Ações', render: period => <PeriodActions period={period} scope={auth.draftScope} /> },
    ];
    return <div className="space-y-6 p-6"><Head title="Períodos de cobrança" /><h1 className="text-2xl font-semibold">Períodos de cobrança</h1>
        <AdminForm form={form} submitLabel="Criar período" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={event => { event.preventDefault(); draft.submit('post', '/billing-periods'); }} className="grid gap-2 rounded-lg border p-4 md:grid-cols-3">
            <FormField id="period-competence" label="Competência" required error={form.errors.competence}><Input id="period-competence" type="month" value={form.data.competence} onChange={event => form.setData('competence', event.target.value)} aria-invalid={Boolean(form.errors.competence)} /></FormField>
            <FormField id="period-due-at" label="Vencimento" required error={form.errors.due_at}><Input id="period-due-at" type="date" value={form.data.due_at} onChange={event => form.setData('due_at', event.target.value)} aria-invalid={Boolean(form.errors.due_at)} /></FormField>
            <FormField id="period-amount" label="Valor (centavos)" required error={form.errors.default_amount_cents}><Input id="period-amount" type="number" min="1" value={form.data.default_amount_cents} onChange={event => form.setData('default_amount_cents', Number(event.target.value))} aria-invalid={Boolean(form.errors.default_amount_cents)} /></FormField>
        </AdminForm>
        <DataTable table="periods" rows={periods.data} total={periods.total} query={tableQuery} columns={columns} rowKey={period => period.id} filters={({ setFilter }) => <label className="grid gap-1 text-sm">Situação<select className="h-9 rounded-md border bg-background px-2" value={String(tableQuery.filters.status ?? '')} onChange={e => setFilter('status', e.target.value || null)}><option value="">Todas</option><option value="open">Aberto</option><option value="closed">Encerrado</option></select></label>} />
    </div>;
}

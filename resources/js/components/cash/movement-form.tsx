import { usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';

type MovementValues = { type: 'in' | 'out'; amount_cents: number; occurred_at: string; category: string; description: string };
type CorrectionValues = MovementValues & { reason: string };
type Movement = { id: number; type: string; amount_cents: number; occurred_at: string; category: string; description: string };

export default function MovementForm() {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const draft = useSessionDraft<MovementValues>({
        scope: auth.draftScope,
        formKey: 'cash:movement:create',
        recordKey: 'new',
        initialValues: { type: 'out', amount_cents: 0, occurred_at: new Date().toISOString().slice(0, 10), category: '', description: '' },
    });
    const { form } = draft;
    return <AdminForm form={form} submitLabel="Registrar movimento" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={event => { event.preventDefault(); draft.submit('post', '/cash/movements'); }} className="grid gap-2 rounded-lg border p-4 md:grid-cols-3">
        <FormField id="movement-type" label="Tipo" required error={form.errors.type}><select id="movement-type" className="rounded-md border bg-background p-2" value={form.data.type} onChange={event => form.setData('type', event.target.value as 'in' | 'out')}><option value="in">Entrada</option><option value="out">Saída</option></select></FormField>
        <FormField id="movement-amount" label="Valor (centavos)" required error={form.errors.amount_cents}><Input id="movement-amount" type="number" min="1" value={form.data.amount_cents} onChange={event => form.setData('amount_cents', Number(event.target.value))} /></FormField>
        <FormField id="movement-date" label="Data" required error={form.errors.occurred_at}><Input id="movement-date" type="date" value={form.data.occurred_at} onChange={event => form.setData('occurred_at', event.target.value)} /></FormField>
        <FormField id="movement-category" label="Categoria" required error={form.errors.category}><Input id="movement-category" value={form.data.category} onChange={event => form.setData('category', event.target.value)} /></FormField>
        <FormField id="movement-description" label="Descrição" required error={form.errors.description}><Input id="movement-description" value={form.data.description} onChange={event => form.setData('description', event.target.value)} /></FormField>
    </AdminForm>;
}

export function CorrectionForm({ movement, onClose }: { movement: Movement; onClose: () => void }) {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const draft = useSessionDraft<CorrectionValues>({
        scope: auth.draftScope,
        formKey: 'cash:movement:correction',
        recordKey: movement.id,
        initialValues: { type: movement.type === 'in' ? 'in' : 'out', amount_cents: movement.amount_cents, occurred_at: movement.occurred_at.slice(0, 10), category: movement.category, description: movement.description, reason: '' },
    });
    const { form } = draft;
    return <AdminForm form={form} submitLabel="Salvar correção" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={event => { event.preventDefault(); draft.submit('post', '/cash/movements/' + movement.id + '/corrections', { onSuccess: onClose }); }} className="grid w-full gap-2 rounded-lg border p-4 md:grid-cols-3">
        <FormField id="correction-type" label="Tipo" required error={form.errors.type}><select id="correction-type" className="rounded-md border bg-background p-2" value={form.data.type} onChange={event => form.setData('type', event.target.value as 'in' | 'out')}><option value="in">Entrada</option><option value="out">Saída</option></select></FormField>
        <FormField id="correction-amount" label="Valor (centavos)" required error={form.errors.amount_cents}><Input id="correction-amount" type="number" min="1" value={form.data.amount_cents} onChange={event => form.setData('amount_cents', Number(event.target.value))} /></FormField>
        <FormField id="correction-date" label="Data" required error={form.errors.occurred_at}><Input id="correction-date" type="date" value={form.data.occurred_at} onChange={event => form.setData('occurred_at', event.target.value)} /></FormField>
        <FormField id="correction-category" label="Categoria" required error={form.errors.category}><Input id="correction-category" value={form.data.category} onChange={event => form.setData('category', event.target.value)} /></FormField>
        <FormField id="correction-description" label="Descrição" required error={form.errors.description}><Input id="correction-description" value={form.data.description} onChange={event => form.setData('description', event.target.value)} /></FormField>
        <FormField id="correction-reason" label="Motivo" required error={form.errors.reason}><Input id="correction-reason" value={form.data.reason} onChange={event => form.setData('reason', event.target.value)} /></FormField>
        <Button type="button" variant="outline" onClick={() => { draft.discardDraft(); onClose(); }}>Cancelar</Button>
    </AdminForm>;
}

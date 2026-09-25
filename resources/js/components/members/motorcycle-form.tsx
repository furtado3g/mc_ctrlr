import { usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';

type MotorcycleValues = { identifier: string; manufacturer: string; model: string; year: string; started_at: string; ended_at: string };

export default function MotorcycleForm({ memberId }: { memberId: number }) {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const draft = useSessionDraft<MotorcycleValues>({
        scope: auth.draftScope,
        formKey: 'members:motorcycle:create',
        recordKey: memberId,
        initialValues: { identifier: '', manufacturer: '', model: '', year: '', started_at: new Date().toISOString().slice(0, 10), ended_at: '' },
    });
    const { form } = draft;

    return <AdminForm form={form} submitLabel="Vincular moto" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={event => { event.preventDefault(); draft.submit('post', '/members/' + memberId + '/motorcycles'); }} className="grid gap-2 rounded-lg border p-4 md:grid-cols-3">
        <FormField id="motorcycle-identifier" label="Placa ou identificação" error={form.errors.identifier}><Input id="motorcycle-identifier" placeholder="Placa ou identificação" value={form.data.identifier} onChange={event => form.setData('identifier', event.target.value)} aria-invalid={Boolean(form.errors.identifier)} /></FormField>
        <FormField id="motorcycle-manufacturer" label="Fabricante" required error={form.errors.manufacturer}><Input id="motorcycle-manufacturer" value={form.data.manufacturer} onChange={event => form.setData('manufacturer', event.target.value)} aria-invalid={Boolean(form.errors.manufacturer)} /></FormField>
        <FormField id="motorcycle-model" label="Modelo" required error={form.errors.model}><Input id="motorcycle-model" value={form.data.model} onChange={event => form.setData('model', event.target.value)} aria-invalid={Boolean(form.errors.model)} /></FormField>
        <FormField id="motorcycle-year" label="Ano" error={form.errors.year}><Input id="motorcycle-year" type="number" min="1885" value={form.data.year} onChange={event => form.setData('year', event.target.value)} aria-invalid={Boolean(form.errors.year)} /></FormField>
        <FormField id="motorcycle-started-at" label="Início do vínculo" required error={form.errors.started_at}><Input id="motorcycle-started-at" type="date" value={form.data.started_at} onChange={event => form.setData('started_at', event.target.value)} aria-invalid={Boolean(form.errors.started_at)} /></FormField>
    </AdminForm>;
}

import { usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { useSessionDraft } from '@/hooks/use-session-draft';

type ReceiptValues = { receipt: File | null };

export function ReceiptUpload({ movementId }: { movementId: number }) {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const draft = useSessionDraft<ReceiptValues>({
        scope: auth.draftScope,
        formKey: 'cash:receipt',
        recordKey: movementId,
        initialValues: { receipt: null },
    });
    const { form } = draft;

    return <AdminForm form={form} submitLabel="Enviar comprovante" processingLabel="Enviando…" connectionError={draft.connectionError} onSubmit={event => { event.preventDefault(); draft.submit('post', '/cash/movements/' + movementId + '/receipt', { forceFormData: true }); }} className="flex flex-wrap items-end gap-2">
        <FormField id={'receipt-' + movementId} label="Comprovante" required error={form.errors.receipt}>
            <input id={'receipt-' + movementId} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => form.setData('receipt', event.target.files?.[0] ?? null)} aria-invalid={Boolean(form.errors.receipt)} />
        </FormField>
    </AdminForm>;
}

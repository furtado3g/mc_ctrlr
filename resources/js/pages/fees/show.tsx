import { Head, router, usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';

type Payment = { id: number; amount_cents: number; paid_at: string; method: string; status: string };
type Fee = { id: number; member: { name: string }; billing_period: { competence: string; due_at: string }; issued_amount_cents: number; adjustment_cents: number; balance_cents: number; status: string; payments: Payment[] };
type PaymentValues = { amount_cents: number; paid_at: string; method: string; reference: string };
type AdjustmentValues = { amount_cents: number; reason: string };
const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

export default function FeeShow({ fee }: { fee: Fee }) {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const paymentDraft = useSessionDraft<PaymentValues>({
        scope: auth.draftScope,
        formKey: 'fees:payment',
        recordKey: fee.id,
        initialValues: { amount_cents: fee.balance_cents, paid_at: new Date().toISOString().slice(0, 10), method: 'Pix', reference: '' },
    });
    const adjustmentDraft = useSessionDraft<AdjustmentValues>({
        scope: auth.draftScope,
        formKey: 'fees:adjustment',
        recordKey: fee.id,
        initialValues: { amount_cents: 0, reason: '' },
    });
    const payment = paymentDraft.form;
    const adjust = adjustmentDraft.form;
    return <div className="space-y-6 p-6"><Head title={'Mensalidade ' + fee.id} /><h1 className="text-2xl font-semibold">{fee.member.name} · {fee.billing_period.competence}</h1>
        <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-3"><div>Valor devido: <strong>{money(fee.issued_amount_cents + fee.adjustment_cents)}</strong></div><div>Saldo: <strong>{money(fee.balance_cents)}</strong></div><div>Situação: <strong>{fee.status}</strong></div></div>
        {fee.balance_cents > 0 && <AdminForm form={payment} submitLabel="Registrar pagamento" draftRestored={paymentDraft.draftRestored} connectionError={paymentDraft.connectionError} onDiscardDraft={paymentDraft.discardDraft} onSubmit={event => { event.preventDefault(); paymentDraft.submit('post', '/fees/' + fee.id + '/payments'); }} className="grid gap-2 rounded-lg border p-4 md:grid-cols-3">
            <FormField id="payment-amount" label="Valor (centavos)" required error={payment.errors.amount_cents}><Input id="payment-amount" type="number" min="1" max={fee.balance_cents} value={payment.data.amount_cents} onChange={event => payment.setData('amount_cents', Number(event.target.value))} aria-invalid={Boolean(payment.errors.amount_cents)} /></FormField>
            <FormField id="payment-paid-at" label="Data do pagamento" required error={payment.errors.paid_at}><Input id="payment-paid-at" type="date" value={payment.data.paid_at} onChange={event => payment.setData('paid_at', event.target.value)} aria-invalid={Boolean(payment.errors.paid_at)} /></FormField>
            <FormField id="payment-method" label="Forma de pagamento" required error={payment.errors.method}><Input id="payment-method" value={payment.data.method} onChange={event => payment.setData('method', event.target.value)} aria-invalid={Boolean(payment.errors.method)} /></FormField>
            <FormField id="payment-reference" label="Referência" error={payment.errors.reference}><Input id="payment-reference" value={payment.data.reference} onChange={event => payment.setData('reference', event.target.value)} aria-invalid={Boolean(payment.errors.reference)} /></FormField>
        </AdminForm>}
        <AdminForm form={adjust} submitLabel="Ajustar cobrança" processingLabel="Salvando ajuste…" draftRestored={adjustmentDraft.draftRestored} connectionError={adjustmentDraft.connectionError} onDiscardDraft={adjustmentDraft.discardDraft} onSubmit={event => { event.preventDefault(); adjustmentDraft.submit('post', '/fees/' + fee.id + '/adjustments'); }} className="grid gap-2 rounded-lg border p-4 md:grid-cols-2">
            <FormField id="fee-adjustment" label="Ajuste (centavos)" required error={adjust.errors.amount_cents}><Input id="fee-adjustment" type="number" value={adjust.data.amount_cents} onChange={event => adjust.setData('amount_cents', Number(event.target.value))} aria-invalid={Boolean(adjust.errors.amount_cents)} /></FormField>
            <FormField id="fee-adjustment-reason" label="Motivo do ajuste" required error={adjust.errors.reason}><Input id="fee-adjustment-reason" value={adjust.data.reason} onChange={event => adjust.setData('reason', event.target.value)} aria-invalid={Boolean(adjust.errors.reason)} /></FormField>
        </AdminForm>
        <h2 className="text-xl font-semibold">Pagamentos</h2><ul className="space-y-2">{fee.payments.map(item => <li key={item.id} className="flex justify-between rounded-lg border p-3">{item.paid_at.slice(0, 10)} · {money(item.amount_cents)} · {item.method} · {item.status}{item.status === 'confirmed' && <Button size="sm" variant="outline" disabled={false} onClick={() => { const reason = prompt('Motivo do estorno'); if (reason) router.post('/payments/' + item.id + '/reverse', { reason }); }}>Estornar</Button>}</li>)}</ul>
    </div>;
}

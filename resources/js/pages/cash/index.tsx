import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import MovementForm, { CorrectionForm } from '@/components/cash/movement-form';
import { ReceiptUpload } from '@/components/cash/receipt-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/tables/data-table';
import type { TableColumn, TableQuery } from '@/types/dynamic-ui';

type Movement = { id: number; type: string; amount_cents: number; occurred_at: string; category: string; description: string; source: string; status: string; receipt: { original_name: string } | null; corrections: { id: number; action: string; reason: string; created_at: string }[] };
type Totals = { opening_cents: number; income_cents: number; expense_cents: number; closing_cents: number };
const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

export default function Cash({ start, end, totals, movements, tableQuery }: { start: string; end: string; totals: Totals; movements: { data: Movement[]; total: number }; tableQuery: TableQuery }) {
    const [editing, setEditing] = useState<number | null>(null);
    const columns: TableColumn<Movement>[] = [
        { key: 'occurred_at', label: 'Data', sortable: true, render: item => item.occurred_at.slice(0, 10) },
        { key: 'type', label: 'Tipo', sortable: true, render: item => item.type === 'in' ? 'Entrada' : 'Saída' },
        { key: 'category', label: 'Categoria', sortable: true, priority: 'secondary', render: item => item.category },
        { key: 'description', label: 'Descrição', priority: 'secondary', render: item => item.description },
        { key: 'amount_cents', label: 'Valor', sortable: true, render: item => `${item.type === 'in' ? '+' : '−'}${money(item.amount_cents)}` },
        { key: 'receipt', label: 'Comprovante', priority: 'secondary', render: item => item.receipt ? <a className="underline" href={`/cash/movements/${item.id}/receipt`}>Abrir comprovante</a> : <ReceiptUpload movementId={item.id} /> },
        { key: 'status', label: 'Ações', priority: 'secondary', render: item => <div className="flex flex-wrap gap-2">{item.source === 'manual' && item.status === 'active' && <><Button size="sm" variant="outline" onClick={() => { const reason = prompt('Motivo do estorno'); if (reason) router.post(`/cash/movements/${item.id}/reverse`, { reason }); }}>Estornar</Button><Button size="sm" variant="outline" onClick={() => setEditing(editing === item.id ? null : item.id)}>Corrigir</Button></>}{editing === item.id && <CorrectionForm movement={item} onClose={() => setEditing(null)} />}</div> },
    ];
    return <div className="space-y-6 p-6"><Head title="Caixa" /><h1 className="text-2xl font-semibold">Caixa do motoclube</h1>
        <div className="grid gap-3 md:grid-cols-4">{Object.entries({ 'Saldo inicial': totals.opening_cents, Entradas: totals.income_cents, Saídas: totals.expense_cents, 'Saldo final': totals.closing_cents }).map(([label, value]) => <div className="rounded-lg border p-4" key={label}><div className="text-muted-foreground">{label}</div><strong className="text-xl">{money(value)}</strong></div>)}</div>
        <MovementForm />
        <DataTable table="cash" rows={movements.data} total={movements.total} query={tableQuery} columns={columns} rowKey={item => item.id} filters={({ setFilter }) => <>
            <label className="grid gap-1 text-sm">Início<Input type="date" value={String(tableQuery.filters.start ?? start)} onChange={e => setFilter('start', e.target.value || null)} /></label>
            <label className="grid gap-1 text-sm">Fim<Input type="date" value={String(tableQuery.filters.end ?? end)} onChange={e => setFilter('end', e.target.value || null)} /></label>
            <label className="grid gap-1 text-sm">Tipo<select className="h-9 rounded-md border bg-background px-2" value={String(tableQuery.filters.type ?? '')} onChange={e => setFilter('type', e.target.value || null)}><option value="">Todos</option><option value="in">Entrada</option><option value="out">Saída</option></select></label>
        </>} />
    </div>;
}

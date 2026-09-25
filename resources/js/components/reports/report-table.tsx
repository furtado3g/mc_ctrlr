import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TableQuery } from '@/types/dynamic-ui';
import { DataTable } from '@/components/tables/data-table';
import type { TableColumn } from '@/types/dynamic-ui';

export default function ReportTable({ title, path, tableKey, start, end, rows, total, totals, tableQuery, extraQuery = {} }: { title: string; path: string; tableKey: string; start: string; end: string; rows: Record<string, string | number | null>[]; total: number; totals: Record<string, number>; tableQuery: TableQuery; extraQuery?: Record<string, string> }) {
    const [dates, setDates] = useState({ start, end });
    const [type, setType] = useState(String(tableQuery.filters.type ?? ''));
    const keys = rows.length ? Object.keys(rows[0]) : [];
    const overdue = String(tableQuery.filters.overdue ?? extraQuery.overdue ?? '') === '1' || tableQuery.filters.overdue === true;
    const applyFilters = () => router.post('/table-query', { table: tableKey, query: { ...tableQuery, filters: { ...tableQuery.filters, start: dates.start, end: dates.end, ...(tableKey !== 'reports.fees' ? { type: type || null } : {}), ...(extraQuery.overdue !== undefined ? { overdue } : {}) }, page: 1 } }, { onSuccess: () => router.visit(path) });
    const sortable = tableKey === 'reports.fees' ? ['member', 'competence', 'due_at', 'status', 'balance_cents'] : ['date', 'type', 'category', 'amount_cents'];
    const columns: TableColumn<Record<string, string | number | null>>[] = keys.map((key, index) => ({ key, label: key, sortable: sortable.includes(key), priority: index > 2 ? 'secondary' : 'primary', render: row => row[key] ?? '—' }));
    return <div className="space-y-5 p-6"><h1 className="text-2xl font-semibold">{title}</h1>
        <nav className="flex gap-4 text-sm underline"><a href="/reports/fees">Mensalidades</a><a href="/reports/cash">Caixa</a><a href="/reports/fiscal">Suporte fiscal</a></nav>
        <div className="flex flex-wrap items-end gap-2"><label className="grid gap-1 text-sm">Início<Input type="date" value={dates.start} onChange={e => setDates({ ...dates, start: e.target.value })} /></label><label className="grid gap-1 text-sm">Fim<Input type="date" value={dates.end} onChange={e => setDates({ ...dates, end: e.target.value })} /></label>{tableKey !== 'reports.fees' && <label className="grid gap-1 text-sm">Tipo<select className="h-9 rounded-md border bg-background px-2" value={type} onChange={e => setType(e.target.value)}><option value="">Todos</option><option value="in">Entrada</option><option value="out">Saída</option></select></label>}{extraQuery.overdue !== undefined && <label className="flex items-center gap-2 pb-2"><input type="checkbox" checked={overdue} onChange={e => { const value = e.target.checked; router.post('/table-query', { table: tableKey, query: { ...tableQuery, filters: { ...tableQuery.filters, start: dates.start, end: dates.end, overdue: value }, page: 1 } }, { onSuccess: () => router.visit(path) }); }} />Somente inadimplentes</label>}<Button type="button" onClick={applyFilters}>Filtrar</Button><a className="rounded-md border px-4 py-2" href={`${path}/export`}>Exportar CSV</a><Button type="button" variant="outline" onClick={() => window.print()}>Imprimir</Button></div>
        <div className="text-sm text-muted-foreground">Período: {start} a {end} · Gerado em {new Date().toLocaleString('pt-BR')}</div>
        <div className="grid gap-2 md:grid-cols-4">{Object.entries(totals).map(([key, value]) => <div className="rounded-lg border p-3" key={key}>{key}: <strong>{(value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>)}</div>
        <DataTable table={tableKey} rows={rows} total={total} query={tableQuery} columns={columns} rowKey={row => String(row.fee_id ?? row.movement_id ?? JSON.stringify(row))} />
    </div>;
}

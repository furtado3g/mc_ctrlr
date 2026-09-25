import { Head } from '@inertiajs/react';
import ReportTable from '@/components/reports/report-table';

export default function CashReport({ rows, total, start, end, totals, tableQuery }: { rows: Record<string, string | number | null>[]; total: number; start: string; end: string; totals: Record<string, number>; tableQuery: import('@/types/dynamic-ui').TableQuery }) {
    return <><Head title="Relatório do caixa" /><ReportTable title="Relatório do caixa" path="/reports/cash" tableKey="reports.cash" start={start} end={end} rows={rows} total={total} totals={totals} tableQuery={tableQuery} /></>;
}

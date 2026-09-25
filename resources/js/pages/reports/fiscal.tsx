import { Head } from '@inertiajs/react';
import ReportTable from '@/components/reports/report-table';

export default function FiscalReport({ rows, total, start, end, totals, tableQuery }: { rows: Record<string, string | number | null>[]; total: number; start: string; end: string; totals: Record<string, number>; tableQuery: import('@/types/dynamic-ui').TableQuery }) {
    return <><Head title="Suporte fiscal" /><ReportTable title="Suporte à prestação de contas fiscal" path="/reports/fiscal" tableKey="reports.fiscal" start={start} end={end} rows={rows} total={total} totals={totals} tableQuery={tableQuery} /></>;
}

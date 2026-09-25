import { Head } from '@inertiajs/react';
import ReportTable from '@/components/reports/report-table';

export default function FeesReport({ rows, total, start, end, totals, overdue, tableQuery }: { rows: Record<string, string | number | null>[]; total: number; start: string; end: string; totals: Record<string, number>; overdue: boolean; tableQuery: import('@/types/dynamic-ui').TableQuery }) {
    return <><Head title="Relatório de mensalidades" /><ReportTable title="Relatório de mensalidades" path="/reports/fees" tableKey="reports.fees" start={start} end={end} rows={rows} total={total} totals={totals} tableQuery={tableQuery} extraQuery={{ overdue: overdue ? '1' : '0' }} /></>;
}

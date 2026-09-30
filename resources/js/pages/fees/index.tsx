import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Globe } from 'lucide-react';
import { DataTable } from '@/components/tables/data-table';
import { Badge } from '@/components/ui/badge';
import type { TableColumn, TableQuery } from '@/types/dynamic-ui';

type Fee = { id: number; member: { name: string }; billing_period: { competence: string }; balance_cents: number; status: string };
type Period = { id: number; competence: string };
const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

export default function Fees({ fees, periods, tableQuery }: { fees: { data: Fee[]; total: number }; periods: Period[]; tableQuery: TableQuery }) {
    const { currentRegional } = usePage().props as {
        currentRegional?: { id: number; name: string; code: string } | null;
    };
    const columns: TableColumn<Fee>[] = [
        { key: 'member_name', label: 'Membro', sortable: true, render: fee => <Link className="underline" href={`/fees/${fee.id}`}>{fee.member.name}</Link> },
        { key: 'competence', label: 'Competência', sortable: true, render: fee => fee.billing_period.competence },
        { key: 'balance_cents', label: 'Saldo', sortable: true, render: fee => money(fee.balance_cents) },
        { key: 'status', label: 'Situação', sortable: false, priority: 'secondary', render: fee => fee.status },
        { key: 'id', label: 'Ação', render: fee => <Link className="underline" href={`/fees/${fee.id}`}>Abrir</Link> },
    ];
    return <div className="space-y-6 p-6">
        <Head title="Mensalidades" />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Mensalidades</h1>
                {currentRegional ? (
                    <Badge variant="outline" className="gap-1 text-xs font-normal">
                        <Building2 className="size-3 text-primary" />
                        {currentRegional.name} ({currentRegional.code})
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="gap-1 text-xs font-normal">
                        <Globe className="size-3 text-emerald-600" />
                        Todas as Regionais
                    </Badge>
                )}
            </div>
            <Link className="underline" href="/billing-periods">Períodos</Link>
        </div>
        <DataTable table="fees" rows={fees.data} total={fees.total} query={tableQuery} columns={columns} rowKey={fee => fee.id} filters={({ setFilter }) => <>
            <label className="grid gap-1 text-sm">Período<select className="h-9 rounded-md border bg-background px-2" value={String(tableQuery.filters.period ?? '')} onChange={e => setFilter('period', e.target.value ? Number(e.target.value) : null)}><option value="">Todos</option>{periods.map(period => <option value={period.id} key={period.id}>{period.competence}</option>)}</select></label>
            <label className="grid gap-1 text-sm">Situação<select className="h-9 rounded-md border bg-background px-2" value={String(tableQuery.filters.status ?? '')} onChange={e => setFilter('status', e.target.value || null)}><option value="">Todas</option>{['open', 'partial', 'paid', 'overdue'].map(status => <option key={status} value={status}>{status}</option>)}</select></label>
        </>} />
    </div>;
}

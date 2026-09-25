import { Head, Link } from '@inertiajs/react';

const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

export default function Dashboard({ members_active, fees_open, cash_balance_cents }: { members_active: number | null; fees_open: number | null; cash_balance_cents: number | null }) {
    return <div className="space-y-6 p-6"><Head title="Painel" /><h1 className="text-2xl font-semibold">Painel do motoclube</h1>
        <div className="grid gap-4 md:grid-cols-3">
            {members_active !== null && <Link href="/members" className="rounded-lg border p-5"><div className="text-muted-foreground">Membros ativos</div><strong className="text-3xl">{members_active}</strong></Link>}
            {fees_open !== null && <Link href="/fees" className="rounded-lg border p-5"><div className="text-muted-foreground">Mensalidades em aberto</div><strong className="text-3xl">{fees_open}</strong></Link>}
            {cash_balance_cents !== null && <Link href="/cash" className="rounded-lg border p-5"><div className="text-muted-foreground">Saldo do caixa</div><strong className="text-3xl">{money(cash_balance_cents)}</strong></Link>}
        </div>
    </div>;
}

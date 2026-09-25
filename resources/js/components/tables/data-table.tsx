import { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTableQuery } from '@/hooks/use-table-query';
import type { TableColumn, TableQuery } from '@/types/dynamic-ui';

type Props<Row> = {
    table: string;
    rows: Row[];
    total: number;
    query: TableQuery;
    columns: TableColumn<Row>[];
    rowKey: (row: Row) => string | number;
    filters?: (controls: { setFilter: (name: string, value: TableQuery['filters'][string]) => void }) => React.ReactNode;
    loading?: boolean;
};

export function DataTable<Row>({ table, rows, total, query, columns, rowKey, filters, loading = false }: Props<Row>) {
    const actions = useTableQuery(table, query);
    const isLoading = loading || actions.isLoading;
    const [search, setSearch] = useState(query.search);
    const [expanded, setExpanded] = useState<string | number | null>(null);
    useEffect(() => setSearch(query.search), [query.search]);
    useEffect(() => {
        if (search === query.search) return;
        const timer = window.setTimeout(() => actions.setSearch(search), 300);
        return () => window.clearTimeout(timer);
    }, [search]); // debounce user input; action handler always submits a complete query snapshot

    const primary = columns.filter(column => column.priority !== 'secondary');
    const secondary = columns.filter(column => column.priority === 'secondary');
    const lastPage = Math.max(1, Math.ceil(total / query.per_page));

    return <section aria-busy={isLoading} className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground" role="status">Atualizando resultados…</p>}
        <div className="flex flex-wrap items-end gap-3">
            <label className="grid gap-1 text-sm">Buscar<Input value={search} onChange={event => setSearch(event.target.value)} /></label>
            {filters?.({ setFilter: actions.setFilter })}
            <label className="grid gap-1 text-sm">Por página<select className="h-9 rounded-md border bg-background px-2" value={query.per_page} onChange={event => actions.setPerPage(Number(event.target.value))}>{[10, 30, 50].map(size => <option key={size}>{size}</option>)}</select></label>
            <Button type="button" variant="outline" onClick={actions.clear}>Limpar filtros</Button>
        </div>
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm"><thead><tr className="border-b bg-muted">{primary.map(column => <th className="p-3" key={column.key}>{column.sortable ? <button className="rounded-sm text-left underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => actions.setSort(column.key)}>{column.label}{query.sort === column.key ? (query.direction === 'asc' ? ' ↑' : ' ↓') : ''}</button> : column.label}</th>)}{secondary.map(column => <th className="hidden p-3 md:table-cell" key={column.key}>{column.sortable ? <button className="underline-offset-4 hover:underline" onClick={() => actions.setSort(column.key)}>{column.label}{query.sort === column.key ? (query.direction === 'asc' ? ' ↑' : ' ↓') : ''}</button> : column.label}</th>)}{secondary.length > 0 && <th className="p-3 md:hidden">Detalhes</th>}</tr></thead>
                <tbody>{rows.map(row => { const key = rowKey(row); const isOpen = expanded === key; return <Fragment key={key}>
                    <tr className="border-b">{primary.map(column => <td className="p-3" key={column.key}>{column.render(row)}</td>)}{secondary.map(column => <td className="hidden p-3 md:table-cell" key={column.key}>{column.render(row)}</td>)}{secondary.length > 0 && <td className="p-3 md:hidden"><Button type="button" variant="ghost" size="sm" aria-expanded={isOpen} aria-controls={`row-details-${key}`} onClick={() => setExpanded(isOpen ? null : key)}>{isOpen ? 'Recolher' : 'Detalhes'}</Button></td>}</tr>
                    {secondary.length > 0 && <tr className="md:hidden" hidden={!isOpen}><td colSpan={primary.length + 1} id={`row-details-${key}`} className="space-y-2 border-b bg-muted/30 p-4">{secondary.map(column => <div key={column.key}><strong>{column.label}: </strong>{column.render(row)}</div>)}</td></tr>}
                </Fragment>; })}</tbody></table>
            {rows.length === 0 && <p className="p-4 text-muted-foreground">{total === 0 && !query.search && Object.keys(query.filters).length === 0 ? 'Nenhum registro cadastrado.' : 'Nenhum resultado encontrado para os filtros atuais.'}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{total} registro(s) · Página {query.page} de {lastPage}</span><div className="flex gap-2"><Button type="button" variant="outline" disabled={query.page <= 1 || isLoading} onClick={() => actions.setPage(query.page - 1)}>Anterior</Button><Button type="button" variant="outline" disabled={query.page >= lastPage || isLoading} onClick={() => actions.setPage(query.page + 1)}>Próxima</Button></div></div>
    </section>;
}

import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TableQuery } from '@/types/dynamic-ui';

export function useTableQuery(table: string, query: TableQuery, endpoint = '/table-query') {
    const pending = useRef(false);
    const queued = useRef<TableQuery | null>(null);
    const updateRef = useRef<(next: TableQuery) => void>(() => undefined);
    const currentQuery = useRef(query);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => { if (!pending.current) currentQuery.current = query; }, [query]);
    const update = useCallback((next: TableQuery) => {
        if (pending.current) {
            queued.current = next;
            return;
        }
        pending.current = true;
        setIsLoading(true);
        router.post(endpoint, { table, query: next }, {
            preserveScroll: true,
            onFinish: () => {
                pending.current = false;
                const nextQuery = queued.current;
                queued.current = null;
                if (nextQuery) updateRef.current(nextQuery);
                else setIsLoading(false);
            },
        });
    }, [endpoint, table]);
    updateRef.current = update;
    const change = (transform: (current: TableQuery) => TableQuery) => {
        const next = transform(currentQuery.current);
        currentQuery.current = next;
        update(next);
    };
    return {
        setSearch: (search: string) => change(current => ({ ...current, search, page: 1 })),
        setFilter: (name: string, value: TableQuery['filters'][string]) => change(current => ({ ...current, filters: { ...current.filters, [name]: value }, page: 1 })),
        setSort: (sort: string) => change(current => ({ ...current, sort, direction: current.sort === sort && current.direction === 'asc' ? 'desc' : 'asc', page: 1 })),
        setPage: (page: number) => change(current => ({ ...current, page })),
        setPerPage: (per_page: number) => change(current => ({ ...current, per_page, page: 1 })),
        clear: () => change(current => ({ ...current, search: '', filters: {}, page: 1 })),
        isLoading,
    };
}

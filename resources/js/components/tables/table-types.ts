export type { TableColumn, TableDirection, TableFilters, TableQuery, DynamicTableState } from '@/types/dynamic-ui';

export type TablePagination = {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
};

export type TableEmptyReason = 'no_records' | 'no_matches';

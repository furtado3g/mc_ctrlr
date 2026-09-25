export type TableDirection = 'asc' | 'desc';

export type TableFilters = Record<string, string | number | boolean | null>;

export type TableQuery = {
    search: string;
    filters: TableFilters;
    sort: string;
    direction: TableDirection;
    page: number;
    per_page: number;
};

export type DynamicTableState<Row> = {
    rows: Row[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    query: TableQuery;
    is_loading: boolean;
    empty_reason: 'no_records' | 'no_matches' | null;
};

export type FormState<Values extends Record<string, unknown>> = {
    values: Values;
    errors: Record<string, string[]>;
    processing: boolean;
    dirty: boolean;
    draft_restored: boolean;
    success_message: string | null;
    connection_error: string | null;
};

export type TableColumn<Row> = {
    key: string;
    label: string;
    sortable?: boolean;
    priority?: 'primary' | 'secondary';
    render: (row: Row) => React.ReactNode;
    renderExpanded?: (row: Row) => React.ReactNode;
};

export const defaultTableQuery: TableQuery = {
    search: '',
    filters: {},
    sort: 'id',
    direction: 'desc',
    page: 1,
    per_page: 30,
};

export interface RegionalCity {
    id: number;
    regional_id: number;
    name: string;
    state: string;
    is_headquarters: boolean;
    active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Regional {
    id: number;
    name: string;
    code: string;
    city: string;
    state: string;
    active: boolean;
    members_count?: number;
    cities_count?: number;
    cities?: RegionalCity[];
    headquarters_city?: RegionalCity | null;
    created_at?: string;
    updated_at?: string;
}

export type UserRegionalScope = 'global' | 'regional';

export interface RegionalContext {
    id: number | null; // null = Visão consolidada / todas as regionais
    name: string;
    code: string;
    cities?: RegionalCity[];
    headquarters_city?: RegionalCity | null;
}

export interface RegionalSharedProps {
    currentRegional: RegionalContext | null;
    availableRegionals?: Array<{
        id: number;
        name: string;
        code: string;
    }>;
}

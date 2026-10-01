export interface BirthdayMember {
    id: number;
    name: string;
    road_nickname: string | null;
    avatar_url: string | null;
    regional_name: string | null;
    regional_id?: number | null;
    birth_date: string | null; // "YYYY-MM-DD"
    birth_day_month: string; // ex: "15 de Outubro"
    day: number;
    month: number;
    is_today: boolean;
    days_until: number;
    turning_age: number | null;
}

export type PostFormat = 'feed_square' | 'feed_portrait' | 'stories';

export interface FormatDimensions {
    width: number;
    height: number;
    label: string;
    aspectRatio: string;
}

export const POST_FORMATS: Record<PostFormat, FormatDimensions> = {
    feed_square: {
        width: 1080,
        height: 1080,
        label: 'Feed Quadrado (1:1)',
        aspectRatio: '1/1',
    },
    feed_portrait: {
        width: 1080,
        height: 1350,
        label: 'Feed Retrato (4:5)',
        aspectRatio: '4/5',
    },
    stories: {
        width: 1080,
        height: 1920,
        label: 'Stories / WhatsApp (9:16)',
        aspectRatio: '9/16',
    },
};

export type PostThemeId = 'dark_gold' | 'asphalt_speed' | 'classic_vintage';

export interface PostTheme {
    id: PostThemeId;
    name: string;
    description: string;
    bgColor: string;
    accentColor: string;
    secondaryColor: string;
    textColor: string;
}

export const POST_THEMES: Record<PostThemeId, PostTheme> = {
    dark_gold: {
        id: 'dark_gold',
        name: 'Dark Gold',
        description: 'Couro escuro com dourado e brasão em relevo',
        bgColor: '#121214',
        accentColor: '#D4AF37',
        secondaryColor: '#8C7322',
        textColor: '#FFFFFF',
    },
    asphalt_speed: {
        id: 'asphalt_speed',
        name: 'Asphalt & Speed',
        description: 'Tema estrada com asfalto e amarelo sinalização',
        bgColor: '#181A1B',
        accentColor: '#F59E0B',
        secondaryColor: '#4B5563',
        textColor: '#F3F4F6',
    },
    classic_vintage: {
        id: 'classic_vintage',
        name: 'Classic Vintage',
        description: 'Moldura clássica de motoclube com faixas nobres',
        bgColor: '#0F172A',
        accentColor: '#38BDF8',
        secondaryColor: '#1E293B',
        textColor: '#F8FAFC',
    },
};

export interface PostGeneratorConfig {
    member: BirthdayMember;
    format: PostFormat;
    theme: PostThemeId;
    photoUrl: string | null;
    zoom: number; // 0.5 a 3.0
    panX: number;
    panY: number;
    headline: string;
    subheadline: string;
    showNickname: boolean;
    showRegional: boolean;
    showAge: boolean;
}

export interface UserProfile {
    id?: number;
    user_id?: number;
    avatar_path?: string | null;
    avatar_url?: string | null;
    road_nickname?: string | null;
    bio?: string | null;
    phone?: string | null;
    social_links?: Record<string, string> | null;
    created_at?: string;
    updated_at?: string;
}

export interface PostAuthor {
    id: number;
    name: string;
    road_nickname?: string | null;
    avatar_url?: string | null;
    member_id?: number | null;
}

export interface PostMedia {
    id: number;
    post_id: number;
    file_path: string;
    url: string;
    sort_order: number;
    created_at?: string;
}

export interface PostComment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: string;
    created_at_human?: string;
    can_delete?: boolean;
    author: PostAuthor;
}

export interface Post {
    id: number;
    user_id: number;
    regional_id?: number | null;
    content: string;
    created_at: string;
    created_at_human?: string;
    author: PostAuthor;
    regional?: {
        id: number;
        name: string;
        code: string;
    } | null;
    media: PostMedia[];
    likes_count: number;
    is_liked: boolean;
    comments_count: number;
    can_delete: boolean;
    comments?: PostComment[];
}

export interface PublicMemberProfile {
    id: number;
    user_id?: number | null;
    name: string;
    road_nickname?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    regional?: string | null;
    city?: string | null;
    joined_at_human?: string | null;
    motorcycles: {
        manufacturer: string;
        model: string;
        year?: number | null;
    }[];
}

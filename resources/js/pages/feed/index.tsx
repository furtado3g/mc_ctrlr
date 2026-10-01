import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Globe, MapPin, MessageSquareDashed } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import PostComposer from '@/components/feed/post-composer';
import PostCard from '@/components/feed/post-card';
import type { Post } from '@/types/feed';
import type { BreadcrumbItem, User } from '@/types';

interface FeedProps {
    posts: {
        data: Post[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    currentTab: 'regional' | 'global';
    availableRegionals: { id: number; name: string; code: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Feed Social',
        href: '/feed',
    },
];

export default function FeedIndex({ posts, currentTab }: FeedProps) {
    const { auth } = usePage().props as { auth: { user: User } };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feed Social" />

            <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6">
                {/* Header & Tabs */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Feed do Clube
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Fique por dentro das novidades, passeios e comunicados dos irmãos de estrada.
                        </p>
                    </div>

                    {/* Regional / Global Tabs */}
                    <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-800">
                        <Link
                            href="/feed?tab=regional"
                            preserveState
                            preserveScroll
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                currentTab === 'regional'
                                    ? 'bg-white text-neutral-950 shadow-xs dark:bg-neutral-900 dark:text-neutral-50'
                                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                            }`}
                        >
                            <MapPin className="h-3.5 w-3.5" />
                            Minha Regional
                        </Link>
                        <Link
                            href="/feed?tab=global"
                            preserveState
                            preserveScroll
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                currentTab === 'global'
                                    ? 'bg-white text-neutral-950 shadow-xs dark:bg-neutral-900 dark:text-neutral-50'
                                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                            }`}
                        >
                            <Globe className="h-3.5 w-3.5" />
                            Todas as Regionais
                        </Link>
                    </div>
                </div>

                {/* Post Creator */}
                <PostComposer defaultRegionalId={auth.user.regional_id as number | undefined} />

                {/* Post Feed List */}
                <div className="space-y-4">
                    {posts.data.length > 0 ? (
                        posts.data.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-neutral-200 p-12 text-center dark:border-neutral-800">
                            <MessageSquareDashed className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                            <h3 className="mt-3 text-base font-medium text-neutral-900 dark:text-neutral-100">
                                Nenhuma publicação encontrada
                            </h3>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                {currentTab === 'regional'
                                    ? 'Sua regional ainda não possui postagens recentes. Seja o primeiro a compartilhar um relato!'
                                    : 'Ainda não foram criadas publicações no clube.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {posts.links && posts.links.length > 3 && (
                    <div className="flex justify-center gap-1.5 pt-4">
                        {posts.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url ?? '#'}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                                    link.active
                                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                        : link.url
                                          ? 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                                          : 'cursor-not-allowed text-neutral-300 dark:text-neutral-600'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

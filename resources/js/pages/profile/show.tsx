import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bike, Calendar, MapPin, MessageSquareDashed } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import PostCard from '@/components/feed/post-card';
import type { Post, PublicMemberProfile } from '@/types/feed';
import type { BreadcrumbItem } from '@/types';

interface PublicProfileProps {
    member: PublicMemberProfile;
    posts: {
        data: Post[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export default function PublicProfileShow({ member, posts }: PublicProfileProps) {
    const getInitials = useInitials();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Membros',
            href: '/members',
        },
        {
            title: member.name,
            href: `/members/${member.id}/public-profile`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Perfil de ${member.name}`} />

            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
                {/* Member Header Card */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="h-32 bg-linear-to-r from-neutral-800 to-neutral-950 sm:h-40" />

                    <div className="relative px-6 pb-6">
                        <div className="-mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <Avatar className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-white dark:ring-neutral-900">
                                <AvatarImage src={member.avatar_url ?? undefined} alt={member.name} />
                                <AvatarFallback className="text-2xl font-bold bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
                                    {getInitials(member.name)}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="mt-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {member.name}
                                </h1>
                                {member.road_nickname && (
                                    <span className="rounded-md bg-neutral-100 px-2.5 py-0.5 text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        "{member.road_nickname}"
                                    </span>
                                )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                                {member.regional && (
                                    <div className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>{member.regional}</span>
                                        {member.city && <span>({member.city})</span>}
                                    </div>
                                )}

                                {member.joined_at_human && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>{member.joined_at_human}</span>
                                    </div>
                                )}
                            </div>

                            {member.bio && (
                                <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                                    {member.bio}
                                </p>
                            )}
                        </div>

                        {/* Motorcycles */}
                        {member.motorcycles && member.motorcycles.length > 0 && (
                            <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    <Bike className="h-4 w-4" />
                                    Motos na Garagem
                                </h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {member.motorcycles.map((moto, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-800 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-200"
                                        >
                                            <span className="font-semibold">{moto.manufacturer}</span> {moto.model}
                                            {moto.year && <span className="text-neutral-500"> ({moto.year})</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Member Posts Feed */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        Publicações de {member.road_nickname ? `"${member.road_nickname}"` : member.name}
                    </h2>

                    {posts.data.length > 0 ? (
                        posts.data.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
                            <MessageSquareDashed className="mx-auto h-8 w-8 text-neutral-400" />
                            <p className="mt-2 text-sm text-neutral-500">
                                Este integrante ainda não realizou publicações no feed.
                            </p>
                        </div>
                    )}

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
            </div>
        </AppLayout>
    );
}

import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Heart, MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import PostGallery from '@/components/feed/post-gallery';
import PostCommentsSection from '@/components/feed/post-comments-section';
import type { Post } from '@/types/feed';

export default function PostCard({ post }: { post: Post }) {
    const getInitials = useInitials();
    const [isLiked, setIsLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [showComments, setShowComments] = useState(false);

    const handleToggleLike = () => {
        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

        router.post(`/feed/posts/${post.id}/likes`, {}, {
            preserveScroll: true,
            onError: () => {
                // Revert on error
                setIsLiked(!nextLiked);
                setLikesCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
            },
        });
    };

    const handleDeletePost = () => {
        if (!confirm('Tem certeza que deseja excluir esta publicação?')) return;

        router.delete(`/feed/posts/${post.id}`, {
            preserveScroll: true,
        });
    };

    const authorLink = post.author.member_id
        ? `/members/${post.author.member_id}/public-profile`
        : undefined;

    return (
        <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            {/* Header: Author info, regional, time, actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {authorLink ? (
                        <Link href={authorLink} className="hover:opacity-85 transition-opacity">
                            <Avatar className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700">
                                <AvatarImage src={post.author.avatar_url ?? undefined} alt={post.author.name} />
                                <AvatarFallback className="bg-neutral-100 font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                                    {getInitials(post.author.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    ) : (
                        <Avatar className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700">
                            <AvatarImage src={post.author.avatar_url ?? undefined} alt={post.author.name} />
                            <AvatarFallback className="bg-neutral-100 font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                                {getInitials(post.author.name)}
                            </AvatarFallback>
                        </Avatar>
                    )}

                    <div>
                        <div className="flex items-center gap-2">
                            {authorLink ? (
                                <Link href={authorLink} className="font-semibold text-neutral-900 hover:underline dark:text-neutral-100">
                                    {post.author.name}
                                </Link>
                            ) : (
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {post.author.name}
                                </span>
                            )}
                            {post.author.road_nickname && (
                                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                    "{post.author.road_nickname}"
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <span>{post.created_at_human ?? post.created_at.slice(0, 10)}</span>
                            <span>•</span>
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                {post.regional ? post.regional.name : 'Global (Todo o Clube)'}
                            </span>
                        </div>
                    </div>
                </div>

                {post.can_delete && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={handleDeletePost}
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir publicação
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Content text */}
            <p className="mt-3 text-sm leading-relaxed text-neutral-800 whitespace-pre-line dark:text-neutral-200">
                {post.content}
            </p>

            {/* Photos */}
            {post.media && post.media.length > 0 && <PostGallery media={post.media} />}

            {/* Interaction footer */}
            <div className="mt-4 flex items-center gap-4 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleLike}
                    className={`cursor-pointer ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'}`}
                >
                    <Heart className={`mr-1.5 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likesCount} {likesCount === 1 ? 'curtida' : 'curtidas'}</span>
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                    className="cursor-pointer text-neutral-600 hover:text-neutral-900 dark:text-neutral-400"
                >
                    <MessageCircle className="mr-1.5 h-4 w-4" />
                    <span>{post.comments_count} {post.comments_count === 1 ? 'comentário' : 'comentários'}</span>
                </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <PostCommentsSection
                    postId={post.id}
                    comments={post.comments ?? []}
                />
            )}
        </article>
    );
}

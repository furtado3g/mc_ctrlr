import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Send, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import type { PostComment } from '@/types/feed';
import type { User } from '@/types';

export default function PostCommentsSection({
    postId,
    comments,
}: {
    postId: number;
    comments: PostComment[];
}) {
    const { auth } = usePage().props as { auth: { user: User } };
    const user = auth.user;
    const getInitials = useInitials();

    const form = useForm({
        content: '',
    });

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.data.content.trim()) return;

        form.post(`/feed/posts/${postId}/comments`, {
            preserveScroll: true,
            onSuccess: () => form.reset('content'),
        });
    };

    const handleDeleteComment = (commentId: number) => {
        if (!confirm('Deseja excluir este comentário?')) return;

        router.delete(`/feed/comments/${commentId}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="mt-4 space-y-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            {/* New comment input */}
            <form onSubmit={handleAddComment} className="flex items-start gap-2.5">
                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-neutral-100 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-1 items-center gap-2">
                    <input
                        type="text"
                        value={form.data.content}
                        onChange={(e) => form.setData('content', e.target.value)}
                        placeholder="Escreva um comentário..."
                        className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-800 dark:focus-visible:ring-neutral-300"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={!form.data.content.trim() || form.processing}
                        className="h-8 rounded-full px-3 cursor-pointer"
                    >
                        <Send className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </form>

            {form.errors.content && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    {form.errors.content}
                </p>
            )}

            {/* Comments list */}
            {comments.length > 0 && (
                <div className="space-y-3 pt-2">
                    {comments.map((comment) => {
                        const authorLink = comment.author.member_id
                            ? `/members/${comment.author.member_id}/public-profile`
                            : undefined;

                        return (
                            <div key={comment.id} className="group flex items-start gap-2.5 text-xs">
                                {authorLink ? (
                                    <Link href={authorLink} className="hover:opacity-85 transition-opacity">
                                        <Avatar className="h-7 w-7 overflow-hidden rounded-full">
                                            <AvatarImage src={comment.author.avatar_url ?? undefined} alt={comment.author.name} />
                                            <AvatarFallback className="bg-neutral-100 text-[10px] font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                                                {getInitials(comment.author.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                ) : (
                                    <Avatar className="h-7 w-7 overflow-hidden rounded-full">
                                        <AvatarImage src={comment.author.avatar_url ?? undefined} alt={comment.author.name} />
                                        <AvatarFallback className="bg-neutral-100 text-[10px] font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                                            {getInitials(comment.author.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div className="flex-1 rounded-2xl bg-neutral-50 px-3.5 py-2 dark:bg-neutral-800/60">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            {authorLink ? (
                                                <Link href={authorLink} className="font-semibold text-neutral-900 hover:underline dark:text-neutral-100">
                                                    {comment.author.name}
                                                </Link>
                                            ) : (
                                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {comment.author.name}
                                                </span>
                                            )}
                                            {comment.author.road_nickname && (
                                                <span className="text-[11px] text-neutral-500">
                                                    "{comment.author.road_nickname}"
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-neutral-400">
                                                {comment.created_at_human ?? comment.created_at.slice(0, 10)}
                                            </span>
                                            {comment.can_delete && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="opacity-0 transition-opacity group-hover:opacity-100 text-neutral-400 hover:text-red-500 cursor-pointer"
                                                    title="Excluir comentário"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

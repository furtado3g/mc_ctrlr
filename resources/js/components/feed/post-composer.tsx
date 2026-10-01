import React, { useRef, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { ImagePlus, Send, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export default function PostComposer({
    defaultRegionalId,
}: {
    defaultRegionalId?: number | null;
}) {
    const { auth } = usePage().props as { auth: { user: User } };
    const user = auth.user;
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

    const form = useForm<{
        content: string;
        regional_id: number | null;
        images: File[];
    }>({
        content: '',
        regional_id: defaultRegionalId ?? null,
        images: [],
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const currentTotal = previews.length;
        const remainingAllowed = 10 - currentTotal;
        const validFiles = files.slice(0, remainingAllowed);

        const newPreviews = validFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        const updatedPreviews = [...previews, ...newPreviews];
        setPreviews(updatedPreviews);
        form.setData('images', updatedPreviews.map((p) => p.file));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (index: number) => {
        const item = previews[index];
        URL.revokeObjectURL(item.url);
        const updated = previews.filter((_, i) => i !== index);
        setPreviews(updated);
        form.setData('images', updated.map((p) => p.file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.data.content.trim() && form.data.images.length === 0) return;

        form.post('/feed/posts', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset('content', 'images');
                previews.forEach((p) => URL.revokeObjectURL(p.url));
                setPreviews([]);
            },
        });
    };

    const isSubmitting = form.processing;
    const canSubmit = form.data.content.trim().length > 0 || form.data.images.length > 0;

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-neutral-100 font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <textarea
                        rows={3}
                        value={form.data.content}
                        onChange={(e) => form.setData('content', e.target.value)}
                        placeholder="O que está acontecendo na estrada? Compartilhe um relato, foto de passeio ou comunicado..."
                        className="w-full resize-none rounded-lg border border-neutral-200 bg-transparent p-3 text-sm placeholder:text-neutral-400 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
                    />

                    {form.errors.content && (
                        <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            {form.errors.content}
                        </p>
                    )}

                    {previews.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                            {previews.map((item, idx) => (
                                <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
                                    <img
                                        src={item.url}
                                        alt={`Foto ${idx + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(idx)}
                                        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-90 transition-opacity hover:opacity-100 cursor-pointer"
                                        title="Remover foto"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {form.errors.images && (
                        <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            {form.errors.images}
                        </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={previews.length >= 10 || isSubmitting}
                                className="cursor-pointer text-neutral-600 hover:text-neutral-900 dark:text-neutral-300"
                            >
                                <ImagePlus className="mr-2 h-4 w-4" />
                                Fotos ({previews.length}/10)
                            </Button>
                        </div>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canSubmit || isSubmitting}
                            className="cursor-pointer"
                        >
                            <Send className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Publicando...' : 'Publicar'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

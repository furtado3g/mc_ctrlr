import React, { useRef, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export default function AvatarUploadForm() {
    const { auth } = usePage().props as { auth: { user: User } };
    const user = auth.user;
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const uploadForm = useForm<{ avatar: File | null }>({
        avatar: null,
    });

    const deleteForm = useForm({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        uploadForm.setData('avatar', file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadForm.data.avatar) return;

        uploadForm.post('/me/profile/avatar', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleRemove = () => {
        if (!confirm('Deseja remover sua foto de perfil?')) return;

        deleteForm.delete('/me/profile/avatar', {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const displaySrc = previewUrl ?? user.avatar ?? undefined;

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Foto de Perfil
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Envie uma foto em formato JPEG, PNG ou WebP de até 5MB.
            </p>

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative group">
                    <Avatar className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700">
                        <AvatarImage src={displaySrc} alt={user.name} />
                        <AvatarFallback className="text-xl font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white cursor-pointer"
                        title="Alterar foto"
                    >
                        <Camera className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex flex-1 flex-col gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="cursor-pointer"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Selecionar imagem
                        </Button>

                        {previewUrl && (
                            <Button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploadForm.processing}
                                className="cursor-pointer"
                            >
                                Salvar foto
                            </Button>
                        )}

                        {user.avatar && !previewUrl && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleRemove}
                                disabled={deleteForm.processing}
                                className="cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remover foto
                            </Button>
                        )}
                    </div>

                    {uploadForm.errors.avatar && (
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                            {uploadForm.errors.avatar}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

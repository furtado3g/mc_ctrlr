import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/types';

interface ProfileDetailsValues {
    road_nickname: string;
    bio: string;
    phone: string;
    social_links: {
        instagram: string;
        facebook?: string;
    };
}

export default function ProfileDetailsForm() {
    const { auth } = usePage().props as { auth: { user: User & { profile?: { phone?: string; social_links?: { instagram?: string; facebook?: string } } } } };
    const user = auth.user;

    const form = useForm<ProfileDetailsValues>({
        road_nickname: user.road_nickname ?? '',
        bio: user.bio ?? '',
        phone: user.profile?.phone ?? '',
        social_links: {
            instagram: user.profile?.social_links?.instagram ?? '',
            facebook: user.profile?.social_links?.facebook ?? '',
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/me/profile/details', {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Informações de Estrada & Comunidade
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Apelido, apresentação e contato exibidos para outros integrantes do clube.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="road_nickname">Apelido de Estrada / Codinome</Label>
                    <Input
                        id="road_nickname"
                        value={form.data.road_nickname}
                        onChange={(e) => form.setData('road_nickname', e.target.value)}
                        placeholder="Ex: Falcão, Trovão, Barba"
                    />
                    {form.errors.road_nickname && (
                        <p className="text-sm text-red-600 dark:text-red-400">{form.errors.road_nickname}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                    <Input
                        id="phone"
                        value={form.data.phone}
                        onChange={(e) => form.setData('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                    />
                    {form.errors.phone && (
                        <p className="text-sm text-red-600 dark:text-red-400">{form.errors.phone}</p>
                    )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Biografia / Apresentação Pessoal</Label>
                    <textarea
                        id="bio"
                        rows={3}
                        value={form.data.bio}
                        onChange={(e) => form.setData('bio', e.target.value)}
                        placeholder="Conte um pouco sobre sua trajetória no motociclismo..."
                        className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:focus-visible:ring-neutral-300"
                    />
                    {form.errors.bio && (
                        <p className="text-sm text-red-600 dark:text-red-400">{form.errors.bio}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                        id="instagram"
                        value={form.data.social_links.instagram}
                        onChange={(e) =>
                            form.setData('social_links', {
                                ...form.data.social_links,
                                instagram: e.target.value,
                            })
                        }
                        placeholder="@usuario"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={form.processing} className="cursor-pointer">
                    Salvar Informações
                </Button>
            </div>
        </form>
    );
}

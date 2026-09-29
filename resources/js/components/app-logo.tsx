import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name, logo } = usePage().props as { name: string; logo?: string | null };
    const [imageError, setImageError] = useState(false);

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                {logo && !imageError ? (
                    <img
                        src={logo}
                        alt={name ? `Logotipo ${name}` : 'Logotipo'}
                        className="size-full object-contain"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}

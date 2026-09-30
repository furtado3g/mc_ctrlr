import { router, usePage } from '@inertiajs/react';
import { Building2, Check, ChevronDown, Globe, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { RegionalContext } from '@/types/regional';

export function RegionalBadge() {
    const { auth, currentRegional, availableRegionals } = usePage().props as unknown as {
        auth: {
            user?: {
                id: number;
                name: string;
                is_global?: boolean;
                regional_id?: number | null;
            };
        };
        currentRegional?: RegionalContext | null;
        availableRegionals?: Array<{
            id: number;
            name: string;
            code: string;
        }>;
    };

    if (!auth?.user) {
        return null;
    }

    const isGlobal = Boolean(auth.user.is_global);

    const handleSelectRegional = (regionalId: number | null) => {
        router.post('/admin/context/regional', { regional_id: regionalId }, {
            preserveState: false,
        });
    };

    if (!isGlobal) {
        if (!currentRegional) {
            return null;
        }

        const citiesCount = currentRegional.cities?.length ?? 0;
        const sedeCity = currentRegional.cities?.find((c) => c.is_headquarters);

        return (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/60 text-xs font-medium text-foreground border">
                <MapPin className="size-3.5 text-primary shrink-0" />
                <span className="truncate">{currentRegional.name}</span>
                {sedeCity && (
                    <span className="text-[11px] text-muted-foreground font-normal">
                        ({sedeCity.name}/{sedeCity.state})
                    </span>
                )}
                {citiesCount > 1 && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                        +{citiesCount - 1} {citiesCount === 2 ? 'cidade' : 'cidades'}
                    </Badge>
                )}
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-mono ml-auto">
                    {currentRegional.code}
                </Badge>
            </div>
        );
    }

    // Global user switcher
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 px-2.5 text-xs font-normal border-dashed hover:border-primary/50"
                >
                    {currentRegional ? (
                        <>
                            <Building2 className="size-3.5 text-primary shrink-0" />
                            <span className="truncate max-w-[120px] font-medium">
                                {currentRegional.name}
                            </span>
                            {currentRegional.cities && currentRegional.cities.length > 0 && (
                                <span className="text-[10px] text-muted-foreground font-normal hidden sm:inline">
                                    ({currentRegional.cities.length} {currentRegional.cities.length === 1 ? 'cid.' : 'cids.'})
                                </span>
                            )}
                            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 font-mono">
                                {currentRegional.code}
                            </Badge>
                        </>
                    ) : (
                        <>
                            <Globe className="size-3.5 text-emerald-600 shrink-0" />
                            <span className="font-medium text-foreground">
                                Todas as Regionais
                            </span>
                            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                                Global
                            </Badge>
                        </>
                    )}
                    <ChevronDown className="size-3 text-muted-foreground ml-auto" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Filtrar escopo de operação:
                </DropdownMenuLabel>

                <DropdownMenuItem
                    onClick={() => handleSelectRegional(null)}
                    className="flex items-center justify-between text-xs cursor-pointer font-medium"
                >
                    <span className="flex items-center gap-2">
                        <Globe className="size-3.5 text-emerald-600" />
                        Visão Consolidada (Todas)
                    </span>
                    {!currentRegional && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {availableRegionals && availableRegionals.length > 0 ? (
                    availableRegionals.map((reg) => (
                        <DropdownMenuItem
                            key={reg.id}
                            onClick={() => handleSelectRegional(reg.id)}
                            className="flex items-center justify-between text-xs cursor-pointer"
                        >
                            <span className="flex items-center gap-2 truncate">
                                <Building2 className="size-3.5 text-muted-foreground" />
                                <span className="truncate">{reg.name}</span>
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="font-mono text-[10px] text-muted-foreground">
                                    {reg.code}
                                </span>
                                {currentRegional?.id === reg.id && (
                                    <Check className="size-3.5 text-primary" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <div className="p-2 text-xs text-muted-foreground text-center">
                        Nenhuma regional cadastrada
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

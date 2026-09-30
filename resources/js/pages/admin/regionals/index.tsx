import { Head, router } from '@inertiajs/react';
import { Building2, Edit2, MapPin, Plus, Power, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Regional } from '@/types/regional';
import { RegionalForm } from './regional-form';

interface PaginatedRegionals {
    data: Regional[];
    total: number;
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    regionals: PaginatedRegionals;
    filters: {
        search: string;
        status: string;
    };
    canManage: boolean;
}

export default function RegionalsIndex({ regionals, filters, canManage }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [formOpen, setFormOpen] = useState(false);
    const [editingRegional, setEditingRegional] = useState<Regional | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/regionals',
            { search, status: filters.status },
            { preserveState: true }
        );
    };

    const handleFilterStatus = (status: string) => {
        router.get(
            '/admin/regionals',
            { search: filters.search, status },
            { preserveState: true }
        );
    };

    const handleOpenCreate = () => {
        setEditingRegional(null);
        setFormOpen(true);
    };

    const handleOpenEdit = (regional: Regional) => {
        setEditingRegional(regional);
        setFormOpen(true);
    };

    const handleToggleStatus = (regional: Regional) => {
        if (regional.id === 1 && regional.active) {
            alert('A regional Matriz não pode ser desativada.');
            return;
        }

        const actionText = regional.active ? 'desativar' : 'reativar';
        if (confirm(`Deseja realmente ${actionText} a regional ${regional.name}?`)) {
            router.post(`/admin/regionals/${regional.id}/toggle-status`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Administração', href: '/admin/users' },
                { title: 'Regionais', href: '/admin/regionals' },
            ]}
        >
            <Head title="Divisões Regionais" />

            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Building2 className="size-6 text-primary" />
                            Divisões Regionais (Multitenant)
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gerencie as unidades, facções e cidades do motoclube para segregação territorial de acessos.
                        </p>
                    </div>

                    {canManage && (
                        <Button onClick={handleOpenCreate} className="gap-2">
                            <Plus className="size-4" />
                            Nova Regional
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="pb-3 border-b">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                            <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nome, código ou cidade..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Filtrar
                                </Button>
                            </form>

                            <div className="flex gap-1 border rounded-lg p-1 bg-muted/30">
                                <Button
                                    size="sm"
                                    variant={filters.status === 'all' || !filters.status ? 'default' : 'ghost'}
                                    onClick={() => handleFilterStatus('all')}
                                    className="h-8 text-xs"
                                >
                                    Todas
                                </Button>
                                <Button
                                    size="sm"
                                    variant={filters.status === 'active' ? 'default' : 'ghost'}
                                    onClick={() => handleFilterStatus('active')}
                                    className="h-8 text-xs"
                                >
                                    Ativas
                                </Button>
                                <Button
                                    size="sm"
                                    variant={filters.status === 'inactive' ? 'default' : 'ghost'}
                                    onClick={() => handleFilterStatus('inactive')}
                                    className="h-8 text-xs"
                                >
                                    Inativas
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/40 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Código</th>
                                        <th className="px-6 py-3">Regional & Sede</th>
                                        <th className="px-6 py-3">Cidades Abrangidas</th>
                                        <th className="px-6 py-3 text-center">Membros</th>
                                        <th className="px-6 py-3">Status</th>
                                        {canManage && <th className="px-6 py-3 text-right">Ações</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {regionals.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                                Nenhuma regional encontrada.
                                            </td>
                                        </tr>
                                    ) : (
                                        regionals.data.map((regional) => (
                                            <tr key={regional.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4 font-mono font-semibold">
                                                    <Badge variant="outline" className="bg-background">
                                                        {regional.code}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-foreground flex items-center gap-1.5">
                                                        {regional.name}
                                                        {regional.id === 1 && (
                                                            <span className="text-xs text-primary font-normal bg-primary/10 px-1.5 py-0.5 rounded">
                                                                Matriz
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <MapPin className="size-3 text-primary" />
                                                        <span>Sede: {regional.city} - {regional.state}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5 max-w-md items-center">
                                                        {regional.cities && regional.cities.length > 0 ? (
                                                            regional.cities.map((city) => (
                                                                <Badge
                                                                    key={city.id}
                                                                    variant={city.is_headquarters ? 'default' : 'outline'}
                                                                    className={`text-xs ${
                                                                        city.is_headquarters
                                                                            ? 'bg-primary/90 text-primary-foreground'
                                                                            : 'bg-muted/50'
                                                                    }`}
                                                                >
                                                                    {city.name}/{city.state}
                                                                    {city.is_headquarters && ' (Sede)'}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">
                                                                {regional.city}/{regional.state}
                                                            </span>
                                                        )}
                                                        {(regional.cities_count ?? 0) > 0 && (
                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                ({regional.cities_count} {regional.cities_count === 1 ? 'cidade' : 'cidades'})
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1 font-medium">
                                                        <Users className="size-3.5 text-muted-foreground" />
                                                        {regional.members_count ?? 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {regional.active ? (
                                                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600">
                                                            Ativa
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            Inativa
                                                        </Badge>
                                                    )}
                                                </td>
                                                {canManage && (
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 gap-1.5"
                                                                onClick={() => handleOpenEdit(regional)}
                                                            >
                                                                <Edit2 className="size-3.5" />
                                                                Editar
                                                            </Button>

                                                            {regional.id !== 1 && (
                                                                <Button
                                                                    size="sm"
                                                                    variant={regional.active ? 'destructive' : 'secondary'}
                                                                    className="h-8 gap-1.5"
                                                                    onClick={() => handleToggleStatus(regional)}
                                                                >
                                                                    <Power className="size-3.5" />
                                                                    {regional.active ? 'Desativar' : 'Ativar'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        {regionals.last_page > 1 && (
                            <div className="flex items-center justify-between p-4 border-t text-sm text-muted-foreground">
                                <div>Total: {regionals.total} regionais</div>
                                <div className="flex gap-1">
                                    {regionals.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            size="sm"
                                            variant={link.active ? 'default' : 'outline'}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="h-8"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <RegionalForm
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    regional={editingRegional}
                />
            </div>
        </AppLayout>
    );
}

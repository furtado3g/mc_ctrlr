import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Cake, Calendar, CalendarDays, Filter, Search, Sparkles, UserPlus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import BirthdayCard from '@/components/birthdays/birthday-card';
import BirthdayGeneratorModal from '@/components/birthdays/birthday-generator-modal';
import MemberSearchDialog from '@/components/birthdays/member-search-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BirthdayMember } from '@/types/birthdays';
import type { BreadcrumbItem } from '@/types';

interface BirthdaysIndexProps {
    birthdays: BirthdayMember[];
    today_count: number;
    week_count: number;
    month_count: number;
    filters: {
        period: string;
        month: number;
        regional_id: number | null;
        search: string | null;
    };
    regionais: { id: number; name: string }[];
    selectedMember: BirthdayMember | null;
}

export default function BirthdaysIndex({
    birthdays,
    today_count,
    week_count,
    month_count,
    filters,
    regionais,
    selectedMember: initialSelectedMember,
}: BirthdaysIndexProps) {
    const [activeGeneratorMember, setActiveGeneratorMember] = useState<BirthdayMember | null>(initialSelectedMember);
    const [generatorModalOpen, setGeneratorModalOpen] = useState(Boolean(initialSelectedMember));
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search ?? '');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Aniversariantes & Posts',
            href: '/birthdays',
        },
    ];

    const applyFilter = (newFilters: Partial<typeof filters>) => {
        router.get(
            '/birthdays',
            {
                ...filters,
                ...newFilters,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search: searchInput });
    };

    const handleOpenGenerator = (member: BirthdayMember) => {
        setActiveGeneratorMember(member);
        setGeneratorModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aniversariantes & Post Instagram" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
                {/* Header Title & Ad-hoc Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
                            <Cake className="h-7 w-7 text-amber-500" />
                            Aniversariantes & Posts para Redes
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Acompanhe as comemorações dos integrantes e gere posts oficiais para o Instagram e WhatsApp em um clique.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => setSearchDialogOpen(true)}
                        className="gap-2 cursor-pointer font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
                    >
                        <UserPlus className="h-4 w-4" />
                        Gerar Post Avulso
                    </Button>
                </div>

                {/* Summary Metrics Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div
                        onClick={() => applyFilter({ period: 'today' })}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                            filters.period === 'today'
                                ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-400/50'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Aniversariantes de Hoje
                            </span>
                            <Cake className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                            {today_count}
                        </p>
                    </div>

                    <div
                        onClick={() => applyFilter({ period: 'week' })}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                            filters.period === 'week'
                                ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-400/50'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Próximos 7 Dias
                            </span>
                            <CalendarDays className="h-5 w-5 text-neutral-400" />
                        </div>
                        <p className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                            {week_count}
                        </p>
                    </div>

                    <div
                        onClick={() => applyFilter({ period: 'month' })}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                            filters.period === 'month'
                                ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-400/50'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Aniversariantes do Mês
                            </span>
                            <Calendar className="h-5 w-5 text-neutral-400" />
                        </div>
                        <p className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                            {month_count}
                        </p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
                    {/* Period Tabs */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-800">
                        <button
                            type="button"
                            onClick={() => applyFilter({ period: 'today' })}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                filters.period === 'today'
                                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                            }`}
                        >
                            Hoje ({today_count})
                        </button>
                        <button
                            type="button"
                            onClick={() => applyFilter({ period: 'week' })}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                filters.period === 'week'
                                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                            }`}
                        >
                            Próximos 7 Dias ({week_count})
                        </button>
                        <button
                            type="button"
                            onClick={() => applyFilter({ period: 'month' })}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                filters.period === 'month'
                                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                            }`}
                        >
                            Mês Atual ({month_count})
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Regional Filter */}
                        {regionais.length > 0 && (
                            <select
                                value={filters.regional_id ?? ''}
                                onChange={(e) =>
                                    applyFilter({
                                        regional_id: e.target.value ? parseInt(e.target.value, 10) : null,
                                    })
                                }
                                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-800 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <option value="">Todas as Regionais</option>
                                {regionais.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
                            <Input
                                type="text"
                                placeholder="Buscar por nome/apelido..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="h-8 text-xs w-44 sm:w-56"
                            />
                            <Button type="submit" size="sm" variant="outline" className="h-8 cursor-pointer">
                                <Search className="h-3.5 w-3.5" />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Members Cards Grid */}
                {birthdays.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {birthdays.map((member) => (
                            <BirthdayCard
                                key={member.id}
                                member={member}
                                onGenerate={handleOpenGenerator}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-neutral-200 p-12 text-center dark:border-neutral-800">
                        <Cake className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                        <h3 className="mt-3 text-base font-semibold text-neutral-800 dark:text-neutral-200">
                            Nenhum aniversariante encontrado
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Não há membros com aniversário registrado para o período ou filtros selecionados.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSearchDialogOpen(true)}
                            className="mt-4 gap-2 text-xs"
                        >
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            Gerar post para outro integrante
                        </Button>
                    </div>
                )}
            </div>

            {/* Generator Modal */}
            <BirthdayGeneratorModal
                member={activeGeneratorMember}
                open={generatorModalOpen}
                onClose={() => setGeneratorModalOpen(false)}
            />

            {/* Ad-hoc Member Search Dialog */}
            <MemberSearchDialog
                open={searchDialogOpen}
                onClose={() => setSearchDialogOpen(false)}
                onSelectMember={handleOpenGenerator}
            />
        </AppLayout>
    );
}

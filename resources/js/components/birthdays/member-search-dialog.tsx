import React, { useState } from 'react';
import { Loader2, Search, Sparkles, UserPlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { BirthdayMember } from '@/types/birthdays';

interface MemberSearchDialogProps {
    open: boolean;
    onClose: () => void;
    onSelectMember: (member: BirthdayMember) => void;
}

export default function MemberSearchDialog({
    open,
    onClose,
    onSelectMember,
}: MemberSearchDialogProps) {
    const getInitials = useInitials();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<BirthdayMember[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const term = searchTerm.trim();
        if (term.length < 2) return;

        setLoading(true);
        try {
            const res = await fetch(`/birthdays/members/search?q=${encodeURIComponent(term)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (err) {
            console.error('Erro ao buscar membros', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (member: BirthdayMember) => {
        onSelectMember(member);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-md p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-neutral-100">
                        <UserPlus className="h-5 w-5 text-amber-500" />
                        Gerar Post para Qualquer Integrante
                    </DialogTitle>
                </DialogHeader>

                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Pesquise um integrante pelo nome ou apelido de estrada para gerar um post de aniversário avulso.
                </p>

                <form onSubmit={handleSearch} className="mt-3 flex gap-2">
                    <Input
                        type="text"
                        placeholder="Nome ou apelido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-xs"
                    />
                    <Button type="submit" disabled={loading || searchTerm.trim().length < 2} className="cursor-pointer gap-1.5 text-xs">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        Buscar
                    </Button>
                </form>

                <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                    {results.length > 0 ? (
                        results.map((m) => (
                            <div
                                key={m.id}
                                onClick={() => handleSelect(m)}
                                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-2.5 transition-colors hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-500/40"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={m.avatar_url ?? undefined} alt={m.name} />
                                        <AvatarFallback className="bg-neutral-100 text-xs font-semibold">
                                            {getInitials(m.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                            {m.name}
                                        </p>
                                        {m.road_nickname && (
                                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                                "{m.road_nickname}"
                                            </p>
                                        )}
                                        <p className="text-[10px] text-neutral-400">
                                            {m.regional_name ?? 'Sem Regional'} • {m.birth_day_month}
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs">
                                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                    Gerar
                                </Button>
                            </div>
                        ))
                    ) : searchTerm.trim().length >= 2 && !loading ? (
                        <p className="text-center py-6 text-xs text-neutral-500">
                            Nenhum integrante encontrado com este termo.
                        </p>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}

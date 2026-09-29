import { Check, Columns2, LayoutTemplate, PanelLeft, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AppLayoutVariant = 'sidebar' | 'header';
export type AuthLayoutVariant = 'simple' | 'card' | 'split';

interface LayoutVariantSelectorProps {
    appLayout: AppLayoutVariant;
    authLayout: AuthLayoutVariant;
    onAppLayoutChange: (val: AppLayoutVariant) => void;
    onAuthLayoutChange: (val: AuthLayoutVariant) => void;
    disabled?: boolean;
}

export default function LayoutVariantSelector({
    appLayout,
    authLayout,
    onAppLayoutChange,
    onAuthLayoutChange,
    disabled = false,
}: LayoutVariantSelectorProps) {
    const appOptions: {
        id: AppLayoutVariant;
        label: string;
        desc: string;
        icon: typeof PanelLeft;
    }[] = [
        {
            id: 'sidebar',
            label: 'Barra Lateral (Sidebar)',
            desc: 'Menu lateral expansível, ideal para uso frequente e telas amplas.',
            icon: PanelLeft,
        },
        {
            id: 'header',
            label: 'Barra Superior (Header)',
            desc: 'Navegação horizontal no topo, com área de conteúdo mais livre.',
            icon: LayoutTemplate,
        },
    ];

    const authOptions: {
        id: AuthLayoutVariant;
        label: string;
        desc: string;
        icon: typeof Square;
    }[] = [
        {
            id: 'simple',
            label: 'Simples e Direto',
            desc: 'Formulário limpo e centralizado na tela.',
            icon: Square,
        },
        {
            id: 'card',
            label: 'Cartão Elegante',
            desc: 'Formulário contido em um card elevado com foco na marca.',
            icon: LayoutTemplate,
        },
        {
            id: 'split',
            label: 'Duas Colunas (Split)',
            desc: 'Banner institucional à esquerda e formulário à direita.',
            icon: Columns2,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <PanelLeft className="size-4 text-muted-foreground" />
                    Layout do Painel do Sistema (Área Autenticada)
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                    Define a estrutura de navegação padrão exibida para os usuários logados.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {appOptions.map((opt) => {
                        const isSelected = appLayout === opt.id;
                        const Icon = opt.icon;
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                disabled={disabled}
                                onClick={() => onAppLayoutChange(opt.id)}
                                className={cn(
                                    'flex flex-col text-left p-3.5 rounded-xl border transition-all relative select-none',
                                    isSelected
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                                        : 'border-border/60 hover:border-border hover:bg-muted/40',
                                    disabled && 'opacity-60 cursor-not-allowed'
                                )}
                            >
                                <div className="flex items-center justify-between w-full mb-1.5">
                                    <div className="flex items-center gap-2 font-medium text-sm text-foreground">
                                        <Icon className={cn('size-4', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                                        <span>{opt.label}</span>
                                    </div>
                                    {isSelected && (
                                        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Check className="size-3" />
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {opt.desc}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Columns2 className="size-4 text-muted-foreground" />
                    Layout das Telas de Autenticação (Login / Registro)
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                    Define o formato visual das telas de entrada do sistema.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {authOptions.map((opt) => {
                        const isSelected = authLayout === opt.id;
                        const Icon = opt.icon;
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                disabled={disabled}
                                onClick={() => onAuthLayoutChange(opt.id)}
                                className={cn(
                                    'flex flex-col text-left p-3.5 rounded-xl border transition-all relative select-none',
                                    isSelected
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                                        : 'border-border/60 hover:border-border hover:bg-muted/40',
                                    disabled && 'opacity-60 cursor-not-allowed'
                                )}
                            >
                                <div className="flex items-center justify-between w-full mb-1.5">
                                    <div className="flex items-center gap-2 font-medium text-sm text-foreground">
                                        <Icon className={cn('size-4', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                                        <span>{opt.label}</span>
                                    </div>
                                    {isSelected && (
                                        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Check className="size-3" />
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {opt.desc}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

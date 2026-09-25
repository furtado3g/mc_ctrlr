import { Head, useForm } from '@inertiajs/react';
import {
    ArrowUpRight,
    Camera,
    CheckCircle2,
    Eye,
    Globe,
    Image as ImageIcon,
    RotateCcw,
    Sparkles,
    Trash2,
    Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Section = {
    key: string;
    title: string;
    body: string;
    image_path?: string | null;
    image_url?: string | null;
    cta_label?: string | null;
    cta_url?: string | null;
    enabled: boolean;
    position: number;
    image?: File | null;
    remove_image?: boolean;
};

type Content = {
    name: string;
    logo_path?: string | null;
    logo_url?: string | null;
    logo?: File | null;
    remove_logo?: boolean;
    sections: Section[];
};

const sectionConfig: Record<
    string,
    { label: string; photoTip: string; textTip: string }
> = {
    hero: {
        label: 'Destaque (Capa / Hero)',
        photoTip: 'Foto panorâmica da capa que fica em tela cheia no início.',
        textTip: 'Frase de impacto e mensagem de boas-vindas do motoclube.',
    },
    about: {
        label: 'Sobre o Motoclube',
        photoTip: 'Foto ilustrativa da história, membros ou manifesto do clube.',
        textTip: 'A essência, história e valores do grupo.',
    },
    activities: {
        label: 'Na Estrada (Atividades)',
        photoTip: 'Foto das viagens, comboios ou encontros dos motociclistas.',
        textTip: 'Dica: cada parágrafo separado por linha em branco se transforma em um cartão na página.',
    },
    instagram: {
        label: 'Galeria & Instagram',
        photoTip: 'Foto de destaque que ilustra o mural oficial.',
        textTip: 'Chamada para seguir a página oficial e acompanhar os passeios.',
    },
    contact: {
        label: 'Contato & Área do Membro',
        photoTip: 'Foto dos encontros ou sede do motoclube.',
        textTip: 'Orientações para novos membros e canais de contato.',
    },
};

export default function InstitutionalPageEditor({
    published,
    draft,
    draftSavedAt,
    draftSavedBy,
    publishedAt,
    publishedBy,
    canEdit,
}: {
    published: Content;
    draft: Content | null;
    draftSavedAt: string | null;
    draftSavedBy: string | null;
    publishedAt: string | null;
    publishedBy: string | null;
    canEdit: boolean;
}) {
    const initial = draft ?? published;
    const form = useForm<Content>({
        name: initial.name,
        logo_path: initial.logo_path ?? null,
        logo_url: initial.logo_url ?? null,
        logo: null,
        remove_logo: false,
        sections: initial.sections.map((s) => ({
            ...s,
            image: null,
            remove_image: false,
        })),
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [sectionPreviews, setSectionPreviews] = useState<
        Record<string, string | null>
    >({});

    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            Object.values(sectionPreviews).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [logoPreview, sectionPreviews]);

    const handleLogoChange = (file: File | null) => {
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
            form.setData((data) => ({
                ...data,
                logo: file,
                remove_logo: false,
            }));
        } else {
            setLogoPreview(null);
            form.setData((data) => ({ ...data, logo: null }));
        }
    };

    const handleRemoveLogo = () => {
        if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
            setLogoPreview(null);
        }
        form.setData((data) => ({
            ...data,
            logo: null,
            remove_logo: true,
        }));
    };

    const handleRestoreLogo = () => {
        form.setData((data) => ({
            ...data,
            remove_logo: false,
        }));
    };

    const handleSectionImageChange = (
        index: number,
        key: string,
        file: File | null,
    ) => {
        if (sectionPreviews[key]) {
            URL.revokeObjectURL(sectionPreviews[key]!);
        }

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setSectionPreviews((prev) => ({ ...prev, [key]: previewUrl }));
            updateSection(index, { image: file, remove_image: false });
        } else {
            setSectionPreviews((prev) => ({ ...prev, [key]: null }));
            updateSection(index, { image: null });
        }
    };

    const handleRemoveSectionImage = (index: number, key: string) => {
        if (sectionPreviews[key]) {
            URL.revokeObjectURL(sectionPreviews[key]!);
            setSectionPreviews((prev) => ({ ...prev, [key]: null }));
        }
        updateSection(index, { image: null, remove_image: true });
    };

    const handleRestoreSectionImage = (index: number) => {
        updateSection(index, { remove_image: false });
    };

    const updateSection = (index: number, values: Partial<Section>) => {
        form.setData(
            'sections',
            form.data.sections.map((section, i) =>
                i === index ? { ...section, ...values } : section,
            ),
        );
    };

    const save = (event: React.FormEvent) => {
        event.preventDefault();
        form.patch('/institutional-page/draft', { forceFormData: true });
    };

    const publish = () => {
        form.post('/institutional-page/publish');
    };

    const effectiveLogoUrl = form.data.remove_logo
        ? null
        : logoPreview || form.data.logo_url;

    const Preview = ({
        content,
        isDraft = false,
    }: {
        content: Content;
        isDraft?: boolean;
    }) => {
        const logo = isDraft
            ? effectiveLogoUrl
            : content.logo_url;

        return (
            <article className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <header className="border-b bg-muted/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Eye className="size-3.5" />
                            {isDraft ? 'Prévia do rascunho em edição' : 'Versão pública atual'}
                        </span>
                        {isDraft && (
                            <Badge variant="outline" className="text-xs">
                                Em edição
                            </Badge>
                        )}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                        {logo ? (
                            <img
                                src={logo}
                                alt="Logo da prévia"
                                className="size-12 rounded object-contain border bg-white p-1"
                            />
                        ) : (
                            <div className="flex size-12 items-center justify-center rounded border border-dashed bg-muted text-xs font-semibold text-muted-foreground">
                                Sem logo
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold leading-tight">
                                {content.name || 'Nome do motoclube'}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Identidade visual da landing page
                            </p>
                        </div>
                    </div>
                </header>

                <div className="divide-y p-4 space-y-4">
                    {content.sections
                        .filter((s) => s.enabled)
                        .sort((a, b) => a.position - b.position)
                        .map((section) => {
                            const config = sectionConfig[section.key];
                            const sectionImg = isDraft
                                ? section.remove_image
                                    ? null
                                    : sectionPreviews[section.key] || section.image_url
                                : section.image_url;

                            return (
                                <section
                                    key={section.key}
                                    className="pt-4 first:pt-0 space-y-2.5"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold text-sm">
                                            {section.title || config?.label || section.key}
                                        </h3>
                                        <Badge variant="secondary" className="text-[10px]">
                                            {config?.label.split(' ')[0] || section.key}
                                        </Badge>
                                    </div>

                                    {sectionImg && (
                                        <div className="overflow-hidden rounded-md border">
                                            <img
                                                src={sectionImg}
                                                alt={`Foto da seção ${section.title}`}
                                                className="max-h-40 w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <p className="whitespace-pre-line text-xs text-muted-foreground leading-relaxed">
                                        {section.body}
                                    </p>

                                    {section.cta_label && section.cta_url && (
                                        <div className="pt-1">
                                            <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                                {section.cta_label}
                                                <ArrowUpRight className="size-3" />
                                            </span>
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                </div>
            </article>
        );
    };

    return (
        <main className="space-y-6 p-6 max-w-7xl mx-auto">
            <Head title="Página institucional" />

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Identidade Visual & Landing Page
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Personalize fotos, textos, logo e seções da página pública institucional.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Globe className="size-4" />
                        Ver página pública
                        <ArrowUpRight className="size-3.5" />
                    </a>
                </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                    {draft ? (
                        <p className="font-medium text-amber-700 dark:text-amber-400">
                            Há alterações em rascunho salvas em{' '}
                            {draftSavedAt
                                ? new Date(draftSavedAt).toLocaleString()
                                : 'data recente'}
                            {draftSavedBy ? ` por ${draftSavedBy}` : ''}.
                        </p>
                    ) : (
                        <p className="text-muted-foreground">
                            Sem alterações em rascunho pendentes. Conteúdo publicado
                            {publishedAt
                                ? ` em ${new Date(publishedAt).toLocaleString()}`
                                : ' (padrão do sistema)'}
                            {publishedBy ? ` por ${publishedBy}` : ''}.
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Edite os dados abaixo e salve como rascunho. Quando estiver pronto, selecione Publicar.
                    </p>
                </div>

                {canEdit && (
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="default"
                            disabled={form.processing}
                            onClick={save}
                        >
                            Salvar rascunho
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={form.processing || !draft}
                            onClick={publish}
                        >
                            <CheckCircle2 className="mr-1.5 size-4" />
                            Publicar
                        </Button>
                    </div>
                )}
            </div>

            {form.recentlySuccessful && (
                <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 p-3 text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    Alteração salva com sucesso!
                </div>
            )}

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(22rem,1.1fr)]">
                <form
                    onSubmit={save}
                    className="space-y-6"
                    aria-label="Editar página institucional"
                >
                    <fieldset disabled={!canEdit} className="space-y-6 disabled:opacity-75">
                        {/* Bloco Identidade da Marca */}
                        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-5">
                            <div className="flex items-center gap-2 border-b pb-3">
                                <Sparkles className="size-5 text-primary" />
                                <div>
                                    <h2 className="font-semibold text-base leading-tight">
                                        Identidade da Marca
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Nome e logotipo exibidos no cabeçalho, rodapé e em todo o sistema.
                                    </p>
                                </div>
                            </div>

                            <label className="grid gap-2 text-sm font-medium">
                                Nome institucional do motoclube
                                <Input
                                    required
                                    maxLength={120}
                                    value={form.data.name}
                                    placeholder="Ex: Rota Livre Motoclube"
                                    onChange={(e) => form.setData('name', e.target.value)}
                                />
                                {form.errors.name && (
                                    <span className="text-xs text-destructive">
                                        {form.errors.name}
                                    </span>
                                )}
                            </label>

                            <div className="grid gap-3 text-sm">
                                <span className="font-medium">Logotipo do motoclube</span>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-dashed p-4 bg-muted/20">
                                    {effectiveLogoUrl ? (
                                        <div className="relative group size-24 shrink-0 rounded-lg border bg-white p-2 flex items-center justify-center shadow-sm">
                                            <img
                                                src={effectiveLogoUrl}
                                                alt="Prévia do logotipo"
                                                className="size-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="size-24 shrink-0 rounded-lg border border-dashed flex flex-col items-center justify-center text-muted-foreground gap-1 bg-muted/40">
                                            <ImageIcon className="size-7" />
                                            <span className="text-[10px]">Sem logo</span>
                                        </div>
                                    )}

                                    <div className="space-y-2 flex-1">
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-medium shadow-sm hover:bg-muted transition-colors">
                                            <Upload className="size-3.5" />
                                            Trocar / Enviar novo logo
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                className="sr-only"
                                                onChange={(e) =>
                                                    handleLogoChange(e.target.files?.[0] ?? null)
                                                }
                                            />
                                        </label>

                                        {effectiveLogoUrl && (
                                            <div>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1.5 text-xs text-destructive hover:underline"
                                                    onClick={handleRemoveLogo}
                                                >
                                                    <Trash2 className="size-3" />
                                                    Remover logotipo
                                                </button>
                                            </div>
                                        )}

                                        {form.data.remove_logo && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                                    Logo marcado para remoção ao salvar.
                                                </span>
                                                <button
                                                    type="button"
                                                    className="text-xs text-primary underline"
                                                    onClick={handleRestoreLogo}
                                                >
                                                    Desfazer
                                                </button>
                                            </div>
                                        )}

                                        <p className="text-[11px] text-muted-foreground">
                                            Formatos aceitos: PNG, JPG, JPEG ou WEBP (máx. 5MB). Fundo transparente recomendado.
                                        </p>
                                    </div>
                                </div>
                                {form.errors.logo && (
                                    <span className="text-xs text-destructive">
                                        {form.errors.logo}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Seções de Conteúdo e Fotos */}
                        <div className="space-y-5">
                            <div className="border-b pb-2">
                                <h2 className="font-semibold text-base leading-tight">
                                    Fotos & Textos das Seções
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Gerencie fotos ilustrativas, títulos, descrições e botões de chamada de cada bloco da landing page.
                                </p>
                            </div>

                            {form.data.sections.map((section, index) => {
                                const config = sectionConfig[section.key] || {
                                    label: section.key,
                                    photoTip: 'Imagem da seção.',
                                    textTip: 'Texto da seção.',
                                };
                                const effectiveSectionImg = section.remove_image
                                    ? null
                                    : sectionPreviews[section.key] || section.image_url;

                                return (
                                    <fieldset
                                        key={section.key}
                                        className="space-y-4 rounded-xl border bg-card p-5 shadow-sm"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                                            <div className="flex items-center gap-2">
                                                <legend className="font-semibold text-sm">
                                                    {config.label}
                                                </legend>
                                            </div>
                                            <label className="flex items-center gap-2 text-xs cursor-pointer font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={section.enabled}
                                                    className="rounded border-input text-primary focus:ring-primary size-4"
                                                    onChange={(e) =>
                                                        updateSection(index, {
                                                            enabled: e.target.checked,
                                                        })
                                                    }
                                                />
                                                Exibir seção na página
                                            </label>
                                        </div>

                                        <div className="grid gap-4">
                                            {/* Título */}
                                            <label className="grid gap-1.5 text-xs font-medium">
                                                Título da seção
                                                <Input
                                                    maxLength={160}
                                                    value={section.title}
                                                    placeholder="Título principal da seção"
                                                    onChange={(e) =>
                                                        updateSection(index, {
                                                            title: e.target.value,
                                                        })
                                                    }
                                                />
                                                {form.errors[
                                                    `sections.${index}.title` as keyof typeof form.errors
                                                ] && (
                                                    <span className="text-xs text-destructive">
                                                        {
                                                            form.errors[
                                                                `sections.${index}.title` as keyof typeof form.errors
                                                            ]
                                                        }
                                                    </span>
                                                )}
                                            </label>

                                            {/* Texto / Conteúdo */}
                                            <label className="grid gap-1.5 text-xs font-medium">
                                                <span>Texto da seção</span>
                                                <textarea
                                                    className="min-h-24 rounded-md border border-input bg-background p-3 text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    maxLength={5000}
                                                    value={section.body}
                                                    placeholder="Conteúdo descritivo da seção"
                                                    onChange={(e) =>
                                                        updateSection(index, {
                                                            body: e.target.value,
                                                        })
                                                    }
                                                />
                                                <span className="text-[11px] text-muted-foreground">
                                                    {config.textTip}
                                                </span>
                                            </label>

                                            {/* Foto da Seção */}
                                            <div className="grid gap-2 text-xs font-medium">
                                                <span>Foto da seção</span>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-dashed p-3 bg-muted/10">
                                                    {effectiveSectionImg ? (
                                                        <div className="relative group max-h-32 w-48 shrink-0 overflow-hidden rounded-md border bg-black/5">
                                                            <img
                                                                src={effectiveSectionImg}
                                                                alt={`Prévia da imagem da seção ${section.title}`}
                                                                className="h-32 w-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-24 w-36 shrink-0 rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground gap-1 bg-muted/30">
                                                            <Camera className="size-6" />
                                                            <span className="text-[10px]">Sem foto personalizada</span>
                                                        </div>
                                                    )}

                                                    <div className="space-y-2 flex-1">
                                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-muted transition-colors">
                                                            <Upload className="size-3.5" />
                                                            {effectiveSectionImg ? 'Trocar foto' : 'Enviar foto'}
                                                            <input
                                                                type="file"
                                                                accept="image/png,image/jpeg,image/webp"
                                                                className="sr-only"
                                                                onChange={(e) =>
                                                                    handleSectionImageChange(
                                                                        index,
                                                                        section.key,
                                                                        e.target.files?.[0] ?? null,
                                                                    )
                                                                }
                                                            />
                                                        </label>

                                                        {effectiveSectionImg && (
                                                            <div>
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                                                                    onClick={() =>
                                                                        handleRemoveSectionImage(
                                                                            index,
                                                                            section.key,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="size-3" />
                                                                    Remover foto
                                                                </button>
                                                            </div>
                                                        )}

                                                        {section.remove_image && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                                                    Foto marcada para remoção ao salvar.
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="text-xs text-primary underline"
                                                                    onClick={() =>
                                                                        handleRestoreSectionImage(index)
                                                                    }
                                                                >
                                                                    Desfazer
                                                                </button>
                                                            </div>
                                                        )}

                                                        <p className="text-[11px] text-muted-foreground">
                                                            {config.photoTip} (PNG, JPG, WEBP até 5MB).
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botão de ação (CTA) */}
                                            <div className="grid gap-3 sm:grid-cols-2 pt-1">
                                                <label className="grid gap-1 text-xs">
                                                    <span>Texto do botão de ação</span>
                                                    <Input
                                                        maxLength={80}
                                                        value={section.cta_label ?? ''}
                                                        placeholder="Ex: Saiba mais"
                                                        onChange={(e) =>
                                                            updateSection(index, {
                                                                cta_label: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </label>
                                                <label className="grid gap-1 text-xs">
                                                    <span>Link do botão (URL HTTPS ou /#secao)</span>
                                                    <Input
                                                        value={section.cta_url ?? ''}
                                                        placeholder="Ex: /#about ou https://..."
                                                        onChange={(e) =>
                                                            updateSection(index, {
                                                                cta_url: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </label>
                                            </div>

                                            {/* Ordem de exibição */}
                                            <div className="pt-1">
                                                <label className="inline-flex items-center gap-2 text-xs">
                                                    <span>Posição / Ordem:</span>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        className="w-20 h-8 text-xs"
                                                        value={section.position}
                                                        onChange={(e) =>
                                                            updateSection(index, {
                                                                position: Number(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                );
                            })}
                        </div>
                    </fieldset>

                    {canEdit && (
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button type="submit" disabled={form.processing}>
                                Salvar rascunho
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={form.processing || !draft}
                                onClick={publish}
                            >
                                <CheckCircle2 className="mr-1.5 size-4" />
                                Publicar na landing page
                            </Button>
                        </div>
                    )}

                    {Object.entries(form.errors)
                        .filter(([key]) => key !== 'name' && key !== 'logo')
                        .map(([key, message]) => (
                            <p
                                key={key}
                                role="alert"
                                className="text-xs text-destructive bg-destructive/10 p-2 rounded"
                            >
                                {key}: {message}
                            </p>
                        ))}
                </form>

                {/* Painel lateral de prévia em tempo real */}
                <div className="space-y-6">
                    <div className="sticky top-6 space-y-5">
                        <Preview
                            content={{
                                ...form.data,
                                sections: [...form.data.sections],
                            }}
                            isDraft={true}
                        />

                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Conteúdo publicado no ar
                            </p>
                            <Preview content={published} isDraft={false} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

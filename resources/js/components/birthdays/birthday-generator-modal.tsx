import React, { useEffect, useRef, useState } from 'react';
import { Download, Share2, Sparkles, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { renderBirthdayPost } from '@/components/birthdays/canvas-renderer';
import PhotoTransformControls from '@/components/birthdays/photo-transform-controls';
import BirthdayCaptionBox from '@/components/birthdays/birthday-caption-box';
import {
    POST_FORMATS,
    POST_THEMES,
    type BirthdayMember,
    type PostFormat,
    type PostGeneratorConfig,
    type PostThemeId,
} from '@/types/birthdays';

interface BirthdayGeneratorModalProps {
    member: BirthdayMember | null;
    open: boolean;
    onClose: () => void;
}

export default function BirthdayGeneratorModal({
    member,
    open,
    onClose,
}: BirthdayGeneratorModalProps) {
    if (!member) return null;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [format, setFormat] = useState<PostFormat>('feed_square');
    const [theme, setTheme] = useState<PostThemeId>('dark_gold');
    const [zoom, setZoom] = useState(1.0);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);
    const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
    const [showNickname, setShowNickname] = useState(true);
    const [showRegional, setShowRegional] = useState(true);
    const [isRendering, setIsRendering] = useState(false);
    const [canShare, setCanShare] = useState(false);

    // Initial check for mobile Web Share API with file support
    useEffect(() => {
        if (typeof navigator !== 'undefined' && 'canShare' in navigator) {
            setCanShare(true);
        }
    }, []);

    // Active photo URL: custom uploaded photo or member's avatar
    const activePhotoUrl = customPhotoUrl ?? member.avatar_url;

    // Reset customizations when member changes
    useEffect(() => {
        setZoom(1.0);
        setPanX(0);
        setPanY(0);
        setCustomPhotoUrl(null);
        setShowNickname(true);
        setShowRegional(true);
    }, [member.id]);

    // Redraw canvas whenever config parameters change
    useEffect(() => {
        if (!open || !canvasRef.current) return;

        const config: PostGeneratorConfig = {
            member,
            format,
            theme,
            photoUrl: activePhotoUrl,
            zoom,
            panX,
            panY,
            headline: 'FELIZ ANIVERSÁRIO',
            subheadline: 'Muitos quilômetros de vida, saúde e irmandade na estrada!',
            showNickname,
            showRegional,
            showAge: false,
        };

        setIsRendering(true);
        renderBirthdayPost(canvasRef.current, config).finally(() => {
            setIsRendering(false);
        });
    }, [open, member, format, theme, activePhotoUrl, zoom, panX, panY, showNickname, showRegional]);

    const handleCustomPhotoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                setCustomPhotoUrl(e.target.result);
                setZoom(1.0);
                setPanX(0);
                setPanY(0);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleResetTransform = () => {
        setZoom(1.0);
        setPanX(0);
        setPanY(0);
        setCustomPhotoUrl(null);
    };

    const handleDownload = (mimeType: 'image/png' | 'image/jpeg' = 'image/png') => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ext = mimeType === 'image/jpeg' ? 'jpg' : 'png';
        const cleanName = (member.road_nickname || member.name)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-');
        const filename = `aniversario-${cleanName}-${format}.${ext}`;

        const dataUrl = canvas.toDataURL(mimeType, 0.95);
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShareMobile = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !navigator.share) return;

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], `aniversario-${member.name}.png`, { type: 'image/png' });

            try {
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `Feliz Aniversário ${member.name}!`,
                        text: `Parabéns ao nosso irmão ${member.name}! 🏍️🎂`,
                    });
                } else {
                    handleDownload();
                }
            } catch (err) {
                console.warn('Compartilhamento cancelado ou não suportado', err);
            }
        }, 'image/png');
    };

    const currentFormatConfig = POST_FORMATS[format];

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-0 sm:max-h-[90vh]">
                <DialogHeader className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            Gerador de Post Instagram • {member.name}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12">
                    {/* Left side: Canvas Preview */}
                    <div className="flex flex-col items-center lg:col-span-6 xl:col-span-7">
                        {/* Format selector tabs */}
                        <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900 mb-4">
                            {(Object.keys(POST_FORMATS) as PostFormat[]).map((fmt) => (
                                <button
                                    key={fmt}
                                    type="button"
                                    onClick={() => setFormat(fmt)}
                                    className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                        format === fmt
                                            ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100'
                                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    {POST_FORMATS[fmt].label}
                                </button>
                            ))}
                        </div>

                        {/* Interactive Canvas container */}
                        <div className="relative flex w-full max-w-[420px] items-center justify-center overflow-hidden rounded-xl border border-neutral-300 bg-neutral-950 shadow-lg dark:border-neutral-700">
                            <canvas
                                ref={canvasRef}
                                style={{
                                    width: '100%',
                                    aspectRatio: currentFormatConfig.aspectRatio,
                                    display: 'block',
                                }}
                                className="object-contain"
                            />
                            {isRendering && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white">
                                    Renderizando arte...
                                </div>
                            )}
                        </div>

                        <p className="mt-2 text-center text-[11px] text-neutral-500 dark:text-neutral-400">
                            Resolução nativa de exportação: {currentFormatConfig.width}x{currentFormatConfig.height}px (Alta Definição)
                        </p>
                    </div>

                    {/* Right side: Controls & Actions */}
                    <div className="flex flex-col space-y-5 lg:col-span-6 xl:col-span-5">
                        {/* Themes Selection */}
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                                Tema Visual do Clube
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                                {(Object.keys(POST_THEMES) as PostThemeId[]).map((themeKey) => {
                                    const t = POST_THEMES[themeKey];
                                    const isSelected = theme === themeKey;
                                    return (
                                        <button
                                            key={themeKey}
                                            type="button"
                                            onClick={() => setTheme(themeKey)}
                                            className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center text-xs transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'border-neutral-950 bg-neutral-100 font-bold ring-2 ring-neutral-950 dark:border-neutral-100 dark:bg-neutral-800 dark:ring-neutral-100'
                                                    : 'border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'
                                            }`}
                                        >
                                            <span
                                                className="h-3 w-3 rounded-full mb-1.5"
                                                style={{ backgroundColor: t.accentColor }}
                                            />
                                            <span className="truncate w-full">{t.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Photo adjust controls */}
                        <PhotoTransformControls
                            zoom={zoom}
                            panX={panX}
                            panY={panY}
                            onZoomChange={setZoom}
                            onPanChange={(x, y) => {
                                setPanX(x);
                                setPanY(y);
                            }}
                            onPhotoUpload={handleCustomPhotoUpload}
                            onReset={handleResetTransform}
                            hasCustomPhoto={Boolean(customPhotoUrl)}
                        />

                        {/* Caption generator with copy button */}
                        <BirthdayCaptionBox member={member} />

                        {/* Download & Share Actions */}
                        <div className="space-y-2 pt-2">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => handleDownload('image/png')}
                                    className="flex-1 gap-2 cursor-pointer font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
                                >
                                    <Download className="h-4 w-4" />
                                    Baixar Imagem (PNG)
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDownload('image/jpeg')}
                                    className="cursor-pointer text-xs"
                                    title="Baixar em JPEG comprimido"
                                >
                                    JPEG
                                </Button>
                            </div>

                            {canShare && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleShareMobile}
                                    className="w-full gap-2 cursor-pointer font-semibold"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Compartilhar no Celular
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import React, { useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Image as ImageIcon, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoTransformControlsProps {
    zoom: number;
    panX: number;
    panY: number;
    onZoomChange: (newZoom: number) => void;
    onPanChange: (panX: number, panY: number) => void;
    onPhotoUpload: (file: File) => void;
    onReset: () => void;
    hasCustomPhoto: boolean;
}

export default function PhotoTransformControls({
    zoom,
    panX,
    panY,
    onZoomChange,
    onPanChange,
    onPhotoUpload,
    onReset,
    hasCustomPhoto,
}: PhotoTransformControlsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onPhotoUpload(file);
        }
    };

    return (
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Ajuste da Foto do Integrante
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="h-7 gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                    <RotateCcw className="h-3 w-3" />
                    Redefinir
                </Button>
            </div>

            {/* Zoom Slider */}
            <div>
                <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1.5">
                    <span className="flex items-center gap-1">
                        <ZoomIn className="h-3.5 w-3.5" />
                        Escala / Zoom
                    </span>
                    <span className="font-mono">{zoom.toFixed(2)}x</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
                        className="rounded p-1 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        title="Diminuir zoom"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </button>
                    <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-neutral-900 dark:bg-neutral-700 dark:accent-neutral-100"
                    />
                    <button
                        type="button"
                        onClick={() => onZoomChange(Math.min(2.5, zoom + 0.1))}
                        className="rounded p-1 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        title="Aumentar zoom"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Pan Directional Controls */}
            <div>
                <span className="block text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                    Enquadramento / Deslocamento
                </span>
                <div className="flex items-center justify-center gap-1.5">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => onPanChange(panX - 15, panY)}
                        className="h-7 w-7"
                        title="Mover para esquerda"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                    <div className="flex flex-col gap-1.5">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => onPanChange(panX, panY - 15)}
                            className="h-7 w-7"
                            title="Mover para cima"
                        >
                            <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => onPanChange(panX, panY + 15)}
                            className="h-7 w-7"
                            title="Mover para baixo"
                        >
                            <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => onPanChange(panX + 15, panY)}
                        className="h-7 w-7"
                        title="Mover para direita"
                    >
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Custom Photo Upload */}
            <div className="pt-1 border-t border-neutral-200 dark:border-neutral-800">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full gap-2 text-xs cursor-pointer"
                >
                    <ImageIcon className="h-3.5 w-3.5" />
                    {hasCustomPhoto ? 'Trocar Foto Utilizada' : 'Usar Outra Foto'}
                </Button>
            </div>
        </div>
    );
}

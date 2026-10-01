import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { PostMedia } from '@/types/feed';

export default function PostGallery({ media }: { media: PostMedia[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!media || media.length === 0) return null;

    const count = media.length;

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex - 1 + count) % count);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + 1) % count);
    };

    return (
        <div className="mt-3">
            {count === 1 && (
                <div
                    className="relative max-h-120 cursor-pointer overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
                    onClick={() => setSelectedIndex(0)}
                >
                    <img
                        src={media[0].url}
                        alt="Foto da publicação"
                        className="h-full w-full object-cover max-h-120"
                        loading="lazy"
                    />
                </div>
            )}

            {count === 2 && (
                <div className="grid grid-cols-2 gap-2">
                    {media.map((item, idx) => (
                        <div
                            key={item.id}
                            className="relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
                            onClick={() => setSelectedIndex(idx)}
                        >
                            <img
                                src={item.url}
                                alt={`Foto ${idx + 1}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            )}

            {count === 3 && (
                <div className="grid grid-cols-2 gap-2">
                    <div
                        className="relative row-span-2 aspect-square sm:aspect-auto cursor-pointer overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
                        onClick={() => setSelectedIndex(0)}
                    >
                        <img
                            src={media[0].url}
                            alt="Foto 1"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        {media.slice(1, 3).map((item, idx) => (
                            <div
                                key={item.id}
                                className="relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
                                onClick={() => setSelectedIndex(idx + 1)}
                            >
                                <img
                                    src={item.url}
                                    alt={`Foto ${idx + 2}`}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {count >= 4 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {media.slice(0, 4).map((item, idx) => {
                        const isFourthAndMore = idx === 3 && count > 4;
                        return (
                            <div
                                key={item.id}
                                className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
                                onClick={() => setSelectedIndex(idx)}
                            >
                                <img
                                    src={item.url}
                                    alt={`Foto ${idx + 1}`}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                                {isFourthAndMore && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold text-white">
                                        +{count - 3}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal / Lightbox */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setSelectedIndex(null)}
                >
                    <button
                        type="button"
                        onClick={() => setSelectedIndex(null)}
                        className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                        title="Fechar visualização"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {count > 1 && (
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="absolute left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                            title="Foto anterior"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}

                    <div
                        className="max-h-[85vh] max-w-[90vw] overflow-hidden rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={media[selectedIndex].url}
                            alt={`Visualização ${selectedIndex + 1}`}
                            className="max-h-[85vh] max-w-[90vw] object-contain"
                        />
                        <div className="mt-2 text-center text-sm text-neutral-400">
                            {selectedIndex + 1} de {count}
                        </div>
                    </div>

                    {count > 1 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="absolute right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                            title="Próxima foto"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

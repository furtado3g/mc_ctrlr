import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BirthdayMember } from '@/types/birthdays';

interface BirthdayCaptionBoxProps {
    member: BirthdayMember;
}

export default function BirthdayCaptionBox({ member }: BirthdayCaptionBoxProps) {
    const [copied, setCopied] = useState(false);

    const nicknamePart = member.road_nickname ? ` "${member.road_nickname}"` : '';
    const regionalPart = member.regional_name ? ` da Regional ${member.regional_name}` : '';
    const regionalTag = member.regional_name
        ? `#${member.regional_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`
        : '';

    const caption = `🎂🎈 PARABÉNS, IRMÃO DE ESTRADA! 🏍️💨

Hoje o dia é de comemoração! Desejamos um feliz aniversário ao nosso integrante ${member.name}${nicknamePart}${regionalPart}!

Que os caminhos continuem abertos, com muita saúde, paz, proteção no asfalto e irmandade nos quilômetros pela frente! 👊🏼⚡

Deixe nos comentários os seus votos para o nosso irmão! 👇

#aniversario #motoclube #irmaosdeestrada #motociclismo #liberdade ${regionalTag} #duasrodas`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(caption);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (e) {
            console.error('Falha ao copiar legenda', e);
        }
    };

    return (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Sugestão de Legenda (Instagram)
                </span>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                            Copiado!
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Legenda
                        </>
                    )}
                </Button>
            </div>

            <div className="mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-xs text-neutral-700 shadow-inner dark:bg-neutral-950 dark:text-neutral-300">
                {caption}
            </div>
        </div>
    );
}

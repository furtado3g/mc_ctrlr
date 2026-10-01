import React from 'react';
import { Calendar, Cake, MapPin, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import type { BirthdayMember } from '@/types/birthdays';

interface BirthdayCardProps {
    member: BirthdayMember;
    onGenerate: (member: BirthdayMember) => void;
}

export default function BirthdayCard({ member, onGenerate }: BirthdayCardProps) {
    const getInitials = useInitials();

    return (
        <div className={`relative flex flex-col justify-between rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
            member.is_today
                ? 'border-amber-400/60 bg-amber-500/5 ring-1 ring-amber-400/30 dark:border-amber-500/40 dark:bg-amber-500/10'
                : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
        }`}>
            {/* Top header badge */}
            <div className="flex items-center justify-between gap-2">
                {member.is_today ? (
                    <Badge variant="default" className="bg-amber-500 text-white hover:bg-amber-600 gap-1.5 font-semibold text-xs">
                        <Cake className="h-3.5 w-3.5" />
                        Aniversário Hoje!
                    </Badge>
                ) : (
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {member.days_until === 1 ? 'Amanhã' : `Em ${member.days_until} dias`}
                    </span>
                )}

                {member.turning_age && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        {member.turning_age} anos
                    </span>
                )}
            </div>

            {/* Member info */}
            <div className="my-4 flex items-center gap-3.5">
                <Avatar className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700">
                    <AvatarImage src={member.avatar_url ?? undefined} alt={member.name} />
                    <AvatarFallback className="bg-neutral-100 font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 text-base">
                        {getInitials(member.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <h3 className="truncate font-semibold text-neutral-900 dark:text-neutral-100 text-base" title={member.name}>
                        {member.name}
                    </h3>

                    {member.road_nickname && (
                        <p className="truncate text-xs font-semibold text-amber-600 dark:text-amber-400">
                            "{member.road_nickname}"
                        </p>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        {member.regional_name && (
                            <span className="flex items-center gap-0.5 truncate">
                                <MapPin className="h-3 w-3" />
                                {member.regional_name}
                            </span>
                        )}
                        <span>•</span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {member.birth_day_month}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action button */}
            <Button
                type="button"
                onClick={() => onGenerate(member)}
                className="w-full gap-2 cursor-pointer font-medium bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
                <Sparkles className="h-4 w-4 text-amber-400" />
                Gerar Post Instagram
            </Button>
        </div>
    );
}

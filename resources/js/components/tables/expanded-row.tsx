import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

type Props = {
    id: string;
    label: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
};

export function ExpandedRow({ id, label, open, onOpenChange, children }: Props) {
    return (
        <Collapsible open={open} onOpenChange={onOpenChange}>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" aria-expanded={open} aria-controls={id + '-details'} aria-label={(open ? 'Recolher' : 'Expandir') + ' detalhes de ' + label}>
                    {open ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
                    <span className="sr-only">{open ? 'Recolher detalhes' : 'Expandir detalhes'}</span>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent id={id + '-details'} className="space-y-2 px-4 py-3 md:hidden">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

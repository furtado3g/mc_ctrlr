import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    processing?: boolean;
    children: ReactNode;
    processingLabel?: string;
};

export function FormSubmit({ processing = false, children, processingLabel = 'Salvando…', disabled, ...props }: Props) {
    return (
        <Button type="submit" disabled={disabled || processing} aria-busy={processing} {...props}>
            {processing ? <><Spinner className="mr-2 size-4" />{processingLabel}</> : children}
        </Button>
    );
}

import { Children, cloneElement, isValidElement } from 'react';
import type { HTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

type Props = {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function FormField({ id, label, required = false, error, hint, children, ...props }: Props) {
    const describedBy = [hint ? id + '-hint' : null, error ? id + '-error' : null].filter(Boolean).join(' ') || undefined;
    const linkedChildren = Children.map(children, child => {
        if (!isValidElement(child)) return child;
        const element = child as ReactElement<{ 'aria-describedby'?: string; 'aria-invalid'?: boolean }>;
        const existing = element.props['aria-describedby'];
        const ariaDescribedBy = [existing, describedBy].filter(Boolean).join(' ') || undefined;
        return cloneElement(element, {
            'aria-describedby': ariaDescribedBy,
            'aria-invalid': error ? true : element.props['aria-invalid'],
        });
    });

    return (
        <div className="grid gap-1.5" {...props}>
            <Label htmlFor={id}>
                {label}
                {required && <span aria-hidden="true" className="ml-1 text-destructive">*</span>}
            </Label>
            {linkedChildren}
            {hint && <p id={id + '-hint'} className="text-xs text-muted-foreground">{hint}</p>}
            <InputError id={id + '-error'} message={error} aria-live="polite" />
        </div>
    );
}

export function RequiredFieldNote() {
    return <p className="text-xs text-muted-foreground"><span className="text-destructive">*</span> Campo obrigatório</p>;
}

export function FieldInput({ id, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string }) {
    return <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? id + '-error' : undefined} {...props} />;
}

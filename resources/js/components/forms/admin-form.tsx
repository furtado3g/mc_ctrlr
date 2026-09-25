import type { FormEvent, ReactNode } from 'react';
import type { InertiaForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormErrorSummary } from '@/components/forms/form-error-summary';
import { FormSubmit } from '@/components/forms/form-submit';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';

type Props<Values extends Record<string, any>> = {
    form: InertiaForm<Values>;
    children: ReactNode;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
    processingLabel?: string;
    draftRestored?: boolean;
    connectionError?: string | null;
    successMessage?: string | null;
    onDiscardDraft?: () => void;
    className?: string;
};

export function AdminForm<Values extends Record<string, any>>({
    form,
    children,
    onSubmit,
    submitLabel,
    processingLabel,
    draftRestored = false,
    connectionError,
    successMessage,
    onDiscardDraft,
    className = 'grid gap-4',
}: Props<Values>) {
    useUnsavedChanges(form.isDirty, form.processing);

    return (
        <form className={className} onSubmit={onSubmit} noValidate>
            <FormErrorSummary errors={form.errors as Record<string, string | string[]>} />
            {draftRestored && (
                <Alert>
                    <AlertTitle>Rascunho recuperado</AlertTitle>
                    <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
                        <span>Os dados não salvos desta sessão foram recuperados.</span>
                        {onDiscardDraft && <Button type="button" variant="outline" size="sm" onClick={onDiscardDraft}>Descartar rascunho</Button>}
                    </AlertDescription>
                </Alert>
            )}
            {connectionError && <Alert variant="destructive" role="alert"><AlertTitle>Falha de conexão</AlertTitle><AlertDescription>{connectionError}</AlertDescription></Alert>}
            {successMessage && <p role="status" aria-live="polite" className="text-sm text-green-700">{successMessage}</p>}
            {form.recentlySuccessful && <p role="status" aria-live="polite" className="text-sm text-green-700">Alterações salvas.</p>}
            {children}
            <div className="flex flex-wrap items-center gap-2">
                <FormSubmit processing={form.processing} processingLabel={processingLabel}>{submitLabel}</FormSubmit>
            </div>
        </form>
    );
}

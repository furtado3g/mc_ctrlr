import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function FormErrorSummary({ errors }: { errors: Record<string, string | string[]> }) {
    const messages = Object.values(errors).flatMap((error) => Array.isArray(error) ? error : [error]);
    if (!messages.length) return null;

    return (
        <Alert variant="destructive" role="alert" aria-live="assertive">
            <AlertTitle>Revise os campos indicados</AlertTitle>
            <AlertDescription>
                <ul className="list-inside list-disc">
                    {[...new Set(messages)].map((message) => <li key={message}>{message}</li>)}
                </ul>
            </AlertDescription>
        </Alert>
    );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import type { FormDataType, UseFormSubmitOptions } from '@inertiajs/core';

const PREFIX = 'mc-ctrlr:form-draft:v1:';
const ACTIVE_SCOPE_KEY = 'mc-ctrlr:active-draft-scope';
const VERSION = 1;
const EXCLUDED_FIELD =
    /(password|secret|token|credential|passkey|file|receipt|confirm|cpf|birth_date|postal_code|address|phone|emergency_contact|companion)/i;

type DraftEnvelope<Values> = {
    version: number;
    savedAt: number;
    values: Values;
};

type Options<Values extends FormDataType<Values> & Record<string, unknown>> = {
    scope: string | null | undefined;
    formKey: string;
    recordKey: string | number;
    initialValues: Values;
};

function storageAvailable(): boolean {
    try {
        return (
            typeof window !== 'undefined' &&
            typeof window.sessionStorage !== 'undefined'
        );
    } catch {
        return false;
    }
}

function removeDraftsOutsideScope(scope: string | null): void {
    if (!storageAvailable()) return;
    try {
        const storage = window.sessionStorage;
        const currentPrefix = scope
            ? PREFIX + encodeURIComponent(scope) + ':'
            : null;
        for (let index = storage.length - 1; index >= 0; index -= 1) {
            const key = storage.key(index);
            if (
                key?.startsWith(PREFIX) &&
                (!currentPrefix || !key.startsWith(currentPrefix))
            )
                storage.removeItem(key);
        }
        if (scope) storage.setItem(ACTIVE_SCOPE_KEY, scope);
        else storage.removeItem(ACTIVE_SCOPE_KEY);
    } catch {
        // Private browsing and storage quotas can disable sessionStorage operations.
    }
}

export function clearSessionDrafts(): void {
    removeDraftsOutsideScope(null);
}

function sanitizeValues<Values extends Record<string, unknown>>(
    values: Values,
): Values {
    const sanitize = (value: unknown, key = ''): unknown => {
        if (
            EXCLUDED_FIELD.test(key) ||
            (typeof File !== 'undefined' && value instanceof File) ||
            (typeof Blob !== 'undefined' && value instanceof Blob)
        )
            return undefined;
        if (Array.isArray(value))
            return value
                .map((item) => sanitize(item))
                .filter((item) => item !== undefined);
        if (value && typeof value === 'object') {
            return Object.fromEntries(
                Object.entries(value).flatMap(([childKey, childValue]) => {
                    const safeValue = sanitize(childValue, childKey);
                    return safeValue === undefined
                        ? []
                        : [[childKey, safeValue]];
                }),
            );
        }
        return value;
    };

    return sanitize(values) as Values;
}

function buildKey(
    scope: string,
    formKey: string,
    recordKey: string | number,
): string {
    return (
        PREFIX +
        encodeURIComponent(scope) +
        ':' +
        encodeURIComponent(formKey) +
        ':' +
        encodeURIComponent(String(recordKey))
    );
}

function readDraft<Values extends Record<string, unknown>>(
    key: string,
): DraftEnvelope<Values> | null {
    if (!storageAvailable()) return null;
    try {
        const value = window.sessionStorage.getItem(key);
        if (!value) return null;
        const draft = JSON.parse(value) as DraftEnvelope<Values>;
        if (
            draft.version !== VERSION ||
            !draft.values ||
            typeof draft.values !== 'object'
        ) {
            window.sessionStorage.removeItem(key);
            return null;
        }
        return draft;
    } catch {
        try {
            window.sessionStorage.removeItem(key);
        } catch {
            /* Storage may be unavailable. */
        }
        return null;
    }
}

export function useSessionDraft<
    Values extends FormDataType<Values> & Record<string, unknown>,
>({ scope, formKey, recordKey, initialValues }: Options<Values>) {
    const storageKey = useMemo(
        () => (scope ? buildKey(scope, formKey, recordKey) : null),
        [scope, formKey, recordKey],
    );
    const [draftEnvelope] = useState(() => {
        removeDraftsOutsideScope(scope ?? null);
        return storageKey ? readDraft<Values>(storageKey) : null;
    });
    const initialValuesRef = useRef(initialValues);
    const [draftRestored, setDraftRestored] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const form = useForm<Values>(initialValuesRef.current);

    useEffect(() => {
        if (draftEnvelope) {
            form.setData({
                ...initialValuesRef.current,
                ...draftEnvelope.values,
            });
            setDraftRestored(true);
        }
        setInitialized(true);
        // Form identity and storage key are stable for the lifetime of this component.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    useEffect(() => {
        if (
            !initialized ||
            !storageKey ||
            !storageAvailable() ||
            !form.isDirty ||
            form.processing
        )
            return;
        const timeout = window.setTimeout(() => {
            try {
                window.sessionStorage.setItem(
                    storageKey,
                    JSON.stringify({
                        version: VERSION,
                        savedAt: Date.now(),
                        values: sanitizeValues(form.data),
                    } satisfies DraftEnvelope<Values>),
                );
            } catch {
                // Storage can be unavailable or full. Keep the active form usable.
            }
        }, 350);
        return () => window.clearTimeout(timeout);
    }, [form.data, form.isDirty, form.processing, initialized, storageKey]);

    const clearDraft = useCallback(() => {
        if (storageKey && storageAvailable()) {
            try {
                window.sessionStorage.removeItem(storageKey);
            } catch {
                /* Storage may be unavailable. */
            }
        }
        setDraftRestored(false);
    }, [storageKey]);

    const discardDraft = useCallback(() => {
        clearDraft();
        form.reset();
        form.clearErrors();
    }, [clearDraft, form]);

    const submit = useCallback(
        (
            method: 'post' | 'put' | 'patch' | 'delete',
            url: string,
            options: UseFormSubmitOptions = {},
        ) => {
            const onSuccess = options.onSuccess;
            form.submit(method, url, {
                ...options,
                onStart: (visit) => {
                    setConnectionError(null);
                    options.onStart?.(visit);
                },
                onSuccess: (page) => {
                    clearDraft();
                    onSuccess?.(page);
                },
                onNetworkError: (error) => {
                    setConnectionError(
                        'Não foi possível conectar. Seus dados foram mantidos para nova tentativa.',
                    );
                    options.onNetworkError?.(error);
                },
            });
        },
        [clearDraft, form],
    );

    const saveDraft = useCallback(() => {
        if (storageKey && storageAvailable()) {
            try {
                window.sessionStorage.setItem(
                    storageKey,
                    JSON.stringify({
                        version: VERSION,
                        savedAt: Date.now(),
                        values: sanitizeValues(form.data),
                    } satisfies DraftEnvelope<Values>),
                );
                setDraftRestored(true);
            } catch {
                // Storage can be unavailable or full. Keep the active form usable.
            }
        }
    }, [form.data, storageKey]);

    return {
        form,
        draftRestored,
        connectionError,
        saveDraft,
        clearDraft,
        discardDraft,
        submit,
    };
}

export function clearDraftSessionOnNavigation(
    scope: string | null | undefined,
): void {
    removeDraftsOutsideScope(scope ?? null);
}

export function useSessionDraftCleanup(scope: string | null | undefined): void {
    useEffect(() => {
        clearDraftSessionOnNavigation(scope);
    }, [scope]);
}

import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

export function useUnsavedChanges(dirty: boolean, processing = false): void {
    const dirtyRef = useRef(dirty);
    const processingRef = useRef(processing);
    const approvedVisit = useRef(false);

    dirtyRef.current = dirty;
    processingRef.current = processing;

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!dirtyRef.current || processingRef.current) return;
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        const removeRouterListener = router.on('before', (event) => {
            if (!dirtyRef.current || processingRef.current) return;
            if (approvedVisit.current) {
                approvedVisit.current = false;
                return;
            }
            const shouldLeave = window.confirm('Há alterações não salvas. Deseja sair desta tela?');
            if (!shouldLeave) {
                event.preventDefault();
                return;
            }
            approvedVisit.current = true;
        });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            removeRouterListener();
        };
    }, []);
}

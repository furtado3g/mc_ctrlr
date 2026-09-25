import { router, usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';

type Role = { id: number; name: string };
type Assignment = {
    id: number;
    started_at: string;
    ended_at: string | null;
    club_role: Role;
};

export default function RoleHistory({
    memberId,
    roles,
    assignments,
    canEdit = true,
}: {
    memberId: number;
    roles: Role[];
    assignments: Assignment[];
    canEdit?: boolean;
}) {
    const { auth } = usePage().props as {
        auth: { draftScope?: string | null };
    };
    const draft = useSessionDraft<{ club_role_id: number; started_at: string }>(
        {
            scope: auth.draftScope,
            formKey: 'role-assignments:create',
            recordKey: memberId,
            initialValues: {
                club_role_id: roles[0]?.id ?? 0,
                started_at: new Date().toISOString().slice(0, 10),
            },
        },
    );
    const { form } = draft;
    return (
        <section className="space-y-3">
            <h2 className="text-xl font-semibold">Cargos</h2>
            {canEdit && (
                <AdminForm
                    form={form}
                    submitLabel="Atribuir"
                    draftRestored={draft.draftRestored}
                    connectionError={draft.connectionError}
                    onDiscardDraft={draft.discardDraft}
                    onSubmit={(e) => {
                        e.preventDefault();
                        draft.submit(
                            'post',
                            `/members/${memberId}/role-assignments`,
                        );
                    }}
                    className="flex flex-wrap items-end gap-3"
                >
                    <FormField
                        id={`member-role-${memberId}`}
                        label="Cargo"
                        required
                        error={form.errors.club_role_id}
                    >
                        <select
                            id={`member-role-${memberId}`}
                            className="rounded-md border bg-background p-2"
                            value={form.data.club_role_id}
                            onChange={(e) =>
                                form.setData(
                                    'club_role_id',
                                    Number(e.target.value),
                                )
                            }
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField
                        id={`member-role-start-${memberId}`}
                        label="Início do cargo"
                        required
                        error={form.errors.started_at}
                    >
                        <Input
                            id={`member-role-start-${memberId}`}
                            type="date"
                            value={form.data.started_at}
                            onChange={(e) =>
                                form.setData('started_at', e.target.value)
                            }
                        />
                    </FormField>
                </AdminForm>
            )}
            <ul>
                {assignments.map((item) => (
                    <li
                        className="flex flex-wrap items-center justify-between gap-2 border-b py-2"
                        key={item.id}
                    >
                        {item.club_role.name} · {item.started_at.slice(0, 10)}{' '}
                        {item.ended_at
                            ? `até ${item.ended_at.slice(0, 10)}`
                            : '(atual)'}{' '}
                        {canEdit && !item.ended_at && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    window.confirm('Encerrar este cargo?') &&
                                    router.patch(
                                        `/role-assignments/${item.id}`,
                                        {
                                            club_role_id: item.club_role.id,
                                            started_at: item.started_at.slice(
                                                0,
                                                10,
                                            ),
                                            ended_at: new Date()
                                                .toISOString()
                                                .slice(0, 10),
                                        },
                                    )
                                }
                            >
                                Encerrar
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

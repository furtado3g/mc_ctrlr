import { Head, router, useForm, usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import MotorcycleForm from '@/components/members/motorcycle-form';
import RoleHistory from '@/components/members/role-history';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';

type Link = {
    id: number;
    started_at: string;
    ended_at: string | null;
    motorcycle: {
        identifier: string | null;
        manufacturer: string;
        model: string;
        year: number | null;
    };
};
type Role = { id: number; name: string };
type Assignment = {
    id: number;
    started_at: string;
    ended_at: string | null;
    club_role: Role;
};
type Member = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    joined_at: string;
    status: string;
    left_at: string | null;
    cpf: string | null;
    birth_date: string | null;
    postal_code: string | null;
    address_line: string | null;
    address_number: string | null;
    address_complement: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    emergency_contact_name: string | null;
    emergency_contact_relationship: string | null;
    emergency_contact_phone: string | null;
    companion_name: string | null;
    companion_phone: string | null;
    motorcycle_links: Link[];
    role_assignments: Assignment[];
    user: { id: number; name: string; email: string; active: boolean } | null;
};
type MemberValues = {
    name: string;
    email: string;
    phone: string;
    joined_at: string;
    status: string;
    left_at: string;
    cpf: string;
    birth_date: string;
    postal_code: string;
    address_line: string;
    address_number: string;
    address_complement: string;
    neighborhood: string;
    city: string;
    state: string;
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_phone: string;
    companion_name: string;
    companion_phone: string;
};

export default function MemberShow({
    member,
    roles,
    canManageAccounts,
    canEditMembers,
}: {
    member: Member;
    roles: Role[];
    canManageAccounts: boolean;
    canEditMembers: boolean;
}) {
    const { auth } = usePage().props as {
        auth: { draftScope?: string | null };
    };
    const draft = useSessionDraft<MemberValues>({
        scope: auth.draftScope,
        formKey: 'members:edit',
        recordKey: member.id,
        initialValues: {
            name: member.name,
            email: member.email ?? '',
            phone: member.phone ?? '',
            joined_at: member.joined_at.slice(0, 10),
            status: member.status,
            left_at: member.left_at?.slice(0, 10) ?? '',
            cpf: member.cpf ?? '',
            birth_date: member.birth_date?.slice(0, 10) ?? '',
            postal_code: member.postal_code ?? '',
            address_line: member.address_line ?? '',
            address_number: member.address_number ?? '',
            address_complement: member.address_complement ?? '',
            neighborhood: member.neighborhood ?? '',
            city: member.city ?? '',
            state: member.state ?? '',
            emergency_contact_name: member.emergency_contact_name ?? '',
            emergency_contact_relationship:
                member.emergency_contact_relationship ?? '',
            emergency_contact_phone: member.emergency_contact_phone ?? '',
            companion_name: member.companion_name ?? '',
            companion_phone: member.companion_phone ?? '',
        },
    });
    const { form } = draft;
    const accountForm = useForm({
        name: member.name,
        email: member.email ?? '',
        password: '',
    });

    return (
        <div className="space-y-6 p-6">
            <Head title={member.name} />
            <h1 className="text-2xl font-semibold">{member.name}</h1>
            {canEditMembers ? (
                <AdminForm
                    form={form}
                    submitLabel="Salvar membro"
                    draftRestored={draft.draftRestored}
                    connectionError={draft.connectionError}
                    onDiscardDraft={draft.discardDraft}
                    onSubmit={(event) => {
                        event.preventDefault();
                        draft.submit('patch', '/members/' + member.id);
                    }}
                    className="grid gap-2 rounded-lg border p-4 md:grid-cols-3"
                >
                    <FormField
                        id="member-name"
                        label="Nome"
                        required
                        error={form.errors.name}
                    >
                        <Input
                            id="member-name"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                            aria-invalid={Boolean(form.errors.name)}
                        />
                    </FormField>
                    <FormField
                        id="member-email"
                        label="Email"
                        error={form.errors.email}
                    >
                        <Input
                            id="member-email"
                            type="email"
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            aria-invalid={Boolean(form.errors.email)}
                        />
                    </FormField>
                    <FormField
                        id="member-phone"
                        label="Telefone"
                        error={form.errors.phone}
                    >
                        <Input
                            id="member-phone"
                            value={form.data.phone}
                            onChange={(event) =>
                                form.setData('phone', event.target.value)
                            }
                            aria-invalid={Boolean(form.errors.phone)}
                        />
                    </FormField>
                    <FormField
                        id="member-cpf"
                        label="CPF"
                        error={form.errors.cpf}
                    >
                        <Input
                            id="member-cpf"
                            value={form.data.cpf}
                            maxLength={14}
                            onChange={(event) =>
                                form.setData('cpf', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-birth-date"
                        label="Data de nascimento"
                        error={form.errors.birth_date}
                    >
                        <Input
                            id="member-birth-date"
                            type="date"
                            value={form.data.birth_date}
                            onChange={(event) =>
                                form.setData('birth_date', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-postal-code"
                        label="CEP"
                        error={form.errors.postal_code}
                    >
                        <Input
                            id="member-postal-code"
                            value={form.data.postal_code}
                            maxLength={9}
                            onChange={(event) =>
                                form.setData('postal_code', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-address-line"
                        label="Logradouro"
                        error={form.errors.address_line}
                    >
                        <Input
                            id="member-address-line"
                            value={form.data.address_line}
                            onChange={(event) =>
                                form.setData('address_line', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-address-number"
                        label="Número"
                        error={form.errors.address_number}
                    >
                        <Input
                            id="member-address-number"
                            value={form.data.address_number}
                            onChange={(event) =>
                                form.setData(
                                    'address_number',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-address-complement"
                        label="Complemento"
                        error={form.errors.address_complement}
                    >
                        <Input
                            id="member-address-complement"
                            value={form.data.address_complement}
                            onChange={(event) =>
                                form.setData(
                                    'address_complement',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-neighborhood"
                        label="Bairro"
                        error={form.errors.neighborhood}
                    >
                        <Input
                            id="member-neighborhood"
                            value={form.data.neighborhood}
                            onChange={(event) =>
                                form.setData('neighborhood', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-city"
                        label="Município"
                        error={form.errors.city}
                    >
                        <Input
                            id="member-city"
                            value={form.data.city}
                            onChange={(event) =>
                                form.setData('city', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-state"
                        label="UF"
                        error={form.errors.state}
                    >
                        <Input
                            id="member-state"
                            value={form.data.state}
                            maxLength={2}
                            onChange={(event) =>
                                form.setData('state', event.target.value)
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-emergency-name"
                        label="Contato de emergência"
                        error={form.errors.emergency_contact_name}
                    >
                        <Input
                            id="member-emergency-name"
                            value={form.data.emergency_contact_name}
                            onChange={(event) =>
                                form.setData(
                                    'emergency_contact_name',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-emergency-relationship"
                        label="Vínculo do contato"
                        error={form.errors.emergency_contact_relationship}
                    >
                        <Input
                            id="member-emergency-relationship"
                            value={form.data.emergency_contact_relationship}
                            onChange={(event) =>
                                form.setData(
                                    'emergency_contact_relationship',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-emergency-phone"
                        label="Telefone de emergência"
                        error={form.errors.emergency_contact_phone}
                    >
                        <Input
                            id="member-emergency-phone"
                            value={form.data.emergency_contact_phone}
                            onChange={(event) =>
                                form.setData(
                                    'emergency_contact_phone',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-companion-name"
                        label="Nome da garupa/companheiro(a)"
                        error={form.errors.companion_name}
                    >
                        <Input
                            id="member-companion-name"
                            value={form.data.companion_name}
                            onChange={(event) =>
                                form.setData(
                                    'companion_name',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-companion-phone"
                        label="Telefone da garupa/companheiro(a)"
                        error={form.errors.companion_phone}
                    >
                        <Input
                            id="member-companion-phone"
                            value={form.data.companion_phone}
                            onChange={(event) =>
                                form.setData(
                                    'companion_phone',
                                    event.target.value,
                                )
                            }
                        />
                    </FormField>
                    <FormField
                        id="member-joined-at"
                        label="Data de ingresso"
                        required
                        error={form.errors.joined_at}
                    >
                        <Input
                            id="member-joined-at"
                            type="date"
                            value={form.data.joined_at}
                            onChange={(event) =>
                                form.setData('joined_at', event.target.value)
                            }
                            aria-invalid={Boolean(form.errors.joined_at)}
                        />
                    </FormField>
                    <FormField
                        id="member-status"
                        label="Situação"
                        required
                        error={form.errors.status}
                    >
                        <select
                            id="member-status"
                            className="rounded-md border bg-background p-2"
                            value={form.data.status}
                            onChange={(event) => {
                                form.setData('status', event.target.value);
                                if (event.target.value === 'active')
                                    form.setData('left_at', '');
                            }}
                            aria-invalid={Boolean(form.errors.status)}
                        >
                            <option value="active">Ativo</option>
                            <option value="left">Desligado</option>
                        </select>
                    </FormField>
                    {form.data.status === 'left' && (
                        <FormField
                            id="member-left-at"
                            label="Data de desligamento"
                            error={form.errors.left_at}
                        >
                            <Input
                                id="member-left-at"
                                type="date"
                                value={form.data.left_at}
                                onChange={(event) =>
                                    form.setData('left_at', event.target.value)
                                }
                                aria-invalid={Boolean(form.errors.left_at)}
                            />
                        </FormField>
                    )}
                </AdminForm>
            ) : (
                <section className="grid gap-2 rounded-lg border p-4 md:grid-cols-3">
                    <h2 className="text-lg font-semibold md:col-span-3">
                        Dados do membro
                    </h2>
                    <p>CPF: {member.cpf ?? '—'}</p>
                    <p>Nascimento: {member.birth_date?.slice(0, 10) ?? '—'}</p>
                    <p>Telefone: {member.phone ?? '—'}</p>
                    <p>
                        Endereço:{' '}
                        {[
                            member.address_line,
                            member.address_number,
                            member.address_complement,
                            member.neighborhood,
                            member.city,
                            member.state,
                            member.postal_code,
                        ]
                            .filter(Boolean)
                            .join(', ') || '—'}
                    </p>
                    <p>
                        Contato de emergência:{' '}
                        {[
                            member.emergency_contact_name,
                            member.emergency_contact_relationship,
                            member.emergency_contact_phone,
                        ]
                            .filter(Boolean)
                            .join(' · ') || '—'}
                    </p>
                    <p>
                        Garupa/companheiro(a):{' '}
                        {[member.companion_name, member.companion_phone]
                            .filter(Boolean)
                            .join(' · ') || '—'}
                    </p>
                    <p>Data de ingresso: {member.joined_at.slice(0, 10)}</p>
                    <p>
                        Situação:{' '}
                        {member.status === 'active' ? 'Ativo' : 'Desligado'}
                    </p>
                </section>
            )}
            <h2 className="text-xl font-semibold">Motos</h2>
            {canEditMembers && <MotorcycleForm memberId={member.id} />}
            <div className="space-y-2">
                {member.motorcycle_links.map((link) => (
                    <div className="rounded-lg border p-3" key={link.id}>
                        <div>
                            {link.motorcycle.manufacturer}{' '}
                            {link.motorcycle.model} ·{' '}
                            {link.motorcycle.identifier || 'Sem identificação'}{' '}
                            · {link.ended_at ? 'Histórico' : 'Atual'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Desde {link.started_at.slice(0, 10)}{' '}
                            {link.ended_at &&
                                'até ' + link.ended_at.slice(0, 10)}
                        </div>
                        {canEditMembers && !link.ended_at && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.patch(
                                        '/member-motorcycles/' + link.id,
                                        {
                                            ...link.motorcycle,
                                            started_at: link.started_at.slice(
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
                                Encerrar vínculo
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            <RoleHistory
                memberId={member.id}
                roles={roles}
                assignments={member.role_assignments}
                canEdit={canEditMembers}
            />
            {canManageAccounts && (
                <section className="space-y-3 rounded-lg border p-4">
                    <h2 className="text-xl font-semibold">Conta de acesso</h2>
                    {member.user ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <span>
                                {member.user.email} ·{' '}
                                {member.user.active ? 'Ativa' : 'Desativada'}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.patch(
                                        `/members/${member.id}/account`,
                                        { active: !member.user?.active },
                                    )
                                }
                            >
                                {member.user.active
                                    ? 'Desativar conta'
                                    : 'Ativar conta'}
                            </Button>
                        </div>
                    ) : (
                        <AdminForm
                            form={accountForm}
                            submitLabel="Criar conta do membro"
                            onSubmit={(event) => {
                                event.preventDefault();
                                accountForm.post(
                                    `/members/${member.id}/account`,
                                    {
                                        onSuccess: () =>
                                            accountForm.reset('password'),
                                    },
                                );
                            }}
                            className="grid gap-3 md:grid-cols-3"
                        >
                            <FormField
                                id="account-name"
                                label="Nome da conta"
                                required
                                error={accountForm.errors.name}
                            >
                                <Input
                                    id="account-name"
                                    value={accountForm.data.name}
                                    onChange={(event) =>
                                        accountForm.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                />
                            </FormField>
                            <FormField
                                id="account-email"
                                label="Email de acesso"
                                required
                                error={accountForm.errors.email}
                            >
                                <Input
                                    id="account-email"
                                    type="email"
                                    value={accountForm.data.email}
                                    onChange={(event) =>
                                        accountForm.setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                />
                            </FormField>
                            <FormField
                                id="account-password"
                                label="Senha inicial"
                                required
                                error={accountForm.errors.password}
                            >
                                <Input
                                    id="account-password"
                                    type="password"
                                    minLength={12}
                                    value={accountForm.data.password}
                                    onChange={(event) =>
                                        accountForm.setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                />
                            </FormField>
                        </AdminForm>
                    )}
                </section>
            )}
        </div>
    );
}

import { Head, useForm } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Input } from '@/components/ui/input';
import ProfileContactsForm from '@/components/members/profile-contacts-form';
import ProfileMotorcycles from '@/components/members/profile-motorcycles';

type Member = {
    id: number;
    name: string;
    phone: string | null;
    joined_at: string;
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
    motorcycle_links: {
        id: number;
        started_at: string;
        ended_at: string | null;
        motorcycle: {
            identifier: string | null;
            manufacturer: string;
            model: string;
            year: number | null;
        };
    }[];
};

type ProfileValues = {
    name: string;
    cpf: string;
    birth_date: string;
    phone: string;
    postal_code: string;
    address_line: string;
    address_number: string;
    address_complement: string;
    neighborhood: string;
    city: string;
    state: string;
};

export default function MemberProfile({
    member,
    canEditJoinedAt,
}: {
    member: Member;
    canEditJoinedAt: boolean;
}) {
    const profile = useForm<ProfileValues>({
        name: member.name,
        cpf: member.cpf ?? '',
        birth_date: member.birth_date?.slice(0, 10) ?? '',
        phone: member.phone ?? '',
        postal_code: member.postal_code ?? '',
        address_line: member.address_line ?? '',
        address_number: member.address_number ?? '',
        address_complement: member.address_complement ?? '',
        neighborhood: member.neighborhood ?? '',
        city: member.city ?? '',
        state: member.state ?? '',
    });
    const membership = useForm({ joined_at: member.joined_at.slice(0, 10) });

    const field = (
        key: keyof ProfileValues,
        label: string,
        required = true,
        type = 'text',
    ) => (
        <FormField
            key={key}
            id={`member-profile-${key}`}
            label={label}
            required={required}
            error={profile.errors[key]}
        >
            <Input
                id={`member-profile-${key}`}
                type={type}
                value={profile.data[key]}
                maxLength={key === 'state' ? 2 : undefined}
                onChange={(event) => profile.setData(key, event.target.value)}
            />
        </FormField>
    );

    return (
        <div className="space-y-6 p-6">
            <Head title="Meu perfil" />
            <header>
                <h1 className="text-2xl font-semibold">Meu perfil</h1>
                <p className="text-sm text-muted-foreground">
                    Mantenha seus dados pessoais atualizados no cadastro do
                    clube.
                </p>
            </header>

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="text-lg font-semibold">Data de ingresso</h2>
                {canEditJoinedAt ? (
                    <AdminForm
                        form={membership}
                        submitLabel="Salvar data de ingresso"
                        className="flex flex-wrap items-end gap-3"
                        onSubmit={(event) => {
                            event.preventDefault();
                            membership.patch('/me/profile/membership-date');
                        }}
                    >
                        <FormField
                            id="member-profile-joined-at"
                            label="Membro desde"
                            required
                            error={membership.errors.joined_at}
                        >
                            <Input
                                id="member-profile-joined-at"
                                type="date"
                                value={membership.data.joined_at}
                                onChange={(event) =>
                                    membership.setData(
                                        'joined_at',
                                        event.target.value,
                                    )
                                }
                            />
                        </FormField>
                    </AdminForm>
                ) : (
                    <p>
                        Membro desde{' '}
                        <time dateTime={member.joined_at.slice(0, 10)}>
                            {new Date(
                                `${member.joined_at.slice(0, 10)}T12:00:00`,
                            ).toLocaleDateString('pt-BR')}
                        </time>
                    </p>
                )}
            </section>

            <AdminForm
                form={profile}
                submitLabel="Salvar perfil"
                className="grid gap-4 rounded-lg border p-4 md:grid-cols-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    profile.patch('/me/profile');
                }}
            >
                <h2 className="text-lg font-semibold md:col-span-2">
                    Dados pessoais
                </h2>
                {field('name', 'Nome completo')}
                {field('cpf', 'CPF')}
                {field('birth_date', 'Data de nascimento', true, 'date')}
                {field('phone', 'Telefone')}
                <h2 className="text-lg font-semibold md:col-span-2">
                    Endereço
                </h2>
                {field('postal_code', 'CEP')}
                {field('address_line', 'Logradouro')}
                {field('address_number', 'Número')}
                {field('address_complement', 'Complemento', false)}
                {field('neighborhood', 'Bairro')}
                {field('city', 'Município')}
                {field('state', 'UF')}
            </AdminForm>
            <ProfileContactsForm
                initialValues={{
                    emergency_contact_name: member.emergency_contact_name ?? '',
                    emergency_contact_relationship:
                        member.emergency_contact_relationship ?? '',
                    emergency_contact_phone:
                        member.emergency_contact_phone ?? '',
                    companion_name: member.companion_name ?? '',
                    companion_phone: member.companion_phone ?? '',
                }}
            />
            <ProfileMotorcycles links={member.motorcycle_links ?? []} />
        </div>
    );
}

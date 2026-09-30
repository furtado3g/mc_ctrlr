import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Globe, MapPin } from 'lucide-react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { DataTable } from '@/components/tables/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';
import type { TableColumn, TableQuery } from '@/types/dynamic-ui';
import type { RegionalCity, RegionalContext } from '@/types/regional';

type Member = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
    joined_at: string;
    regional_city_id?: number | null;
    regional_city?: RegionalCity | null;
};

type MemberValues = {
    name: string;
    email: string;
    phone: string;
    joined_at: string;
    status: string;
    regional_city_id: string;
};

type Props = {
    members: { data: Member[]; total: number };
    tableQuery: TableQuery;
};

export default function Members({ members, tableQuery }: Props) {
    const { auth, currentRegional } = usePage().props as {
        auth: { draftScope?: string | null };
        currentRegional?: RegionalContext | null;
    };

    const draft = useSessionDraft<MemberValues>({
        scope: auth.draftScope,
        formKey: 'members:create',
        recordKey: 'new',
        initialValues: {
            name: '',
            email: '',
            phone: '',
            joined_at: new Date().toISOString().slice(0, 10),
            status: 'active',
            regional_city_id: '',
        },
    });
    const { form } = draft;

    const availableCities = currentRegional?.cities ?? [];

    const columns: TableColumn<Member>[] = [
        {
            key: 'name',
            label: 'Nome',
            sortable: true,
            render: (member) => (
                <Link href={`/members/${member.id}`} className="font-medium underline">
                    {member.name}
                </Link>
            ),
        },
        {
            key: 'city',
            label: 'Cidade',
            priority: 'secondary',
            sortable: false,
            render: (member) =>
                member.regional_city ? (
                    <span className="flex items-center gap-1 text-xs">
                        <MapPin className="size-3 text-muted-foreground" />
                        {member.regional_city.name}/{member.regional_city.state}
                    </span>
                ) : (
                    '—'
                ),
        },
        {
            key: 'email',
            label: 'Email',
            priority: 'secondary',
            sortable: false,
            render: (member) => member.email || '—',
        },
        {
            key: 'phone',
            label: 'Telefone',
            priority: 'secondary',
            sortable: false,
            render: (member) => member.phone || '—',
        },
        {
            key: 'joined_at',
            label: 'Ingresso',
            priority: 'secondary',
            sortable: true,
            render: (member) => member.joined_at?.slice(0, 10) || '—',
        },
        {
            key: 'status',
            label: 'Situação',
            sortable: true,
            render: (member) => (member.status === 'active' ? 'Ativo' : 'Desligado'),
        },
        {
            key: 'actions',
            label: 'Ação',
            render: (member) => (
                <Link href={`/members/${member.id}`} className="underline">
                    Abrir
                </Link>
            ),
        },
    ];

    return (
        <div className="space-y-6 p-6">
            <Head title="Membros" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">Membros</h1>
                    {currentRegional ? (
                        <Badge variant="outline" className="gap-1 text-xs font-normal">
                            <Building2 className="size-3 text-primary" />
                            {currentRegional.name} ({currentRegional.code})
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="gap-1 text-xs font-normal">
                            <Globe className="size-3 text-emerald-600" />
                            Todas as Regionais
                        </Badge>
                    )}
                </div>
            </div>

            <AdminForm
                form={form}
                submitLabel="Cadastrar"
                draftRestored={draft.draftRestored}
                connectionError={draft.connectionError}
                onDiscardDraft={draft.discardDraft}
                onSubmit={(event) => {
                    event.preventDefault();
                    draft.submit('post', '/members');
                }}
                className="grid gap-3 rounded-lg border p-4 md:grid-cols-3"
            >
                <FormField id="member-name" label="Nome" required error={form.errors.name}>
                    <Input
                        id="member-name"
                        autoComplete="name"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                        aria-invalid={Boolean(form.errors.name)}
                    />
                </FormField>
                <FormField id="member-email" label="Email" error={form.errors.email}>
                    <Input
                        id="member-email"
                        type="email"
                        autoComplete="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        aria-invalid={Boolean(form.errors.email)}
                    />
                </FormField>
                <FormField id="member-phone" label="Telefone" error={form.errors.phone}>
                    <Input
                        id="member-phone"
                        autoComplete="tel"
                        value={form.data.phone}
                        onChange={(event) => form.setData('phone', event.target.value)}
                        aria-invalid={Boolean(form.errors.phone)}
                    />
                </FormField>
                <FormField id="member-joined-at" label="Data de ingresso" required error={form.errors.joined_at}>
                    <Input
                        id="member-joined-at"
                        type="date"
                        value={form.data.joined_at}
                        onChange={(event) => form.setData('joined_at', event.target.value)}
                        aria-invalid={Boolean(form.errors.joined_at)}
                    />
                </FormField>

                {availableCities.length > 0 && (
                    <FormField id="member-city" label="Cidade da Regional" error={form.errors.regional_city_id}>
                        <select
                            id="member-city"
                            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                            value={form.data.regional_city_id}
                            onChange={(e) => form.setData('regional_city_id', e.target.value)}
                        >
                            <option value="">Selecione uma cidade...</option>
                            {availableCities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name} - {city.state} {city.is_headquarters ? '(Sede)' : ''}
                                </option>
                            ))}
                        </select>
                    </FormField>
                )}

                <input type="hidden" name="status" value={form.data.status} />
            </AdminForm>

            <DataTable
                table="members"
                rows={members.data}
                total={members.total}
                query={tableQuery}
                columns={columns}
                rowKey={(member) => member.id}
                filters={({ setFilter }) => (
                    <div className="flex flex-wrap gap-2">
                        <label className="grid gap-1 text-sm">
                            Situação
                            <select
                                className="h-9 rounded-md border bg-background px-2"
                                value={String(tableQuery.filters.status ?? '')}
                                onChange={(event) => setFilter('status', event.target.value || null)}
                            >
                                <option value="">Todas</option>
                                <option value="active">Ativo</option>
                                <option value="left">Desligado</option>
                            </select>
                        </label>

                        {availableCities.length > 0 && (
                            <label className="grid gap-1 text-sm">
                                Cidade
                                <select
                                    className="h-9 rounded-md border bg-background px-2"
                                    value={String(tableQuery.filters.regional_city_id ?? '')}
                                    onChange={(event) => setFilter('regional_city_id', event.target.value || null)}
                                >
                                    <option value="">Todas as cidades</option>
                                    {availableCities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}/{city.state} {city.is_headquarters ? '(Sede)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </div>
                )}
            />
        </div>
    );
}

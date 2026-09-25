import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type MotorcycleLink = {
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

type Values = {
    identifier: string;
    manufacturer: string;
    model: string;
    year: string;
    started_at: string;
    ended_at: string;
};

function localToday(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;
}

function dateOnly(value: string): string {
    return value.slice(0, 10);
}

export default function ProfileMotorcycles({
    links,
}: {
    links: MotorcycleLink[];
}) {
    const [editing, setEditing] = useState<number | null>(null);
    const form = useForm<Values>({
        identifier: '',
        manufacturer: '',
        model: '',
        year: '',
        started_at: localToday(),
        ended_at: '',
    });

    const beginEdit = (link: MotorcycleLink) => {
        setEditing(link.id);
        form.setData({
            identifier: link.motorcycle.identifier ?? '',
            manufacturer: link.motorcycle.manufacturer,
            model: link.motorcycle.model,
            year: link.motorcycle.year?.toString() ?? '',
            started_at: dateOnly(link.started_at),
            ended_at: link.ended_at ? dateOnly(link.ended_at) : '',
        });
    };

    const clear = () => {
        setEditing(null);
        form.reset();
        form.setData({
            identifier: '',
            manufacturer: '',
            model: '',
            year: '',
            started_at: localToday(),
            ended_at: '',
        });
    };

    return (
        <section className="space-y-4 rounded-lg border p-4">
            <header>
                <h2 className="text-lg font-semibold">Minhas motos</h2>
                <p className="text-sm text-muted-foreground">
                    Cadastre mais de uma moto. Vínculos encerrados permanecem no
                    histórico.
                </p>
            </header>

            <AdminForm
                form={form}
                submitLabel={editing ? 'Salvar moto' : 'Cadastrar moto'}
                className="grid gap-3 md:grid-cols-3"
                onSubmit={(event) => {
                    event.preventDefault();
                    const options = {
                        preserveScroll: true,
                        onSuccess: clear,
                    };
                    if (editing) {
                        form.patch(
                            `/me/profile/motorcycles/${editing}`,
                            options,
                        );
                    } else {
                        form.post('/me/profile/motorcycles', options);
                    }
                }}
            >
                <FormField
                    id="profile-motorcycle-identifier"
                    label="Placa ou identificação"
                    error={form.errors.identifier}
                >
                    <Input
                        id="profile-motorcycle-identifier"
                        maxLength={32}
                        value={form.data.identifier}
                        onChange={(event) =>
                            form.setData('identifier', event.target.value)
                        }
                    />
                </FormField>
                <FormField
                    id="profile-motorcycle-manufacturer"
                    label="Fabricante"
                    required
                    error={form.errors.manufacturer}
                >
                    <Input
                        id="profile-motorcycle-manufacturer"
                        maxLength={120}
                        value={form.data.manufacturer}
                        onChange={(event) =>
                            form.setData('manufacturer', event.target.value)
                        }
                    />
                </FormField>
                <FormField
                    id="profile-motorcycle-model"
                    label="Modelo"
                    required
                    error={form.errors.model}
                >
                    <Input
                        id="profile-motorcycle-model"
                        maxLength={120}
                        value={form.data.model}
                        onChange={(event) =>
                            form.setData('model', event.target.value)
                        }
                    />
                </FormField>
                <FormField
                    id="profile-motorcycle-year"
                    label="Ano"
                    error={form.errors.year}
                >
                    <Input
                        id="profile-motorcycle-year"
                        type="number"
                        min="1900"
                        max="2100"
                        value={form.data.year}
                        onChange={(event) =>
                            form.setData('year', event.target.value)
                        }
                    />
                </FormField>
                <FormField
                    id="profile-motorcycle-started-at"
                    label="Início do vínculo"
                    required
                    error={form.errors.started_at}
                >
                    <Input
                        id="profile-motorcycle-started-at"
                        type="date"
                        max={localToday()}
                        value={form.data.started_at}
                        onChange={(event) =>
                            form.setData('started_at', event.target.value)
                        }
                    />
                </FormField>
                {editing && (
                    <FormField
                        id="profile-motorcycle-ended-at"
                        label="Fim do vínculo"
                        error={form.errors.ended_at}
                    >
                        <Input
                            id="profile-motorcycle-ended-at"
                            type="date"
                            value={form.data.ended_at}
                            onChange={(event) =>
                                form.setData('ended_at', event.target.value)
                            }
                        />
                    </FormField>
                )}
                {editing && (
                    <Button type="button" variant="outline" onClick={clear}>
                        Cancelar edição
                    </Button>
                )}
            </AdminForm>

            <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-3">Moto</th>
                            <th className="p-3">Identificação</th>
                            <th className="p-3">Vínculo</th>
                            <th className="p-3">Situação</th>
                            <th className="p-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.map((link) => (
                            <tr className="border-b" key={link.id}>
                                <td className="p-3">
                                    {link.motorcycle.manufacturer}{' '}
                                    {link.motorcycle.model}
                                    {link.motorcycle.year
                                        ? ` (${link.motorcycle.year})`
                                        : ''}
                                </td>
                                <td className="p-3">
                                    {link.motorcycle.identifier ?? '—'}
                                </td>
                                <td className="p-3">
                                    {dateOnly(link.started_at)} –{' '}
                                    {link.ended_at
                                        ? dateOnly(link.ended_at)
                                        : 'atual'}
                                </td>
                                <td className="p-3">
                                    {link.ended_at ? 'Encerrado' : 'Atual'}
                                </td>
                                <td className="space-x-2 p-3">
                                    {!link.ended_at && (
                                        <>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => beginEdit(link)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    router.delete(
                                                        `/me/profile/motorcycles/${link.id}`,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                Encerrar vínculo
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {links.length === 0 && (
                            <tr>
                                <td
                                    className="p-4 text-muted-foreground"
                                    colSpan={5}
                                >
                                    Nenhuma moto cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

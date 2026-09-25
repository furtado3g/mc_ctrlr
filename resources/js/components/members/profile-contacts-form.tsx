import { useForm } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ContactValues = {
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_phone: string;
    companion_name: string;
    companion_phone: string;
};

export default function ProfileContactsForm({
    initialValues,
}: {
    initialValues: ContactValues;
}) {
    const form = useForm<ContactValues>(initialValues);

    return (
        <AdminForm
            form={form}
            submitLabel="Salvar contatos"
            className="grid gap-4 rounded-lg border p-4 md:grid-cols-2"
            onSubmit={(event) => {
                event.preventDefault();
                form.patch('/me/profile/contacts');
            }}
        >
            <h2 className="text-lg font-semibold md:col-span-2">
                Contato de emergência
            </h2>
            <FormField
                id="emergency-contact-name"
                label="Nome"
                error={form.errors.emergency_contact_name}
            >
                <Input
                    id="emergency-contact-name"
                    value={form.data.emergency_contact_name}
                    maxLength={255}
                    onChange={(event) =>
                        form.setData(
                            'emergency_contact_name',
                            event.target.value,
                        )
                    }
                />
            </FormField>
            <FormField
                id="emergency-contact-relationship"
                label="Vínculo"
                error={form.errors.emergency_contact_relationship}
            >
                <Input
                    id="emergency-contact-relationship"
                    value={form.data.emergency_contact_relationship}
                    maxLength={120}
                    onChange={(event) =>
                        form.setData(
                            'emergency_contact_relationship',
                            event.target.value,
                        )
                    }
                />
            </FormField>
            <FormField
                id="emergency-contact-phone"
                label="Telefone"
                error={form.errors.emergency_contact_phone}
            >
                <Input
                    id="emergency-contact-phone"
                    value={form.data.emergency_contact_phone}
                    maxLength={40}
                    onChange={(event) =>
                        form.setData(
                            'emergency_contact_phone',
                            event.target.value,
                        )
                    }
                />
            </FormField>
            <h2 className="text-lg font-semibold md:col-span-2">
                Garupa/companheiro(a)
            </h2>
            <FormField
                id="companion-name"
                label="Nome"
                error={form.errors.companion_name}
            >
                <Input
                    id="companion-name"
                    value={form.data.companion_name}
                    maxLength={255}
                    onChange={(event) =>
                        form.setData('companion_name', event.target.value)
                    }
                />
            </FormField>
            <FormField
                id="companion-phone"
                label="Telefone"
                error={form.errors.companion_phone}
            >
                <Input
                    id="companion-phone"
                    value={form.data.companion_phone}
                    maxLength={40}
                    onChange={(event) =>
                        form.setData('companion_phone', event.target.value)
                    }
                />
            </FormField>
            <div className="flex flex-wrap gap-2 md:col-span-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        form.setData({
                            emergency_contact_name: '',
                            emergency_contact_relationship: '',
                            emergency_contact_phone: '',
                            companion_name: '',
                            companion_phone: '',
                        })
                    }
                >
                    Limpar contatos
                </Button>
            </div>
        </AdminForm>
    );
}

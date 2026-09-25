import { Head, router, usePage } from '@inertiajs/react';
import { AdminForm } from '@/components/forms/admin-form';
import { FormField } from '@/components/forms/form-field';
import MotorcycleForm from '@/components/members/motorcycle-form';
import RoleHistory from '@/components/members/role-history';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSessionDraft } from '@/hooks/use-session-draft';

type Link = { id: number; started_at: string; ended_at: string | null; motorcycle: { identifier: string | null; manufacturer: string; model: string; year: number | null } };
type Role = { id: number; name: string };
type Assignment = { id: number; started_at: string; ended_at: string | null; club_role: Role };
type Member = { id: number; name: string; email: string | null; phone: string | null; joined_at: string; status: string; left_at: string | null; motorcycle_links: Link[]; role_assignments: Assignment[] };
type MemberValues = { name: string; email: string; phone: string; joined_at: string; status: string; left_at: string };

export default function MemberShow({ member, roles }: { member: Member; roles: Role[] }) {
    const { auth } = usePage().props as { auth: { draftScope?: string | null } };
    const draft = useSessionDraft<MemberValues>({
        scope: auth.draftScope,
        formKey: 'members:edit',
        recordKey: member.id,
        initialValues: { name: member.name, email: member.email ?? '', phone: member.phone ?? '', joined_at: member.joined_at.slice(0, 10), status: member.status, left_at: member.left_at?.slice(0, 10) ?? '' },
    });
    const { form } = draft;

    return <div className="space-y-6 p-6"><Head title={member.name} /><h1 className="text-2xl font-semibold">{member.name}</h1>
        <AdminForm form={form} submitLabel="Salvar membro" draftRestored={draft.draftRestored} connectionError={draft.connectionError} onDiscardDraft={draft.discardDraft} onSubmit={event => { event.preventDefault(); draft.submit('patch', '/members/' + member.id); }} className="grid gap-2 rounded-lg border p-4 md:grid-cols-3">
            <FormField id="member-name" label="Nome" required error={form.errors.name}><Input id="member-name" value={form.data.name} onChange={event => form.setData('name', event.target.value)} aria-invalid={Boolean(form.errors.name)} /></FormField>
            <FormField id="member-email" label="Email" error={form.errors.email}><Input id="member-email" type="email" value={form.data.email} onChange={event => form.setData('email', event.target.value)} aria-invalid={Boolean(form.errors.email)} /></FormField>
            <FormField id="member-phone" label="Telefone" error={form.errors.phone}><Input id="member-phone" value={form.data.phone} onChange={event => form.setData('phone', event.target.value)} aria-invalid={Boolean(form.errors.phone)} /></FormField>
            <FormField id="member-joined-at" label="Data de ingresso" required error={form.errors.joined_at}><Input id="member-joined-at" type="date" value={form.data.joined_at} onChange={event => form.setData('joined_at', event.target.value)} aria-invalid={Boolean(form.errors.joined_at)} /></FormField>
            <FormField id="member-status" label="Situação" required error={form.errors.status}><select id="member-status" className="rounded-md border bg-background p-2" value={form.data.status} onChange={event => { form.setData('status', event.target.value); if (event.target.value === 'active') form.setData('left_at', ''); }} aria-invalid={Boolean(form.errors.status)}><option value="active">Ativo</option><option value="left">Desligado</option></select></FormField>
            {form.data.status === 'left' && <FormField id="member-left-at" label="Data de desligamento" error={form.errors.left_at}><Input id="member-left-at" type="date" value={form.data.left_at} onChange={event => form.setData('left_at', event.target.value)} aria-invalid={Boolean(form.errors.left_at)} /></FormField>}
        </AdminForm>
        <h2 className="text-xl font-semibold">Motos</h2><MotorcycleForm memberId={member.id} />
        <div className="space-y-2">{member.motorcycle_links.map(link => <div className="rounded-lg border p-3" key={link.id}>
            <div>{link.motorcycle.manufacturer} {link.motorcycle.model} · {link.motorcycle.identifier || 'Sem identificação'} · {link.ended_at ? 'Histórico' : 'Atual'}</div>
            <div className="text-sm text-muted-foreground">Desde {link.started_at.slice(0, 10)} {link.ended_at && 'até ' + link.ended_at.slice(0, 10)}</div>
            {!link.ended_at && <Button variant="outline" size="sm" onClick={() => router.patch('/member-motorcycles/' + link.id, { ...link.motorcycle, started_at: link.started_at.slice(0, 10), ended_at: new Date().toISOString().slice(0, 10) })}>Encerrar vínculo</Button>}
        </div>)}</div>
        <RoleHistory memberId={member.id} roles={roles} assignments={member.role_assignments} />
    </div>;
}

<?php

namespace Tests\Feature;

use App\Models\InstitutionalPage;
use App\Models\PermissionGrant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InstitutionalPageManagementTest extends TestCase
{
    use RefreshDatabase;

    private function grant(User $user, string $action): void
    {
        PermissionGrant::create(['user_id' => $user->id, 'area' => 'institucional', 'action' => $action, 'granted_by' => $user->id, 'granted_at' => now()]);
    }

    private function content(string $name): array
    {
        return ['name' => $name, 'logo_path' => null, 'sections' => [['key' => 'hero', 'title' => 'Bem-vindo', 'body' => 'Texto', 'image_path' => null, 'cta_label' => null, 'cta_url' => null, 'enabled' => true, 'position' => 0]]];
    }

    public function test_view_permission_allows_read_only_editor_and_edit_permission_is_required_for_changes(): void
    {
        $viewer = User::factory()->create();
        $this->grant($viewer, 'view');
        $this->actingAs($viewer)->get('/institutional-page')->assertOk()->assertInertia(fn (Assert $page) => $page->component('institutional-page/edit')->where('canEdit', false));
        $this->actingAs($viewer)->patch('/institutional-page/draft', [])->assertForbidden();
        $this->actingAs(User::factory()->create())->get('/institutional-page')->assertForbidden();
    }

    public function test_draft_is_saved_separately_and_only_explicit_publish_changes_public_content(): void
    {
        $editor = User::factory()->create();
        $this->grant($editor, 'view');
        $this->grant($editor, 'edit');
        $this->actingAs($editor)->patch('/institutional-page/draft', $this->content('Novo Clube'))->assertRedirect();
        $this->assertSame('Laravel', InstitutionalPage::first()->published_content['name'] ?? 'Laravel');
        $this->assertSame('Novo Clube', InstitutionalPage::first()->draft_content['name']);
        $this->actingAs($editor)->get('/institutional-page')->assertOk()->assertInertia(fn (Assert $page) => $page->component('institutional-page/edit')->where('draft.name', 'Novo Clube')->where('published.name', config('app.name')));
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('content.name', config('app.name')));
        $this->actingAs($editor)->post('/institutional-page/publish')->assertRedirect();
        $this->assertSame('Novo Clube', InstitutionalPage::first()->published_content['name']);
        $this->assertNull(InstitutionalPage::first()->draft_content);
    }

    public function test_validation_and_publish_without_draft_do_not_mutate_published_snapshot(): void
    {
        $editor = User::factory()->create();
        $this->grant($editor, 'view');
        $this->grant($editor, 'edit');
        InstitutionalPage::create(['key' => 'home', 'published_content' => $this->content('Atual')]);
        $this->actingAs($editor)->patch('/institutional-page/draft', ['name' => ' ', 'sections' => []])->assertSessionHasErrors('name');
        $malicious = $this->content('Atualizado');
        $malicious['sections'][0]['body'] = '<script>alert(1)</script>';
        $this->actingAs($editor)->patch('/institutional-page/draft', $malicious)->assertSessionHasErrors('sections.0.body');
        $this->actingAs($editor)->post('/institutional-page/publish')->assertSessionHasErrors('draft');
        $this->assertSame('Atual', InstitutionalPage::first()->published_content['name']);
    }

    public function test_uploaded_logo_and_section_image_are_saved_and_published_as_public_assets(): void
    {
        Storage::fake('public');
        $editor = User::factory()->create();
        $this->grant($editor, 'view');
        $this->grant($editor, 'edit');
        $payload = $this->content('Clube com marca');
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/kZsAAAAASUVORK5CYII=', true);
        $payload['logo'] = UploadedFile::fake()->createWithContent('logo.png', $png);
        $payload['sections'][0]['image'] = UploadedFile::fake()->createWithContent('estrada.png', $png);

        $this->actingAs($editor)->patch('/institutional-page/draft', $payload)->assertRedirect();
        $draft = InstitutionalPage::firstOrFail()->draft_content;
        Storage::disk('public')->assertExists($draft['logo_path']);
        Storage::disk('public')->assertExists($draft['sections'][0]['image_path']);
        $this->actingAs($editor)->post('/institutional-page/publish')->assertRedirect();
        $this->assertSame($draft['logo_path'], InstitutionalPage::first()->published_content['logo_path']);
    }

    public function test_instagram_section_can_be_saved_in_draft_and_published(): void
    {
        $editor = User::factory()->create();
        $this->grant($editor, 'view');
        $this->grant($editor, 'edit');

        $payload = [
            'name' => 'Clube da Estrada',
            'logo_path' => null,
            'sections' => [
                [
                    'key' => 'hero',
                    'title' => 'Início',
                    'body' => 'Texto do início',
                    'image_path' => null,
                    'cta_label' => null,
                    'cta_url' => null,
                    'enabled' => true,
                    'position' => 0,
                ],
                [
                    'key' => 'instagram',
                    'title' => 'Galeria do Instagram',
                    'body' => 'Siga nossas rotas no perfil oficial',
                    'image_path' => null,
                    'cta_label' => 'Seguir no Instagram',
                    'cta_url' => 'https://instagram.com/clubedaestrada',
                    'enabled' => true,
                    'position' => 1,
                ],
            ],
        ];

        $this->actingAs($editor)->patch('/institutional-page/draft', $payload)->assertRedirect();
        $draft = InstitutionalPage::firstOrFail()->draft_content;
        $this->assertCount(2, $draft['sections']);
        $this->assertSame('instagram', $draft['sections'][1]['key']);
        $this->assertSame('https://instagram.com/clubedaestrada', $draft['sections'][1]['cta_url']);

        $this->actingAs($editor)->post('/institutional-page/publish')->assertRedirect();
        $published = InstitutionalPage::firstOrFail()->published_content;
        $this->assertSame('instagram', $published['sections'][1]['key']);
        $this->assertSame('Galeria do Instagram', $published['sections'][1]['title']);
    }
}

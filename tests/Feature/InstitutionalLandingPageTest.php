<?php

namespace Tests\Feature;

use App\Models\InstitutionalPage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InstitutionalLandingPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_landing_uses_fallback_and_keeps_login_available(): void
    {
        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page->component('landing/index')->where('content.name', config('app.name'))->has('content.sections'));
        $this->get('/login')->assertOk();
    }

    public function test_public_landing_exposes_only_enabled_published_sections_in_order(): void
    {
        InstitutionalPage::create(['key' => 'home', 'published_content' => ['name' => 'Estradeiros', 'logo_path' => null, 'sections' => [
            ['key' => 'contact', 'title' => 'Contato', 'body' => 'Fale conosco', 'enabled' => true, 'position' => 2],
            ['key' => 'about', 'title' => 'Sobre', 'body' => 'Publicado', 'enabled' => true, 'position' => 1],
            ['key' => 'activities', 'title' => 'Oculta', 'body' => 'Segredo', 'enabled' => false, 'position' => 0],
        ]], 'draft_content' => ['name' => 'Rascunho', 'sections' => []]]);

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page->where('content.name', 'Estradeiros')->has('content.sections', 2)->where('content.sections.0.title', 'Sobre')->where('content.sections.1.title', 'Contato')->missing('draft'));
    }

    public function test_authentication_screen_shares_the_current_published_brand(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('institutional/logo.webp', 'logo');
        InstitutionalPage::create(['key' => 'home', 'published_content' => ['name' => 'Estradeiros', 'logo_path' => 'institutional/logo.webp', 'sections' => []], 'draft_content' => ['name' => 'Rascunho', 'logo_path' => null, 'sections' => []]]);

        $this->get('/login')->assertOk()->assertInertia(fn (Assert $page) => $page->where('name', 'Estradeiros')->where('logo', Storage::disk('public')->url('institutional/logo.webp')));
    }

    public function test_public_landing_exposes_instagram_section_when_enabled(): void
    {
        InstitutionalPage::create(['key' => 'home', 'published_content' => ['name' => 'Estradeiros MC', 'logo_path' => null, 'sections' => [
            ['key' => 'hero', 'title' => 'Início', 'body' => 'Texto', 'enabled' => true, 'position' => 0],
            ['key' => 'instagram', 'title' => 'Galeria Instagram', 'body' => 'Nosso feed', 'cta_label' => 'Seguir', 'cta_url' => 'https://instagram.com/estradeirosmc', 'enabled' => true, 'position' => 1],
        ]], 'draft_content' => null]);

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('content.name', 'Estradeiros MC')
            ->has('content.sections', 2)
            ->where('content.sections.1.key', 'instagram')
            ->where('content.sections.1.title', 'Galeria Instagram')
            ->where('content.sections.1.cta_url', 'https://instagram.com/estradeirosmc')
        );
    }
}

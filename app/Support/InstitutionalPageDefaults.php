<?php

namespace App\Support;

use App\Models\InstitutionalPage;

class InstitutionalPageDefaults
{
    /** @return array<string, mixed> */
    public static function publishedContent(): array
    {
        try {
            $page = InstitutionalPage::query()->home()->first();

            return ($page ? $page->published_content : null) ?? self::content();
        } catch (\Throwable) {
            return self::content();
        }
    }

    /** @return array{name: string, logo_path: null, sections: list<array<string, mixed>>} */
    public static function content(): array
    {
        return [
            'name' => config('app.name', 'Motoclube'),
            'logo_path' => null,
            'sections' => [
                ['key' => 'hero', 'title' => "A estrada aproxima.\nA irmandade fica.", 'body' => 'Duas rodas, novos caminhos e histórias que merecem ser compartilhadas. Conheça o nosso motoclube.', 'image_path' => null, 'cta_label' => 'Conheça o motoclube', 'cta_url' => '/#about', 'enabled' => true, 'position' => 0],
                ['key' => 'about', 'title' => "Duas rodas.\nUm mesmo caminho.", 'body' => "A paixão por motos é o ponto de partida. O que torna cada viagem especial são as pessoas que encontramos pelo caminho.\n\nEste é um espaço para compartilhar histórias, cultivar amizades e viver o motociclismo com respeito, companheirismo e responsabilidade.", 'image_path' => null, 'cta_label' => null, 'cta_url' => null, 'enabled' => true, 'position' => 1],
                ['key' => 'activities', 'title' => "Histórias que começam\nquando a gente se encontra.", 'body' => "Na estrada, cada curva convida a descobrir uma paisagem e um novo caminho. Viajar em companhia transforma o percurso em uma história compartilhada.\n\nNos encontros, as motos aproximam pessoas. Uma conversa, uma experiência trocada e a vontade de marcar o próximo passeio.\n\nNa comunidade, o respeito faz a diferença. Cuidar de quem está ao lado e praticar um motociclismo responsável também fazem parte da jornada.", 'image_path' => null, 'cta_label' => null, 'cta_url' => null, 'enabled' => true, 'position' => 2],
                ['key' => 'contact', 'title' => "O próximo encontro\ncomeça com uma conversa.", 'body' => 'Quer conhecer melhor o motoclube? Procure os membros e a diretoria para saber mais sobre os encontros, os passeios e como se aproximar da nossa comunidade.', 'image_path' => null, 'cta_label' => null, 'cta_url' => null, 'enabled' => true, 'position' => 3],
            ],
        ];
    }
}

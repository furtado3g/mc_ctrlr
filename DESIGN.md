---
version: alpha
name: Motoclube — institucional e gestão
description: Uma apresentação de estrada e companheirismo com uma área de gestão funcional.
colors:
    petrol: '#142e31'
    deep: '#0e2225'
    copper: '#e1a16b'
    paper: '#f4f5ef'
    ink: '#213b3b'
    muted: '#526865'
typography:
    display:
        fontFamily: 'Barlow Condensed, Arial Narrow, sans-serif'
    body:
        fontFamily: 'Instrument Sans, sans-serif'
rounded:
    DEFAULT: '0px'
spacing:
    page-max: '1248px'
    section-gap: '110px'
components:
    landing-button:
        minHeight: '52px'
---

# Motoclube

## Overview

Público brasileiro, português brasileiro. A landing `/` apresenta o motoclube e orienta visitantes para as seções e membros para o login. A direção visual vem de sinalização de estrada, paisagens ao entardecer e tipografia condensada de emblemas. A assinatura é o contraste entre a abertura fotográfica e um manifesto tipográfico silencioso.

Registro híbrido: a página pública tem expressão de marca; as telas administrativas mantêm os tokens neutros e os componentes shadcn existentes. Não aplicar a paleta institucional aos formulários administrativos.

Fontes de comportamento: `specs/005-landing-page-institucional/contracts/landing-page.md`. Conteúdo público vem exclusivamente da publicação vigente, com fallback editorial. Seções inativas não devem reaparecer no menu, no conteúdo ou no rodapé. Não inventar sede, datas, estatísticas, agenda ou depoimentos.

## Colors

`resources/css/landing.css` é a fonte de tokens da superfície pública (`--mc-*`), espelhada no frontmatter. A classe `.mc-landing` limita o alcance. Cobre indica ações sobre petróleo; tinta sobre papel garante a leitura. A landing tem paleta editorial própria, independente da preferência de tema do painel. Tokens do painel continuam em `resources/css/app.css`.

## Typography

Barlow Condensed 600 em títulos de apresentação e manifesto; Instrument Sans em navegação e leitura. As fontes são baixadas pelo plugin Laravel/Vite e servidas localmente. Títulos usam caixa alta via CSS, sem alterar o texto publicado. Textos longos quebram linha, sem truncamento de informações institucionais.

## Layout

Conteúdo com máximo de 1248px, margens de 48px no desktop e 20px no celular. Seções com 110px de respiro, reduzidos a 64px no celular. Imagens reservam espaço; navegação móvel é expansível no fluxo, sem modal. A ordem é a posição definida pelo editor. A foto padrão é ilustrativa e pode ser substituída por upload publicado.

## Elevation & Depth

Sem sombras em cartões. Profundidade pela fotografia com cobertura tonal, blocos de cor e divisórias. Não adicionar animação ambiente ou parallax. Respeitar movimento reduzido.

## Shapes

Superfícies e botões retos na landing; o painel mantém seus raios existentes. Ícones Lucide com traço leve. A curva abstrata no manifesto representa o percurso e não dados geográficos.

## Components

Links e botões com hover, foco visível e semântica nativa. Menu móvel com `aria-expanded`, fechamento por Escape e retorno de foco ao botão. FAQ com `details`/`summary`, acessível por teclado. Login permanece disponível no rodapé e no bloco de membros, inclusive no celular. Estados sem conteúdo mantêm identidade, título e entrada do membro.

## Do's and Don'ts

- Preservar nome, logo, títulos, corpo, links, imagens e ordenação publicados.
- Não apresentar fotografia ilustrativa como registro de membros reais.
- Não adicionar contatos fictícios nem botões sem destino.
- Não impor regras de adesão ao clube sem informação da diretoria.
- Reservar tipografia expressiva para a apresentação; manter texto corrido confortável.

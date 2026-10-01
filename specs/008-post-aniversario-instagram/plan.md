# Implementation Plan: Gerador de Post de Aniversário para Instagram

**Branch**: `008-post-aniversario-instagram` | **Date**: 2026-10-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-post-aniversario-instagram/spec.md`

## Summary

Implementar o módulo de aniversariantes com gerador de posts comemorativos para Instagram no motoclube. O módulo oferece uma listagem dinâmica dos aniversariantes (hoje, semana, mês corrente) filtrável por regional e busca, além de uma ferramenta interativa no frontend baseada em Canvas HTML5 para composição de artes em alta definição (Feed 1080x1080, Feed Retrato 1080x1350 e Stories 1080x1920). O gerador combina a foto de perfil do membro (com controles de zoom e enquadramento), nome, apelido de estrada, brasão oficial do clube, molduras temáticas e botão para cópia de legenda pronta com hashtags.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript 5.7+

**Primary Dependencies**:
- Backend: Laravel 13, Inertia.js (Laravel adapter 3.0), Eloquent ORM
- Frontend: React 19, @inertiajs/react 3.0, Tailwind CSS v4, Lucide React (`Cake`, `Sparkles`, `Download`, `Copy`, `Share2`, `ZoomIn`, `ZoomOut`), Radix UI (Dialog, Tabs, Slider, Select, Tooltip)
- Canvas API: Nativa do navegador (HTML5 Canvas 2D Context) para composição gráfica e exportação de blob PNG/JPEG sem dependências externas pesadas

**Storage**:
- Banco de Dados: SQLite (desenvolvimento/testes) / MySQL / PostgreSQL (produção) - aproveita a coluna existente `members.birth_date` e relacionamentos `user.profile`
- Arquivos: Disco público local (`storage/app/public/avatars`) para leitura de foto de perfil

**Testing**: PHPUnit 12+ com `RefreshDatabase`, testes de feature cobrindo a rota de aniversariantes, cálculo de datas, filtros de período (`today`, `week`, `month`), escopo regional e busca de membros.

**Target Platform**: Navegadores Web desktop e mobile (responsivo com suporte à Web Share API em smartphones)

**Project Type**: Aplicação Web híbrida (Laravel + Inertia.js + React SPA)

**Performance Goals**:
- Renderização e atualização do Canvas em menos de 16ms (60 FPS interativo) durante ajustes de zoom e troca de molduras
- Exportação e download da imagem de alta resolução em menos de 500ms no navegador
- Carregamento inicial da página de aniversariantes em menos de 300ms

**Constraints**:
- Resolução nativa exata do Instagram: 1080x1080 (1:1), 1080x1350 (4:5) e 1080x1920 (9:16)
- Sem dependência de serviços externos pesados de renderização (YAGNI): toda a renderização ocorre no cliente via Canvas 2D
- Proteção de dados: exibir apenas nome, apelido, regional e dia/mês do aniversário (sem expor ano de nascimento ou CPF)

**Scale/Scope**: Módulo integrado à barra de navegação para consulta de todos os membros e geração de posts para centenas de aniversários anuais.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio / Gate | Avaliação | Status |
|------------------|-----------|--------|
| **I. Test-First & Coverage** | Testes de feature em PHPUnit para endpoints de busca e listagem de aniversariantes com cobertura de períodos e permissões. | APROVADO |
| **II. Simplicity & YAGNI** | Uso de HTML5 Canvas nativo no React sem bibliotecas pesadas de terceiros (sem Puppeteer, sem GD no servidor). | APROVADO |
| **III. Desempenho e Interatividade** | Resposta instantânea no navegador sem consumo de CPU/RAM no servidor para geração gráfica. | APROVADO |
| **IV. Segurança e Privacidade** | Sanitização dos dados do membro: oculta CPF, endereços e ano exato caso não solicitado, exibindo apenas dados comemorativos. | APROVADO |

## Project Structure

### Documentation (this feature)

```text
specs/008-post-aniversario-instagram/
├── plan.md              # Este plano de implementação
├── research.md          # Decisões técnicas e motor de renderização (Fase 0)
├── data-model.md        # Estruturas de dados DTOs e Canvas Config (Fase 1)
├── quickstart.md        # Roteiro de validação e testes (Fase 1)
├── contracts/           # Contratos de rotas e endpoints (Fase 1)
│   └── birthday-posts-endpoints.md
└── tasks.md             # Tarefas de implementação (geradas no próximo passo)
```

### Source Code (repository root)

```text
app/
├── Http/
│   └── Controllers/
│       └── BirthdayPostController.php      # Listagem de aniversariantes e busca de membros
└── Models/
    ├── Member.php                          # Modelo de membro (consulta birth_date)
    └── UserProfile.php                     # Foto de perfil e apelido de estrada

resources/js/
├── types/
│   └── birthdays.ts                        # Tipos BirthdayMember, PostFormat, PostTheme, etc.
├── components/
│   ├── app-sidebar.tsx                     # Inclusão do link "Aniversariantes" na navegação
│   └── birthdays/
│       ├── birthday-card.tsx               # Card de aniversariante com atalhos de ação
│       ├── birthday-generator-modal.tsx    # Modal com preview do canvas e painel de controles
│       ├── birthday-canvas-preview.tsx     # Componente Canvas com desenho dos temas gráficos
│       └── birthday-caption-box.tsx        # Caixa com sugestão de legenda e botão copiar
└── pages/
    └── birthdays/
        └── index.tsx                       # Página principal de aniversariantes e filtros

tests/Feature/
└── BirthdayPostTest.php                    # Testes de feature da rota e filtros de aniversariantes
```

**Structure Decision**: Padrão do projeto Laravel + Inertia.js com controller dedicado `BirthdayPostController`, types TypeScript específicos e componentes modulares de composição visual sob `resources/js/components/birthdays/`.

## Complexity Tracking

*Nenhuma violação identificada. Arquitetura enxuta (YAGNI) e sem dependências externas adicionais.*

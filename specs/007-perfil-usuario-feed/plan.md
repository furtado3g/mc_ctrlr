# Implementation Plan: Perfil de Usuário e Feed Social do Clube

**Branch**: `007-perfil-usuario-feed` | **Date**: 2026-10-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-perfil-usuario-feed/spec.md`

## Summary

Implementar a gestão completa do perfil de usuário com upload/remoção de foto (avatar), apelido de estrada, bio e links sociais, integrada à experiência do Feed Social do motoclube. O feed oferece suporte à criação de postagens com texto e até 10 fotos, filtros dinâmicos regional e global, interações em tempo real (curtidas e comentários), permissões de moderação para administradores e visualização do perfil público dos integrantes com histórico de atividades.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript 5.7+

**Primary Dependencies**:
- Backend: Laravel 13, Inertia.js (Laravel adapter 3.0), Laravel Fortify
- Frontend: React 19, @inertiajs/react 3.0, Tailwind CSS v4, Lucide React, Radix UI (Avatar, DropdownMenu, Dialog, Tabs)

**Storage**:
- Banco de Dados: SQLite (desenvolvimento/testes) / PostgreSQL/MySQL (produção)
- Armazenamento de Arquivos: Disco local/público (`storage/app/public` com link simbólico em `/storage`) para avatares e mídias de postagens (`avatars/`, `posts/`)

**Testing**: PHPUnit 12+ com `RefreshDatabase`, testes de feature cobrindo autenticação, uploads de arquivo (`Illuminate\Http\UploadedFile::fake()`), integridade referencial e autorização via Policies

**Target Platform**: Navegadores Web desktop e mobile (responsivo)

**Project Type**: Aplicação Web híbrida (Laravel + Inertia.js + React SPA)

**Performance Goals**:
- Upload e atualização do avatar em menos de 2 segundos
- Carregamento inicial do feed (< 1 segundo) com carregamento sob demanda/paginação de 15 posts por página
- Carregamento otimizado de mídias e tratamento de imagens com fallback visual

**Constraints**:
- Limite estrito de até 10 fotos por publicação no feed
- Limite de 5MB por arquivo de imagem (JPEG, PNG, WebP)
- Proteção de dados confidenciais: perfis públicos não devem expor CPF, contatos de emergência ou dados financeiros
- Não adicionar bibliotecas pesadas de processamento em tempo real desnecessárias (YAGNI)

**Scale/Scope**: Comunidade de motoclube com centenas a milhares de membros distribuídos por múltiplas regionais

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio / Gate | Avaliação | Status |
|------------------|-----------|--------|
| **I. Test-First & Coverage** | Testes de feature obrigatórios para upload de avatar, criação de post com múltiplas fotos, filtragem regional/global, curtidas, comentários e permissões de moderação. | APROVADO |
| **II. Simplicity & YAGNI** | Uso dos recursos nativos do Laravel (Storage, Eloquent, Policies) e React sem adicionar serviços externos desnecessários de armazenamento de mídia ou microsserviços. | APROVADO |
| **III. Integridade Referencial e Cascade** | Relações com `ON DELETE CASCADE` garantem que a remoção de posts exclua mídias, comentários e curtidas sem órfãos no banco. | APROVADO |
| **IV. Segurança e Proteção de Dados** | Validação estrita de tipos MIME no backend e sanitização no perfil público para ocultar dados sensíveis. | APROVADO |

## Project Structure

### Documentation (this feature)

```text
specs/007-perfil-usuario-feed/
├── plan.md              # Este plano de implementação
├── research.md          # Decisões técnicas e arquiteturais (Fase 0)
├── data-model.md        # Modelagem de dados e diagrama E-R (Fase 1)
├── quickstart.md        # Roteiro de validação e testes (Fase 1)
├── contracts/           # Contratos de interfaces e endpoints (Fase 1)
│   └── profile-and-feed-endpoints.md
└── tasks.md             # Tarefas de implementação (geradas no próximo passo)
```

### Source Code (repository root)

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── FeedController.php            # Listagem do feed, criação e exclusão de posts
│   │   ├── FeedInteractionController.php # Toggle de curtidas e postagem/exclusão de comentários
│   │   ├── UserProfileController.php     # Upload/remoção de avatar e detalhes sociais
│   │   └── PublicProfileController.php   # Visualização do perfil público do membro
│   ├── Requests/
│   │   ├── AvatarUploadRequest.php       # Validação de upload de imagem de perfil
│   │   ├── PostCreateRequest.php         # Validação de post e até 10 fotos
│   │   ├── PostCommentRequest.php        # Validação de comentário
│   │   └── UserProfileDetailsRequest.php # Validação de apelido de estrada e bio
│   └── Middleware/
│       └── HandleInertiaRequests.php     # Compartilhamento do avatar atualizado no auth.user
├── Models/
│   ├── User.php                          # Relação com UserProfile e posts
│   ├── UserProfile.php                   # Modelo de dados de perfil e avatar
│   ├── Post.php                          # Modelo de post do feed
│   ├── PostMedia.php                     # Mídias anexadas ao post
│   ├── PostLike.php                      # Curtidas
│   └── PostComment.php                   # Comentários
└── Policies/
    ├── PostPolicy.php                    # Autorização de exclusão (autor vs admin)
    └── PostCommentPolicy.php             # Autorização de exclusão de comentário

database/
└── migrations/
    ├── 2026_10_01_000001_create_user_profiles_table.php
    └── 2026_10_01_000002_create_feed_tables.php

resources/js/
├── components/
│   ├── app-sidebar.tsx                   # Adição do link "Feed Social" no menu principal
│   ├── feed/
│   │   ├── post-card.tsx                 # Card de publicação (autor, texto, fotos, likes, comentários)
│   │   ├── post-composer.tsx             # Caixa de publicação com anexo de até 10 fotos
│   │   ├── post-gallery.tsx              # Galeria/carrossel responsivo de fotos com lightbox
│   │   └── post-comments-section.tsx     # Lista expansível e formulário de comentários
│   └── profile/
│       └── avatar-upload-form.tsx        # Componente de upload e remoção de avatar
├── pages/
│   ├── feed/
│   │   └── index.tsx                     # Tela principal do feed com abas Regional/Global
│   ├── profile/
│   │   ├── edit.tsx                      # Edição de dados complementares e foto
│   │   └── show.tsx                      # Perfil público do membro
│   └── settings/
│       └── profile.tsx                   # Integração do avatar upload nas configurações
└── types/
    └── feed.ts                           # Tipos TypeScript para Post, Media, Like, Comment, Profile

tests/Feature/
├── UserProfileAvatarTest.php             # Testes de upload, validação e remoção de avatar
├── FeedManagementTest.php                # Testes de criação, listagem, filtros regional/global e exclusão
└── FeedInteractionsTest.php              # Testes de curtidas, comentários e perfil público
```

**Structure Decision**: Padrão do starter kit Laravel 13 + Inertia + React, organizando os controllers em `app/Http/Controllers/`, componentes especializados em `resources/js/components/feed/` e `resources/js/components/profile/`, e testes feature dedicados em `tests/Feature/`.

## Complexity Tracking

| Violação | Por que é necessária | Alternativa mais simples rejeitada por que |
|---|---|---|
| Nenhuma | N/A | Arquitetura segue estritamente os padrões existentes no projeto sem violações. |

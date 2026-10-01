# Tasks: Perfil de Usuário e Feed Social do Clube

**Input**: Design documents from `specs/007-perfil-usuario-feed/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/profile-and-feed-endpoints.md`, `quickstart.md`)

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/profile-and-feed-endpoints.md`

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths and quoted validation rules in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar tipos TypeScript e infraestrutura de armazenamento para avatares e publicações.

- [X] T001 [P] Define TypeScript interfaces for UserProfile, Post, PostMedia, PostLike, and PostComment in `resources/js/types/feed.ts`
- [X] T002 [P] Update User type in `resources/js/types/auth.ts` to include optional profile attributes (`avatar?: string`, `road_nickname?: string`, `bio?: string`)
- [X] T003 Configure storage directories `storage/app/public/avatars` and `storage/app/public/posts` and ensure symbolic link in `config/filesystems.php`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estrutura de banco de dados, modelos Eloquent e autorização que bloqueiam todas as histórias.

**⚠️ CRITICAL**: Nenhuma história de usuário pode ser implementada antes da conclusão desta fase.

- [X] T004 Create database migration for `user_profiles` table in `database/migrations/2026_10_01_000001_create_user_profiles_table.php` with fields `user_id` (foreignId unique cascade), `avatar_path` (nullable string max 255), `road_nickname` (nullable string max 100), `bio` (nullable text), `phone` (nullable string max 30), and `social_links` (nullable json)
- [X] T005 Create database migration for feed tables (`posts`, `post_media`, `post_likes`, `post_comments`) in `database/migrations/2026_10_01_000002_create_feed_tables.php` with composite indexes `['regional_id', 'created_at']` and unique index `['post_id', 'user_id']` on `post_likes`
- [X] T006 [P] Create `UserProfile` Eloquent model with fillable attributes and belongsTo User relationship in `app/Models/UserProfile.php`
- [X] T007 [P] Create `PostMedia` Eloquent model with fillable `['post_id', 'file_path', 'sort_order']` in `app/Models/PostMedia.php`
- [X] T008 [P] Create `PostLike` Eloquent model with fillable `['post_id', 'user_id']` in `app/Models/PostLike.php`
- [X] T009 [P] Create `PostComment` Eloquent model with fillable `['post_id', 'user_id', 'content']` in `app/Models/PostComment.php`
- [X] T010 Create `Post` Eloquent model with relationships (`user`, `regional`, `media`, `likes`, `comments`) in `app/Models/Post.php`
- [X] T011 Update `User` Eloquent model in `app/Models/User.php` adding `profile()` (HasOne), `posts()` (HasMany), `postLikes()` (HasMany), and `avatar_url` accessor
- [X] T012 [P] Create `PostPolicy` in `app/Policies/PostPolicy.php` authorizing author or admin (`$user->id === $post->user_id || $user->canAccess('administracao', 'edit') || $user->is_global`) for deletion
- [X] T013 [P] Create `PostCommentPolicy` in `app/Policies/PostCommentPolicy.php` authorizing comment author, post author, or admin for deletion
- [X] T014 Register "Feed Social" navigation item with Lucide icon in `resources/js/components/app-sidebar.tsx`

**Checkpoint**: Base de dados, modelos e autorizações prontos. As histórias de usuário podem ser iniciadas.

---

## Phase 3: User Story 1 - Gestão do Perfil Pessoal e Upload de Foto (Priority: P1) 🎯 MVP

**Goal**: Permitir que usuários autenticados enviem/removam foto de perfil (avatar até 5MB em JPEG, PNG ou WebP), atualizem apelido de estrada e biografia, e visualizem o avatar atualizado na navegação.

**Independent Test**: Usuário autenticado faz upload de avatar válido via `/me/profile/avatar`, observa o arquivo salvo em disco público, vê o avatar refletido na barra superior e sidebar, e ao clicar em remover foto restaura o avatar com iniciais.

### Tests for User Story 1

- [X] T015 [P] [US1] Create feature tests for avatar upload, validation rules, removal, and profile details update in `tests/Feature/UserProfileAvatarTest.php`

### Implementation for User Story 1

- [X] T016 [P] [US1] Create Form Request `AvatarUploadRequest` with validation rule `'avatar' => 'required|image|mimes:jpeg,png,webp|max:5120'` in `app/Http/Requests/AvatarUploadRequest.php`
- [X] T017 [P] [US1] Create Form Request `UserProfileDetailsRequest` with validation rules `'road_nickname' => 'nullable|string|max:100'`, `'bio' => 'nullable|string|max:1000'`, `'phone' => 'nullable|string|max:30'`, `'social_links' => 'nullable|array'` in `app/Http/Requests/UserProfileDetailsRequest.php`
- [X] T018 [US1] Implement `UserProfileController` with methods `uploadAvatar`, `removeAvatar`, and `updateDetails` managing public storage in `app/Http/Controllers/UserProfileController.php`
- [X] T019 [US1] Update `HandleInertiaRequests` middleware in `app/Http/Middleware/HandleInertiaRequests.php` to share `auth.user.avatar` and `auth.user.road_nickname` with the frontend
- [X] T020 [US1] Register profile routes (`POST /me/profile/avatar`, `DELETE /me/profile/avatar`, `PATCH /me/profile/details`) in `routes/web.php`
- [X] T021 [P] [US1] Create avatar upload and removal component with live preview in `resources/js/components/profile/avatar-upload-form.tsx`
- [X] T022 [P] [US1] Create road nickname and bio editing component in `resources/js/components/profile/profile-details-form.tsx`
- [X] T023 [US1] Integrate avatar upload and profile details forms into user settings page in `resources/js/pages/settings/profile.tsx` and `resources/js/pages/member-profile/index.tsx`

**Checkpoint**: User Story 1 (MVP) funcional e testável de forma independente.

---

## Phase 4: User Story 2 - Feed Social com Filtro Regional/Global e Múltiplas Fotos (Priority: P1)

**Goal**: Disponibilizar o feed social com filtros por aba (Minha Regional vs Todas as Regionais), permitir publicação de relatos com até 10 fotos e exclusão de posts pelo autor ou administradores.

**Independent Test**: Membro cria uma publicação anexando até 10 fotos no feed. A postagem aparece imediatamente no topo da aba correspondente com ordenação cronológica decrescente. Ao alternar entre "Minha Regional" e "Todas as Regionais", a filtragem funciona conforme a regional do usuário.

### Tests for User Story 2

- [X] T024 [P] [US2] Create feature tests for post creation, 10-photo limit validation, regional/global filtering, pagination, and post deletion in `tests/Feature/FeedManagementTest.php`

### Implementation for User Story 2

- [X] T025 [P] [US2] Create Form Request `PostCreateRequest` with validation rules `'content' => 'required|string|min:1|max:5000'`, `'regional_id' => 'nullable|exists:regionais,id'`, `'images' => 'nullable|array|max:10'`, and `'images.*' => 'required|image|mimes:jpeg,png,webp|max:5120'` in `app/Http/Requests/PostCreateRequest.php`
- [X] T026 [US2] Implement `FeedController` with `index` (regional/global filtering and pagination), `store` (with multi-image storage), and `destroy` (with media cleanup) in `app/Http/Controllers/FeedController.php`
- [X] T027 [US2] Register feed routes (`GET /feed`, `POST /feed/posts`, `DELETE /feed/posts/{post}`) in `routes/web.php`
- [X] T028 [P] [US2] Create post composer component with text area, multi-photo file selector (max 10), thumbnail previews, and remove buttons in `resources/js/components/feed/post-composer.tsx`
- [X] T029 [P] [US2] Create responsive photo gallery and lightbox modal for 1 to 10 photos in `resources/js/components/feed/post-gallery.tsx`
- [X] T030 [US2] Create post card component displaying author, road nickname, avatar, regional badge, relative timestamp, text content, media gallery, and delete action in `resources/js/components/feed/post-card.tsx`
- [X] T031 [US2] Create feed page with regional/global tabs, post composer, post list, and pagination controls in `resources/js/pages/feed/index.tsx`

**Checkpoint**: User Stories 1 e 2 funcionais e testáveis de forma independente.

---

## Phase 5: User Story 3 - Interações no Feed: Curtidas e Comentários (Priority: P2)

**Goal**: Permitir que os membros interajam nas postagens por meio de curtidas (toggle com contador instantâneo) e comentários (criação e exclusão).

**Independent Test**: Usuário clica em curtir em uma postagem, o contador incrementa e o estado reflete a curtida. Em seguida, posta um comentário e ele aparece listado com autor e avatar. Ao excluir o comentário, ele é removido.

### Tests for User Story 3

- [X] T032 [P] [US3] Create feature tests for like/unlike toggle idempotency, comment creation, character limit validation, and comment deletion in `tests/Feature/FeedInteractionsTest.php`

### Implementation for User Story 3

- [X] T033 [P] [US3] Create Form Request `PostCommentRequest` with validation rule `'content' => 'required|string|min:1|max:1000'` in `app/Http/Requests/PostCommentRequest.php`
- [X] T034 [US3] Implement `FeedInteractionController` with `toggleLike`, `storeComment`, and `destroyComment` in `app/Http/Controllers/FeedInteractionController.php`
- [X] T035 [US3] Register interaction routes (`POST /feed/posts/{post}/likes`, `POST /feed/posts/{post}/comments`, `DELETE /feed/comments/{comment}`) in `routes/web.php`
- [X] T036 [P] [US3] Create comments list and submission form component in `resources/js/components/feed/post-comments-section.tsx`
- [X] T037 [US3] Update `PostCard` in `resources/js/components/feed/post-card.tsx` to include interactive like button with count, comments trigger, and collapsible comments section

**Checkpoint**: User Stories 1, 2 e 3 funcionais e integradas.

---

## Phase 6: User Story 4 - Perfil Público e Histórico do Membro (Priority: P3)

**Goal**: Permitir que membros cliquem no autor de qualquer postagem no feed para visualizar seu perfil público com dados não-sensíveis (avatar, apelido, cidade, motos cadastradas e histórico de postagens).

**Independent Test**: Ao clicar no autor de um post no feed, o usuário é redirecionado para a rota do perfil público, onde visualiza a foto, apelido de estrada, biografia, motos e histórico de publicações do membro, sem exposição de CPF ou dados sigilosos.

### Tests for User Story 4

- [X] T038 [P] [US4] Create feature tests for public profile view, verifying exposure of non-sensitive fields and author post history in `tests/Feature/PublicProfileTest.php`

### Implementation for User Story 4

- [X] T039 [US4] Implement `PublicProfileController` with `show` method loading public member data, motorcycles, and author posts in `app/Http/Controllers/PublicProfileController.php`
- [X] T040 [US4] Register public profile route (`GET /members/{member}/public-profile`) in `routes/web.php`
- [X] T041 [US4] Create public profile page displaying member header, bio, motorcycles, and feed of author's posts in `resources/js/pages/profile/show.tsx`
- [X] T042 [US4] Update author links on `PostCard` and `PostCommentsSection` to point to `/members/{member}/public-profile` in `resources/js/components/feed/post-card.tsx`

**Checkpoint**: Todas as 4 histórias de usuário funcionais e integradas.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificação de validações, limpeza de arquivos temporários e garantia de conformidade de código.

- [X] T043 [P] Execute quickstart validation scenarios defined in `specs/007-perfil-usuario-feed/quickstart.md`
- [X] T044 Run backend test suite via `php artisan test --filter=User` and `php artisan test --filter=Feed`
- [X] T045 Run frontend code checks and typecheck via `npm run check` and `npm run types:check`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode iniciar imediatamente.
- **Foundational (Phase 2)**: Depende da Fase 1 — BLOQUEIA todas as histórias de usuário.
- **User Stories (Phase 3+)**: Dependem da conclusão da Fase 2.
  - Podem ser executadas em sequência (P1 US1 → P1 US2 → P2 US3 → P3 US4) ou em paralelo por desenvolvedores distintos.
- **Polish (Phase 7)**: Depende da conclusão das histórias desejadas.

### User Story Dependencies

- **User Story 1 (P1)**: Depende apenas da Fase 2. MVP independente.
- **User Story 2 (P1)**: Depende da Fase 2. Reutiliza avatares da US1 quando disponíveis (com fallback para iniciais se não houver foto).
- **User Story 3 (P2)**: Depende da estrutura de posts da US2.
- **User Story 4 (P3)**: Depende dos posts da US2 e do perfil da US1.

---

## Parallel Opportunities

```bash
# Execução paralela de Setup e Types (Fase 1):
T001: resources/js/types/feed.ts
T002: resources/js/types/auth.ts

# Execução paralela de Modelos e Políticas (Fase 2):
T006: app/Models/UserProfile.php
T007: app/Models/PostMedia.php
T008: app/Models/PostLike.php
T009: app/Models/PostComment.php
T012: app/Policies/PostPolicy.php
T013: app/Policies/PostCommentPolicy.php

# Execução paralela de Componentes da US1 (Fase 3):
T016: app/Http/Requests/AvatarUploadRequest.php
T017: app/Http/Requests/UserProfileDetailsRequest.php
T021: resources/js/components/profile/avatar-upload-form.tsx
T022: resources/js/components/profile/profile-details-form.tsx

# Execução paralela de Componentes da US2 (Fase 4):
T028: resources/js/components/feed/post-composer.tsx
T029: resources/js/components/feed/post-gallery.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Executar Fase 1 (Setup) e Fase 2 (Foundational).
2. Executar Fase 3 (User Story 1 - Avatar e Perfil).
3. **Validar**: Fazer upload e remoção de avatar e verificar reflexo no layout.
4. Entregar incremento inicial funcional.

### Incremental Delivery

1. Setup + Foundational concluídos.
2. Adicionar US1 (Perfil & Avatar) → Validar e aprovar.
3. Adicionar US2 (Feed Social & Múltiplas Fotos) → Validar filtros regionais e limite de 10 fotos.
4. Adicionar US3 (Curtidas & Comentários) → Validar interações sociais.
5. Adicionar US4 (Perfil Público) → Validar navegação e proteção de dados sensíveis.
6. Validação final via `quickstart.md`.

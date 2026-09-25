---

description: "Task list template for feature implementation"
---

# Tasks: Landing page institucional

**Input**: Design documents from `specs/005-landing-page-institucional/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/landing-page.md](contracts/landing-page.md), [quickstart.md](quickstart.md)

**Tests**: Incluídos porque os cenários de aceitação e o roteiro de validação especificam verificação automatizada de acesso público, permissões, mídia, rascunhos e publicação.

**Organization**: As tarefas de implementação estão agrupadas pelas histórias da especificação para entregar e validar cada fluxo separadamente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser executada em paralelo com outra tarefa marcada `[P]` na mesma etapa, pois altera arquivos diferentes e não depende de tarefa incompleta.
- **[Story]**: História do usuário correspondente (`US1` ou `US2`).
- Cada tarefa aponta os caminhos exatos dos arquivos a criar ou alterar.

## Path Conventions

- Aplicação web Laravel + React no repositório raiz: `app/`, `database/`, `resources/`, `routes/`, `tests/`.
- Artefatos desta feature: `specs/005-landing-page-institucional/`.

## Phase 1: Setup

**Purpose**: Usar a aplicação Laravel/React e os serviços Docker Compose já existentes.

Nenhuma dependência ou estrutura de projeto adicional é necessária; o setup compartilhado já está descrito em [quickstart.md](quickstart.md).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criar o estado institucional comum e os pontos de integração usados pelas duas histórias.

- [X] T001 Criar migration `database/migrations/2026_09_25_000011_create_institutional_pages_table.php` com chave única `home`, `published_content` e `draft_content` JSONB anuláveis, `draft_saved_by` e `published_by` anuláveis com exclusão da conta em set-null, horários de salvamento/publicação anuláveis e timestamps conforme `data-model.md`.
- [X] T002 Criar o model `app/Models/InstitutionalPage.php` com casts dos snapshots JSONB, escopos para o registro `home` e relações opcionais com `User`; adicionar defaults públicos de fallback em `app/Support/InstitutionalPageDefaults.php` sem criar publicação falsa no banco.
- [X] T003 Criar o resolvedor de identidade publicada em `app/Support/InstitutionalBrand.php` e compartilhar nome/logo do snapshot publicado em `app/Http/Middleware/HandleInertiaRequests.php`, `resources/views/app.blade.php` e `resources/js/app.tsx`; configurar o layout público para `landing/index`, integrar o logo em `resources/js/components/app-logo.tsx` e `resources/js/layouts/auth/auth-simple-layout.tsx`, `resources/js/layouts/auth/auth-card-layout.tsx` e `resources/js/layouts/auth/auth-split-layout.tsx`, preservando o ícone e nome padrão sem publicação.
- [X] T004 Registrar as rotas públicas e administrativas em `routes/web.php`: `GET /`, `GET /institutional-page`, `PATCH /institutional-page/draft` e `POST /institutional-page/publish`; manter `/` público e aplicar `auth`, `verified` e `EnsureActiveUser` às rotas administrativas.

**Checkpoint**: Snapshots, identidade padrão e rotas estão definidos para implementar primeiro a leitura pública e depois a manutenção.

---

## Phase 3: User Story 2 - Conhecer o motoclube pela página pública (Priority: P1)

**Goal**: Apresentar o motoclube a visitantes em `/` sem autenticação, mostrando apenas a publicação vigente e oferecendo acesso ao login.

**Independent Test**: Abrir `/` sem sessão e verificar identidade, conteúdo e botão de entrada; com snapshot publicado e rascunho diferente, confirmar que somente os dados publicados aparecem; sem publicação, confirmar o fallback completo.

### Tests for User Story 2

- [X] T005 [P] [US2] Criar testes de feature em `tests/Feature/InstitutionalLandingPageTest.php` para visitante anônimo em `/`, fallback sem configuração, exibição somente das seções ativas ordenadas, isolamento do rascunho, nome/logo publicados, links para `/login` e continuidade das rotas de autenticação.

### Implementation for User Story 2

- [X] T006 [US2] Criar `app/Http/Controllers/InstitutionalLandingController.php` para responder `GET /` com o snapshot publicado filtrado por seção ativa, metadados da página e defaults seguros quando não houver publicação; não incluir dados administrativos ou do rascunho.
- [X] T007 [US2] Criar a página pública responsiva em `resources/js/pages/landing/index.tsx` com nome/logo publicados, seções na ordem recebida, estado inicial sem conteúdo cadastrado e chamada para `/login`; usar texto simples, alt text para imagens e navegação acessível sem layout ou sidebar administrativa.

**Checkpoint**: Visitantes conseguem consultar a apresentação pública inicial e conteúdo publicado; rascunhos não aparecem e o fluxo de autenticação permanece acessível.

---

## Phase 4: User Story 1 - Manter a página e a identidade institucional (Priority: P1) 🎯 MVP

**Goal**: Permitir que responsáveis autorizados editem um rascunho institucional, revisem-no e publiquem nome, logo e seções por ação explícita.

**Dependency**: US2 deve estar concluída porque o teste independente desta história confirma a atualização visível da página pública e da identidade compartilhada.

**Independent Test**: Com uma conta autorizada, alterar nome, logo e conteúdo; confirmar que salvar como rascunho mantém `/` inalterada e que publicar atualiza `/` e a identidade apresentada no sistema. Repetir com contas sem `view` e sem `edit` para confirmar `403` nos caminhos correspondentes.

### Tests for User Story 1

- [X] T008 [P] [US1] Criar testes em `tests/Feature/InstitutionalPageManagementTest.php` para acesso autorizado, `view` sem `edit`, negação sem permissão, validação, rascunho não público, publicação explícita, falha de publicação que preserva o estado atual e substituição de imagens usando `Storage::fake('public')`.
- [X] T009 [P] [US1] Estender `tests/Feature/AccessGroupManagementTest.php` para conceder `institucional.view` e `institucional.edit` por grupo e rejeitar pares de área/ação inválidos.

### Implementation for User Story 1

- [X] T010 [P] [US1] Adicionar `institucional` com ações `view` e `edit` em `app/Support/AccessPermissionCatalog.php` e propagar os Gates, permissões compartilhadas, concessões administrativas e navegação nos arquivos `app/Providers/AppServiceProvider.php`, `app/Http/Requests/AccessGroupRequest.php`, `app/Http/Controllers/AdminUserController.php`, `app/Http/Controllers/AccessGroupController.php`, `app/Http/Middleware/HandleInertiaRequests.php`, `resources/js/pages/access-groups/index.tsx`, `resources/js/pages/admin/users.tsx` e `resources/js/components/app-sidebar.tsx`.
- [X] T011 [P] [US1] Criar `app/Http/Requests/InstitutionalPageRequest.php` validando nome obrigatório com até 120 caracteres, seções únicas entre `hero`, `about`, `activities` e `contact`, título de seção ativa obrigatório com até 160 caracteres, texto simples com até 5.000 caracteres, rótulo de chamada com até 80 caracteres, par rótulo/URL completo, URL local iniciada por `/` ou externa HTTPS sem esquema executável, posição inteira não negativa e única, e imagens PNG/JPEG/WebP de até 5 MB; autorizar gravações somente com `institucional.edit`.
- [X] T012 [P] [US1] Implementar salvamento do snapshot integral de rascunho em `app/Actions/SaveInstitutionalPageDraft.php` e promoção do rascunho para publicado em `app/Actions/PublishInstitutionalPageDraft.php`, mantendo autor/horário e removendo assets substituídos somente depois do sucesso.
- [X] T013 [US1] Criar `app/Http/Controllers/InstitutionalPageAdminController.php` para exibir estado publicado/rascunho com `institucional.view`, salvar com `institucional.edit` e publicar apenas o rascunho corrente; registrar as ações autorizadas sem persistir conteúdo do rascunho na resposta pública.
- [X] T014 [US1] Criar a interface administrativa em `resources/js/pages/institutional-page/edit.tsx` com edição da identidade, campos das seções predefinidas, upload e remoção de imagens, ativação e ordenação, prévia do rascunho, estado/autoria/horário e botões separados para salvar rascunho e publicar; exibir erros de validação e bloquear controles de edição sem `institucional.edit`.

**Checkpoint**: O responsável autorizado consegue salvar, revisar e publicar o conteúdo; o visitante vê a nova versão somente depois da publicação.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verificar as duas histórias integradas e atualizar as instruções de validação.

- [X] T015 Executar os testes `tests/Feature/InstitutionalPageManagementTest.php`, `tests/Feature/InstitutionalLandingPageTest.php` e `tests/Feature/AccessGroupManagementTest.php` via Docker Compose e corrigir falhas de contrato, autorização, publicação ou limpeza de assets.
- [X] T016 Executar Pint e PHPStan nos arquivos de `app/` e `tests/`, e verificação TypeScript/build nos arquivos de `resources/js/` usando Docker Compose; corrigir os arquivos da feature reportados pelos gates.
- [X] T017 Conferir e ajustar os comandos Docker e filtros dos testes em `specs/005-landing-page-institucional/quickstart.md` para corresponder aos scripts e classes realmente executados.
- [X] T018 Executar os passos de validação manual de `specs/005-landing-page-institucional/quickstart.md` e confirmar que a página pública, a prévia administrativa, o fallback de marca e a identidade compartilhada correspondem aos contratos.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: usa o projeto e serviços existentes; não requer alteração de infraestrutura ou dependências.
- **Foundational (Phase 2)**: T001 → T002 → T003 → T004; bloqueia ambas as histórias.
- **User Stories**: US2 começa após a fundação; US1 começa após US2 porque seu teste independente exige uma página pública que consuma o snapshot publicado.
- **Polish (Phase 5)**: depende de US1 e US2 completas.

### User Story Dependencies

- **User Story 2 (P1)**: depende apenas da fundação (T001–T004) e pode ser testada com snapshots publicados em fixtures, sem o painel administrativo.
- **User Story 1 (P1)**: depende da fundação e de US2 para provar ponta a ponta que a publicação muda o conteúdo público e a marca.

### Within Each User Story

- Escrever os testes T005 e T008–T009 antes da implementação da história correspondente.
- Em US2, controller precede a página React; a rota foi registrada na fundação.
- Em US1, permissão, request e ações podem avançar em paralelo após os testes; controller depende desses contratos; UI depende das rotas e props do controller.
- Manter a integração pública e administrativa nas rotas registradas pela fundação evita alterações concorrentes em `routes/web.php`.

### Parallel Opportunities

- T008 e T009 podem ser escritos em paralelo com as tarefas de US2; cada teste usa um arquivo próprio.
- Em US1, T010, T011 e T012 podem ser implementadas em paralelo após T008–T009, pois alteram arquivos distintos.
- Testes do backend e do grupo de acesso podem ser executados em paralelo após os fluxos estarem implementados.
- US2 é uma entrega pública utilizável antes do editor; US1 adiciona a manutenção autenticada sobre a página existente.

---

## Parallel Example: Foundation, Public Page, and Administration

```text
# Depois de T001–T004:
Responsável A: T005 (tests/Feature/InstitutionalLandingPageTest.php)
Responsável B: T008 e T009 (tests/Feature/InstitutionalPageManagementTest.php,
                             tests/Feature/AccessGroupManagementTest.php)

# Após T005 estar definido:
Responsável A: T006 → T007 (controller público → página React)

# Depois de US2 e dos testes T008–T009:
Responsável A: T010 (catálogo e UI das permissões)
Responsável B: T011 (request de validação)
Responsável C: T012 (ações de rascunho/publicação)
# Integração sequencial: T013 → T014
```

---

## Implementation Strategy

### MVP First

As duas histórias P1 são necessárias para concluir a feature solicitada. US2 pode ser entregue primeiro como landing com conteúdo padrão/publicado; US1 habilita administradores a manter identidade e conteúdo sem mudanças no código.

1. Completar a fundação T001–T004.
2. Entregar US2: conteúdo padrão, leitura pública e acesso ao login.
3. Entregar US1: permissão, rascunho, prévia administrativa e publicação explícita.
4. Validar que o rascunho não é público e que a publicação sincroniza a marca da aplicação.

### Incremental Delivery

1. Foundation → estrutura de snapshot, fallback, identidade e rotas.
2. US2 → landing pública útil com fallback e conteúdo publicado.
3. US1 → administração da landing, grants por cargo, edição e publicação.
4. Polish → gates automatizados e quickstart de ponta a ponta.

## Notes

- `[P]` indica somente tarefas em arquivos distintos sem dependências pendentes.
- Os testes devem validar autorização e isolamento de estado, não apenas renderização.
- Histórico de versões, layouts livres e publicação agendada não fazem parte desta implementação.

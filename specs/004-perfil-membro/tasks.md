---
description: "Tasks for member profile self-service and administration"
---

# Tasks: Perfil do membro

**Input**: Design documents from `/specs/004-perfil-membro/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/profile-routes.md](contracts/profile-routes.md)

**Tests**: Incluídos porque os critérios SC-002, SC-003, SC-004, SC-005 e SC-006 exigem verificação automatizada de autorização, CPF, motos, permissões e acesso administrativo.

**Organization**: Tarefas agrupadas por história para manter incrementos verificáveis.

## Format: `- [ ] ID [P?] [Story?] Descrição`

- **[P]**: Arquivos diferentes e sem dependência de tarefa incompleta.
- **[Story]**: História correspondente à especificação.
- Toda tarefa indica os caminhos que serão criados ou alterados.

## Phase 1: Setup

**Purpose**: O projeto Laravel, React/Inertia e Docker Compose já está configurado. Não há inicialização de projeto nem dependências novas necessárias para esta feature.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Adicionar os campos compartilhados do cadastro e expô-los no modelo antes dos incrementos de perfil, motos e administração.

- [X] T001 [P] Criar migration em `database/migrations/` para adicionar `cpf CHAR(11) nullable unique`, `birth_date DATE nullable`, `postal_code string(8) nullable`, `address_line string nullable`, `address_number string nullable`, `address_complement string nullable`, `neighborhood string nullable`, `city string nullable`, `state char(2) nullable`, `emergency_contact_name string(255) nullable`, `emergency_contact_relationship string(120) nullable`, `emergency_contact_phone string(40) nullable`, `companion_name string(255) nullable` e `companion_phone string(40) nullable`; novos campos permanecem nullable para preservar membros existentes.
- [X] T002 [P] Atualizar `app/Models/Member.php` para incluir os campos de perfil em `$fillable` e converter `birth_date` para `date`, mantendo os casts existentes de `joined_at` e `left_at`.

**Checkpoint**: Migration preserva dados existentes; o modelo pode ler e gravar os novos campos.

## Phase 3: User Story 1 - Preencher e manter o próprio perfil (Priority: P1) 🎯 MVP

**Goal**: O membro consulta e atualiza apenas seu perfil, vê a data de ingresso e só a altera quando seu grupo de acesso concede a capacidade exclusiva.

**Independent Test**: Conta vinculada sem `cadastros.view/edit` lê e altera os próprios dados; não acessa outro membro; CPF inválido ou duplicado não substitui os dados existentes; `joined_at` é visível e só muda com `membros.edit_joined_at` no grupo ativo do cargo vigente.

### Tests for User Story 1

- [X] T003 [P] [US1] Criar testes em `tests/Feature/MemberProfileTest.php` para leitura/edição própria sem permissão administrativa, rejeição de conta sem membro vinculado, isolamento contra outro membro, bloqueio de `member_id/status/left_at/joined_at` no endpoint geral de perfil e CPF inválido/duplicado sem perda do valor anterior.
- [X] T004 [P] [US1] Criar testes em `tests/Feature/AccessGroupMembershipDatePermissionTest.php` para exibir `joined_at` sem permissão, negar alteração direta sem `membros.edit_joined_at`, permitir com capacidade no grupo ativo do cargo vigente, negar para cargo/grupo inativo e auditar a alteração; confirmar que a capacidade não equivale a `cadastros.edit`.

### Implementation for User Story 1

- [X] T005 [US1] Criar regra de CPF em `app/Rules/ValidCpf.php` e request em `app/Http/Requests/MemberProfileRequest.php`; normalizar CPF para exatamente 11 dígitos, aceitar entrada pontuada ou não, validar dígitos verificadores e unicidade de `members.cpf`; exigir `name string(255)`, `birth_date date` não futura, `phone string(40)`, `postal_code string(8)` com dígitos, `address_line string`, `address_number string` (aceita `s/n`), `neighborhood string`, `city string` e `state char(2)` com UF válida, mantendo `address_complement string` opcional.
- [X] T006 [US1] Criar catálogo de permissões em `app/Support/AccessPermissionCatalog.php` que mantenha os pares atuais de áreas `cadastros,cobrancas,caixa,relatorios,administracao` com ações `view/edit` e adicione somente o par `membros/edit_joined_at` com rótulo “Alterar data de ingresso”; usar lista exata de pares permitidos.
- [X] T007 [US1] Adaptar `app/Http/Requests/AccessGroupRequest.php` e `app/Http/Controllers/AccessGroupController.php` para validar e persistir o novo par usando o catálogo, disponibilizar a permissão e o rótulo à página, e manter a auditoria de criação/alteração de grupos.
- [X] T008 [US1] Atualizar `resources/js/pages/access-groups/index.tsx` para mostrar a capacidade de data de ingresso em seção própria, permitir selecionar/remover o item por grupo e exibi-lo nas permissões efetivas do cargo sem misturá-lo à matriz comum `view/edit`.
- [X] T009 [US1] Criar `app/Http/Controllers/MemberProfileController.php`, registrar rotas em `routes/web.php` e aplicar validação/autorização do contrato: obter membro via `auth()->user()->member`, nunca via ID do cliente; `GET /me/profile` mostra `joined_at`; `PATCH /me/profile` atualiza apenas perfil próprio; `PATCH /me/profile/membership-date` aceita somente data válida, exige `canAccess('membros', 'edit_joined_at')` e audita ator, membro e datas anterior/nova.
- [X] T010 [US1] Criar `resources/js/pages/member-profile/index.tsx`, atualizar `resources/js/components/app-sidebar.tsx` e `app/Http/Middleware/HandleInertiaRequests.php` para disponibilizar navegação ao membro vinculado sem permissões administrativas; usar `resources/js/components/forms/` para exibir/editar dados pessoais, mostrar sempre a data de ingresso e habilitar sua edição somente pela prop de capacidade calculada no servidor; manter PII apenas em memória e avisar sobre alterações não salvas sem gravar CPF/endereço/contatos em `sessionStorage`.

**Checkpoint**: O membro consegue completar o cadastro básico e a data de ingresso obedece à permissão individual tanto na UI quanto no backend.

## Phase 4: User Story 2 - Manter contato de emergência e dados da garupa (Priority: P1)

**Goal**: O membro salva ou limpa os contatos opcionais sem preencher parcialmente cada grupo nem alterar dados de outra pessoa.

**Independent Test**: Salvar perfil sem contatos, preencher contato de emergência com nome/vínculo/telefone e garupa com somente nome/telefone, limpar cada grupo e confirmar persistência; tentativa com campos parciais deve ser recusada.

### Tests for User Story 2

- [X] T011 [P] [US2] Criar testes em `tests/Feature/MemberProfileContactsTest.php` para grupos de contato opcionais completos, vazios e parciais; provar que nome/vínculo/telefone de emergência são gravados juntos e companheiro(a) armazena apenas nome/telefone, sempre no membro autenticado.

### Implementation for User Story 2

- [X] T012 [US2] Criar `app/Http/Requests/MemberProfileContactsRequest.php` com validação em conjunto: contato de emergência usa `name string(255)`, `relationship string(120)` e `phone string(40)` obrigatórios quando qualquer campo é informado; companheiro(a) usa somente `name string(255)` e `phone string(40)`, obrigatórios quando qualquer campo é informado; campos vazios limpam cada grupo.
- [X] T013 [US2] Criar `app/Http/Controllers/MemberProfileContactsController.php` e adicionar `PATCH /me/profile/contacts` em `routes/web.php`; resolver membro da sessão, gravar/limpar os campos no registro `members` sem aceitar `member_id`, CPF ou outros atributos do perfil.
- [X] T014 [US2] Criar `resources/js/components/members/profile-contacts-form.tsx` e integrá-lo em `resources/js/pages/member-profile/index.tsx` com campos nome/vínculo/telefone para emergência e somente nome/telefone para garupa, mensagens de validação e ação para limpar cada grupo opcional.

**Checkpoint**: Os dois grupos opcionais podem ser mantidos de forma independente e não bloqueiam dados pessoais básicos.

## Phase 5: User Story 3 - Cadastrar e manter as próprias motos (Priority: P1)

**Goal**: O membro mantém uma ou mais motos no próprio perfil e encerra vínculos preservando o histórico.

**Independent Test**: Cadastrar duas motos, atualizar uma, encerrar um vínculo e confirmar que ambos os registros permanecem; uma conta não pode editar vínculo pertencente a outro membro; períodos sobrepostos são recusados.

### Tests for User Story 3

- [X] T015 [P] [US3] Criar testes em `tests/Feature/MemberProfileMotorcycleTest.php` para duas motos no mesmo perfil, atualização isolada, encerramento sem apagar vínculo, tentativa de IDOR, identificador já usado e rejeição de períodos sobrepostos.

### Implementation for User Story 3

- [X] T016 [US3] Extrair criação/atualização/encerramento de `app/Http/Controllers/MemberMotorcycleController.php` para `app/Actions/ManageMemberMotorcycle.php`, mantendo `identifier` opcional, string com máximo 32 caracteres e único, `manufacturer/model` obrigatórios com máximo 120 caracteres, `year` opcional inteiro entre 1900 e 2100, `started_at` obrigatório e `ended_at` opcional após ou igual ao início; executar verificação de sobreposição e escrita em transação, reutilizar identificador existente apenas quando fabricante/modelo/ano coincidirem e retornar erro de validação quando divergirem, e nunca apagar `member_motorcycles`.
- [X] T017 [US3] Criar `app/Http/Requests/MemberProfileMotorcycleRequest.php` e `app/Http/Controllers/MemberProfileMotorcycleController.php`; registrar rotas POST/PATCH/DELETE em `routes/web.php`, derivar membro da sessão, limitar atualização ao vínculo próprio e atual, não aceitar IDs de membro/moto do payload, e encerrar por `ended_at` ao invés de excluir histórico.
- [X] T018 [US3] Criar `resources/js/components/members/profile-motorcycles.tsx` e integrar uma seção de frota em `resources/js/pages/member-profile/index.tsx` para cadastrar múltiplas motos, exibir vínculos atuais e encerrados, preencher início padrão com a data atual e oferecer correção/encerramento somente em vínculo atual.

**Checkpoint**: O membro mantém sua frota e histórico sem acesso a vínculos de outros membros.

## Phase 6: User Story 4 - Consultar cadastros no painel administrativo (Priority: P2)

**Goal**: Administradores com permissão existente consultam e mantêm o perfil completo, enquanto listagens e contas sem autorização não recebem dados pessoais.

**Independent Test**: Com `cadastros.view`, abrir detalhe e confirmar leitura de dados; com `cadastros.edit`, alterar dados; sem consulta administrativa, receber recusa; payload da listagem não contém CPF, nascimento, endereço ou contatos.

### Tests for User Story 4

- [X] T019 [P] [US4] Criar testes em `tests/Feature/AdminMemberProfileTest.php` para leitura com `cadastros.view`, alteração com `cadastros.edit`, recusa sem acesso, membros sem conta vinculada e ausência de CPF/nascimento/endereço/contatos no payload da listagem.

### Implementation for User Story 4

- [X] T020 [US4] Atualizar `app/Http/Requests/MemberRequest.php` para validar os novos campos pessoais e de contato como opcionais quando membro legado/incompleto for mantido no painel, aplicar regra de CPF válido/normalizado/único com exclusão do próprio membro, manter autorização `cadastros.edit` e permitir manutenção administrativa de `joined_at` sem exigir `membros.edit_joined_at`.
- [X] T021 [US4] Atualizar `app/Http/Controllers/MemberController.php` para selecionar explicitamente apenas `id,name,email,phone,joined_at,status,left_at` em `index`, carregar campos pessoais/contatos apenas em `show` autorizado, e enviar `canEditMembers` calculado por `cadastros.edit` para distinguir consulta de edição.
- [X] T022 [US4] Atualizar `resources/js/pages/members/show.tsx` para exibir e manter dados pessoais e contatos, esconder/desabilitar campos e ações mutáveis quando `canEditMembers` for falso, e manter motos, cargos e conta segundo as permissões correspondentes; atualizar `resources/js/components/members/role-history.tsx` para respeitar o modo somente leitura e `resources/js/hooks/use-session-draft.ts` para não persistir CPF, nascimento, CEP, endereço, telefones ou dados de contato nos rascunhos.

**Checkpoint**: O painel administrativo mantém compatibilidade com membros sem login e não expõe PII em listagens ou para contas sem autorização.

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validar a feature completa no ambiente Docker e corrigir falhas de integração.

- [X] T023 Validar os cenários de `specs/004-perfil-membro/quickstart.md` no Docker Compose com os testes HTTP de propriedade do perfil/motos, grupos de acesso, auditoria e payloads administrativos, além do build da interface.
- [X] T024 Executar `php artisan test`, `./vendor/bin/pint --test`, `./vendor/bin/phpstan analyse`, `npm run check` nos oito arquivos React alterados, `npm run types:check` e `npm run build` nos serviços `app` e `node` do Docker Compose; corrigir regressões da feature nos caminhos `app/`, `resources/js/`, `routes/web.php` e `tests/Feature/`. O `npm run check` sem caminhos também foi executado e reportou problemas de formatação em 139 arquivos preexistentes/fora do escopo; os arquivos alterados passaram na checagem direcionada.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem tarefas; o projeto já está inicializado e possui Docker Compose.
- **Foundational (Phase 2)**: T001 e T002 preparam o schema/modelo e bloqueiam todas as histórias.
- **US1 (Phase 3)**: Depende da fundação; cria o acesso próprio, o núcleo de autorização e a tela base.
- **US2 (Phase 4)**: Depende da US1 para acrescentar a seção de contatos à página própria.
- **US3 (Phase 5)**: Depende da US1 e da composição do perfil próprio; implementa frota/histórico.
- **US4 (Phase 6)**: Depende apenas da fundação e pode ser desenvolvido em paralelo às histórias próprias, pois usa controllers/pages distintos.
- **Polish (Phase 7)**: Depende das histórias que serão entregues.

### User Story Dependencies

- **US1 (P1)**: Após Phase 2; não depende de outra história.
- **US2 (P1)**: Após US1 para reutilizar a tela de perfil e suas rotas de sessão.
- **US3 (P1)**: Após US1 para integrar a seção de motos na página de perfil; independente da US2 no backend, mas a integração visual deve ocorrer após US2 para evitar conflito no arquivo de página.
- **US4 (P2)**: Após Phase 2; independente das histórias de autoatendimento.

### Parallel Opportunities

- T001 e T002 alteram arquivos diferentes e podem ser executadas em paralelo.
- T003 e T004 são testes em arquivos diferentes e podem ser escritos em paralelo após a fundação.
- Na US1, T005 (validação de CPF) e T006 (catálogo de permissões) são independentes; T007 depende de T006 e T008 depende de T007.
- Na US2, T011 pode ser desenvolvido junto a tarefas independentes da US4; T012 precede T013 e T014 depende do contrato exposto por T013.
- Na US3, T015 pode ser desenvolvido junto à US4; T016 precede a integração dos controllers em T017; T018 depende das rotas e props de T017.
- A US4 pode avançar em paralelo com US1–US3 após a fundação, observando os arquivos exclusivos listados nas tarefas.

## Parallel Example: User Story 1

```text
Após Phase 2:
Trilha A: T003 -> T005 -> T009 -> T010
Trilha B: T004 -> T006 -> T007 -> T008
T009 e T010 integram a tela/rota do perfil; concluir ambas antes do checkpoint da US1.
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir T001–T002 para schema/modelo.
2. Concluir US1 (T003–T010): dados pessoais próprios, CPF e data de ingresso com permissão dedicada.
3. Validar o checkpoint da US1 no Docker; entregar como primeiro incremento utilizável.

### Incremental Delivery

1. Phase 2 + US1: perfil básico e data de ingresso protegida.
2. US2: acrescentar contatos opcionais.
3. US3: acrescentar motos e preservação do histórico.
4. US4: completar manutenção administrativa e privacidade das listagens; pode avançar em paralelo após a fundação.
5. Executar T023–T024 após os incrementos escolhidos.

## Notes

- Todas as tarefas usam checkbox, ID sequencial, rótulo `[P]` somente para paralelismo e `[USn]` em tarefas de história.
- Testes de cada história devem demonstrar os critérios independentes declarados antes do checkpoint daquela história.
- Campos novos permanecem nullable no banco para compatibilidade histórica; os formulários exigem os campos centrais no preenchimento do perfil.
- Nunca usar dados pessoais reais nos testes ou na validação manual.

# Implementation Plan: Perfil do membro

**Branch**: `004-perfil-membro` | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-perfil-membro/spec.md`

## Summary

Implementar perfil de autoatendimento para a conta vinculada ao membro, incluindo dados pessoais, endereço, contatos opcionais e motos, mantendo o cadastro administrativo existente. Dados pessoais e contatos opcionais serão acrescentados a `members`; motos reutilizarão `motorcycles` e `member_motorcycles`. Um item independente de permissão no grupo do cargo vigente controlará a alteração, pelo próprio membro, de `joined_at`.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript 5.7+, React 19
**Primary Dependencies**: Laravel 13.17, Inertia 3, Fortify, Wayfinder, Tailwind CSS 4, componentes shadcn/ui locais
**Storage**: PostgreSQL 17 em Docker Compose
**Testing**: PHPUnit 12, Laravel HTTP/feature tests, Pint, PHPStan/Larastan, `vp check`, TypeScript `tsc`
**Target Platform**: Aplicação web responsiva; desenvolvimento e validação local via Docker Compose
**Project Type**: Aplicação web monolítica Laravel + React/Inertia
**Performance Goals**: Páginas de perfil e gravação devem usar consultas limitadas ao membro autenticado; sem requisito de throughput especial para o volume de um motoclube
**Constraints**: Restringir dados pessoais a acesso próprio ou administrativo autorizado; CPF normalizado e único; operações de perfil não podem depender de `cadastros.view/edit`; listagens administrativas não devem serializar novos campos pessoais; motos mantêm histórico de vínculo; a edição própria de ingresso exige capacidade independente
**Scale/Scope**: 1 cadastro por conta vinculada; múltiplos vínculos de moto por membro; contato de emergência e garupa opcionais, um de cada por membro

## Constitution Check

O arquivo `.specify/memory/constitution.md` contém somente marcadores de modelo não ratificados. Não há princípios de projeto aprovados que imponham gates adicionais. O desenho segue as convenções existentes: Laravel Form Requests, controladores web/Inertia, modelos Eloquent, migrations incrementais, autorização no servidor e testes PHPUnit.

**Gate inicial**: aprovado; sem princípio ratificado violado.

## Project Structure

### Documentation (this feature)

```text
specs/004-perfil-membro/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── profile-routes.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── Http/Controllers/MemberProfileController.php
├── Http/Controllers/MemberProfileContactsController.php
├── Http/Controllers/MemberProfileMotorcycleController.php
├── Http/Requests/MemberProfileRequest.php
├── Http/Requests/MemberProfileContactsRequest.php
├── Http/Requests/MemberProfileMotorcycleRequest.php
├── Models/Member.php
└── Models/AccessGroupPermission.php
database/migrations/
tests/Feature/MemberProfileTest.php
tests/Feature/MemberProfileMotorcycleTest.php
tests/Feature/AccessGroupMembershipDatePermissionTest.php
resources/js/pages/member-profile/
resources/js/components/members/
routes/web.php
```

**Structure Decision**: Manter o monólito atual e adicionar os fluxos de autoatendimento em controladores/requests próprios para não misturar autorização pessoal com edição administrativa. A UI usa React com Inertia e os componentes de formulário já existentes. A interface administrativa de `members/show` continua como ponto de consulta e manutenção autorizada.

## Design Decisions

- Guardar `cpf`, `birth_date` e campos de endereço em `members`; CPF será armazenado somente normalizado (11 dígitos) com índice único. `name` e `phone` existentes permanecem como fonte única.
- Adicionar campos simples do contato de emergência e da garupa diretamente a `members`; há uma pessoa de cada tipo e não há histórico próprio que justifique novas tabelas. A garupa/companheiro(a) tem somente nome e telefone.
- Atualizar contatos opcionais em endpoint dedicado; cada grupo de contato é salvo completo ou limpo completamente, evitando que campos parcialmente preenchidos virem estados ambíguos.
- Reutilizar `motorcycles` e `member_motorcycles`; as rotas de autoatendimento obtêm o membro exclusivamente por `auth()->user()->member_id` e verificam ownership no vínculo para toda mutação.
- Representar a capacidade específica na tabela existente como `area=membros`, `action=edit_joined_at` (compatível com os comprimentos atuais), exibida numa seção separada na matriz de grupos de acesso. Validar pares permitidos por catálogo explícito, sem aceitar combinações arbitrárias de área e ação. `User::canAccess('membros', 'edit_joined_at')` considera apenas o grupo ativo do cargo vigente.
- Separar atualização de `joined_at` no fluxo próprio. Pedido do membro pode alterar somente essa data e requer a nova capacidade; requisições administrativas existentes continuam protegidas por `cadastros.edit`.
- A tela do próprio perfil mostra `joined_at` mesmo sem capacidade de edição. A autorização é sempre revalidada no backend, sem confiar em campos ou flags React.
- Manter `Member.name` como nome do cadastro do clube e `User.name/email` como identidade/login; rotular e editar os campos nos contextos próprios. `Member.email` segue como contato administrativo existente.
- Selecionar explicitamente colunas seguras na listagem administrativa após adicionar CPF/endereço/contatos ao modelo, para não enviar dados pessoais na tabela geral.
- Não persistir rascunho de CPF, nascimento, endereço ou contatos em `sessionStorage`; o formulário próprio pode usar estado Inertia/React em memória e o aviso de alterações pendentes sem armazenamento local de PII.
- Manter auditoria para alterações de permissões e para alteração de `joined_at`; não registrar CPF ou dados de contato em logs/auditoria.

## Constitution Check (post-design)

O desenho preserva autorização no servidor, aplica ownership em toda rota do membro e limita novos dados sensíveis. Nenhuma regra constitucional ratificada se aplica, pois o documento continua no estado de template. A listagem administrativa usa seleção explícita para evitar serialização acidental de PII. Gate aprovado.

## Complexity Tracking

Não há violações de princípios constitucionais nem novos serviços/projetos. Os contatos opcionais ficam como campos do membro porque existe apenas um registro de cada tipo e não há histórico independente requerido.

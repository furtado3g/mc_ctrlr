# Implementation Plan: Áreas de Usuários e Regionalização de Acessos com Divisão por Cidades (Multitenant)

**Branch**: `006-regionalizacao-multitenant` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-regionalizacao-multitenant/spec.md` with requirement "preciso que as regionais sejam divididas também em cidades onde uma regional pode ter n cidades"

## Summary

Expandir a arquitetura multitenant para suportar a divisão de cada `Regional` em uma ou mais cidades (`1 Regional : N Cidades`). A entidade `RegionalCity` modela os municípios atendidos por cada regional, com identificação da cidade sede (`is_headquarters`). A interface de gerenciamento de regionais permite adicionar, editar e remover cidades atomicamente. Os membros podem ser vinculados a uma cidade da sua regional (`regional_city_id`), permitindo consultas e filtros refinados por município, mantendo o isolamento de escopo regional nos caixas, cobranças e relatórios.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript 5.7+, React 19  
**Primary Dependencies**: Laravel 13.17, Inertia 3, Fortify, Tailwind CSS 4, shadcn/ui  
**Storage**: PostgreSQL 17 em Docker Compose (Single database, shared schema com foreign key `regional_id` e relação `regional_cities`)  
**Testing**: PHPUnit 12, Laravel Feature Tests, Pint, Larastan, TypeScript `tsc`  
**Target Platform**: Aplicação web responsiva; ambiente local e produção via Docker Compose  
**Project Type**: Monolito web Laravel + React/Inertia  
**Performance Goals**: Consultas filtradas por `regional_id` e `regional_city_id` indexados devem responder em < 500ms; carregamento eager-loaded de cidades sem N+1 queries  
**Constraints**: Isolamento lógico estrito; bloqueio total de IDOR entre regionais (HTTP 403); integridade referencial com bloqueio de exclusão de cidades com membros vinculados (`RESTRICT`); migração transparente de dados legados  
**Scale/Scope**: Suporte a dezenas de regionais simultâneas e centenas de cidades agregadas com dezenas de milhares de registros segregados  

## Constitution Check

O arquivo `.specify/memory/constitution.md` não possui princípios ratificados que imponham restrições adicionais. O plano adota as convenções canônicas do projeto: migrations incrementais com dados de fallback, traits/scopes Eloquent para escopo regional automático, Form Requests para validação, políticas de autorização Laravel e suíte de testes de integração em `tests/Feature/`.

**Gate inicial**: aprovado; sem princípios violados.

## Project Structure

### Documentation (this feature)

```text
specs/006-regionalizacao-multitenant/
├── plan.md              # Este arquivo
├── research.md          # Decisões arquiteturais e modelagem de cidades
├── data-model.md        # Entidades regionals, regional_cities, users, members
├── quickstart.md        # Cenários de validação end-to-end com cidades
├── contracts/
│   └── regional-routes.md # Contratos de endpoints REST/Inertia
└── tasks.md             # Tarefas de implementação (/speckit-tasks)
```

### Source Code (repository root)

```text
app/
├── Actions/
│   └── SetActiveRegionalContext.php
├── Http/
│   ├── Controllers/
│   │   ├── RegionalController.php          # Atualizado para gerenciar cidades da regional
│   │   ├── RegionalContextController.php
│   │   └── MemberController.php            # Atualizado para suportar regional_city_id
│   ├── Middleware/
│   │   ├── EnsureUserBelongsToRegional.php
│   │   └── HandleInertiaRequests.php
│   └── Requests/
│       ├── RegionalRequest.php             # Validação do array cities.*
│       ├── MemberRequest.php               # Validação de regional_city_id pertencente à regional
│       └── AdminUserRequest.php
├── Models/
│   ├── Regional.php                        # Relação hasMany(RegionalCity)
│   ├── RegionalCity.php                    # Novo model da cidade da regional
│   ├── User.php
│   ├── Member.php                          # Relação belongsTo(RegionalCity)
│   ├── Fee.php
│   ├── CashMovement.php
│   └── BillingPeriod.php
├── Scopes/
│   └── RegionalScope.php
└── Traits/
    └── BelongsToRegional.php

database/migrations/
├── 2026_09_30_000001_create_regionals_table.php
├── 2026_09_30_000002_add_regional_id_to_tenanted_tables.php
├── 2026_09_30_000003_add_regional_composite_indexes.php
├── 2026_09_30_000004_create_regional_cities_table.php       # Nova migration: tabela regional_cities + seed
└── 2026_09_30_000005_add_regional_city_id_to_members.php   # Nova migration: regional_city_id em members

resources/js/
├── components/
│   ├── app-sidebar.tsx                     # Seletor de regional
│   └── regional-badge.tsx
├── pages/
│   ├── admin/
│   │   ├── regionals/
│   │   │   ├── index.tsx                   # Listagem com cidades e contagens
│   │   │   └── regional-form.tsx           # Formulário com adição dinâmica de N cidades e sede
│   │   └── users.tsx
│   └── members/
│       └── index.tsx                       # Filtro e alocação de membro por cidade da regional
└── types/
    └── regional.ts                         # Tipos Regional e RegionalCity

tests/Feature/
├── RegionalManagementTest.php              # Testes de CRUD de regional com N cidades e sede
├── RegionalIsolationTest.php               # Testes de isolamento com cidades e anti-IDOR
├── RegionalContextSwitchTest.php
├── AdminUserRegionalTest.php
└── RegionalReportConsolidationTest.php
```

## Complexity Tracking

Não há violações de complexidade nem padrões exóticos. A introdução da tabela `regional_cities` e da chave estrangeira `regional_city_id` em `members` é a abordagem relacional mais limpa e canônica para atender ao requisito de N cidades por regional (YAGNI).

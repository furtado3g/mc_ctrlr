# Implementation Plan: Gestão do motoclube

**Branch**: `001-gestao-motoclube` (identificador Spec Kit; Git não inicializado) | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: `specs/001-gestao-motoclube/spec.md`

## Summary

Criar painel administrativo para membros, motos, hierarquia, mensalidades, caixa consolidado e relatórios. Usar uma aplicação Laravel com starter kit React/Inertia. Regras financeiras e permissões ficam no servidor; PostgreSQL garante unicidade e transações; comprovantes ficam em armazenamento privado.

## Technical Context

**Language/Version**: PHP 8.3+ com Laravel 13; TypeScript com React 19

**Primary Dependencies**: Starter kit Laravel React, Inertia 3, Tailwind CSS 4, shadcn/ui, Vite

**Storage**: PostgreSQL; disco privado Laravel para comprovantes

**Testing**: PHPUnit/Pest conforme starter kit; integração HTTP e transacional; interface nos fluxos críticos

**Target Platform**: Navegadores modernos em desktop e celular; servidor Linux com PHP 8.3+ e PostgreSQL

**Project Type**: Aplicação web monolítica com páginas React via Inertia

**Performance Goals**: Gerar 500 mensalidades em 2 minutos; relatórios com até 10 mil movimentos em 5 segundos

**Constraints**: BRL; fuso America/Sao_Paulo; valores em centavos inteiros; caixa único; operações financeiras atômicas e auditáveis; sem integração bancária

**Scale/Scope**: Um motoclube, 500 membros e 10 mil movimentos no conjunto de homologação

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` contém somente placeholders, sem princípios ratificados. Nenhuma regra aplicável ou violação a justificar. O plano preserva as restrições da especificação.

## Project Structure

### Documentation (this feature)

```text
specs/001-gestao-motoclube/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/admin-routes.md
└── tasks.md               # $speckit-tasks
```

### Source Code (repository root)

```text
app/
├── Actions/               # emissão, pagamentos, estornos e caixa
├── Http/Controllers/
├── Http/Requests/
├── Models/
├── Policies/
└── Reports/
database/{migrations,factories,seeders}/
resources/{css,js}/
resources/js/{components/ui,layouts,pages,types}/
routes/web.php
tests/{Feature,Unit}/
```

**Structure Decision**: Uma aplicação Laravel concentra rotas, autenticação e domínio. React fica em `resources/js`; Inertia evita API pública separada. O repositório contém apenas Spec Kit, portanto esses diretórios serão criados na implementação.

## Design Sequence

1. Inicializar starter kit, acesso administrativo e permissões.
2. Implementar membros, motos, cargos e históricos.
3. Implementar períodos e emissão idempotente de mensalidades.
4. Implementar pagamentos, caixa e estornos transacionais.
5. Implementar comprovantes, relatórios e exportações.
6. Validar jornadas, concorrência, autorização e metas da especificação.

## Post-Design Constitution Check

Gate aprovado: não há constituição ratificada. O desenho mantém caixa único, cobrança integral para membros ativos na emissão e ausência de juros automáticos.

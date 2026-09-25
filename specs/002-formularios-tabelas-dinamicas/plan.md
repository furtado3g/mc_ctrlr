# Implementation Plan: Formulários e tabelas dinâmicas

**Branch**: `002-formularios-tabelas-dinamicas` | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-formularios-tabelas-dinamicas/spec.md`

## Summary

Padronizar a experiência de preenchimento e consulta do painel administrativo existente. Formulários passarão a compartilhar estados de validação, submissão, aviso de saída e rascunho temporário por sessão. Tabelas passarão a compartilhar busca, filtros, ordenação, paginação, estados de carregamento e expansão responsiva; a consulta canônica será validada no servidor e preservada na sessão, sem query string. Os registros oficiais, regras financeiras e permissões existentes permanecem inalterados.

## Technical Context

**Language/Version**: PHP 8.3; TypeScript 5.7; JavaScript/React 19

**Primary Dependencies**: Laravel 13, Inertia Laravel/React 3, Tailwind CSS 4, shadcn/ui, `@inertiajs/react` `useForm`, PostgreSQL 17

**Storage**: PostgreSQL para registros oficiais e sessões Laravel; `sessionStorage` do navegador para rascunhos temporários, com escopo versionado da sessão

**Testing**: PHPUnit/Laravel Feature tests, PHPStan/Larastan, TypeScript `tsc --noEmit`, build Vite Plus; validação manual responsiva no quickstart

**Target Platform**: Painel web responsivo em navegadores modernos, servido pelo contêiner Docker da aplicação

**Project Type**: Aplicação web administrativa monolítica com frontend React/Inertia e backend Laravel

**Performance Goals**: 95% das buscas, filtros, ordenações e mudanças de página em tabelas de 10.000 registros em até 3 segundos; sem perda ou duplicação de linhas durante atualizações

**Constraints**: URL não expõe estado de tabela; consultas e mutações respeitam autorização do servidor; rascunhos não armazenam senhas, arquivos ou credenciais; telas estreitas usam expansão de linha para detalhes; manter compatibilidade com os endpoints e entidades atuais

**Scale/Scope**: Todas as listas administrativas de membros, motos, cargos, mensalidades, caixa, relatórios, usuários e permissões; dezenas de campos de formulário; tabelas testadas até 10.000 movimentos/registros

## Constitution Check

O arquivo de constituição contém apenas placeholders e não define princípios ratificados, gates de testes ou restrições adicionais. Não há regra ativa a violar.

| Gate | Resultado | Evidência |
|---|---|---|
| Escopo focado em valor do usuário | PASS | Revisão limitada a formulários, tabelas e estados temporários; domínio oficial preservado |
| Segurança e autorização | PASS | Consultas e mutações continuam autorizadas no servidor; rascunhos excluem segredos e arquivos |
| Testabilidade | PASS | Contratos, cenários, testes de feature, TypeScript, análise estática e benchmark definidos |
| Simplicidade | PASS | Componentes compartilhados próprios; nenhuma nova biblioteca de grid ou entidade persistente |

## Project Structure

### Documentation (this feature)

```text
specs/002-formularios-tabelas-dinamicas/
├── plan.md                         # Este plano
├── research.md                     # Decisões e alternativas pesquisadas
├── data-model.md                   # Estado de sessão e view models
├── quickstart.md                   # Validação manual e automatizada
├── contracts/
│   └── ui-contracts.md             # Contratos de tabelas e formulários
└── tasks.md                        # Gerado posteriormente por $speckit-tasks
```

### Source Code (repository root)

```text
app/
├── Http/Controllers/               # Consultas e mutações de estado de tabelas
├── Http/Middleware/                # Escopo temporário da sessão e compartilhamento Inertia
├── Http/Requests/                  # Validação de filtros, ordenação e campos
└── Support/                        # Normalização/regras compartilhadas, se necessário

resources/js/
├── components/forms/               # Campo, erros, submissão, dirty state e draft
├── components/tables/              # DataTable, filtros, paginação e linha expansível
├── hooks/                          # useSessionDraft e estado de navegação/consulta
├── pages/                          # Adaptação das páginas existentes por recurso
└── types/                          # Contratos de FormState e DynamicTableState

tests/Feature/
├── MotoclubFormExperienceTest.php  # Validação de erros, autorização e submissões
└── MotoclubTableQueryTest.php      # Estado da sessão, filtros, ordenação e paginação
tests/Browser/                      # Se o ambiente de navegador for disponibilizado
```

**Structure Decision**: Manter o monólito Laravel/Inertia atual. A lógica de dados, autorização e filtros permanece no backend; componentes e hooks React centralizam a experiência visual no frontend. Não será criada uma aplicação frontend separada nem camada de API paralela.

## Phase 0: Research Complete

As decisões e alternativas estão em [research.md](research.md): sessão Laravel para estado canônico de tabelas, `sessionStorage` versionado para rascunhos, `useForm` para ciclo de formulário, tabela server-driven própria, allowlist de ordenação e linha expansível em telas estreitas.

## Phase 1: Design Complete

- [data-model.md](data-model.md) define `table_queries`, `form_drafts`, `DynamicTableState` e `FormState`, sem novas entidades oficiais.
- [contracts/ui-contracts.md](contracts/ui-contracts.md) define os contratos observáveis de consulta, formulário, responsividade e acessibilidade.
- [quickstart.md](quickstart.md) define os comandos e cenários de validação, incluindo 10.000 registros, autorização e rascunhos.

## Implementation Sequence

1. Criar tipos, normalizadores e hooks compartilhados para `FormState`, `DynamicTableState`, rascunhos e confirmação de navegação.
2. Adicionar o escopo opaco da sessão e ações autorizadas para salvar, ler, limpar e validar consultas de tabela; adaptar primeiro membros e mensalidades como referência.
3. Criar o componente `DataTable` server-driven com busca, filtros, ordenação allowlisted, paginação, loading, empty states e expansão móvel.
4. Migrar formulários de membros, motos, cargos, períodos, mensalidades, pagamentos, caixa, usuários e permissões para o ciclo compartilhado de formulário.
5. Migrar tabelas de membros, mensalidades, caixa, relatórios, cargos e usuários, mantendo exportações com o mesmo estado de filtro da sessão.
6. Cobrir autorização, validação, restauração/limpeza de rascunho, concorrência de atualização, página inválida e desempenho com testes automatizados e quickstart.

## Complexity Tracking

Nenhuma violação de constituição exige justificativa. A funcionalidade usa os componentes e a sessão existentes e não adiciona persistência oficial ou dependências externas.

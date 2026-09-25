# Research: Gestão do motoclube

## Aplicação e interface

**Decision**: Laravel 13 com starter kit React, Inertia 3, TypeScript, Tailwind 4 e shadcn/ui.

**Rationale**: O kit oficial reúne a pilha solicitada e autenticação. Inertia permite páginas React com rotas e permissões no Laravel. Laravel 13 requer PHP 8.3+. Fontes: [starter kit](https://laravel.com/framework/docs/starter-kits), [versões](https://laravel.com/framework/docs/releases), [shadcn/ui Laravel](https://ui.shadcn.com/docs/installation/laravel).

**Alternatives considered**: API e SPA separadas, que exigiriam autenticação e implantação adicionais; Blade, que não atende ao React pedido.

## Persistência financeira

**Decision**: PostgreSQL; dinheiro em centavos inteiros; restrições únicas e transações para emissão, pagamento e estorno. Bloquear a mensalidade durante pagamento e exigir vínculo único entre pagamento e movimento.

**Rationale**: Evita duplicatas e saldo negativo sob concorrência. Fontes: [transações Laravel](https://laravel.com/framework/docs/database/schema), [bloqueios de linha](https://laravel.com/framework/docs/13.x/queries).

**Alternatives considered**: SQLite em produção; saldos independentes dos movimentos, com maior risco de divergência.

## Segurança e comprovantes

**Decision**: Sessões e políticas Laravel por operação; cadastro público desabilitado após criar o administrador inicial; comprovantes em disco privado, com download autorizado.

**Rationale**: Cargo do clube não concede acesso financeiro. Arquivos financeiros não devem ter URL pública. Fontes: [autenticação](https://laravel.com/framework/docs/13.x/authentication), [arquivos privados](https://laravel.com/framework/docs/filesystem).

**Alternatives considered**: Permissão inferida do cargo; disco público.

## Relatórios e operação

**Decision**: CSV UTF-8 para exportação detalhada e impressão pelo navegador para resumos; incluir filtros, período, geração, categorias e totais. Paginar listas e indexar competência, vencimento, data de movimento e relações.

**Rationale**: CSV permite conferência contábil e recontagem sem integração fiscal eletrônica. Testes de integração devem cobrir transações, autorização e conciliação com 500 membros e 10 mil movimentos.

**Alternatives considered**: PDF como formato único; somente testes unitários, insuficientes para concorrência e restrições do banco.

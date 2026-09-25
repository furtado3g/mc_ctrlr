# Validação: formulários e tabelas dinâmicas

## Verificações automatizadas

- Suíte Laravel completa no Docker: 55 aprovados, 2 ignorados, 278 assertions.
- `TableQueryStateTest` e `DynamicTablesTest`: isolamento por usuário e tabela, autorização, filtros allowlisted, URL sem parâmetros, exportação CSV e 10.001 membros; aprovados.
- TypeScript (`npm run types:check`): aprovado.
- PHPStan (`vendor/bin/phpstan analyse --no-progress --memory-limit=512M`): aprovado sem erros.
- Laravel Pint (`vendor/bin/pint --test`): aprovado após correções automáticas de estilo.
- Build frontend (`npm run build` no serviço Node do Compose): concluída. Vite sinalizou que o pacote opcional `fontaine` não está instalado; não impediu a build.

## Desempenho

Executado `php tests/Performance/benchmark.php` no Docker com 10.000 membros e 10.000 movimentos de caixa. p95 de 30 execuções no serviço PostgreSQL local:

| Consulta | p95 |
| --- | ---: |
| Busca textual | 17,48 ms |
| Filtro por situação | 8,53 ms |
| Ordenação e página | 5,57 ms |

O relatório fiscal levou 2,443 s para montar 10.000 linhas. Não foi adicionada migration de índice: o benchmark ficou abaixo do limite de 3 s e não mostrou necessidade de índice adicional para os fluxos medidos.

## Acessibilidade e validação manual

- Os componentes renderizam labels associados, erros junto ao campo, resumo de validação, foco visível, `aria-expanded` e `aria-controls`; os detalhes responsivos continuam associados ao botão mesmo recolhidos.
- O quickstart descreve verificação visual em 375 px, 768 px e desktop, com teclado e leitor de tela.
- A checagem visual em navegador não foi executada nesta sessão porque não há navegador disponível no ambiente automatizado (`cua.getState()` retornou nenhuma superfície). O teste com participantes também permanece uma atividade moderada fora da execução automatizada.

## Limitações observadas

- O benchmark mede consultas locais no container e não representa latência de rede, carga concorrente ou volume real do motoclube.
- Upload de comprovante permanece opcional; o arquivo é enviado no envio do formulário e não entra no rascunho persistido.

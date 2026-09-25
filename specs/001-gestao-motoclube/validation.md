# Validação da implementação

Data: 25/09/2026. Ambiente: Docker Compose com PHP 8.3, PostgreSQL 17 e Node 24. A aplicação respondeu `HTTP 200` em `http://localhost:8000/login` com os ativos compilados.

| Cenário do quickstart | Resultado | Evidência |
| --- | --- | --- |
| 1. Membro, duas motos, encerramento e reativação | Aprovado | `MotoclubMembersTest::test_member_motorcycle_and_role_history_survive_status_changes` |
| 2. Cargo separado de permissão de caixa | Aprovado | `MotoclubMembersTest::test_hierarchy_does_not_grant_administrative_access` e retorno 403 em `MotoclubFinanceTest` |
| 3. Emissão para ativos sem duplicação | Aprovado | Teste de emissão; benchmark com 500 membros criou 500 e a repetição criou 0 |
| 4. Pagamento parcial, integral e excesso recusado | Aprovado | `MotoclubFinanceTest::test_payment_and_reversal_reconcile_fee_and_cash` |
| 5. Estorno e conciliação | Aprovado | Mesmo teste: saldo da mensalidade e caixa voltam juntos |
| 6. Lançamentos, comprovante privado e correção auditada | Aprovado | Testes de comprovante privado e correção do caixa |
| 7. Relatório fiscal e período vazio | Aprovado | Testes de exportação CSV, totais de caixa e período vazio |
| 8. Desempenho | Aprovado | `tests/Performance/benchmark.php`: emissão 500 = 1,417 s; segunda emissão = 0 novas; saldo 10 mil = 0,023 s; relatório fiscal 10 mil = 1,955 s |

`php artisan test`: 45 aprovados, 2 ignorados porque o cadastro público está desativado, 179 asserções. `phpstan analyse`: sem erros. `npm run types:check` e `npm run build`: aprovados. O benchmark executa em transação revertida, sem conservar os dados de medição.

Os testes exercitam as rotas HTTP e a lógica de negócio; não houve inspeção visual interativa porque nenhum navegador estava disponível no ambiente. Os critérios SC-001 e SC-004 dependem de um teste de uso com participantes e permanecem sem medição. No benchmark, 10 mil movimentos sintéticos produziram entradas e saídas iguais de 500.000 centavos e saldo final zero; os testes de integração também verificam a conciliação em cenários menores.

# Data Model: Gestão do motoclube

Valores monetários são inteiros em centavos de BRL; datas e horários persistem em UTC e são exibidos em `America/Sao_Paulo`. Chaves primárias são IDs internos. Registros financeiros e históricos não sofrem exclusão física no uso normal.

| Entidade | Campos principais | Relações e restrições |
|---|---|---|
| User | nome, email único, senha, ativo | Usuário do painel; acesso independente de cargo do clube. |
| PermissionGrant | user_id, área, ação, concedido_por, concedido_em | Único por usuário, área e ação; áreas: cadastros, cobranças, caixa, relatórios, administração. |
| Member | nome, email opcional, telefone opcional, ingresso_em, situação, desligamento_em | Situação `ativo` ou `desligado`; identificação interna única; contato não é identificador único. |
| Motorcycle | identificação, fabricante, modelo, ano opcional | Identificação normalizada única quando informada; histórico de propriedade em MemberMotorcycle. |
| MemberMotorcycle | member_id, motorcycle_id, início, fim | Um vínculo ativo por moto; intervalos não se sobrepõem para a mesma moto. |
| ClubRole | nome único, ordem única, ativo | Posição na hierarquia, sem efeito automático nas permissões do painel. |
| RoleAssignment | member_id, club_role_id, início, fim | Histórico; impedir intervalos sobrepostos para o mesmo cargo e membro quando a regra do clube exigir titular único. Por padrão, múltiplos membros podem ter o mesmo cargo. |
| BillingPeriod | competência (`AAAA-MM`), vencimento_em, valor_padrão_centavos, estado | Competência única; estado `aberto` ou `encerrado`; valor positivo. |
| Fee | member_id, billing_period_id, valor_emitido_centavos, ajuste_centavos, ajuste_motivo, estado | Único por membro e período. Saldo = emitido + ajustes válidos − pagamentos válidos; nunca negativo. |
| Payment | fee_id, valor_centavos, pago_em, forma, referência opcional, estado, registrado_por | Valor positivo; estado `confirmado` ou `estornado`; estorno requer motivo, autor e data. |
| CashMovement | tipo, valor_centavos, ocorrido_em, categoria, descrição, origem, payment_id opcional, estado, criado_por | Entrada ou saída; pagamento confirmado tem exatamente um movimento vinculado; `payment_id` único; caixa é consolidado. |
| CashCorrection | movement_id, ação, motivo, antes, depois, autor, criado_em | Trilha imutável para alteração ou estorno de movimento manual; correção de movimento de mensalidade é feita via pagamento. |
| Receipt | movement_id único, caminho_privado, nome_original, tipo, tamanho, enviado_por, enviado_em | Comprovante opcional, consultado somente com permissão financeira. |
| AuditEvent | entidade, entidade_id, ação, autor, ocorrido_em, dados_anteriores, dados_novos | Histórico financeiro imutável de emissão, ajuste, pagamento, correção e estorno. |

## Regras e transições

- `Member`: ativo → desligado; reativação explícita mantém todo o histórico. A emissão seleciona apenas membros ativos no instante da geração, com valor integral mesmo após ingresso durante a competência.
- `BillingPeriod`: aberto → encerrado; período encerrado não aceita nova emissão. Alterar valor padrão não altera mensalidades existentes.
- `Fee`: em aberto → parcialmente paga → paga, conforme saldo; vencida é uma apresentação de saldo positivo após vencimento, sem multa ou juros automáticos. Estorno pode fazer a cobrança voltar a parcialmente paga ou em aberto.
- `Payment`: confirmado → estornado; não há exclusão. Registro e entrada no caixa ocorrem na mesma transação; estorno reverte o efeito no caixa na mesma transação.
- `CashMovement`: ativo → estornado. Movimento manual pode ser corrigido com trilha de versões; o movimento vinculado a pagamento segue o estado do pagamento.
- Emissão usa unicidade `(member_id, billing_period_id)` e operação repetida retorna as cobranças já existentes sem criar novas. Pagamento bloqueia a mensalidade para calcular saldo. Correção ou estorno financeiro exige justificativa não vazia.
- Saldos do caixa são calculados a partir dos movimentos válidos no intervalo. Saldo inicial inclui movimentos anteriores; nenhum saldo separado por forma de pagamento ou conta.

## Índices e volume

Indexar `fees(billing_period_id, member_id)`, `fees(member_id)`, `payments(fee_id, estado)`, `cash_movements(ocorrido_em, estado)`, `member_motorcycles(motorcycle_id, fim)` e `audit_events(entidade, entidade_id)`. Paginar listagens. Meta de homologação: 500 membros e 10 mil movimentos.

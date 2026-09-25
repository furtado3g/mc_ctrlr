# Contratos de interface administrativa

Todas as rotas exigem sessão autenticada e autorização no servidor. Páginas usam respostas Inertia; comandos de alteração validam campos e redirecionam com mensagem de sucesso ou erros por campo. Exportações retornam CSV UTF-8. Identificadores são IDs internos; valores são enviados em centavos e apresentados em BRL.

| Área | Método e rota | Entrada principal | Resultado e permissão |
|---|---|---|---|
| Painel | GET `/dashboard` | — | Resumo filtrado pelas permissões. |
| Membros | GET `/members`; POST `/members`; GET `/members/{id}`; PATCH `/members/{id}` | Nome, contato, ingresso, situação | Lista paginada, cadastro e histórico; `cadastros.*`. |
| Motos | POST `/members/{id}/motorcycles`; PATCH `/member-motorcycles/{id}` | Moto, início/fim do vínculo | Atualiza vínculo sem apagar histórico; `cadastros.edit`. |
| Hierarquia | GET/POST `/club-roles`; POST `/members/{id}/role-assignments`; PATCH `/role-assignments/{id}` | Cargo, ordem, vigência | Histórico de cargos; `cadastros.*`. |
| Usuários | GET/POST `/admin/users`; PATCH `/admin/users/{id}/permissions` | Usuário, permissões | Apenas `administração.*`; sem cadastro público. |
| Períodos | GET/POST `/billing-periods`; PATCH `/billing-periods/{id}` | Competência, vencimento, valor, estado | Competência única; `cobranças.*`. |
| Emissão | POST `/billing-periods/{id}/generate` | Confirmação | Resultado com criadas, já existentes e inelegíveis; idempotente; `cobranças.edit`. |
| Mensalidades | GET `/fees`; GET `/fees/{id}`; POST `/fees/{id}/adjustments` | Filtros; valor e motivo do ajuste | Lista, histórico e saldo; ajuste exige `cobranças.edit`. |
| Pagamentos | POST `/fees/{id}/payments`; POST `/payments/{id}/reverse` | Valor, data, forma, referência; motivo de estorno | Pagamento e caixa atômicos; `cobranças.edit` e `caixa.edit`. |
| Caixa | GET `/cash`; POST `/cash/movements`; POST `/cash/movements/{id}/corrections`; POST `/cash/movements/{id}/reverse` | Intervalo; tipo, categoria, valor, descrição; motivo | Extrato e saldo consolidado; `caixa.view/edit`. |
| Comprovantes | POST `/cash/movements/{id}/receipt`; GET `/cash/movements/{id}/receipt` | Arquivo opcional | Download privado; `caixa.view/edit`. |
| Relatórios | GET `/reports/fees`; GET `/reports/cash`; GET `/reports/fiscal` | Início/fim, filtros, `format=csv` opcional | Página ou CSV com período, geração e totais; `relatórios.view`. |

## Erros e invariantes observáveis

- Não autenticado: redirecionamento para login. Sem permissão: HTTP 403, sem dados financeiros.
- Dados inválidos: erros de validação por campo; nenhuma alteração parcial.
- Cobrança já existente: emissão informa `já existentes` e não duplica. Período encerrado: emissão recusada.
- Pagamento maior que saldo ou valor não positivo: recusado sem entrada no caixa.
- Estorno repetido: recusado ou tratado como operação já concluída, sem nova reversão; motivo obrigatório.
- Relatório sem linhas: totais zero e indicação de ausência de registros. CSV usa cabeçalho, período, data de geração e colunas de origem para conciliação.
- Comprovante: aceitar apenas tipos configurados e tamanho limitado; falha de upload não expõe arquivo parcial.

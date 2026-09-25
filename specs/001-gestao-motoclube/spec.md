# Feature Specification: Gestão do motoclube

**Feature Branch**: `não criada`
**Created**: 2026-09-25
**Status**: Draft
**Input**: Sistema web para administrar membros, motos, mensalidades, hierarquias, períodos de cobrança, relatórios fiscais e caixa do motoclube.

## Clarifications

### Session 2026-09-25

- Q: Como a mensalidade deve ser cobrada quando um membro entra ou se desliga no meio de um período? → A: Valor integral para quem estiver ativo na geração; exceções por ajuste autorizado.
- Q: As mensalidades vencidas devem receber multa ou juros automaticamente? → A: Sem multa ou juros automáticos.
- Q: Os lançamentos do caixa precisam guardar comprovantes para a prestação de contas? → A: Comprovante opcional por movimento.
- Q: O caixa deve separar saldos por conta, como dinheiro, banco e Pix? → A: Um saldo único para todo o motoclube.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrar membros e motos (Priority: P1)

O administrador cadastra membros, acompanha sua situação e registra motos vinculadas, preservando o histórico de alterações.

**Why this priority**: Os demais controles dependem de cadastros confiáveis.
**Independent Test**: Cadastrar um membro com duas motos, trocar uma moto e consultar o histórico.

**Acceptance Scenarios**:

1. **Given** um administrador autenticado, **When** cadastra um membro com dados válidos, **Then** o membro aparece na lista e pode receber motos.
2. **Given** um membro existente, **When** uma moto deixa de ser vinculada, **Then** a moto sai da lista atual e o vínculo anterior permanece no histórico.
3. **Given** um membro desligado, **When** seu cadastro é consultado, **Then** os registros históricos continuam disponíveis.

---

### User Story 2 - Controlar cargos e acesso (Priority: P1)

O administrador define cargos na hierarquia, atribui cargos a membros e controla separadamente quem pode usar cada área administrativa.

**Why this priority**: Dados pessoais e financeiros exigem acesso restrito.
**Independent Test**: Atribuir cargo e confirmar que um usuário sem permissão financeira não consulta o caixa.

**Acceptance Scenarios**:

1. **Given** um membro ativo, **When** recebe um cargo, **Then** o cargo e seu período de vigência aparecem no perfil.
2. **Given** um usuário sem permissão financeira, **When** tenta consultar o caixa, **Then** o acesso é recusado sem exibir valores.

---

### User Story 3 - Gerir mensalidades (Priority: P1)

O responsável financeiro cria períodos de cobrança, emite mensalidades para membros elegíveis e registra pagamentos parciais ou integrais.

**Why this priority**: A receita recorrente é central para o clube.
**Independent Test**: Criar um período, emitir cobranças e registrar pagamento parcial.

**Acceptance Scenarios**:

1. **Given** um período e membros elegíveis, **When** as mensalidades são geradas, **Then** cada membro recebe no máximo uma cobrança nesse período.
2. **Given** uma cobrança em aberto, **When** um pagamento parcial é registrado, **Then** valor pago, saldo e situação são atualizados.
3. **Given** uma cobrança quitada, **When** é consultada, **Then** seu histórico de pagamentos permanece disponível.

---

### User Story 4 - Controlar o caixa (Priority: P2)

O tesoureiro registra entradas e saídas, consulta extrato e acompanha saldos. Pagamentos de mensalidades são refletidos no caixa uma única vez.

**Why this priority**: Permite conciliar cobranças com recursos disponíveis.
**Independent Test**: Registrar uma despesa e uma mensalidade paga e conferir o saldo.

**Acceptance Scenarios**:

1. **Given** movimentos registrados, **When** o tesoureiro filtra um intervalo, **Then** vê saldo inicial, entradas, saídas e saldo final reconciliáveis com os movimentos.
2. **Given** um pagamento confirmado, **When** o caixa é consultado, **Then** há uma única entrada correspondente.
3. **Given** um lançamento incorreto, **When** é corrigido ou estornado, **Then** o motivo e os dados anteriores permanecem auditáveis.

---

### User Story 5 - Emitir relatórios (Priority: P2)

O responsável financeiro consulta e exporta demonstrativos de mensalidades, inadimplência, caixa e dados de suporte à prestação de contas fiscal.

**Why this priority**: O clube precisa prestar contas e organizar informações para análise contábil.
**Independent Test**: Exportar relatório de um período e comparar totais com cobranças e movimentos.

**Acceptance Scenarios**:

1. **Given** um intervalo de datas, **When** o relatório é gerado, **Then** apresenta o período e totais consistentes com os registros de origem.
2. **Given** nenhuma movimentação no intervalo, **When** o relatório é gerado, **Then** apresenta totais zerados e informa ausência de registros.

### Edge Cases

- Impedir cobrança repetida para o mesmo membro e período.
- Impedir pagamento acima do saldo pendente.
- Preservar cobranças, pagamentos e cargos de membros desligados.
- Mudança do valor padrão não altera cobranças emitidas sem ação explícita e auditável.
- Estorno de pagamento ajusta mensalidade e caixa mantendo histórico.
- Acesso direto a uma operação restrita também exige permissão.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST autenticar usuários administrativos e permitir encerrar a sessão.
- **FR-002**: O sistema MUST permitir criar, consultar, editar e desativar membros com nome, contato, data de ingresso e situação.
- **FR-003**: O sistema MUST permitir vincular múltiplas motos a um membro, registrando identificação, modelo e período do vínculo.
- **FR-004**: O sistema MUST preservar históricos de membros, motos e cargos após alterações.
- **FR-005**: O sistema MUST permitir definir cargos ordenados e atribuí-los a membros com início e fim de vigência.
- **FR-006**: O sistema MUST manter as permissões administrativas independentes dos cargos do clube, configuráveis para cadastros, cobranças, caixa e relatórios.
- **FR-007**: O sistema MUST aplicar permissões a consultas e alterações, inclusive por acesso direto à operação.
- **FR-008**: O sistema MUST permitir criar períodos com competência, vencimento, valor padrão e situação aberta ou encerrada.
- **FR-009**: O sistema MUST emitir no máximo uma mensalidade por membro elegível e período, fixando o valor devido na emissão.
- **FR-019**: O sistema MUST cobrar o valor integral dos membros ativos na data de geração, inclusive quando ingressaram durante o período; exceções exigem ajuste individual autorizado e auditável.
- **FR-020**: O sistema MUST manter o valor devido após o vencimento sem aplicar multa ou juros automáticos.
- **FR-021**: O sistema MUST permitir anexar e consultar um comprovante opcional para cada movimento de caixa, com acesso sujeito à permissão financeira.
- **FR-022**: O sistema MUST manter um saldo único para o caixa do motoclube, sem separar saldos por dinheiro, banco ou Pix.
- **FR-010**: O sistema MUST registrar pagamentos parciais ou integrais com data, valor, forma e referência opcional.
- **FR-011**: O sistema MUST calcular saldo e situação da mensalidade com base no valor emitido e nos pagamentos válidos, recusando excesso.
- **FR-012**: O sistema MUST registrar entradas e saídas do caixa com data, valor, categoria, descrição e responsável; cada pagamento confirmado gera uma única entrada vinculada.
- **FR-013**: O sistema MUST mostrar extrato, saldo inicial, entradas, saídas e saldo final para um intervalo escolhido.
- **FR-014**: O sistema MUST restringir correções e estornos financeiros a usuários autorizados, exigindo motivo e preservando histórico.
- **FR-015**: O sistema MUST permitir filtrar e exportar relatórios de mensalidades, inadimplência e caixa por período.
- **FR-016**: O sistema MUST oferecer relatório de suporte fiscal com entradas, saídas, categorias, datas, referências, totais, intervalo e data de geração.
- **FR-017**: O sistema MUST registrar autor e data de criação, alteração e estorno de informações financeiras.
- **FR-018**: O painel MUST resumir membros ativos, mensalidades em aberto e saldo do caixa conforme as permissões do usuário.

### Key Entities *(include if feature involves data)*

- **Membro**: Pessoa associada ao clube, com contato, ingresso e situação.
- **Moto**: Veículo ligado a um membro durante um período.
- **Cargo e designação**: Posição hierárquica e histórico de ocupantes.
- **Usuário administrativo e permissão**: Credencial e operações autorizadas.
- **Período de cobrança**: Competência, vencimento, valor padrão e situação.
- **Mensalidade**: Valor devido pelo membro em um período e seu saldo.
- **Pagamento**: Parcela recebida para uma mensalidade.
- **Movimento de caixa**: Entrada ou saída, sua origem, correções e comprovante opcional.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um administrador cadastra um membro e uma moto em até 3 minutos em teste de uso.
- **SC-002**: Um responsável gera cobranças para 500 membros em até 2 minutos, sem duplicatas.
- **SC-003**: Em amostra de 100 lançamentos, totais do caixa e relatórios coincidem integralmente com registros de origem.
- **SC-004**: Pelo menos 90% dos participantes de um teste de uso concluem sem ajuda cadastro, pagamento e consulta de extrato.
- **SC-005**: Listas e relatórios para até 10 mil movimentos apresentam resultados em até 5 segundos em condições normais.
- **SC-006**: Todas as tentativas testadas de acesso financeiro por usuários sem permissão são recusadas.

## Assumptions

- A primeira versão atende a um único motoclube e usa reais brasileiros.
- O caixa representa um único saldo consolidado; conciliação por contas financeiras individuais fica fora do escopo inicial.
- Apenas usuários administrativos acessam o painel; área de autoatendimento dos membros fica fora desta entrega.
- Membros ativos na data de geração são elegíveis à mensalidade integral; membros desligados antes dessa data não recebem cobrança automática desse período.
- O relatório fiscal organiza informações para a contabilidade. Emissão de notas, cálculo de tributos e entrega de obrigações legais ficam fora do escopo.
- Pagamentos são confirmados manualmente; integração bancária e cobrança automática ficam fora do escopo.
- A implementação solicitada usará Laravel, React, Tailwind CSS e shadcn/ui; decisões técnicas detalhadas pertencem à fase de planejamento.

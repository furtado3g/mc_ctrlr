# Feature Specification: Áreas de Usuários e Regionalização de Acessos (Multitenant) com Divisão por Cidades

**Feature Branch**: `006-regionalizacao-multitenant`

**Created**: 2026-09-30 | **Updated**: 2026-09-30

**Status**: Draft

**Input**: User description: "preciso desenvolver as areas de usuários e regionalização dos acessos (multitenant)" e "preciso que as regionais sejam divididas também em cidades onde uma regional pode ter n cidades"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastro e Estruturação de Regionais e Cidades (Priority: P1) 🎯 MVP

Como administrador geral do motoclube, desejo cadastrar e gerenciar as regionais (unidades/divisões) do motoclube e suas respectivas cidades de abrangência (onde 1 regional possui N cidades), definindo a cidade sede, status ativo/inativo e responsáveis, para que o sistema possa segregar dados e operações por localidade e município.

**Why this priority**: É o bloco fundacional para qualquer isolamento multitenant e organização territorial. Sem a definição de regionais e suas cidades integradas, nenhum usuário, membro ou registro pode ser contextualizado territorialmente.

**Independent Test**: Um administrador geral acessa a área de regionais, cadastra "Regional Sul" com as cidades Curitiba/PR (Sede), Londrina/PR e Joinville/SC, e cadastra "Regional Sudeste" com São Paulo/SP (Sede) e Campinas/SP, confirmando persistência, vinculação das cidades e auditoria completa.

**Acceptance Scenarios**:

1. **Given** um administrador com permissão de gestão global, **When** ele cadastra uma nova regional com nome, código/sigla, e uma lista de 1 ou mais cidades (definindo uma como cidade sede), **Then** a regional e suas cidades são criadas e disponibilizadas para vinculação de usuários e membros.
2. **Given** uma regional cadastrada com cidades associadas, **When** o administrador edita a regional para adicionar uma nova cidade ou remover uma cidade sem membros vinculados, **Then** as alterações são salvas com sucesso.
3. **Given** uma cidade que possui membros vinculados, **When** o administrador tenta remover essa cidade da regional, **Then** o sistema impede a remoção com mensagem explicativa de restrição de integridade.
4. **Given** uma regional cadastrada com membros ou registros associados, **When** o administrador tenta excluí-la, **Then** o sistema impede a exclusão física e permite apenas a desativação da regional e suas cidades.
5. **Given** uma regional inativa, **When** um operador tenta cadastrar novos membros ou lançamentos nela, **Then** o sistema rejeita a operação com mensagem explicativa.

---

### User Story 2 - Gestão de Usuários e Vínculo a Regionais (Priority: P1)

Como gestor de acessos, desejo criar e manter contas de usuários atribuindo papéis, permissões e seus respectivos escopos de atuação (global ou restrito a uma regional), para que cada operador atue exclusivamente no seu raio de competência.

**Why this priority**: Define as áreas de atuação dos usuários e garante a aplicação de políticas de segurança e privacidade territorial.

**Independent Test**: Cadastrar um usuário operador vinculado exclusivamente à "Regional Sul" com permissão de cadastro; realizar login com este usuário e confirmar que ele só visualiza e manipula registros da "Regional Sul" e das cidades sob sua jurisdição.

**Acceptance Scenarios**:

1. **Given** um administrador atribuindo acessos a um usuário, **When** define o escopo do usuário como "Regional", **Then** deve selecionar obrigatoriamente a regional fixa de atuação do usuário.
2. **Given** um usuário com escopo global (Diretoria Nacional), **When** ele acessa o sistema, **Then** ele tem a visão consolidada ou a capacidade de filtrar o contexto por uma regional específica.
3. **Given** um usuário logado associado à Regional A, **When** tenta acessar diretamente por URL ou formulário um registro pertencente à Regional B, **Then** o sistema nega o acesso com código de autorização 403.

---

### User Story 3 - Segregação Multitenant em Membros, Cobranças e Caixa por Regional e Cidade (Priority: P2)

Como diretor ou operador regional, desejo consultar e gerenciar membros (alocados à sua respectiva cidade dentro da regional), cobranças de mensalidades e movimentações de caixa restritos à minha regional, garantindo a privacidade e a autonomia operacional de cada divisão.

**Why this priority**: Assegura a integridade operacional e financeira descentralizada sem vazamento de informações entre diferentes unidades do motoclube, com organização refinada por município.

**Independent Test**: Logar com usuário da Regional A e cadastrar um membro alocado a uma das cidades da Regional A e uma receita de caixa; logar com usuário da Regional B e verificar que a listagem de membros e o saldo de caixa não contêm nenhum dado da Regional A.

**Acceptance Scenarios**:

1. **Given** um operador da Regional A na tela de membros, **When** cadastra um membro, **Then** ele pode selecionar apenas as cidades vinculadas à Regional A como município de alocação do membro.
2. **Given** a listagem de membros de uma regional, **When** o operador filtra por uma cidade específica pertencente à regional, **Then** apenas os membros daquela cidade são exibidos.
3. **Given** a geração de mensalidades de um período, **When** executada por um operador regional, **Then** as cobranças são emitidas apenas para os membros ativos da sua respectiva regional.
4. **Given** um gestor global visualizando o extrato financeiro ou relatórios, **When** filtra por uma regional específica ou seleciona visão geral, **Then** o sistema apresenta os dados filtrados ou consolidados de acordo com o filtro selecionado.

---

### Edge Cases

- O que acontece se uma cidade for transferida de uma regional para outra? Os membros associados a ela acompanham a nova regional ou devem ser reassociados explicitamente?
- O que acontece quando uma regional possui cidades em mais de uma Unidade Federativa (UF)? O sistema deve permitir que cada cidade tenha sua própria sigla de UF, com uma delas marcada como Sede da regional.
- O que acontece se o usuário autenticado perder o acesso à regional que está selecionada no seu contexto atual?
- Como o sistema se comporta caso uma regional seja desativada enquanto operadores ainda possuem sessões ativas nela?
- Tentativas de injeção ou manipulação manual de identificador de regional ou cidade via parâmetros de requisição (IDOR) devem ser barradas em 100% dos fluxos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir a criação, consulta, atualização e desativação de Regionais do motoclube com identificador único, nome, sigla/código e status.
- **FR-002**: O sistema DEVE permitir que cada Regional seja composta por uma ou mais Cidades (`1 Regional : N Cidades`), onde cada cidade possui nome, UF e indicador de cidade sede (headquarters).
- **FR-003**: Toda Regional DEVE possuir obrigatoriamente pelo menos uma cidade cadastrada, sendo exatamente uma delas designada como cidade sede.
- **FR-004**: O sistema DEVE permitir associar membros a uma cidade específica pertencente à regional do membro (`regional_city_id`).
- **FR-005**: O sistema DEVE permitir classificar usuários entre escopo Global (acesso irrestrito ou alternável a todas as regionais) e escopo Regional (restrito a regional específica).
- **FR-006**: O sistema DEVE aplicar filtros automáticos de escopo regional em todas as consultas e operações de membros, cobranças, caixas e relatórios com base no contexto do usuário autenticado.
- **FR-007**: O sistema DEVE impedir que operadores regionais visualizem, editem ou excluam registros de outras regionais via qualquer canal de entrada.
- **FR-008**: O sistema DEVE permitir que usuários com escopo Global selecionem a regional em foco ou visualizem dados consolidados sem necessidade de efetuar novo login.
- **FR-009**: O sistema DEVE manter o caixa e as cobranças de mensalidades 100% segregados por regional, possuindo cada unidade seu próprio saldo e extrato independente, com consolidação disponível apenas para escopo Global.
- **FR-010**: O sistema DEVE restringir o gerenciamento de usuários e de regionais exclusivamente a Administradores com escopo Global.
- **FR-011**: Todas as alterações de vínculos de regionais, cidades e operações de usuários DEVEM registrar evento na trilha de auditoria contendo autor, data/hora, entidade afetada e valores anteriores/posteriores.

### Key Entities *(include if feature involves data)*

- **Regional (Tenant/Divisão)**: Representa uma unidade, facção ou divisão regional do motoclube. Possui nome, código único, status (ativo/inativo) e relação 1:N com cidades.
- **RegionalCity (Cidade da Regional)**: Representa um município abrangido pela regional. Possui nome, UF (2 caracteres), indicador de cidade sede (`is_headquarters`) e vínculo obrigatório com a regional (`regional_id`).
- **Usuário (User Scope)**: Representa a conta de acesso, configurada com escopo Global ou vinculada a uma regional fixa.
- **Membro Regionalizado e Municipalizado**: Membro vinculado à sua regional (`regional_id`) e, opcionalmente ou obrigatoriamente, à sua cidade específica dentro da regional (`regional_city_id`).
- **Lançamento/Cobrança Regionalizada**: Registros financeiros segregados por regional.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administradores globais conseguem cadastrar uma regional com múltiplas cidades e definir a cidade sede em um único fluxo de interface.
- **SC-002**: 100% das requisições e consultas realizadas por usuários com escopo regional retornam apenas registros associados à sua regional autorizada (zero vazamento de dados inter-regionais).
- **SC-003**: Listagens e cadastros de membros permitem filtrar e selecionar apenas cidades ativas pertencentes à regional ativa.
- **SC-004**: Usuários autorizados com escopo Global conseguem alternar o filtro de regional em foco ou voltar à visão consolidada em até 2 cliques na interface.
- **SC-005**: Tempo de resposta das listagens e filtros regionalizados permanece estável e compatível com os tempos atuais do sistema (< 500ms para consultas rotineiras).
- **SC-006**: Administradores globais conseguem emitir relatórios consolidados somando todas as regionais ou filtrando por regional isolada com 100% de conciliação matemática.

## Assumptions

- O banco de dados continuará utilizando a mesma infraestrutura relacional (PostgreSQL), utilizando isolamento lógico baseado em colunas de escopo (`regional_id`) e relação `regional_cities`.
- Uma regional pode abranger cidades de um mesmo estado ou de estados vizinhos (cada cidade possui seu próprio campo UF).
- A migration de transição criará automaticamente a tabela `regional_cities` e migrará a cidade/UF atual de cada regional existente como sua cidade sede inicial.

# Feature Specification: Grupos de acesso por cargo

**Feature Branch**: `não criada`
**Created**: 2026-09-25
**Status**: Draft — ready for planning
**Input**: User description: "preciso criar grupos de acesso, onde o nivel de acesso será o cargo do membro"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configurar grupos de acesso por cargo (Priority: P1)

Um administrador autorizado define grupos de acesso com permissões por área do sistema e associa cada cargo do motoclube a um grupo. Cargos que não estejam associados a um grupo não concedem permissões administrativas a contas de membros.

**Why this priority**: A associação entre cargo e permissões é a regra central pedida e permite configurar o acesso antes de aplicar a regra a contas.

**Independent Test**: Criar um grupo, selecionar permissões de consulta e alteração, associá-lo a um cargo e confirmar a configuração no cadastro do cargo.

**Acceptance Scenarios**:

1. **Given** um administrador com permissão para gerenciar acesso, **When** cria um grupo com nome e permissões válidas, **Then** o grupo fica disponível para associação a cargos.
2. **Given** um cargo existente, **When** o administrador associa um grupo, **Then** o cargo passa a apresentar esse grupo como sua política de acesso.
3. **Given** um grupo associado a um cargo, **When** o administrador altera as permissões do grupo, **Then** os direitos efetivos ligados ao cargo refletem a configuração atual.

### User Story 2 - Aplicar o acesso efetivo do cargo (Priority: P1)

O sistema permite vincular uma conta própria ao cadastro do membro. Essa conta recebe as permissões do grupo associado ao cargo vigente do membro, sem usar designações encerradas.

**Why this priority**: A configuração só protege o painel quando a regra de cargo é aplicada às contas usadas pelos próprios membros.

**Independent Test**: Criar uma conta vinculada a um membro, associar um grupo de consulta ao cargo vigente dele e verificar que a conta consegue consultar a área liberada e recebe recusa ao tentar uma operação fora do grupo.

**Acceptance Scenarios**:

1. **Given** uma conta autenticada vinculada a um membro com cargo vigente associado a um grupo, **When** consulta uma área liberada pelo grupo, **Then** consegue visualizar os dados autorizados.
2. **Given** a mesma identidade, **When** tenta consultar ou alterar uma área não concedida pelo grupo, **Then** o sistema recusa a operação e não revela dados protegidos.
3. **Given** um membro cujo cargo vigente é alterado ou encerrado, **When** uma nova operação autenticada é realizada, **Then** o acesso efetivo passa a corresponder à nova designação vigente.
4. **Given** um membro sem cargo vigente, **When** sua conta acessa uma área administrativa, **Then** não recebe permissões por cargo.

### User Story 3 - Alterar cargos e grupos com segurança (Priority: P2)

Um administrador revisa as associações e permissões mantendo registro das mudanças e sem remover, por acidente, o acesso necessário para administrar os grupos.

**Why this priority**: Alterações na política de acesso afetam todas as pessoas que recebem permissões por um cargo e precisam ser verificáveis e reversíveis.

**Independent Test**: Alterar a associação de um cargo e suas permissões, consultar o histórico e confirmar que uma conta sem a permissão de administração não altera a política.

**Acceptance Scenarios**:

1. **Given** uma associação existente, **When** ela é alterada ou removida, **Then** a configuração vigente muda e ficam registrados autor, data e valores anteriores e novos.
2. **Given** um usuário sem autorização para administrar acessos, **When** tenta criar, alterar ou remover grupos e associações por uma tela ou endereço direto, **Then** a operação é recusada.
3. **Given** que uma alteração deixaria o sistema sem nenhuma identidade autorizada a administrar acessos, **When** o administrador tenta confirmá-la, **Then** o sistema impede a mudança e explica o motivo.
4. **Given** uma conta vinculada a um membro, **When** o administrador a desativa, **Then** ela não consegue iniciar novas sessões.

### Edge Cases

- Cargo inativo ou designação encerrada não deve conceder permissões.
- Cargo sem grupo associado deve resultar em ausência de permissões concedidas por cargo.
- Grupo inativo ou removido não deve continuar concedendo permissões.
- Um grupo em uso não pode ser removido sem que o administrador resolva as associações existentes.
- A alteração ou revogação do grupo deve ser aplicada na próxima operação protegida, mesmo em uma sessão já autenticada.
- Uma conta de membro sem vínculo válido com membro/cargo não deve receber permissões por cargo.
- Sobreposição de designações vigentes deve seguir uma regra única e determinística, registrada como pressuposto antes da implementação.
- A própria conta de administração não pode perder o último caminho autorizado para gerenciar acessos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que administradores autorizados criem, consultem, alterem, ativem e desativem grupos de acesso.
- **FR-002**: Cada grupo MUST possuir um nome único e uma configuração explícita de permissões de consulta e alteração por área administrativa.
- **FR-003**: O sistema MUST permitir associar no máximo um grupo de acesso a cada cargo do motoclube; um grupo pode ser compartilhado por mais de um cargo.
- **FR-004**: O sistema MUST permitir deixar um cargo sem grupo associado, concedendo a esse cargo zero permissões pelo mecanismo de grupos.
- **FR-005**: O sistema MUST permitir que administrador autorizado vincule uma conta de acesso com email único a um membro e a desative sem excluir o cadastro ou o histórico do membro.
- **FR-006**: O sistema MUST derivar as permissões das contas vinculadas a membros exclusivamente da designação vigente do membro e do grupo ativo associado ao cargo; designações históricas não concedem acesso.
- **FR-007**: O sistema MUST validar permissões tanto na navegação da interface quanto em cada operação protegida, sem depender de controles visuais para segurança.
- **FR-008**: A criação, alteração, ativação, desativação e associação de grupos, assim como a vinculação ou desativação de contas de membros, MUST registrar autor, data e valores anteriores e novos.
- **FR-009**: O sistema MUST impedir que usuários sem autorização administrativa alterem grupos, permissões ou associações, inclusive por acesso direto.
- **FR-010**: O sistema MUST impedir alterações que deixem o motoclube sem uma identidade autorizada a administrar grupos de acesso.
- **FR-011**: As permissões efetivas MUST refletir alterações de grupo ou de cargo na próxima operação protegida, sem depender de novo login.
- **FR-012**: O sistema MUST apresentar, para cada cargo, o grupo associado e as permissões que serão efetivamente concedidas.
- **FR-013**: Contas administrativas existentes, sem vínculo com cadastro de membro, MUST manter o modelo de permissões administrativas vigente; a herança por cargo aplica-se às contas vinculadas a membros.

### Key Entities *(include if feature involves data)*

- **Grupo de acesso**: Conjunto nomeado de permissões de consulta e alteração por área administrativa, com situação ativa/inativa e histórico de mudanças.
- **Cargo**: Posição hierárquica existente no motoclube, podendo estar associada a um grupo de acesso.
- **Designação de cargo**: Período em que um membro ocupa um cargo; somente a designação vigente determina permissões por cargo.
- **Conta de membro**: Credencial vinculada a um único membro e usada por ele para entrar no painel; recebe acesso a partir do cargo vigente.
- **Conta administrativa**: Credencial administrativa existente sem vínculo com membro, que mantém as permissões administrativas configuradas atualmente.
- **Permissão efetiva**: Direito de consulta ou alteração obtido pela associação vigente entre conta do membro, membro, cargo e grupo.
- **Evento de auditoria de acesso**: Registro de quem alterou grupos, permissões ou vínculos, quando ocorreu e quais valores mudaram.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um administrador consegue criar um grupo e associá-lo a um cargo em até 2 minutos em um teste de uso.
- **SC-002**: Em todos os cenários de autorização testados, 100% das operações não concedidas pelo grupo são recusadas, inclusive por endereço direto.
- **SC-003**: Uma mudança de cargo ou grupo passa a valer na primeira operação protegida subsequente, sem exigir novo login.
- **SC-004**: Em uma auditoria de 20 alterações de acesso, 100% apresentam autor, data e valores anterior e novo.
- **SC-005**: Pelo menos 90% dos administradores de teste identificam o grupo e as permissões efetivas de um cargo sem auxílio.

## Assumptions

- A primeira versão reutiliza as áreas administrativas e ações de consulta/alteração existentes: cadastros, cobranças, caixa, relatórios e administração.
- Contas próprias de membros são criadas e vinculadas por um administrador autorizado; não haverá auto cadastro público nesta versão.
- Cada conta de membro é vinculada a um único cadastro de membro; um membro pode ter no máximo uma conta de acesso ativa.
- Contas de membros usam email único e o fluxo existente de autenticação e recuperação de acesso.
- Contas administrativas existentes sem vínculo com membro mantêm as permissões atuais durante esta feature; não são convertidas automaticamente em contas de membros.
- O acesso por cargo usa somente uma designação efetiva por membro. Se houver mais de uma designação vigente, aplica-se o cargo com menor número de ordem, considerado o de maior precedência hierárquica.
- Um cargo sem grupo associado, um cargo inativo ou um grupo inativo concede zero permissões por cargo.
- Uma conta de membro sem cargo vigente ou com cargo/grupo inativo não recebe permissões por cargo; as permissões de contas administrativas existentes continuam seguindo sua configuração própria.
- A operação inicial ainda precisa manter pelo menos uma identidade administrativa autorizada a gerenciar grupos, para evitar bloqueio do motoclube.
- As permissões são verificadas em cada operação, para que mudanças sejam efetivas durante sessões já abertas.

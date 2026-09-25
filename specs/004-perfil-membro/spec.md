# Feature Specification: Perfil do membro

**Feature Branch**: `004-perfil-membro`

**Created**: 2026-09-25

**Status**: Ready for planning

**Input**: User description: "preciso de um modulo aonde o usuário possa informar os teus dados (nome, cpf, dt_nascimento, endereço, telefone, contato de emergencia, dado da garupa(conjugue), dados das motos dos membros)"

## Clarifications

### Session 2026-09-25

- Q: Quais informações deseja armazenar sobre a garupa/companheiro(a)? → A: Somente nome e telefone.
- Q: O membro deve poder consultar desde quando é membro e alterar essa data somente com uma permissão específica? → A: Sim; a data de ingresso deve ser visível ao membro e sua alteração deve exigir uma permissão específica.
- Q: Como a permissão específica para alterar a data de ingresso deve ser concedida? → A: Como item separado nos grupos de acesso por cargo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preencher e manter o próprio perfil (Priority: P1)

Um membro autenticado acessa seu perfil e informa ou atualiza nome, CPF, data de nascimento, endereço e telefone. As informações ficam ligadas ao cadastro do próprio membro.

**Why this priority**: Esses dados formam o cadastro pessoal básico e são necessários para o motoclube manter informações de contato e identificação atualizadas.

**Independent Test**: Com uma conta vinculada a um membro, salvar os dados pessoais e reabrir o perfil para confirmar que foram persistidos; tentar alterar o perfil de outro membro por endereço direto deve ser recusado.

**Acceptance Scenarios**:

1. **Given** um membro autenticado com perfil incompleto, **When** informa os dados pessoais válidos, **Then** o sistema salva esses dados no cadastro vinculado à sua conta.
2. **Given** um membro com perfil existente, **When** atualiza telefone ou endereço, **Then** o perfil passa a apresentar os dados atualizados sem criar outro cadastro de membro.
3. **Given** um membro autenticado, **When** tenta consultar ou alterar os dados pessoais de outro membro, **Then** o sistema recusa a operação e não revela os dados protegidos.
4. **Given** um CPF já cadastrado para outra pessoa, **When** o usuário tenta salvá-lo, **Then** o sistema informa o conflito e mantém os dados anteriores.
5. **Given** um membro autenticado, **When** consulta seu perfil, **Then** consegue ver desde quando é membro; só consegue alterar essa data se o grupo de acesso associado ao seu cargo vigente conceder a permissão específica.

### User Story 2 - Manter contato de emergência e dados da garupa (Priority: P1)

O membro pode registrar e atualizar um contato de emergência e os dados da garupa/companheiro(a), mantendo essas informações associadas ao seu próprio perfil.

**Why this priority**: O motoclube precisa ter contatos úteis em situações de emergência e conhecer a pessoa que acompanha o membro.

**Independent Test**: Salvar contato de emergência e dados da garupa no perfil de um membro e confirmar que os dados aparecem apenas nos acessos autorizados.

**Acceptance Scenarios**:

1. **Given** um membro autenticado, **When** informa nome, vínculo e telefone do contato de emergência, **Then** os dados são salvos no seu perfil.
2. **Given** que o membro tem uma garupa/companheiro(a), **When** informa nome e telefone, **Then** esses dados ficam associados ao membro e podem ser atualizados sem alterar o cadastro de outra pessoa.
3. **Given** um membro sem garupa/companheiro(a) ou sem contato de emergência disponível, **When** salva os demais dados do perfil, **Then** o salvamento é permitido e os campos opcionais ficam vazios.
4. **Given** um usuário sem autorização para consultar dados pessoais de membros, **When** tenta acessar o contato de emergência ou os dados da garupa de outro membro, **Then** o sistema recusa o acesso.

### User Story 3 - Cadastrar e manter as próprias motos (Priority: P1)

O membro informa e atualiza os dados das motos que utiliza, podendo manter mais de uma moto vinculada ao seu cadastro.

**Why this priority**: As motos identificam os veículos ligados ao membro e são parte explícita do cadastro solicitado.

**Independent Test**: Incluir uma moto, atualizar seus dados, incluir uma segunda moto e confirmar que ambas aparecem no perfil do membro correto.

**Acceptance Scenarios**:

1. **Given** um membro autenticado, **When** informa os dados de uma moto, **Then** a moto fica vinculada ao seu cadastro.
2. **Given** um membro com moto cadastrada, **When** corrige os dados ou encerra o vínculo, **Then** o sistema preserva o histórico do vínculo e apresenta a situação atual corretamente.
3. **Given** um membro autenticado, **When** tenta alterar ou encerrar o vínculo de uma moto de outro membro, **Then** o sistema recusa a operação.
4. **Given** um membro com mais de uma moto, **When** consulta seu perfil, **Then** todas as motos e seus vínculos atuais ou encerrados são apresentados de forma identificável.

### User Story 4 - Consultar cadastros no painel administrativo (Priority: P2)

Um administrador autorizado consulta os dados pessoais, os contatos e as motos para manter o cadastro do motoclube atualizado, respeitando as permissões existentes.

**Why this priority**: A secretaria e os responsáveis pelo cadastro precisam conferir as informações, enquanto a edição pelo próprio membro continua disponível.

**Independent Test**: Acessar um cadastro com uma conta autorizada e confirmar a exibição dos dados; repetir com conta sem permissão e confirmar a recusa.

**Acceptance Scenarios**:

1. **Given** um administrador com acesso autorizado a cadastros, **When** abre o cadastro de um membro, **Then** consulta seus dados pessoais, contatos e motos.
2. **Given** um usuário sem permissão para consultar cadastros, **When** tenta abrir os dados pessoais de um membro, **Then** recebe recusa de acesso.

### Edge Cases

- CPF pode ser informado com pontuação ou sem pontuação, mas deve ser validado e comparado pelo mesmo valor normalizado.
- Dois membros não podem usar o mesmo CPF.
- Campos opcionais de contato ou garupa vazios não impedem salvar os outros dados.
- O membro pode ter mais de uma moto; atualizar uma não deve sobrescrever as demais.
- Um membro sem conta vinculada continua administrável por usuários autorizados no painel.
- Desativar a conta ou encerrar o vínculo de login não exclui o cadastro, contatos, motos ou histórico.
- Dados pessoais e de contato não devem aparecer em listagens ou telas para usuários sem autorização.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que cada membro autenticado consulte e atualize somente o perfil do cadastro de membro vinculado à sua conta.
- **FR-002**: O perfil MUST armazenar nome, CPF, data de nascimento, endereço e telefone do membro.
- **FR-003**: O sistema MUST validar o CPF, aceitar entrada com ou sem pontuação, normalizar seu armazenamento e impedir que dois membros usem o mesmo CPF.
- **FR-004**: O endereço MUST permitir registrar CEP, logradouro, número, complemento, bairro, município e UF; complemento pode ficar vazio.
- **FR-005**: O sistema MUST permitir registrar nome, vínculo e telefone de um contato de emergência; esses dados são opcionais.
- **FR-006**: O sistema MUST permitir registrar nome e telefone da garupa/companheiro(a), associados ao membro; ambos são opcionais.
- **FR-007**: O sistema MUST permitir que o membro cadastre e mantenha uma ou mais motos vinculadas ao próprio cadastro, com os dados disponíveis de identificação, fabricante, modelo e ano.
- **FR-008**: Atualizações ou encerramentos de vínculo de moto MUST preservar o histórico já registrado e não alterar motos de outros membros.
- **FR-009**: O sistema MUST autorizar a consulta administrativa desses dados conforme as permissões de cadastro existentes e negar operações diretas sem autorização.
- **FR-010**: O acesso ao próprio perfil e à própria frota MUST estar disponível à conta vinculada mesmo quando o cargo não concede permissões administrativas de consulta ou alteração de cadastros.
- **FR-011**: Usuários administrativos autorizados MUST conseguir consultar e manter os dados do membro sem exigir que o membro possua conta de acesso.
- **FR-012**: Desativar uma conta de acesso ou encerrar um vínculo MUST preservar os dados do membro e o histórico das motos.
- **FR-013**: O sistema MUST mostrar ao membro a data desde quando pertence ao motoclube e MUST exigir uma permissão específica para permitir que essa data seja alterada pelo próprio membro.
- **FR-014**: A permissão específica para alterar a data de ingresso MUST ser um item separado nos grupos de acesso associados aos cargos, independente das permissões comuns de consulta e alteração de cadastros.

### Key Entities

- **Perfil do membro**: Dados pessoais de identificação, nascimento, endereço e telefone pertencentes ao cadastro já existente do membro.
- **Contato de emergência**: Nome, vínculo e telefone de uma pessoa a contatar em caso de emergência; opcional e associado ao perfil do membro.
- **Garupa/companheiro(a)**: Pessoa associada ao membro como acompanhante, com nome e telefone opcionais.
- **Moto do membro**: Veículo identificado por seus dados disponíveis, ligado ao membro por um vínculo que pode ter período de início e encerramento.
- **Conta do membro**: Credencial já vinculada ao cadastro de membro e usada para restringir a edição ao próprio perfil.
- **Data de ingresso**: Data que indica desde quando a pessoa pertence ao motoclube; visível no próprio perfil e alterável somente com permissão específica.
- **Permissão de alteração da data de ingresso**: Concessão própria de um grupo de acesso por cargo que autoriza o membro a alterar a própria data de ingresso.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 90% dos membros de teste conseguem preencher ou atualizar os dados pessoais do perfil em até 5 minutos.
- **SC-002**: Em 100% dos testes, um membro não consegue consultar ou alterar dados pessoais, contatos ou motos de outro membro, inclusive por requisição direta.
- **SC-003**: Em 100% dos testes, CPFs duplicados ou inválidos são recusados antes de substituir qualquer dado já salvo.
- **SC-004**: Membros conseguem manter duas ou mais motos no mesmo perfil sem sobrescrita ou perda de histórico em 100% dos cenários de teste.
- **SC-005**: Administradores de cadastro conseguem consultar os dados do membro, enquanto usuários sem a permissão correspondente recebem recusa em todos os cenários testados.
- **SC-006**: Em 100% dos testes, membros conseguem consultar a própria data de ingresso, e contas sem a permissão específica não conseguem alterá-la.

## Assumptions

- Cada conta de membro está vinculada a um único cadastro de membro, conforme a regra definida na feature de grupos de acesso.
- O membro autenticado pode editar os próprios dados pessoais e motos sem herdar permissões gerais de cadastro para outros membros.
- Contato de emergência e dados da garupa são opcionais; os demais campos pessoais são preenchidos pelo membro no fluxo de cadastro ou edição.
- CPF é um dado único por membro, validado segundo o formato brasileiro; pessoas sem CPF válido exigiriam um fluxo excepcional fora do escopo inicial.
- O endereço é registrado como campos separados para facilitar consulta e prestação de informações.
- A primeira versão mantém uma pessoa como garupa/companheiro(a) associada ao perfil, identificada por nome e telefone; cadastro de filhos ou múltiplos dependentes fica fora do escopo.
- As informações existentes de motos e histórico de vínculos são reutilizadas; o formulário próprio do membro não substitui os controles administrativos do cadastro.
- Administradores podem consultar e editar dados conforme as permissões existentes de cadastros; contatos de emergência e identificadores pessoais seguem restritos a esse acesso autorizado.
- A data de ingresso corresponde à data já mantida no cadastro do membro; sua alteração continua sujeita à nova permissão específica.
- A permissão de auto alteração da data de ingresso é herdada exclusivamente do grupo associado ao cargo vigente do membro; administradores mantêm o cadastro de outros membros conforme suas permissões administrativas existentes.

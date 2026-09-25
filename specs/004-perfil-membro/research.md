# Research: Perfil do membro

## Integração com autenticação e autorização

**Decision**: Expor perfil próprio por rotas autenticadas dedicadas, resolver o membro por `User.member_id` e aplicar `canAccess()` apenas à capacidade de alteração de `joined_at`.

**Rationale**: `User` já tem vínculo único com `Member`; hoje os controladores de `/members/{member}` exigem `cadastros.view` e os Form Requests de cadastro exigem `cadastros.edit`. Reutilizar essas rotas no self-service ampliaria a superfície de acesso e misturaria dois contextos de autorização. A rota dedicada permite acesso ao próprio cadastro sem permissão administrativa e mantém a checagem no servidor.

**Alternatives considered**: Tornar `cadastros.view/edit` implicitamente válido para o perfil próprio foi rejeitado porque daria acesso administrativo a dados de terceiros; reaproveitar somente o endpoint administrativo mistura as regras do membro e do operador.

## Representação da permissão de data de ingresso

**Decision**: Reutilizar `access_group_permissions` com par `area=membros`, `action=edit_joined_at`; apresentar a capacidade como item separado da tabela de permissões por área. A consulta de capacidade segue o cargo ativo de menor `sort_order`, o cargo ativo e seu grupo ativo conforme `User::canAccess()`.

**Rationale**: A tabela tem chave única por grupo/área/ação, aceita área até 32 caracteres e ação até 16; `edit_joined_at` cabe nesse limite. Isso conserva a associação cargo→grupo existente e mantém a capacidade independente de `cadastros.view/edit`, sem introduzir novo mecanismo de permissões.

**Alternatives considered**: Criar nova tabela ou migrar todas as permissões para chaves genéricas adicionaria complexidade sem necessidade para uma única capacidade. Codificar como `cadastros.edit` foi rejeitado porque contradiz o requisito de permissão específica.

## Dados de perfil e CPF

**Decision**: Colocar identificação, endereço, contato de emergência e garupa no registro `members`. Normalizar CPF para dígitos antes da validação de unicidade e persistência, complementando a regra da aplicação com índice único do banco.

**Rationale**: Nome, telefone e data de ingresso já pertencem a `members`; ampliar essa entidade mantém o perfil coeso e evita redundância. Existe somente um contato de emergência e uma garupa, sem histórico individual ou atributos que exijam identidade própria; campos opcionais mantêm o modelo direto. Restrição de banco cobre concorrência entre gravações simultâneas.

**Alternatives considered**: Tabela separada para todo o perfil introduziria uma relação obrigatória adicional em cada leitura; tabelas individuais para cada contato adicionariam entidades e joins sem suportar múltiplos contatos nem histórico requerido nesta versão.

## Motos e histórico

**Decision**: Reutilizar catálogo `motorcycles` e pivô histórico `member_motorcycles`; endpoints de perfil derivam o proprietário da sessão e restringem updates pelo vínculo que pertence a esse membro.

**Rationale**: O banco já guarda identificador, fabricante, modelo, ano e datas do vínculo, e o controller existente valida sobreposição temporal. Essa reutilização preserva o histórico sem criar uma segunda fonte de dados de motos.

**Alternatives considered**: Criar cadastro de motos dentro de `members` duplicaria o modelo e perderia a normalização/histórico existentes. O endpoint administrativo atual, sozinho, não atende ao acesso próprio pois requer `cadastros.edit`.

## Auditoria e minimização de dados

**Decision**: Registrar auditoria da alteração da data de ingresso (ator, membro, valor anterior e novo) e das mudanças na permissão; excluir CPF, endereço, contato de emergência e dados da garupa de snapshots e logs genéricos.

**Rationale**: A data afeta histórico institucional e a capacidade determina quem pode alterá-la. Evitar persistir campos pessoais sensíveis em registros de auditoria reduz exposição adicional.

**Alternatives considered**: Auditar o snapshot integral do membro facilitaria inspeção, mas duplicaria dados sensíveis e não é necessário para comprovar mudança de data ou permissão.

## Minimização dos dados em listagens

**Decision**: Selecionar explicitamente as colunas seguras da tela de listagem administrativa, excluindo CPF, nascimento, endereço, contato de emergência e garupa. Exibir campos sensíveis apenas na página de detalhe protegida por `cadastros.view`.

**Rationale**: `MemberController::index()` serializa atualmente os modelos retornados; adicionar colunas ao modelo faria com que Inertia as enviasse sem necessidade na tabela geral.

**Alternatives considered**: Ocultar os campos somente no React foi rejeitado porque os dados ainda seriam transferidos ao navegador.

## Campos duplicados entre cadastro e conta

**Decision**: `Member.name` é o nome do cadastro do clube; `User.name` e `User.email` continuam representando identidade e login; `Member.email` mantém o email de contato administrativo já existente. Não sincronizar automaticamente os nomes nem misturar email de login e contato.

**Rationale**: O fluxo existente de configurações atualiza `User`, enquanto o cadastro administrativo usa `Member`. Distinguir contextos evita que mudar um atributo de credencial altere o cadastro do clube sem intenção.

**Alternatives considered**: Sincronização automática introduz efeitos colaterais em fluxos existentes e exige decidir qual lado é fonte da verdade em caso de divergência.

## Rascunhos de formulário com dados pessoais

**Decision**: Não armazenar CPF, endereço, nascimento ou telefones de terceiros em `sessionStorage`. O perfil mantém alterações em memória e usa aviso de navegação com alterações não salvas.

**Rationale**: O hook `useSessionDraft` existente grava campos de formulário no armazenamento da sessão do navegador. Esse mecanismo é útil para formulários administrativos, mas duplicaria localmente os dados pessoais desta feature.

**Alternatives considered**: Reutilizar o hook sem filtro deixaria PII acessível a scripts no mesmo origin e persistente na aba após a atualização; não é necessário para atender ao requisito do perfil.

## Acesso de membro desligado

**Decision**: Manter o acesso ao perfil condicionado às regras já existentes de conta ativa/autenticada. Esta feature não adiciona bloqueio extra com base em `members.status`; o vínculo de conta pode ser desativado pelos controles administrativos atuais.

**Rationale**: A especificação garante preservação dos dados ao desativar/encerrar vínculo, mas não define bloqueio de contas ativas para membros desligados. Não ampliar `EnsureActiveUser` evita mudar comportamento de autenticação além do escopo.

**Alternatives considered**: Bloquear automaticamente por status exigiria uma nova regra de ciclo de vida que não foi solicitada.

## Motos compartilhadas e início do vínculo

**Decision**: Restringir a edição de atributos globais da moto no autoatendimento a vínculos atuais e validar novamente ownership do vínculo no backend. Encerrar vínculo preserva o pivô. O membro informa a data inicial do vínculo no cadastro, com início padrão igual à data atual na UI; a permissão especial de data aplica-se somente à associação do membro ao clube (`joined_at`).

**Rationale**: `Motorcycle` pode ser referenciada por vários vínculos, inclusive históricos; alterações por ex-proprietário não devem afetar o cadastro atual de outro membro. A spec não atribui permissão para retroagir a data do vínculo da moto.

**Alternatives considered**: Permitir a qualquer membro editar dados globais da moto, mesmo após fim de vínculo, pode modificar o histórico compartilhado. Forçar sempre a data corrente impediria registrar um vínculo histórico que o próprio cadastro autoriza representar; por isso o formulário recebe data, sem misturar com a capacidade específica de `joined_at`.

Ao cadastrar uma identificação já existente, reutilizar o registro canônico somente se fabricante, modelo e ano coincidirem com os dados informados; caso contrário, retornar erro de validação para evitar que `firstOrCreate` ignore silenciosamente dados divergentes.

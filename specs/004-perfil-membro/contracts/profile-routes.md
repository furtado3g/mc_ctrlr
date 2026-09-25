# Contract: Perfil do membro

Todas as rotas usam sessão web Laravel autenticada, verificada e ativa, com respostas Inertia/redirect e erros de validação Laravel. O servidor obtém o membro próprio por `auth.user.member_id`; cliente não escolhe o `member_id`.

## `GET /me/profile`

Exibe perfil próprio, data de ingresso, contatos e motos atuais/históricas. Sem conta ligada a membro, recusar com 403/404. Props incluem dados desse membro e `canEditJoinedAt` calculado no servidor. Essa flag serve apenas à UI; autorização da escrita é revalidada no endpoint.

## `PATCH /me/profile`

Atualiza nome, CPF, nascimento, telefone e endereço. Não aceita data de ingresso, status, IDs de relações nem identificador de outro membro. CPF pode ser formatado ou não; a resposta de erro de unicidade mantém o estado anterior. Validações retornam erros por campo no padrão Inertia.

## `PATCH /me/profile/contacts`

Atualiza contato de emergência opcional (nome, vínculo e telefone) e companheiro(a) opcional (somente nome e telefone). Cada grupo é validado como conjunto: campos todos vazios removem os dados; preenchimento parcial é recusado. Operação limitada ao membro autenticado.

## `PATCH /me/profile/membership-date`

Atualiza exclusivamente `joined_at`. Requer capacidade do grupo ativo do cargo vigente `membros.edit_joined_at`; sem capacidade retorna 403. Registra ator e valores anterior/novo em auditoria. Data deve ser válida e compatível com as regras de período de membro existentes.

## Motos próprias

- `POST /me/profile/motorcycles`: cadastra ou reutiliza moto e cria vínculo com início/fim informados.
- `PATCH /me/profile/motorcycles/{link}`: atualiza dados da moto e período, somente se o vínculo pertencer ao membro da sessão.
- `DELETE /me/profile/motorcycles/{link}`: encerra o vínculo (define data de fim) sem apagar moto ou histórico; somente vínculo próprio.

Identificador, fabricante, modelo, ano e período seguem as validações de motos existentes. Períodos sobrepostos do mesmo veículo são recusados. Identificador existente só é reutilizado quando fabricante/modelo/ano coincidem; divergência retorna erro de validação sem atualizar o veículo canônico.

## Administração existente

O cadastro administrativo `/members/{member}` continua exigindo `cadastros.view`; alterações existentes seguem `cadastros.edit`. O payload administrativo inclui os novos campos de perfil e relacionamentos opcionais. Alteração de `joined_at` por esse fluxo mantém autorização administrativa existente. Dados pessoais só são serializados em detalhe autorizado, não em listagens gerais.

## Grupos de acesso

Os contratos de criar/atualizar grupo aceitam `permissions` com pares ordinários `area ∈ [cadastros,cobrancas,caixa,relatorios,administracao]`, `action ∈ [view,edit]`, e o item reservado `area=membros`, `action=edit_joined_at`. Qualquer outro par fora da lista é rejeitado. A interface mostra a capacidade de data em seção própria para não confundir com permissões administrativas gerais.

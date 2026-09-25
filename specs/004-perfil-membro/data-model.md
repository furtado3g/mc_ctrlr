# Data Model: Perfil do membro

## Member (`members`)

Expande o registro atual. `name`, `phone`, `joined_at`, `status`, `left_at` e `email` continuam sendo os campos canônicos já usados pelas demais features.

| Field | Type | Rules |
|---|---|---|
| `cpf` | string(11), nullable durante migração | Só dígitos; válido conforme dígitos verificadores do CPF; único entre valores preenchidos |
| `birth_date` | date, nullable durante migração | Data válida e não futura |
| `postal_code` | string(8), nullable durante migração | CEP normalizado em dígitos |
| `address_line` | string, nullable durante migração | Logradouro |
| `address_number` | string, nullable durante migração | Número/complemento de identificação, aceita `s/n` |
| `address_complement` | string nullable | Complemento opcional |
| `neighborhood` | string, nullable durante migração | Bairro |
| `city` | string, nullable durante migração | Município |
| `state` | char(2), nullable durante migração | UF brasileira |
| `emergency_contact_name` | string(255), nullable | Nome do contato de emergência |
| `emergency_contact_relationship` | string(120), nullable | Vínculo com o membro |
| `emergency_contact_phone` | string(40), nullable | Telefone do contato de emergência |
| `companion_name` | string(255), nullable | Nome da garupa/companheiro(a) |
| `companion_phone` | string(40), nullable | Telefone da garupa/companheiro(a) |
| `joined_at` | date | Data de ingresso atual; membro lê sempre; escrita própria requer capacidade independente |

Os campos novos ficam nullable na migration para preservar cadastros existentes; o formulário exige os dados pessoais e endereço especificados antes de salvar um perfil completo. Índices sugeridos: unique parcial/condicional para `cpf` não nulo, conforme suporte do driver de produção; se o mesmo schema precisa funcionar em SQLite de teste, usar unique simples aceitando múltiplos `NULL` nos drivers suportados pelo projeto.

Contato de emergência é opcional como conjunto: quando preenchido, nome, vínculo e telefone são obrigatórios juntos; vazio limpa os três campos. Garupa/companheiro(a) também é opcional como conjunto: nome e telefone são obrigatórios juntos; vazio limpa ambos. Esses campos pertencem a `members` porque existe no máximo uma pessoa de cada tipo e não há histórico independente.

## Motorcycle / MemberMotorcycle

Reutiliza as entidades atuais. `Motorcycle.identifier` é identificador opcional e único; fabricante e modelo são obrigatórios; ano fica no intervalo válido configurado pela aplicação. `MemberMotorcycle` guarda `member_id`, `motorcycle_id`, `started_at` e `ended_at`; fim nulo significa vínculo atual.

As ações de autoatendimento devem aceitar dados da moto e vínculo num único fluxo transacional. Uma moto só pode ter vínculos com períodos não sobrepostos. Encerrar um vínculo define `ended_at` e mantém o registro. Toda edição por `/me` exige que `member_motorcycles.member_id` seja igual ao membro ligado à sessão; falha de ownership deve retornar 404/403 sem revelar dados da moto alheia.

## AccessGroupPermission (`access_group_permissions`)

O par já existente `(area, action)` recebe o valor adicional `('membros', 'edit_joined_at')`; a unicidade atual impede duplicidade no grupo. O limite de `action` (16) comporta `edit_joined_at` (14). A validação da administração de grupos aceita esse item de forma separada da matriz convencional `view/edit`.

Resolução: conta ativa → vínculo do membro → cargo vigente mais prioritário conforme algoritmo já usado em `User::canAccess()` → grupo ativo associado → existência do par exato. Cargo ou grupo ausente/inativo não concede a permissão.

## User (`users`) e autorização

`member_id` é nullable e único como hoje. Conta sem vínculo segue apenas o fluxo administrativo. Conta vinculada acessa apenas a própria rota de perfil; a mudança de `joined_at` é permitida pelo endpoint dedicado quando `canAccess('membros', 'edit_joined_at')` for verdadeiro. Edição administrativa de outro membro permanece coberta pelas permissões existentes.

## Auditoria

Mudança de `joined_at`: registrar evento `member/membership_date_changed` com ID do membro, ator e datas anterior/nova; não incluir snapshot pessoal completo. Alterações de grupo passam pelo mecanismo de auditoria existente, incluindo a capacidade efetiva. CPF, endereço e telefones não entram em snapshots de auditoria.

## Validações de integridade

- Normalizar CPF removendo pontuação/espaços, validar dígitos verificadores e verificar unicidade dentro de transação/banco.
- Atualização de perfil grava todos os campos em `members` em uma única operação.
- Não aceitar `member_id`, `joined_at`, `status`, `left_at` ou relações como campos livres do endpoint de perfil geral.
- Atualizar/encerrar motos dentro de transação e escopo de propriedade.
- Perfil ativo de membro continua existindo mesmo sem conta de usuário vinculada; ações administrativas continuam possíveis sob `cadastros.edit`.

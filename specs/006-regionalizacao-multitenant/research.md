# Research: Áreas de Usuários e Regionalização de Acessos com Divisão por Cidades (Multitenant)

## Contexto & Decisões Arquiteturais

A introdução de multitenancy/regionalização no sistema de gestão do motoclube visa separar dados cadastrais, financeiros e operacionais por divisões territoriais (Regionais/Facções), com cada regional abrangendo uma ou mais cidades (`1 Regional : N Cidades`). A administração de acessos é centralizada na Diretoria Nacional e a autonomia operacional pertence aos diretores e tesoureiros locais.

---

### Decisão 1: Modelagem de Cidades da Regional (1 Regional : N Cidades)

- **Decisão**: Criação da entidade/tabela `regional_cities` com `id`, `regional_id` (FK para `regionals.id`), `name` (string 120), `state` (char 2), `is_headquarters` (boolean), `active` (boolean) e timestamps.
- **Rationale**:
  - Normaliza de forma limpa e canônica a relação 1:N entre uma Regional e suas Cidades.
  - Permite que uma regional cubra múltiplos municípios (mesmo entre estados vizinhos), identificando claramente a cidade sede (`is_headquarters = true`).
  - Suporta integridade referencial com membros e integridade de exclusão (impede exclusão de cidade com registros vinculados).
- **Alternativas consideradas**:
  - *Array JSON de cidades na tabela `regionals` (`cities jsonb`)*: Rejeitado porque inviabiliza constraints de integridade referencial direta com membros, queries relacionais eficientes e auditoria refinada por município.
  - *Tabela unificada de todos os 5.570 municípios do Brasil (IBGE) com tabela pivô `regional_city`*: Rejeitado por complexidade e overhead desnecessários (YAGNI). O motoclube opera em praças específicas e apenas precisa cadastrar as cidades atendidas por cada filial.

---

### Decisão 2: Vínculo de Membros à Cidade da Regional

- **Decisão**: Adição da coluna `regional_city_id` (nullable bigint fk) na tabela `members`, vinculando opcionalmente ou obrigatoriamente o membro a uma das cidades ativas cadastradas na sua respectiva regional.
- **Rationale**:
  - Permite que os operadores da regional distribuam seus membros pelas cidades de atuação da regional.
  - Validação estrita: a cidade selecionada deve pertencer obrigatoriamente à mesma `regional_id` do membro (regra de validação no `MemberRequest` / `MemberController`).
- **Alternativas consideradas**:
  - *Manter apenas o campo texto livre `city`*: Rejeitado porque não atende ao requisito de divisão estruturada da regional por cidades e permite inconsistências de digitação e filtros truncados.

---

### Decisão 3: Estratégia de Migração e Compatibilidade com Dados Legados

- **Decisão**: A migration de criação de `regional_cities` migrará automaticamente o valor atual das colunas `city` e `state` de cada linha da tabela `regionals` como uma cidade sede inicial (`is_headquarters = true`).
  - As colunas `city` e `state` na tabela `regionals` são mantidas como reflexo da cidade sede para total compatibilidade retroativa com código existente.
  - O model `Regional` sincroniza o valor da sede com a coleção `cities`.
- **Rationale**:
  - Zero downtime e zero perda de dados: todas as regionais existentes continuam válidas com sua cidade sede migrada automaticamente.
- **Alternativas consideradas**:
  - *Drop imediato das colunas `city`/`state` em `regionals`*: Rejeitado porque quebraria chamadas existentes antes de todos os controllers e views serem atualizados.

---

### Decisão 4: Sincronização Atômica no Formulário de Regionais

- **Decisão**: O payload de criação e edição (`POST /admin/regionals` e `PATCH /admin/regionals/{regional}`) aceita o array `cities: [{ id?, name, state, is_headquarters }]`.
  - Validação: array `cities` com no mínimo 1 item; cada item com `name` obrigatório, `state` de 2 letras; exatamente uma cidade marcada como `is_headquarters = true`.
  - Persistência atômica em transação (`DB::transaction`): salva/atualiza a regional e sincroniza os registros em `regional_cities`.
- **Rationale**:
  - Gerenciamento atômico, intuitivo e sem necessidade de múltiplos endpoints ou telas separadas para cadastrar regional e cidades.
- **Alternativas consideradas**:
  - *Endpoints REST separados (`/admin/regionals/{id}/cities`)*: Rejeitado porque fragmenta o fluxo de criação da regional (o usuário teria que criar a regional primeiro e depois adicionar cidades uma a uma).

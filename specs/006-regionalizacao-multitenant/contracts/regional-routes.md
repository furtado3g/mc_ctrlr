# Contracts: Rotas e Endpoints de Regionalização com Cidades e Usuários

## 1. Gestão de Regionais e Cidades (Administrador Global)

Todas as rotas exigem autenticação, escopo global (`user.is_global = true`) e permissão `administracao.edit` (ou `administracao.view` para leitura).

### `GET /admin/regionals`
Lista paginada e filtrável de regionais, incluindo contagem de cidades e membros.

- **Query Parameters**:
  - `search` (opcional): busca por nome, código ou cidade.
  - `status` (opcional): `all`, `active`, `inactive`.
- **Response (Inertia)**:
  - Component: `admin/regionals/index`
  - Props:
    - `regionals`: Lista paginada contendo:
      ```typescript
      interface RegionalResource {
        id: number;
        name: string;
        code: string;
        city: string;
        state: string;
        active: boolean;
        members_count: number;
        cities_count: number;
        cities: Array<{
          id: number;
          name: string;
          state: string;
          is_headquarters: boolean;
          active: boolean;
        }>;
      }
      ```

---

### `POST /admin/regionals`
Cadastra uma nova regional juntamente com suas cidades.

- **Request Body**:
  ```json
  {
    "name": "Regional Sul",
    "code": "SUL",
    "cities": [
      {
        "name": "Curitiba",
        "state": "PR",
        "is_headquarters": true
      },
      {
        "name": "Londrina",
        "state": "PR",
        "is_headquarters": false
      },
      {
        "name": "Joinville",
        "state": "SC",
        "is_headquarters": false
      }
    ]
  }
  ```
- **Validation Rules**:
  - `name`: string, obrigatório, máx 120 caracteres.
  - `code`: string, obrigatório, 2-20 caracteres alfanuméricos com traço, único.
  - `cities`: array, obrigatório, min:1.
  - `cities.*.name`: string, obrigatório, máx 120 caracteres.
  - `cities.*.state`: string, obrigatório, 2 caracteres maiúsculos (UF válida).
  - `cities.*.is_headquarters`: boolean, opcional (exatamente 1 deve ser `true`).
- **Response**: Redirect 302 para `/admin/regionals` com mensagem flash.

---

### `PATCH /admin/regionals/{regional}`
Atualiza dados da regional e sincroniza sua lista de cidades.

- **Request Body**:
  - Mesma estrutura do `POST`, com `code` validando unicidade ignorando a regional atual.
  - O array `cities` atualiza cidades existentes, adiciona novas e remove cidades retiradas (desde que não tenham membros associados).
- **Response**: Redirect 302 para `/admin/regionals` com mensagem flash.

---

### `POST /admin/regionals/{regional}/toggle-status`
Ativa ou desativa a regional e suas cidades associadas.

- **Response**: Redirect 302 com atualização do status. Bloqueia desativação se for a regional matriz (`id = 1`).

---

## 2. Seleção de Contexto Regional (Apenas Usuários Globais)

### `POST /admin/context/regional`
Permite que um usuário com `is_global = true` selecione a regional em foco para navegação ou volte para visão consolidada.

- **Request Body**:
  - `regional_id`: bigint nullable (ID da regional ativa, ou `null` para visão consolidada).
- **Response**: Redirect 302 para a rota anterior ou dashboard, atualizando a sessão.
- **Autorização**: Negado (403) para usuários que não possuem `is_global = true`.

---

## 3. Gestão de Usuários com Escopo Regional

### `POST /admin/users` & `PATCH /admin/users/{user}`
- **Campos do Payload**:
  - `is_global`: boolean, opcional (padrão false).
  - `regional_id`: bigint nullable, obrigatório se `is_global = false` (deve existir em `regionals` e estar ativa).

---

## 4. Gestão de Membros com Cidade da Regional

### `POST /members` & `PATCH /members/{member}`
- **Campos adicionados**:
  - `regional_city_id`: bigint nullable (deve pertencer à `regional_id` ativa do operador ou selecionada pelo admin).

---

## 5. Compartilhamento Global via Inertia (Middleware)

No `HandleInertiaRequests.php`, disponibilizar para o frontend:

```typescript
interface SharedProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      is_global: boolean;
      regional_id: number | null;
      regional?: {
        id: number;
        name: string;
        code: string;
        cities?: Array<{ id: number; name: string; state: string; is_headquarters: boolean }>;
      } | null;
    };
  };
  currentRegional: {
    id: number | null; // null = consolidado/todas
    name: string;
    code: string;
    cities?: Array<{ id: number; name: string; state: string; is_headquarters: boolean }>;
  } | null;
  availableRegionals?: Array<{
    id: number;
    name: string;
    code: string;
  }>; // Apenas para usuários com is_global = true
}
```

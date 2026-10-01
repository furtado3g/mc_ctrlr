# Data Model: Perfil de Usuário e Feed Social do Clube

## Diagrama Entidade-Relacionamento

```text
+----------------+          1:1          +-------------------+
|     User       | --------------------- |    UserProfile    |
+----------------+                       +-------------------+
        | 1                               | user_id (FK, UK)
        |                                 | avatar_path       |
        | 1:N                             | road_nickname     |
        v                                 | bio               |
+----------------+                        | phone             |
|      Post      |                        | social_links (JSON)
+----------------+                        +-------------------+
| id             |
| user_id (FK)   |
| regional_id(FK)|
| content        |
| created_at     |
+----------------+
    | 1        | 1                     | 1
    | 1:N      | 1:N                   | 1:N
    v          v                       v
+------------+ +--------------------+ +--------------------+
| PostMedia  | |      PostLike      | |    PostComment     |
+------------+ +--------------------+ +--------------------+
| id         | | id                 | | id                 |
| post_id(FK)| | post_id (FK)       | | post_id (FK)       |
| file_path  | | user_id (FK)       | | user_id (FK)       |
| sort_order | | created_at         | | content            |
| created_at | +--------------------+ | created_at         |
+------------+   [UK: post_id+user_id] +--------------------+
```

---

## Entidades e Atributos

### 1. UserProfile
Extensão dos dados sociais e visuais do usuário autenticado.

- **Tabela**: `user_profiles`
- **Campos**:
  - `id`: `BIGINT UNSIGNED`, Primary Key, Auto Increment
  - `user_id`: `BIGINT UNSIGNED`, Foreign Key referenciando `users(id)` com `ON DELETE CASCADE`, UNIQUE
  - `avatar_path`: `VARCHAR(255)`, Nullable — caminho relativo no disco público (`avatars/{filename}`)
  - `road_nickname`: `VARCHAR(100)`, Nullable — apelido de estrada ou codinome no motoclube
  - `bio`: `TEXT`, Nullable — descrição / biografia breve do membro
  - `phone`: `VARCHAR(30)`, Nullable — telefone / WhatsApp para contato entre membros
  - `social_links`: `JSON`, Nullable — objeto contendo chaves como `instagram`, `facebook`
  - `created_at`: `TIMESTAMP`, Nullable
  - `updated_at`: `TIMESTAMP`, Nullable

- **Regras de Validação**:
  - `avatar`: `nullable|image|mimes:jpeg,png,webp|max:5120` (máx. 5MB)
  - `road_nickname`: `nullable|string|max:100`
  - `bio`: `nullable|string|max:1000`
  - `phone`: `nullable|string|max:30`
  - `social_links`: `nullable|array`
  - `social_links.instagram`: `nullable|string|max:100`
  - `social_links.facebook`: `nullable|string|max:100`

---

### 2. Post
Publicação compartilhada no feed comunitário do motoclube.

- **Tabela**: `posts`
- **Campos**:
  - `id`: `BIGINT UNSIGNED`, Primary Key, Auto Increment
  - `user_id`: `BIGINT UNSIGNED`, Foreign Key referenciando `users(id)` com `ON DELETE CASCADE`, Index
  - `regional_id`: `BIGINT UNSIGNED`, Nullable, Foreign Key referenciando `regionais(id)` com `ON DELETE SET NULL`, Index
  - `content`: `TEXT`, Not Null — texto do relato, comunicado ou evento
  - `created_at`: `TIMESTAMP`, Nullable, Index
  - `updated_at`: `TIMESTAMP`, Nullable

- **Índices Compostos**:
  - `['regional_id', 'created_at']`: otimiza filtragem da aba "Minha Regional"
  - `['user_id', 'created_at']`: otimiza aba de publicações no perfil público do membro

- **Regras de Validação**:
  - `content`: `required|string|min:1|max:5000`
  - `regional_id`: `nullable|exists:regionais,id`
  - `images`: `nullable|array|max:10` (no máximo 10 arquivos)
  - `images.*`: `required|image|mimes:jpeg,png,webp|max:5120`

---

### 3. PostMedia
Imagens anexadas a uma postagem do feed.

- **Tabela**: `post_media`
- **Campos**:
  - `id`: `BIGINT UNSIGNED`, Primary Key, Auto Increment
  - `post_id`: `BIGINT UNSIGNED`, Foreign Key referenciando `posts(id)` com `ON DELETE CASCADE`, Index
  - `file_path`: `VARCHAR(255)`, Not Null — caminho relativo no disco público (`posts/{filename}`)
  - `sort_order`: `TINYINT UNSIGNED`, Not Null, Default `0` — índice para ordenação da galeria/carrossel
  - `created_at`: `TIMESTAMP`, Nullable
  - `updated_at`: `TIMESTAMP`, Nullable

- **Regras**:
  - Limite estrito de no máximo 10 mídias por postagem.
  - Ordenação crescente por `sort_order`.

---

### 4. PostLike
Registro de curtida em uma publicação.

- **Tabela**: `post_likes`
- **Campos**:
  - `id`: `BIGINT UNSIGNED`, Primary Key, Auto Increment
  - `post_id`: `BIGINT UNSIGNED`, Foreign Key referenciando `posts(id)` com `ON DELETE CASCADE`
  - `user_id`: `BIGINT UNSIGNED`, Foreign Key referenciando `users(id)` com `ON DELETE CASCADE`
  - `created_at`: `TIMESTAMP`, Nullable
  - `updated_at`: `TIMESTAMP`, Nullable

- **Índice Único**:
  - `UNIQUE ('post_id', 'user_id')`: impede curtidas duplicadas e garante idempotência do toggle de curtida.

---

### 5. PostComment
Comentários realizados por membros em uma publicação.

- **Tabela**: `post_comments`
- **Campos**:
  - `id`: `BIGINT UNSIGNED`, Primary Key, Auto Increment
  - `post_id`: `BIGINT UNSIGNED`, Foreign Key referenciando `posts(id)` com `ON DELETE CASCADE`, Index
  - `user_id`: `BIGINT UNSIGNED`, Foreign Key referenciando `users(id)` com `ON DELETE CASCADE`, Index
  - `content`: `TEXT`, Not Null — texto do comentário
  - `created_at`: `TIMESTAMP`, Nullable
  - `updated_at`: `TIMESTAMP`, Nullable

- **Regras de Validação**:
  - `content`: `required|string|min:1|max:1000`

---

## Transições de Estado e Ciclo de Vida

1. **Avatar do Usuário**:
   - `Sem Foto` (default) → exibe avatar com iniciais do nome.
   - `Upload de Foto` → validação (mimes, 5MB) → armazena em `storage/app/public/avatars` → atualiza `user_profiles.avatar_path` → remove foto anterior se houver.
   - `Remoção de Foto` → exclui arquivo físico → define `avatar_path = null` → volta a exibir avatar com iniciais.

2. **Publicação no Feed**:
   - `Criação` → validação do texto e array de até 10 fotos → transação de banco: insere `posts`, faz upload de cada arquivo em `storage/app/public/posts` e insere `post_media` com `sort_order` sequencial.
   - `Exclusão` (pelo autor ou moderador) → transação: coleta caminhos de arquivos em `post_media` → exclui registro em `posts` (cascade remove `post_media`, `post_likes`, `post_comments`) → remove arquivos físicos do disco `public`.

3. **Curtida (Toggle)**:
   - Se registro em `post_likes` já existir para `(post_id, user_id)`: remove registro (descurtir).
   - Se não existir: cria registro (curtir).

# Research: Perfil de Usuário e Feed Social do Clube

## Context & Objectives
O objetivo é implementar o perfil individual de usuário com upload/gerenciamento de avatar e o feed social da comunidade de motoclube, suportando postagens com até 10 fotos, filtros regional/global, interações (curtidas e comentários), moderação e perfil público dos membros.

---

## Decision 1: Perfil de Usuário e Armazenamento do Avatar

### Decision
Criar a tabela `user_profiles` com relação 1:1 com `users`, contendo:
- `user_id` (foreignId, unique, cascade on delete)
- `avatar_path` (string, nullable)
- `road_nickname` (string, nullable - apelido de estrada)
- `bio` (text, nullable - apresentação pessoal)
- `phone` (string, nullable - contato preferencial)
- `social_links` (json, nullable - redes sociais: Instagram, Facebook, etc.)

No modelo `User`, expor:
- Relação `$user->profile()` (`HasOne`)
- Accessor `getAvatarUrlAttribute()` ou propagação no `HandleInertiaRequests` para preencher o atributo `auth.user.avatar`, que os componentes existentes do frontend (`UserInfo.tsx`, `NavUser.tsx`) já consomem diretamente.

### Rationale
- Separa credenciais/sessão de autenticação (`users`) dos dados complementares e sociais (`user_profiles`).
- Preserva retrocompatibilidade total com as contas existentes (criação automática ou sob demanda via `profile()->firstOrCreate()`).
- O frontend já está preparado com `<AvatarImage src={user.avatar} />` e `<AvatarFallback>{getInitials(user.name)}</AvatarFallback>`, exigindo zero retrabalho na barra superior e sidebar.

### Alternatives Considered
- *Colunas diretamente na tabela `users`*: Simples, mas polui a tabela principal de autenticação do Fortify/framework e dificulta a evolução de dados sociais específicos (redes, preferências).
- *Armazenar fotos em base64 no banco*: Descartado por ineficiência de tráfego, peso em banco de dados e falta de cache via CDN/web server.

---

## Decision 2: Processamento e Armazenamento de Arquivos (Avatar e Postagens)

### Decision
- **Storage Disk**: Disco `public` configurado no Laravel (`storage/app/public`), acessível publicamente via link simbólico `/storage/`.
- **Diretórios**:
  - Avatares: `storage/app/public/avatars/{hash}.{ext}`
  - Fotos de postagens: `storage/app/public/posts/{hash}.{ext}`
- **Formatos aceitos**: `image/jpeg`, `image/png`, `image/webp`.
- **Limites de tamanho**: Até 5MB por arquivo.
- **Validação**: Validação estrita via Form Requests (`mimes:jpeg,png,webp|max:5120`).
- **Limpeza de arquivos**:
  - Na substituição ou remoção do avatar, o arquivo anterior em disco é excluído via `Storage::disk('public')->delete($oldPath)`.
  - Na exclusão de um post, todas as imagens associadas em `post_media` são removidas do disco.

### Rationale
- Segue o padrão já estabelecido no projeto em `SaveInstitutionalPageDraft` e `InstitutionalPageAssets`.
- Não adiciona dependências pesadas de processamento em tempo real se GD/Imagick padrão ou salvamento otimizado atenderem o caso (YAGNI).
- Seguro contra arquivos maliciosos através da validação MIME do Laravel e nomes hash gerados pelo framework.

### Alternatives Considered
- *Serviço externo (S3/Cloudinary)*: Desnecessário para o ambiente atual; a interface de Storage do Laravel permite trocar o disco para S3 futuramente apenas via `.env` (`FILESYSTEM_DISK=s3`).

---

## Decision 3: Estrutura do Feed Social (Posts, Mídias, Curtidas e Comentários)

### Decision
Modelagem normalizada com quatro entidades relacionais:
1. `posts`:
   - `id`, `user_id`, `regional_id` (nullable: null indica post global do clube; preenchido indica post daquela regional), `content` (text), `created_at`, `updated_at`.
2. `post_media`:
   - `id`, `post_id` (foreignId cascade), `file_path` (string), `sort_order` (tinyInteger, 0 a 9), `created_at`, `updated_at`.
3. `post_likes`:
   - `id`, `post_id` (foreignId cascade), `user_id` (foreignId cascade), `created_at`, `updated_at`.
   - Índice único `[post_id, user_id]` para garantir que cada usuário só curta uma vez.
4. `post_comments`:
   - `id`, `post_id` (foreignId cascade), `user_id` (foreignId cascade), `content` (text), `created_at`, `updated_at`.

### Rationale
- Performance máxima com `withCount(['likes', 'comments'])` e `withExists(['likes as is_liked'])`.
- Cascade delete garante integridade referencial automática quando um post é removido.
- Suporta ordenação precisa das fotos (carrossel / grade de até 10 fotos).
- A verificação de curtida (`is_liked`) é resolvida em uma única query SQL sem N+1.

### Alternatives Considered
- *JSON column para fotos e curtidas dentro de `posts`*: Dificulta queries relacionais, joins para exclusão de arquivos e contagens atômicas concorrentes.
- *Polimorfismo para likes e comentários*: Desnecessário no momento (YAGNI), já que apenas posts recebem interações.

---

## Decision 4: Estratégia de Filtragem Regional vs Global

### Decision
- **Aba "Minha Regional" (`filter=regional`)**:
  - Se o usuário pertence a uma regional (`$user->regional_id`): exibe posts onde `posts.regional_id = $user->regional_id`.
  - Se o usuário é administrador global (`$user->is_global`): exibe posts da regional ativa na sessão (`active_regional_id`).
- **Aba "Todas as Regionais" (`filter=global`)**:
  - Exibe todas as postagens (posts regionais de todas as unidades + posts globais).
- **Criação de Post**:
  - Por padrão, o post é vinculado à `regional_id` do usuário.
  - Usuários globais ou membros da diretoria podem escolher publicar como "Global (Todo o Clube)" ou vincular à regional selecionada.

### Rationale
- Atende pontualmente aos requisitos FR-008 e FR-009, respeitando a arquitetura multirregional já implementada no sistema com `RegionalContextController` e `HandleInertiaRequests`.

---

## Decision 5: Autorização e Moderação (Policies)

### Decision
Criar `PostPolicy` e `PostCommentPolicy`:
- `PostPolicy::create`: Qualquer usuário ativo (`$user->active`).
- `PostPolicy::update`: Autor do post (`$user->id === $post->user_id`).
- `PostPolicy::delete`: Autor do post (`$user->id === $post->user_id`) OU administradores/moderadores (`$user->canAccess('administracao', 'edit') || $user->is_global`).
- `PostCommentPolicy::delete`: Autor do comentário (`$user->id === $comment->user_id`) OU autor do post associado OU moderador.

### Rationale
- Garante segurança nas bordas (controllers/requests) sem depender apenas de regras na interface visual.
- Administradores conseguem moderar conteúdo inadequado com registro limpo.

---

## Decision 6: Navegação e Interface do Usuário (Inertia + React + Tailwind)

### Decision
- Rota do Feed: `/feed` acessível pelo menu lateral (`AppSidebar.tsx`) com ícone do Lucide (`MessageSquareShare` ou `Newspaper` ou `Rss`).
- Rota de Perfil Pessoal: `/profile` (gerenciamento de foto, apelido, bio, contato) integrada/compatível com `/settings/profile` e `/me/profile`.
- Rota de Perfil Público: `/members/{member}/public-profile` ou `/profile/{user}`, exibindo os dados públicos e lista de postagens do membro.
- Componentes UI:
  - `AvatarCropperModal` ou seletor de arquivo com pré-visualização instantânea.
  - `PostComposer`: Caixa de criação de post com área de texto e anexo de até 10 imagens (com thumbnails e botão de remover antes de enviar).
  - `PostCard`: Card com autor, avatar, data relativa (ex: "há 2 horas"), tag da regional (ou "Global"), galeria/carrossel responsivo de fotos, botões de curtir/comentar, contador e área expansível de comentários.

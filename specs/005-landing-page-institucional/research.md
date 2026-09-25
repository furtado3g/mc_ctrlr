# Research: Landing page institucional

## Decisões

### Página pública e páginas administrativas

- **Decisão**: Substituir o redirecionamento atual de `/` por uma página pública e manter a edição sob rotas autenticadas existentes. Usar o layout público sem sidebar do painel.
- **Justificativa**: `routes/web.php` hoje redireciona `/` para `/login`; o projeto já distingue páginas públicas (`welcome`, sem layout autenticado) em `resources/js/app.tsx`. `/login` e as demais rotas de autenticação permanecem válidas.
- **Alternativas consideradas**: Manter `/` como login e publicar em outra rota; reutilizar o layout administrativo. Ambas contrariam o requisito de landing em `/` ou exporiam navegação interna na página pública.

### Rascunho e publicação

- **Decisão**: Manter apenas o snapshot publicado e o rascunho corrente. A edição salva o rascunho; a ação de publicar substitui o snapshot público de forma atômica. Não criar versões históricas.
- **Justificativa**: A clarificação confirma que salvar não deve alterar a página pública. Uma única linha com os dois estados atende à publicação reversível sem sistema de aprovação ou versionamento adicional.
- **Alternativas consideradas**: Publicar cada salvamento (rejeitada pela clarificação); criar uma tabela completa de revisões (fora do escopo e sem necessidade atual).

### Seções da página

- **Decisão**: Usar seções predefinidas com chaves estáveis e campos estruturados; representar texto como texto simples e chamadas como links validados.
- **Justificativa**: A especificação limita a primeira versão a apresentação, sobre, atividades, contato e chamada para ação, sem um editor livre de layouts. Campos conhecidos simplificam validação, acessibilidade e testes.
- **Alternativas consideradas**: HTML ou componentes arbitrários; editor visual genérico. Ambos aumentariam risco de XSS, escopo e manutenção sem solicitação explícita.

### Permissão de acesso

- **Decisão**: Acrescentar a área `institucional` ao catálogo de permissões do projeto, com `view` para abrir o painel e `edit` para salvar rascunhos e publicar. Aplicar a autorização no backend e refletir a área nos grupos e navegação.
- **Justificativa**: `AccessPermissionCatalog`, `AccessGroupRequest`, `AccessGroupController` e os Gates de `AppServiceProvider` formam o padrão existente. A área dedicada separa manutenção institucional de caixa, cadastros e administração geral. Membros recebem direitos pelo grupo do cargo vigente; contas administrativas não vinculadas usam as concessões diretas existentes.
- **Alternativas consideradas**: Reutilizar `administracao.edit` (mais amplo que o necessário); adicionar ação especial para cada operação (duplicaria controles para rascunho e publicação).

### Nome e logo compartilhados

- **Decisão**: O backend resolve sempre a identidade publicada e a compartilha em uma propriedade de aplicação comum. Usar o mesmo valor para landing, sidebar/cabeçalho, autenticação e título de documento; manter ícones estáticos alternativos quando não houver logo.
- **Justificativa**: Hoje o nome de painel vem de `HandleInertiaRequests`, o título de `resources/views/app.blade.php` e `resources/js/app.tsx` usa `VITE_APP_NAME`; os componentes autenticados usam `AppLogo`, enquanto layouts de autenticação usam um SVG estático. A identidade precisa ter fonte única para não divergir.
- **Alternativas consideradas**: Alterar somente a landing; manter nome da aplicação em variável de build. Ambas deixam o sistema autenticado com a marca antiga.

### Armazenamento de imagens

- **Decisão**: Guardar imagens destinadas à página pública no disco Laravel `public`, com nomes aleatórios e extensões PNG, JPEG ou WebP, limitadas inicialmente a 5 MB. O snapshot público referencia somente arquivos publicados; o rascunho é enviado apenas ao painel autorizado.
- **Justificativa**: `config/filesystems.php` já configura o disco público e o disco privado dos comprovantes. O conteúdo é institucional e criado para ser público quando publicado. Os recibos demonstram validação MIME, limite de upload e `Storage::fake` nos testes; logos e imagens não devem usar o disco privado de comprovantes.
- **Alternativas consideradas**: Guardar binário no banco; usar serviço externo de mídia; exigir URL externa. Nenhuma é necessária no escopo atual.

### Persistência e validação

- **Decisão**: Persistir o estado publicado e o rascunho como snapshots JSONB de uma única página `home`, com metadados de quem salvou/publicou e respectivos horários. Validar cada seção contra seu tipo e chaves permitidas antes de salvar.
- **Justificativa**: O app é executado em PostgreSQL 17 no Compose e já usa JSONB em eventos de auditoria. A página é única e tem pequeno volume; snapshots mantêm uma transição simples e evitam consultas por seção.
- **Alternativas consideradas**: Tabelas normalizadas por seção; adequadas a grande volume ou seções extensíveis, mas desnecessárias para a única página e o conjunto fixo definidos.

### Validação

- **Decisão**: Cobrir GET público, fallback, autenticação/entrada, permissões de view/edit, upload de mídia, isolamento entre rascunho e publicação, publicação bem-sucedida e preservação do estado publicado em falhas. Seguir testes Laravel com `RefreshDatabase`, `withoutVite`, Inertia assertions e `Storage::fake`.
- **Justificativa**: Esses padrões já aparecem em `tests/Feature/MemberProfileTest.php`, `tests/Feature/AccessGroupManagementTest.php` e `tests/Feature/MotoclubFinanceTest.php`.
- **Alternativas consideradas**: Depender apenas de verificação visual manual; insuficiente para validar autorização e estado público persistido.

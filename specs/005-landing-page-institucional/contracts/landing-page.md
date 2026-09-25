# Contract: Landing page institucional

## Rotas públicas

### `GET /`

- **Acesso**: público, sem autenticação.
- **Sucesso**: `200`; renderiza a página pública com o snapshot publicado. Se ainda não houver publicação, usa conteúdo e marca de fallback.
- **Dados expostos**: nome e logo publicados, seções ativas ordenadas por `position`, chamada para autenticação e metadados de página. Nunca inclui campos de rascunho, autor do rascunho ou caminhos não publicados.
- **Falhas**: erro de leitura não deve expor exceção, conteúdo interno ou versão parcial. A resposta usa o fallback disponível.

## Rotas administrativas

Todas exigem sessão autenticada, conta ativa e e-mail verificado, além da permissão indicada. Os formulários retornam ao painel com mensagem de resultado e erros de validação por campo.

### `GET /institutional-page`

- **Permissão**: `institucional.view`.
- **Sucesso**: página administrativa com o conteúdo publicado, o rascunho corrente quando existir, estado de publicação e metadados do último salvamento/publicação.
- **Sem permissão**: `403`; a resposta não revela os dados do rascunho.

### `PATCH /institutional-page/draft`

- **Permissão**: `institucional.edit`.
- **Entrada**: nome institucional e snapshot completo das seções. Imagens opcionais são recebidas como arquivos PNG, JPEG ou WebP de até 5 MB; texto é tratado como texto simples; chamadas aceitam caminho local ou URL HTTPS.
- **Sucesso**: valida e substitui o rascunho corrente, registra autor/horário, retorna redirecionamento para o painel com confirmação. A página pública permanece igual.
- **Falha**: `403` sem permissão; validação com erros por campo; falha ao persistir não altera o snapshot público nem substitui o rascunho anterior válido.

### `POST /institutional-page/publish`

- **Permissão**: `institucional.edit`.
- **Entrada**: sem conteúdo editável; publica o rascunho validado corrente.
- **Sucesso**: troca o snapshot publicado, registra publicador/horário, limpa o rascunho e responde com confirmação. Nome, logo e seções da landing e do sistema passam a usar a mesma identidade publicada.
- **Sem rascunho**: retorna validação legível e não altera a publicação.
- **Falha durante a publicação**: mantém integralmente o snapshot público anterior e conserva o rascunho para nova tentativa.

## Grupos de acesso

- O catálogo apresenta uma área `institucional` com permissões `view` e `edit`.
- `view` controla a entrada no editor e exibição do conteúdo administrativo.
- `edit` controla salvamento de rascunho e publicação.
- A página pública `/` não exige nem concede permissão administrativa.
- A checagem de cada operação ocorre no servidor; ocultar controles na interface não é controle de segurança.

## Identidade compartilhada

- O nome e o logo compartilhados pelo servidor representam sempre o estado publicado.
- O mesmo estado deve alimentar a landing, o cabeçalho/navegação autenticados, telas de autenticação e título da aplicação.
- Se o logo não estiver configurado ou não puder ser lido, usar o ícone institucional padrão e manter o nome textual acessível.

## Contrato dos campos das seções

- Somente as seções conhecidas `hero`, `about`, `activities` e `contact` podem ser enviadas.
- Uma seção aparece publicamente somente quando `enabled` é verdadeiro.
- Seções ativas devem ter título e campos de conteúdo necessários para seu tipo.
- Rótulo e URL da chamada são opcionais como par; URL local deve começar por `/` e URL externa deve usar HTTPS.
- Chaves desconhecidas, posições duplicadas, HTML executável e caminhos de arquivo arbitrários enviados pelo cliente são rejeitados; para preservar uma imagem existente, só pode ser referenciada uma imagem já pertencente ao snapshot administrativo atual.

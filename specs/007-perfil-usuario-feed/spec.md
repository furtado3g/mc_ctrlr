# Feature Specification: Perfil de Usuário e Feed Social do Clube

**Feature Branch**: `007-perfil-usuario-feed`

**Created**: 2026-09-30

**Status**: Ready for Planning

**Input**: User description: "crie a parte de perfil de usuário onde ele possa colocar foto de perfil e onde tenha feed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestão do Perfil Pessoal e Upload de Foto (Priority: P1)

Como usuário autenticado da plataforma do motoclube, desejo acessar minha página de perfil, visualizar meus dados cadastrais, atualizar informações complementares (bio, apelido de estrada, telefone/redes) e enviar/alterar minha foto de perfil (avatar), para que outros membros me identifiquem nas atividades do clube.

**Why this priority**: A foto e identidade visual do usuário são a fundação para qualquer experiência comunitária e para o feed de postagens.

**Independent Test**: Usuário autenticado acessa "/profile", clica para carregar uma imagem como foto de perfil, salva a alteração e observa a foto atualizada no topo do perfil, na barra de navegação e em suas futuras postagens.

**Acceptance Scenarios**:

1. **Given** usuário autenticado na plataforma, **When** faz upload de arquivo de imagem válido (JPG/PNG/WebP até 5MB) na área de foto de perfil, **Then** a imagem é recortada/otimizada e exibida como seu novo avatar no cabeçalho e perfil.
2. **Given** usuário selecionando arquivo de formato inválido (ex.: PDF) ou superior ao limite, **When** tenta salvar, **Then** o sistema exibe mensagem amigável de erro e preserva a foto anterior.
3. **Given** usuário com foto já cadastrada, **When** opta por remover a foto de perfil, **Then** o sistema remove a foto personalizada e restaura o avatar padrão com iniciais do nome.

---

### User Story 2 - Feed Social com Filtro Regional/Global e Múltiplas Fotos (Priority: P1)

Como membro do motoclube, desejo acessar o feed de publicações alternando entre a visão da minha regional e a visão global de todo o clube, criando postagens com texto e até 10 fotos de passeios/eventos, para manter os integrantes informados e engajados.

**Why this priority**: O feed é a funcionalidade central de comunicação social e compartilhamento entre membros solicitada diretamente pelo usuário.

**Independent Test**: Membro cria uma publicação com texto descritivo e anexo de fotos; o post aparece no topo do feed com nome do autor, foto de perfil, data/hora relativa, galeria de fotos e escopo (regional/global).

**Acceptance Scenarios**:

1. **Given** membro autenticado no feed, **When** escreve um texto de relato de passeio, anexa até 10 fotos e clica em publicar, **Then** a nova publicação aparece imediatamente no topo do feed.
2. **Given** membro visualizando o feed, **When** alterna entre a aba "Minha Regional" e "Todas as Regionais", **Then** o feed filtra adequadamente as postagens pertencentes à regional ativa ou consolidadas de todo o clube.
3. **Given** membro visualizando o feed, **When** rola a tela para baixo, **Then** as publicações anteriores são carregadas em ordem cronológica decrescente com paginação fluida.
4. **Given** autor de uma publicação existente, **When** decide excluir sua própria publicação, **Then** a publicação e suas mídias associadas são removidas do feed.
5. **Given** administrador do clube, **When** identifica conteúdo impróprio de outro usuário, **Then** tem permissão de moderação para remover o post do feed.

---

### User Story 3 - Interações no Feed: Curtidas e Comentários (Priority: P2)

Como membro autenticado, desejo interagir com as postagens de outros membros no feed por meio de curtidas e comentários, para expressar apoio, tirar dúvidas sobre rotas e celebrar encontros do clube.

**Why this priority**: Interações sociais incentivam o retorno frequente dos membros e aprofundam a sensação de comunidade.

**Independent Test**: Membro clica no botão curtir de uma publicação de colega; o contador incrementa em tempo real e o ícone reflete o status de curtido. Em seguida, posta um comentário e ele é exibido na lista de comentários do post.

**Acceptance Scenarios**:

1. **Given** usuário visualizando um post, **When** clica no botão "Curtir", **Then** o contador de curtidas aumenta em 1 e o usuário é registrado como curtidor.
2. **Given** usuário que já curtiu um post, **When** clica novamente em "Curtir", **Then** a curtida é desfeita e o contador diminui em 1.
3. **Given** usuário visualizando um post no feed, **When** digita um comentário e envia, **Then** o comentário aparece acompanhado do autor, avatar e horário.
4. **Given** autor de um comentário, **When** opta por excluir seu comentário, **Then** o comentário é removido da lista do post.

---

### User Story 4 - Perfil Público e Histórico do Membro (Priority: P3)

Como membro do motoclube, desejo clicar no avatar ou nome de qualquer autor de postagem no feed para abrir a página de perfil daquele membro, visualizando sua foto, nome de estrada/apelido, regional/cidade, moto(s) cadastrada(s) e o histórico de postagens que ele publicou.

**Why this priority**: Permite que os membros se conheçam melhor e encontrem companheiros de estrada da mesma regional ou com motos similares.

**Independent Test**: Clicar no autor de um post no feed redireciona para a página `/members/{id}/profile`, exibindo suas informações públicas e feed filtrado com suas publicações.

**Acceptance Scenarios**:

1. **Given** usuário navegando pelo feed, **When** clica no nome ou foto do autor da publicação, **Then** é redirecionado para a visualização pública do perfil desse membro.
2. **Given** visualização do perfil público de um membro, **When** carregada, **Then** são exibidos apenas dados não-sensíveis (nome, apelido, cidade/regional, foto, biografia, motos e postagens próprias).

---

### Edge Cases

- O que acontece se o usuário tentar enviar mais de 10 fotos em uma única publicação? O seletor de arquivos e a validação no backend bloqueiam o envio, alertando o usuário sobre o limite de 10 imagens.
- O que acontece se uma foto enviada tiver proporções atípicas (ex.: imagem panorâmica muito longa ou vertical extrema)? O componente de exibição em carrossel/grade aplica proporção consistente com opção de clique para zoom/lightbox.
- O que acontece se o usuário perder a conexão durante o upload de múltiplas fotos para o feed? O sistema deve alertar sobre a falha de envio e permitir reenvio sem perder o texto já digitado.
- O que acontece quando um usuário for desligado ou excluído do clube? Suas postagens continuam identificadas ou são anonimizadas conforme diretrizes do clube.
- O que acontece se o usuário tentar publicar um post vazio (sem texto e sem foto)? O botão de publicação permanece desabilitado e a validação rejeita a ação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir que todo usuário autenticado visualize e edite suas informações de perfil pessoal (bio, apelido/nome de estrada, telefone de contato opcional).
- **FR-002**: O sistema DEVE permitir o envio, recorte e substituição de foto de perfil (avatar) pelo próprio usuário, suportando formatos de imagem padrão (JPEG, PNG, WebP) com armazenamento seguro e otimização de resolução.
- **FR-003**: O sistema DEVE permitir a remoção da foto de perfil, aplicando automaticamente um avatar com as iniciais do nome do usuário.
- **FR-004**: O sistema DEVE exibir o avatar do usuário de forma consistente em toda a plataforma (menu superior, barra lateral, cards de membros e posts do feed).
- **FR-005**: O sistema DEVE disponibilizar uma tela de Feed Social acessível no menu principal da plataforma.
- **FR-006**: O sistema DEVE permitir a criação de postagens no feed contendo texto formatado e anexos de fotos.
- **FR-007**: O sistema DEVE suportar até 10 fotos por publicação no feed, organizadas em galeria ou carrossel navegável.
- **FR-008**: O sistema DEVE oferecer navegação por abas/filtros no feed, permitindo alternar entre o feed da "Minha Regional" (regional ativa do operador) e "Todas as Regionais" (feed global do clube).
- **FR-009**: O sistema DEVE permitir que todos os membros ativos criem postagens no feed, com administradores e diretoria possuindo capacidade adicional de moderação e exclusão de posts de terceiros.
- **FR-010**: O sistema DEVE permitir que os membros curtam e descurtam publicações no feed.
- **FR-011**: O sistema DEVE permitir que os membros adicionem comentários em publicações e excluam seus próprios comentários.
- **FR-012**: O sistema DEVE permitir que o autor da publicação ou administradores do clube excluam uma publicação do feed.
- **FR-013**: O sistema DEVE apresentar as postagens do feed ordenadas por data de criação decrescente, com paginação sob demanda.
- **FR-014**: O sistema DEVE disponibilizar a visualização de perfil público de membros, exibindo foto, regional, cidade, motos associadas e lista de publicações do autor.

### Key Entities *(include if feature involves data)*

- **UserProfile**: Extensão dos dados do usuário, armazenando foto de perfil (caminho do arquivo), apelido de estrada, bio/apresentação pessoal e preferências de contato.
- **Post**: Publicação no feed social contendo autor (usuário/membro), regional associada (opcional para postagens globais), conteúdo em texto, carimbo de data/hora e status.
- **PostMedia**: Imagens associadas a uma publicação (até 10 por post), armazenando caminho do arquivo, ordem de exibição e dimensões.
- **PostLike**: Registro de curtida associando um usuário a uma publicação específica.
- **PostComment**: Comentário em uma publicação, contendo autor, texto do comentário, data/hora e referência ao post.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários conseguem enviar ou atualizar sua foto de perfil em menos de 10 segundos em conexões padrão.
- **SC-002**: 100% das fotos de perfil carregadas são exibidas corretamente no cabeçalho e nas postagens sem quebra de layout.
- **SC-003**: Publicação no feed com texto e até 10 fotos é processada e visível no feed em menos de 3 segundos após a submissão.
- **SC-004**: Membros conseguem navegar e alternar entre abas do feed (regional vs global) com tempo de resposta inferior a 1 segundo.
- **SC-005**: 90% dos membros ativos acessam o feed ou perfil pelo menos uma vez por semana durante o primeiro mês de lançamento.

## Assumptions

- A infraestrutura existente de autenticação e contas de usuário (`User` / `Member`) será reutilizada sem necessidade de recriar fluxo de login.
- O armazenamento de arquivos de fotos utilizará o sistema de arquivos configurado na aplicação (`storage/app/public` com link simbólico em desenvolvimento e storage configurado em produção).
- Moderação de conteúdo será reativa através da exclusão direta por administradores (sem fila de pré-aprovação de posts em v1).
- Vídeos no feed estão fora do escopo da versão inicial (v1 restrito a texto e até 10 fotos por post).

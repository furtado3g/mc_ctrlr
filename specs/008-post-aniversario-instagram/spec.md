# Feature Specification: Gerador de Post de Aniversário para Instagram

**Feature Branch**: `008-post-aniversario-instagram`

**Created**: 2026-10-01

**Status**: Ready for Planning

**Input**: User description: "quero fazer um modulo que gere utilizando a foto de perfil um post para o instagram de aniversário para o membro do clube"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listagem de Aniversariantes e Geração de Arte para o Instagram (Priority: P1) 🎯 MVP

Como gestor ou responsável pela comunicação do motoclube, desejo visualizar a lista de membros aniversariantes (do dia, da semana e do mês) e gerar com um clique um post comemorativo formatado para o Instagram contendo a foto de perfil, nome e apelido de estrada do membro, para parabenizá-lo nas redes sociais do clube com agilidade e padrão visual oficial.

**Why this priority**: É o núcleo do valor solicitado: transformar a foto de perfil e os dados cadastrais do membro em uma peça gráfica comemorativa pronta para publicação no Instagram.

**Independent Test**: O administrador acessa o módulo de Aniversariantes, localiza um membro com aniversário no período, clica em "Gerar Post Instagram" e visualiza imediatamente a arte gerada com a foto de perfil centralizada na moldura temática, acompanhada do botão de download da imagem em alta resolução (PNG/JPEG) e de cópia da legenda de parabéns.

**Acceptance Scenarios**:

1. **Given** membro cadastrado com data de nascimento e foto de perfil, **When** o gestor clica em "Gerar Post Instagram", **Then** o sistema compõe a arte visual no formato Instagram (Feed 1080x1080 ou 1080x1350) integrando a foto do membro, seu nome, apelido de estrada, brasão/identidade do clube e mensagem comemorativa.
2. **Given** a arte gerada e exibida na pré-visualização, **When** o gestor clica em "Baixar Imagem", **Then** o arquivo gráfico é baixado no dispositivo em formato PNG/JPEG com qualidade otimizada para publicação no Instagram.
3. **Given** a tela de geração do post, **When** o gestor clica em "Copiar Legenda", **Then** um texto personalizado de felicitações (incluindo menção ao nome, apelido, regional e hashtags do clube) é copiado para a área de transferência.
4. **Given** membro aniversariante sem foto de perfil cadastrada, **When** o gestor abre o gerador de arte, **Then** o sistema alerta sobre a ausência de foto e permite realizar o upload de uma foto avulsa para a arte ou utilizar uma silhueta/brasão padrão comemorativo.

---

### User Story 2 - Personalização de Moldura, Formato e Ajuste de Foto (Priority: P2)

Como gestor de comunicação do clube, desejo escolher entre diferentes temas/molduras comemorativas, alternar entre formatos de post (Feed 1:1, Feed Retrato 4:5 e Stories 9:16) e ajustar o enquadramento/zoom da foto do membro, para que o conteúdo se adeque perfeitamente ao canal de divulgação escolhido.

**Why this priority**: Proporciona flexibilidade criativa e atende tanto às publicações no Feed quanto aos Stories do Instagram e status de WhatsApp.

**Independent Test**: O operador seleciona o formato "Stories (9:16)", aplica zoom e reposiciona a foto do membro dentro da moldura circular/recortada, seleciona o tema "Edição Especial Estrada", e a pré-visualização atualiza instantaneamente antes de exportar a imagem.

**Acceptance Scenarios**:

1. **Given** o modal/tela do gerador de arte aberto, **When** o usuário alterna o formato entre "Feed Quadrado (1:1)", "Feed Retrato (4:5)" e "Stories (9:16)", **Then** as dimensões do canvas e a disposição dos elementos gráficos se reconfiguram harmoniosamente.
2. **Given** a foto carregada no preview, **When** o usuário ajusta controles de escala (zoom) e deslocamento (pan), **Then** a imagem do membro é reposicionada dentro da máscara visual sem distorção.
3. **Given** a galeria de temas visuais do clube (ex.: "Clássico Escuro", "Estrada & Liberdade", "Aniversário de Colete"), **When** o usuário clica em um tema, **Then** as cores de destaque, texturas de fundo e molduras mudam em tempo real.

---

### User Story 3 - Visualização e Alertas de Próximos Aniversários (Priority: P3)

Como integrante da diretoria ou membro do clube, desejo consultar com facilidade os próximos aniversários do mês em minha regional ou no clube todo, para não perder as datas festivas e preparar as homenagens com antecedência.

**Why this priority**: Complementa a geração de posts dando visibilidade organizada das datas comemorativas futuras sem exigir buscas manuais membro a membro.

**Independent Test**: O usuário abre a aba "Aniversariantes do Mês", filtra por regional ou pesquisa por nome/apelido, e visualiza cards ordenados cronologicamente pelo dia do aniversário, com indicador visual de aniversariantes de hoje.

**Acceptance Scenarios**:

1. **Given** usuários na página do módulo de aniversários, **When** filtram por "Hoje", "Esta Semana" ou "Este Mês", **Then** a listagem exibe apenas os membros com nascimento correspondente, ordenados pelo dia.
2. **Given** gestor regional com regional ativa selecionada, **When** consulta a listagem, **Then** tem a opção de alternar entre aniversariantes da sua regional e aniversariantes de todo o clube.

---

### Edge Cases

- O que acontece se a foto de perfil do membro for de baixa resolução ou estiver na vertical/horizontal extrema? O gerador centraliza a foto dentro da máscara circular/quadrada com preenchimento harmônico de fundo e permite que o operador dê zoom ou reposicione manualmente antes de salvar.
- O que acontece se o membro não tiver apelido de estrada ("road nickname") cadastrado? O template oculta o campo de apelido sem deixar espaços vazios ou aspas sobrando, exibindo com destaque o nome do integrante e sua regional.
- O que acontece se o membro não possuir data de nascimento cadastrada no sistema? Ele não aparece na lista automática de aniversariantes, mas o gerador oferece uma opção de "Gerar Post Avulso" permitindo selecionar qualquer membro manualmente.
- O que acontece em dispositivos móveis? A geração de imagem e download via canvas/HTML funciona de forma responsiva, com suporte opcional ao botão nativo de compartilhamento (Web Share API) quando suportado pelo navegador mobile para enviar diretamente ao app do Instagram ou WhatsApp.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer uma visão de aniversariantes com filtros por período ("Hoje", "Próximos 7 dias", "Mês atual") e por regional.
- **FR-002**: O sistema DEVE carregar automaticamente a foto de perfil (`avatar`), nome completo, apelido de estrada (`road_nickname`) e regional do membro selecionado para compor o post.
- **FR-003**: O sistema DEVE disponibilizar gerador de arte comemorativa com suporte ao formato padrão do Instagram Feed (1080x1080 pixels) e formato Instagram Stories (1080x1920 pixels).
- **FR-004**: O sistema DEVE permitir o download da arte gerada como imagem nos formatos PNG ou JPEG de alta definição.
- **FR-005**: O sistema DEVE incluir na arte gerada os elementos de identidade do motoclube (logo/brasão oficial, tipografia de estrada, mensagem comemorativa e selo de aniversário).
- **FR-006**: O sistema DEVE permitir ajuste manual de enquadramento (zoom in/out e reposicionamento horizontal/vertical) da foto do membro dentro da moldura.
- **FR-007**: O sistema DEVE permitir a substituição temporária da foto no próprio gerador de arte caso o membro não possua avatar ou deseje usar outra foto para a comemoração.
- **FR-008**: O sistema DEVE disponibilizar gerador de texto com sugestão de legenda para a publicação com botão "Copiar Legenda", contendo nome, apelido, votos de estrada e hashtags oficiais.
- **FR-009**: O sistema DEVE permitir a seleção de pelo menos dois modelos/temas visuais de moldura (ex.: fundo escuro metálico / couro e fundo com temática de estrada).
- **FR-010**: O sistema DEVE restringir a ação de geração e download de artes para usuários autenticados com acesso ao clube (administradores, diretores sociais e membros autorizados).

### Key Entities *(include if feature involves data)*

- **Member**: Entidade existente contendo dados cadastrais (`name`, `birth_date`, `regional_id`, `status`).
- **UserProfile**: Entidade existente contendo `avatar_path` e `road_nickname`.
- **BirthdayTemplate**: Configuração de layout e estilo de arte (dimensões, posições do avatar, logotipo, texto de congratulação, cores de destaque e fontes).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Gestores conseguem gerar e baixar a arte de aniversário completa pronta para o Instagram em menos de 15 segundos por aniversariante.
- **SC-002**: 100% das imagens geradas respeitam rigorosamente os padrões de proporção e resolução do Instagram (1080x1080 no Feed e 1080x1920 no Stories) sem pixelização ou cortes indevidos do rosto.
- **SC-003**: A pré-visualização das alterações de tema, formato e zoom da foto responde em menos de 200 milissegundos no navegador.
- **SC-004**: 90% dos posts de aniversário do clube passam a ser produzidos através do gerador integrado, padronizando a comunicação visual nas redes sociais.

## Assumptions

- O clube possui arquivo em alta resolução do logotipo/brasão oficial disponível na pasta pública de assets da aplicação.
- A geração da imagem final será renderizada preferencialmente no navegador do usuário utilizando HTML5 Canvas / SVG export, garantindo velocidade instantânea sem sobrecarga no servidor.
- A publicação final no Instagram será realizada manualmente ou via compartilhamento mobile pelo responsável de mídias sociais (não depende de aprovação prévia de API comercial da Meta/Instagram Graph API para publicação automatizada em v1).
- O módulo utiliza a base existente de membros (`members.birth_date`) e os perfis vinculados (`users.profile`).

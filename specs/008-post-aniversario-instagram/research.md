# Research: Gerador de Post de Aniversário para Instagram

**Feature**: `008-post-aniversario-instagram`
**Date**: 2026-10-01

Este documento registra as decisões técnicas, alternativas avaliadas e justificativas arquiteturais para a implementação do módulo de aniversariantes e gerador de post para redes sociais.

---

## 1. Motor de Composição Gráfica (Canvas HTML5 vs Backend GD/Imagick)

- **Decisão**: Renderização 100% interativa client-side utilizando a API nativa **HTML5 Canvas 2D**, exportando diretamente para `image/png` e `image/jpeg` em alta resolução (1080x1080 no Feed e 1080x1920 no Stories).
- **Justificativa**:
  - **Interatividade instantânea**: O operador pode arrastar, dar zoom (pan/zoom) e trocar de tema gráfico em tempo real (< 16ms, 60fps) sem nenhuma requisição de rede intermediária.
  - **Zero sobrecarga no servidor**: Elimina consumo de CPU e RAM no servidor PHP para manipulação pesada de pixels.
  - **Alta resolução nativa**: O canvas virtual renderiza nas dimensões exatas solicitadas pelo Instagram (1080x1080 ou 1080x1920), enquanto a visualização na tela do usuário utiliza CSS scale responsivo para caber em qualquer viewport.
- **Alternativas consideradas**:
  - *PHP GD / Imagick*: Requer envio de parâmetros de crop/zoom para o backend a cada clique e re-geração no servidor. Ineficiente para ajustes visuais finos.
  - *Puppeteer / Browsershot*: Exige binários pesados de Chromium no servidor, alto tempo de inicialização (1 a 3s por imagem) e consumo elevado de memória.

---

## 2. Consulta Eficiente de Aniversariantes e Regionalidade

- **Decisão**: Endpoint `GET /birthdays` no `BirthdayPostController` com filtros:
  - `period`: `today` (aniversariantes de hoje), `week` (próximos 7 dias) e `month` (mês corrente).
  - `regional_id`: isolamento ou consolidação conforme contexto ativo e permissões de acesso.
  - `search`: busca por nome ou apelido de estrada.
- **Justificativa**:
  - A tabela `members` já possui a coluna `birth_date` (`DATE`). Utiliza filtros indexados `whereMonth('birth_date', ...)` e `whereDay('birth_date', ...)`, calculando `days_until_birthday` e idade que está completando diretamente na camada de aplicação.
  - Carrega com `with(['user.profile', 'regional'])` para fornecer imediatamente o `avatar`, `road_nickname` e nome da regional.
- **Alternativas consideradas**:
  - *Tabela auxiliar de eventos comemorativos*: Desnecessária (YAGNI), já que a data de nascimento é um dado cadastral estável.

---

## 3. Segurança de Imagem e CORS no Canvas (Tainted Canvas Prevention)

- **Decisão**: Garantir que as imagens de avatar carregadas do disco público (`/storage/avatars/...`) sejam desenhadas no canvas sem bloquear a exportação (`toBlob` / `toDataURL`):
  - Em elementos `new Image()`, configurar `img.crossOrigin = "anonymous"`.
  - Como as imagens são servidas no mesmo domínio (origem) pela rota web do Laravel/Vite, o Canvas permanece seguro e desbloqueado para exportação.
  - Para uploads avulsos de fotos feitos diretamente no gerador (caso o membro não tenha foto de perfil cadastrada), usar `FileReader.readAsDataURL(file)` gerando uma URL base64 local imune a restrições de CORS.
- **Alternativas consideradas**:
  - *Proxy backend em base64 para todas as fotos*: Adiciona latência e consumo de banda desnecessários para fotos que já residem no mesmo host.

---

## 4. Temas Visuais e Design System Motoclube

- **Decisão**: Definir 3 temas gráficos predefinidos renderizados programaticamente pelo Canvas:
  1. **Dark Leather & Gold (Padrão Oficial)**: Fundo escuro texturizado (estilo couro/carbono), detalhes em dourado metálico, brasão vetorial do clube no topo, moldura circular com aro duplo para a foto, tipografia marcante serif/sans e selo "Feliz Aniversário!".
  2. **Asphalt & Speed (Estrada)**: Linhas dinâmicas de asfalto e velocidade, tons de grafite e cinza com detalhes em amarelo/laranja de sinalização de pista.
  3. **Classic Vintage**: Moldura clássica com tipografia de motos vintage e brasão em destaque.
- **Justificativa**: Garante que qualquer operador, mesmo sem conhecimentos de design gráfico, gere peças com padrão visual profissional e alinhado à marca do motoclube.

---

## 5. Exportação e Compartilhamento (Download + Web Share API)

- **Decisão**:
  - **Download Desktop/Mobile**: Botão "Baixar Imagem" gera um arquivo com nome padronizado (ex.: `aniversario-[apelido-ou-nome]-[data].png`).
  - **Web Share API**: Em dispositivos móveis compatíveis (`navigator.canShare({ files })`), exibir botão adicional "Compartilhar", abrindo o menu nativo do sistema operacional (permitindo enviar diretamente ao Instagram Stories, Feed ou WhatsApp).
  - **Cópia de Legenda**: Botão "Copiar Legenda" monta texto comemorativo formatado com emojis, menção da regional e hashtags do clube via `navigator.clipboard.writeText(...)`.
- **Justificativa**: Atende perfeitamente ao fluxo de trabalho ágil dos diretores de comunicação que gerenciam redes sociais tanto pelo computador quanto pelo celular.

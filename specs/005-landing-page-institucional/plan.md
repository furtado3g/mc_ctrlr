# Implementation Plan: Landing page institucional

**Branch**: `005-landing-page-institucional` | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-landing-page-institucional/spec.md`

## Summary

Criar uma página pública do motoclube em `/` e uma área administrativa para manter seu conteúdo e sua identidade visual. A página terá seções institucionais predefinidas. O conteúdo e a identidade terão uma versão publicada e um rascunho separado, com publicação explícita. O acesso administrativo usará uma permissão específica nos grupos de acesso existentes. O nome e o logo publicados serão compartilhados pela página pública, autenticação e painel.

## Technical Context

**Language/Version**: PHP 8.3 e TypeScript 5.7 com React 19.

**Primary Dependencies**: Laravel 13, Inertia 3, React 19, Tailwind CSS 4 e componentes Radix/shadcn existentes. Nenhuma dependência nova prevista.

**Storage**: PostgreSQL 17 no Docker Compose; disco público Laravel para logos e imagens institucionais, sem armazenar conteúdo binário no banco.

**Testing**: PHPUnit 12 / testes feature Laravel com PostgreSQL; VitePlus para lint/format e TypeScript; build do frontend.

**Target Platform**: Aplicação web responsiva executada pelos serviços Docker Compose já existentes.

**Project Type**: Aplicação web Laravel + React/Inertia, com backend e frontend no mesmo repositório.

**Performance Goals**: A landing pública deve ser entregue em até 2 segundos no percentil 95 em condições normais de uso do motoclube; carregar a configuração institucional sem consultas por seção.

**Constraints**: A rota `/` será pública; login e painel permanecem disponíveis em suas rotas atuais. Somente usuários ativos e autorizados podem editar ou publicar. A versão pública não pode ler dados do rascunho. As seções são predefinidas, sem editor de layout livre. Arquivos de imagem devem ser validados e os dados textuais não devem aceitar HTML executável.

**Scale/Scope**: Uma página institucional por motoclube, uma versão publicada e no máximo um rascunho corrente, com conjunto pequeno de seções fixas e poucos responsáveis administrativos.

## Constitution Check

O arquivo de constituição contém somente placeholders do template, sem princípios ratificados que possam ser usados como gates. Portanto, não há violações formais a justificar. O desenho respeita os gates de segurança e compatibilidade já presentes no projeto: autorização no servidor, validação de entrada, publicação sem expor rascunhos e cobertura de fluxos públicos e negados.

**Resultado pré-pesquisa**: PASS — sem restrições de constituição definidas; os controles padrão do projeto serão mantidos.

## Design Decisions

- **Conteúdo em rascunho e publicação**: guardar um snapshot publicado e um snapshot de rascunho no registro da landing. O comando de publicação substitui o snapshot público em uma transação e limpa os assets antigos somente após sucesso. Isso mantém a publicação anterior disponível em caso de falha e evita criar um histórico de versões, que está fora do escopo.
- **Seções estruturadas**: representar as seções predefinidas como uma lista validada de chaves e campos conhecidos (apresentação, sobre, atividades, contato e chamada para ação). O conteúdo textual será texto simples; URLs de chamadas serão validadas. Não será aceito HTML livre.
- **Permissão granular**: incluir `institucional.view` e `institucional.edit` no catálogo central de permissões. A primeira controla acesso à área administrativa e a segunda controla salvar rascunho e publicar. Os grupos por cargo concedem essas permissões separadamente das áreas de caixa e cadastros.
- **Identidade compartilhada**: resolver nome e logo publicados no backend e compartilhá-los para a landing, layout do painel, layouts de autenticação e metadados de título. O fallback atual permanece enquanto não houver conteúdo publicado.
- **Armazenamento de mídia**: usar o disco público já configurado para imagens destinadas à publicação, com nomes gerados pelo armazenamento, tipos PNG/JPEG/WebP e limite inicial de 5 MB por imagem. O caminho de rascunho não será retornado pela página pública. Assets referenciados pela versão publicada só serão removidos depois de uma publicação substituta bem-sucedida.
- **Auditoria**: manter o escopo de auditoria definido pela aplicação sem criar histórico de versões da página. Registrar ator e horário da publicação; snapshots completos permanecem limitados ao estado corrente publicado e ao rascunho.

## Project Structure

### Documentation (this feature)

```text
specs/005-landing-page-institucional/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── landing-page.md
└── tasks.md              # Gerado por $speckit-tasks
```

### Source Code (repository root)

```text
app/
├── Http/Controllers/     # Leitura pública e manutenção administrativa
├── Http/Requests/        # Validação de conteúdo, permissões e imagens
├── Models/               # Registro institucional
├── Providers/            # Gates para institucional.view/edit
└── Support/              # Catálogo de permissões e defaults da página
database/migrations/      # Estado publicado e rascunho institucional
resources/js/
├── components/           # Marca configurável e seções institucionais
├── layouts/              # Marca nas áreas autenticadas e de login
└── pages/                # Landing pública e editor administrativo
routes/web.php            # Rota pública e operações administrativas
resources/views/app.blade.php # Título e dados iniciais da marca
tests/Feature/            # Contratos públicos, autorização, rascunho e publicação
```

**Structure Decision**: Estender a aplicação Laravel/React existente. Rotas, permissões, componentes de marca, telas e testes serão mantidos em suas pastas atuais, sem criar outro projeto ou serviço.

## Constitution Check (post-design)

O desenho continua sem conflito com princípios ratificados (não há princípios definidos). As decisões de autorização, mídia e publicação preservam o acesso protegido do painel e mantêm o conteúdo não publicado fora das respostas públicas.

**Resultado pós-design**: PASS.

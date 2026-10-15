# Feature Specification: Sistema de Cache em Redis e Referência Unificada de Storage no Docker

**Feature Branch**: `009-cache-redis-referencia-storage`

**Created**: 2026-10-15

**Status**: Ready for Implementation Planning

**Input**: User description: "implemente um sistema de cache em redis e crie uma referencia de storage em alguma pasta do projeto na instancia que estiver rodando o docker"

## Clarifications

### Session 2026-10-15
- Q: Qual deve ser o caminho físico da pasta de referência de armazenamento dentro da estrutura do projeto na instância Docker? → A: Criar uma pasta raiz `./data/storage` unificando dados persistentes fora da árvore do código da aplicação.
- Q: Qual deve ser a estratégia de invalidação do cache de permissões ao alterar cargos ou grupos de acesso? → A: Invalidação global de todas as permissões em cache (`user:*:permissions`) ao alterar grupos ou cargos, e granular ao alterar um membro específico.
- Q: O serviço de cache Redis deve persistir dados em disco ou operar estritamente como cache volátil em memória? → A: Cache híbrido com persistência em disco (AOF ou RDB montado em volume Docker), preservando chaves de cache após reinicialização do Redis.
- Q: Onde os arquivos de persistência do Redis devem ser armazenados no host da instância Docker? → A: Na pasta raiz `./data/redis` no projeto, unificando toda a persistência do host sob o diretório `./data`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Aceleração de Conteúdo e Cache com Invalidação Automática (Priority: P1) 🎯 MVP

Como visitante, membro ou administrador do sistema, desejo que as páginas e informações frequentemente consultadas (como landing page institucional, lista de regionais ativas, permissões de usuário e dados públicos) carreguem de forma quase instantânea, garantindo que qualquer alteração publicada seja refletida de imediato sem exigir limpezas manuais.

**Why this priority**: É o valor central da solicitação de cache: diminuir a carga sobre o banco de dados relacional, aumentar a velocidade de resposta e garantir que o cache em memória seja atualizado automaticamente após mutações.

**Independent Test**: O usuário acessa a página inicial ou páginas de leitura e o tempo de carregamento é minimizado. Em seguida, o administrador edita e publica uma nova foto ou texto institucional; ao recarregar a página pública, a versão atualizada é entregue imediatamente, comprovando a invalidação automática do cache.

**Acceptance Scenarios**:

1. **Given** consultas repetidas a dados de leitura (ex.: snapshot da landing page, listagens de regionais e permissões), **When** a requisição é processada, **Then** a resposta é recuperada do serviço de cache em memória, evitando consultas redundantes ao banco de dados.
2. **Given** dados mantidos em cache, **When** um administrador publica uma alteração (ex.: nova logo ou edição da página institucional, atualização de regional ou concessão de acesso), **Then** as chaves de cache relacionadas são imediatamente invalidadas e regeneradas na próxima consulta.
3. **Given** o serviço de cache em memória temporariamente inativo ou inacessível, **When** qualquer usuário efetua uma requisição, **Then** o sistema opera em modo de contingência transparente (fallback para o banco/disco), sem exibir falha ou tela de erro para o usuário.

---

### User Story 2 - Referência de Armazenamento Persistente e Unificado no Docker (Priority: P2)

Como mantenedor ou operador da infraestrutura do clube, desejo que todos os arquivos enviados (fotos de membros, fotos da página institucional, comprovantes financeiros) possuam uma referência física consistente e uma pasta dedicada acessível no projeto dentro da instância Docker (padronizada na pasta raiz `./data/storage`), assegurando que reconstruções de contêineres ou reinicializações do ambiente preservem integralmente todos os arquivos.

**Why this priority**: Garante durabilidade e facilidade de backup/manutenção das mídias enviadas pelos usuários, prevenindo perdas acidentais de arquivos e eliminando inconsistências de caminhos entre o host e o contêiner.

**Independent Test**: O usuário envia uma imagem (ex.: foto da seção hero institucional ou avatar de perfil). O arquivo é gravado e verificado fisicamente no diretório de referência configurado no host (`./data/storage/public`) e no contêiner. O ambiente de contêineres é parado e reiniciado com recriação dos serviços; o arquivo permanece acessível e é servido sem erros pelo servidor web.

**Acceptance Scenarios**:

1. **Given** o envio de arquivos pelo sistema (fotos, logos, documentos), **When** o upload é concluído com sucesso, **Then** o arquivo é armazenado no diretório de referência dedicado `./data/storage` do projeto na instância Docker.
2. **Given** contêineres Docker reiniciados, recriados ou atualizados, **When** a aplicação ou o servidor web solicita um arquivo armazenado, **Then** o arquivo continua disponível no mesmo caminho relativo e absoluto referenciado.
3. **Given** a geração do link simbólico de storage público (`public/storage`), **When** o contêiner sobe ou os scripts de inicialização são executados, **Then** a referência simbólica para a pasta de arquivos é validada e garantida de forma automática.

---

### User Story 3 - Diagnóstico e Saúde Operacional de Cache e Armazenamento (Priority: P3)

Como administrador ou responsável técnico, desejo ter visibilidade simples e confiável do estado de conectividade do serviço de cache e da integridade da pasta de armazenamento, para detectar previamente qualquer anomalia de persistência ou desempenho.

**Why this priority**: Facilita a sustentação da infraestrutura, permitindo validar rapidamente em comandos de diagnóstico ou testes se o cache e os volumes de armazenamento estão operando dentro do esperado.

**Independent Test**: O administrador executa rotinas de verificação ou testes do sistema e recebe a confirmação explícita de conexão bem-sucedida ao serviço de cache em memória e confirmação de leitura/escrita na pasta de referência de storage.

**Acceptance Scenarios**:

1. **Given** os serviços Docker em execução, **When** um comando ou teste de saúde do cache é acionado, **Then** o sistema confirma leitura, gravação e expiração de chave no serviço em memória com latência inferior a 10ms.
2. **Given** o diretório de armazenamento montado, **When** a rotina de validação verifica as permissões, **Then** confirma capacidade de leitura, escrita e resolução do link público sem erros de permissão de sistema operacional.

---

### Edge Cases

- **Queda ou reinicialização do serviço de cache**: O sistema não deve travar nem emitir erro fatal ao usuário; deve recorrer temporariamente à fonte de dados original e restabelecer a conexão automaticamente assim que o serviço voltar.
- **Falha de permissão no diretório de mídias**: Se a pasta de referência no host não tiver permissão de escrita pelo usuário do contêiner, o sistema deve fornecer mensagens claras no log e prevenir gravações corrompidas.
- **Concorrência de invalidação de cache**: Quando múltiplas edições ocorrem em curto intervalo, as tags/chaves de cache devem ser expurgadas de forma atômica para evitar entrega de dados desatualizados (race conditions).
- **Recriação do ambiente Docker sem perda de mídia**: A pasta de referência física `./data/storage` no host deve manter todos os uploads intactos, mesmo quando `docker compose down -v` ou novas imagens forem compiladas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE utilizar um serviço de armazenamento chave-valor em memória dedicado (Redis) para as operações de cache da aplicação, operando em modo híbrido com persistência em disco preservada após reinicializações.
- **FR-002**: O sistema DEVE armazenar em cache os dados estáticos e de leitura frequente (incluindo snapshot institucional da landing page, lista de regionais e permissões compiladas do usuário autenticado).
- **FR-003**: O sistema DEVE invalidar de forma automática e imediata as entradas de cache correspondentes sempre que ocorrer salvamento, atualização ou publicação de dados, adotando invalidação global de permissões (`user:*:permissions`) ao alterar grupos ou cargos, e granular ao alterar um membro específico.
- **FR-004**: O sistema DEVE possuir mecanismo de tolerância a falhas (fallback) que garanta o funcionamento ininterrupto da aplicação em caso de indisponibilidade momentânea do serviço de cache.
- **FR-005**: O sistema DEVE dispor de uma pasta de referência explícita de armazenamento de arquivos no projeto na instância em que o contêiner Docker roda, padronizada na pasta raiz `./data/storage` (com subpastas `public/`, `receipts/` e `private/`), fora da árvore de código da aplicação.
- **FR-006**: O sistema DEVE persistir permanentemente todos os uploads (imagens institucionais, fotos de perfil, comprovantes) no diretório de referência mapeado `./data/storage`, sobrevivendo à destruição e recriação dos contêineres.
- **FR-007**: O sistema DEVE assegurar que o link simbólico (`public/storage`) e os caminhos de URL pública continuem entregando arquivos estáticos através do servidor web sem bloqueios ou referências a portas incorretas.
- **FR-008**: O sistema DEVE incluir no roteiro de inicialização e ambiente Docker a orquestração do serviço de cache (com persistência em `./data/redis`) e a correta montagem das pastas de armazenamento (`./data/storage`).

### Key Entities *(include if feature involves data)*

- **Entrada de Cache**: Representa um dado volátil serializado em memória, associado a uma chave única, tempo de vida (TTL) e identificador de contexto/tag para invalidação seletiva.
- **Volume de Mídia Referenciado**: Representa a pasta de armazenamento do projeto `./data/storage` vinculada à instância Docker (mapeada para `/var/www/html/storage/app`), contendo os arquivos públicos (`./data/storage/public`) e privados (`./data/storage/receipts`), com persistência garantida no host fora da árvore do código.
- **Persistência do Redis**: Representa os arquivos de snapshot/appendonly do Redis montados na pasta física `./data/redis` do projeto no host.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O tempo de resposta para carregamento das informações da landing page e páginas com dados cacheados apresenta redução mensurável de pelo menos 50% em acessos repetidos.
- **SC-002**: 100% dos arquivos enviados por upload permanecem íntegros e acessíveis após a execução de comandos de parada e recriação dos contêineres Docker (`docker compose down && docker compose up -d`).
- **SC-003**: Invalidação de cache concluída em menos de 500ms após a publicação de dados institucionais ou atualização de cadastros, garantindo que nenhum usuário veja conteúdo defasado.
- **SC-004**: Taxa de disponibilidade da aplicação de 100% mesmo se o serviço de cache em memória for reiniciado ou pausado (degradação graciosa com zero erros HTTP 500 para o visitante).

## Assumptions

- O ambiente Docker possui conectividade de rede interna entre os serviços da aplicação, o servidor web e o serviço de cache.
- A persistência dos arquivos no disco do host ocorre através de volume/bind mount mapeado diretamente da pasta raiz `./data/storage` do projeto para `/var/www/html/storage/app` nos contêineres.
- A persistência do Redis no disco do host ocorre através de volume/bind mount mapeado de `./data/redis` para `/data` no contêiner do Redis.
- O driver de cache em memória será configurável por variáveis de ambiente padrão, permitindo utilizar drivers locais/array durante a execução de testes automatizados unitários quando desejado.

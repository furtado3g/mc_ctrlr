# Research: Formulários e tabelas dinâmicas

## Decision 1: Preservar consultas na sessão do usuário

- **Decision**: Armazenar busca, filtros, ordenação e página em um namespace de consulta por usuário e por tabela durante a sessão atual. A URL permanece limpa.
- **Rationale**: Atende à decisão da especificação, permite voltar à tabela sem refazer o trabalho e evita que dados de consulta sejam compartilhados por links ou copiados para fora da sessão.
- **Alternatives considered**: Query string na URL (rejeitada porque o usuário escolheu não expor o estado); estado somente no componente (rejeitado porque se perde ao navegar); armazenamento permanente no perfil (rejeitado porque a preferência é temporária).

## Decision 2: Rascunhos temporários de formulários

- **Decision**: Manter rascunhos não enviados em `sessionStorage`, com chave versionada por escopo opaco da sessão, formulário e registro. Restaurar o rascunho ao retornar ao formulário, informar que ele foi recuperado e removê-lo após salvar, descartar explicitamente ou encerrar a sessão/logout.
- **Rationale**: Protege o trabalho após falha de conexão ou navegação acidental sem gravar cada tecla no servidor. O escopo de sessão impede que um novo login restaure dados antigos; rascunhos não incluem senhas, arquivos ou dados que não pertençam ao formulário.
- **Alternatives considered**: Somente estado React (não sobrevive à navegação); sessão Laravel para cada alteração (mais latência e risco de perder a última mudança em falha de conexão); armazenamento permanente no navegador (pode sobreviver à sessão e deixar dados sensíveis); salvar automaticamente como registro oficial (mistura rascunho com dado financeiro e exige fluxo de aprovação).

## Decision 3: Tabelas responsivas com linha expansível

- **Decision**: Em telas estreitas, renderizar as colunas prioritárias na linha principal e disponibilizar detalhes secundários e ações pela expansão explícita da linha. Em telas maiores, manter a leitura tabular completa.
- **Rationale**: Mantém as ações principais acessíveis sem rolagem horizontal e preserva o contexto do registro aberto.
- **Alternatives considered**: Rolagem horizontal (dificulta a leitura e a localização das ações); seletor manual de colunas (aumenta a carga de configuração e pode esconder dados necessários).

## Decision 4: Componentes compartilhados para consistência

- **Decision**: Criar componentes de formulário e tabela compartilhados para estados de campo, mensagens, submissão, paginação, filtros, ordenação, linha expansível, carregamento e estado vazio; as páginas fornecem apenas campos e colunas específicos do domínio.
- **Rationale**: Reduz divergências entre membros, cobranças, caixa e relatórios e torna os critérios de acessibilidade e responsividade verificáveis em um só lugar.
- **Alternatives considered**: Ajustar cada página separadamente (duplicação e comportamento inconsistente); introduzir uma biblioteca externa de tabelas (dependência adicional sem necessidade para o escopo atual).

## Decision 5: Consultas escaláveis e autorizadas no servidor

- **Decision**: Validar e aplicar filtros, ordenação e paginação no servidor, com lista explícita de colunas ordenáveis e filtros permitidos por recurso. A autorização continua sendo aplicada antes da consulta e da mutação.
- **Rationale**: Evita carregar milhares de registros no navegador, protege dados financeiros e mantém resultados coerentes com a fonte oficial.
- **Alternatives considered**: Filtrar tudo no navegador (não escala para 10.000 registros e pode expor dados sem permissão); aceitar qualquer campo vindo do cliente (abre espaço para ordenação ou filtros indevidos).

## Decision 5a: Mutação explícita do estado de consulta

- **Decision**: A mudança de filtros, ordenação, tamanho ou página envia o estado completo para uma ação autenticada e autorizada; o GET da tabela lê o estado da sessão e devolve a lista paginada. Alterações de busca e filtro reiniciam a página para 1; paginação mantém os demais campos.
- **Rationale**: Evita combinações parciais, mantém a URL limpa e permite validar uma única estrutura por tabela. A lista de colunas ordenáveis é uma allowlist por recurso e sempre usa desempate estável por identificador.
- **Alternatives considered**: Estado em `sessionStorage` com fetch separado (duplica o fluxo Inertia e dificulta o carregamento inicial); links com `?page=` e query string (contradiz a decisão do usuário); aceitar nomes de coluna diretamente do cliente (risco de consulta indevida).

## Decision 6: Estados de interação e validação

- **Decision**: Usar estados explícitos para inicial, carregando, sucesso, erro de validação, erro de conexão e vazio; bloquear o botão enquanto a submissão estiver em andamento e manter os dados do formulário em falhas recuperáveis.
- **Rationale**: Torna o resultado da ação compreensível e cobre os cenários de aceitação sem depender de mensagens genéricas.
- **Alternatives considered**: Mensagens globais sem vínculo ao campo (dificultam a correção); limpar o formulário após qualquer tentativa (perde trabalho); spinner sem preservar controles (deixa o usuário sem contexto).

## Decision 7: Sem alteração persistente de domínio

- **Decision**: A revisão não cria entidades financeiras ou de cadastro novas. O armazenamento temporário de consultas e rascunhos usa a sessão existente e não altera os registros oficiais.
- **Rationale**: Mantém o limite da feature na experiência de uso e preserva as regras financeiras e trilhas de auditoria já implementadas.
- **Alternatives considered**: Criar tabelas permanentes de preferências e rascunhos (escopo e retenção desnecessários para a primeira versão).

## Evidence from the current project

- O stack existente é PHP 8.3, Laravel 13, Inertia Laravel 3, React 19, Inertia React 3, TypeScript 5.7, Tailwind 4, shadcn/ui e PostgreSQL 17.
- A sessão usa o driver `database` e lifetime padrão de 120 minutos; o logout deve invalidar a sessão e gerar novo escopo para o próximo login.
- As páginas atuais usam `useState` e `router.post/patch`, tabelas com `paginate(30)` e `withQueryString()`, e várias telas usam `overflow-x-auto`; a revisão deve centralizar esses comportamentos sem introduzir uma biblioteca de grid.
- A busca textual para 10.000 registros deve ser medida com `EXPLAIN ANALYZE`; índices adicionais só serão criados se a medição demonstrar necessidade.

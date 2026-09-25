# UI Contracts: Formulários e tabelas dinâmicas

Este contrato descreve o comportamento observável das páginas administrativas. As regras de negócio e autorização continuam nos endpoints existentes; a revisão padroniza os dados de consulta e os estados apresentados ao usuário.

## Consulta de tabela

Cada página de lista deve aceitar e devolver um estado lógico equivalente a:

```text
TableQuery {
  search: string|null
  filters: object
  sort: string
  direction: "asc"|"desc"
  page: positive integer
  per_page: positive integer
}
```

Regras do contrato:

- Campos desconhecidos, ordenações não permitidas, páginas inválidas e filtros malformados são ignorados ou normalizados para o padrão seguro.
- O estado pode ser restaurado dentro da sessão do usuário, mas não deve ser colocado na URL.
- A resposta deve incluir total, página atual, tamanho de página e indicação de `no_records` ou `no_matches` quando não houver linhas.
- A ordenação deve ser determinística; quando houver empate, a página usa um critério estável do registro.
- A resposta não pode incluir registros fora da permissão do usuário.

## Formulário administrativo

Todo formulário revisado deve expor estados equivalentes a:

```text
FormState {
  values: object
  errors: map<string, string[]>
  processing: boolean
  dirty: boolean
  draft_restored: boolean
  success_message: string|null
  connection_error: string|null
}
```

Regras do contrato:

- Erros são associados à chave do campo; erros gerais continuam disponíveis para falhas que não pertencem a um campo.
- Enquanto `processing` for verdadeiro, o controle de submissão fica desabilitado e não inicia uma segunda operação.
- Uma resposta de validação mantém os valores enviados e permite corrigir somente o necessário.
- Um rascunho recuperado deve ser identificado para o usuário e pode ser descartado explicitamente.
- Sucesso remove o rascunho e apresenta confirmação da operação.
- Falha de conexão mantém os valores editados e oferece nova tentativa.

## Responsividade e acessibilidade

- Formulários devem seguir uma ordem de leitura linear, associar rótulos aos controles e permitir navegação por teclado.
- Tabelas devem manter cabeçalho identificável, foco visível e ação de expansão operável por teclado.
- Em tela estreita, a linha expandida deve apresentar detalhes e ações sem remover a identificação do registro.
- Mensagens de erro, carregamento e sucesso devem ser anunciadas de forma perceptível e permanecer junto da tarefa que as originou.

## Superfícies cobertas

O contrato se aplica às listas e formulários de membros, motos, cargos, períodos, mensalidades, pagamentos, caixa, relatórios, usuários e permissões. Rotas existentes permanecem compatíveis; a mudança é no estado de consulta e na apresentação da interface.

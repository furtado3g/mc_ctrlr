# Contracts: Endpoints de Aniversariantes e Gerador de Posts

**Feature**: `008-post-aniversario-instagram`
**Date**: 2026-10-01

Este documento especifica os contratos de rotas, parâmetros de requisição e respostas Inertia para o módulo de aniversariantes.

---

## 1. Listagem de Aniversariantes e Tela do Gerador

### `GET /birthdays`
Exibe a página principal do módulo de aniversariantes, com listagem filtrável por período, regional e busca, além de permitir abrir o gerador de arte comemorativa para qualquer membro selecionado.

#### Query Parameters
- `period` (string, opcional, padrão: `month`):
  - `today`: Aniversariantes de hoje.
  - `week`: Próximos 7 dias.
  - `month`: Mês corrente (ou mês especificado).
- `month` (int, opcional, 1-12, padrão: mês atual): Filtra aniversariantes de um mês específico.
- `regional_id` (int, opcional): Filtra aniversariantes de uma regional específica (para usuários globais/diretoria).
- `search` (string, opcional): Termo de busca por nome ou apelido de estrada.
- `member_id` (int, opcional): Se informado na URL, abre automaticamente o gerador com este membro pré-carregado.

#### Response: Inertia Render (`birthdays/index`)
```json
{
  "component": "birthdays/index",
  "props": {
    "birthdays": [
      {
        "id": 14,
        "name": "Roberto Silva",
        "road_nickname": "Gavião",
        "avatar_url": "/storage/avatars/user_14_xyz.webp",
        "regional_name": "Vale do Paraíba",
        "birth_date": "1985-10-15",
        "birth_day_month": "15 de Outubro",
        "day": 15,
        "month": 10,
        "is_today": false,
        "days_until": 14,
        "turning_age": 41
      }
    ],
    "today_count": 1,
    "week_count": 4,
    "month_count": 12,
    "filters": {
      "period": "month",
      "month": 10,
      "regional_id": null,
      "search": null
    },
    "regionais": [
      { "id": 1, "name": "Vale do Paraíba" },
      { "id": 2, "name": "Litoral Norte" }
    ],
    "selectedMember": null
  }
}
```

---

## 2. Consulta Rápida de Membro para Post Avulso

### `GET /birthdays/members/search?q={termo}`
Permite que o operador pesquise qualquer membro ativo do motoclube para gerar um post de aniversário avulso, mesmo que a data de nascimento não esteja no período atual.

#### Response (JSON)
```json
[
  {
    "id": 22,
    "name": "Carlos Eduardo",
    "road_nickname": "Trovão",
    "avatar_url": "/storage/avatars/user_22_abc.webp",
    "regional_name": "Serra da Mantiqueira",
    "birth_date": "1978-04-12",
    "birth_day_month": "12 de Abril",
    "day": 12,
    "month": 4,
    "is_today": false,
    "days_until": 193,
    "turning_age": 48
  }
]
```

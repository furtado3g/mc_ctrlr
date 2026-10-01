# Interface Contracts: Perfil de Usuário e Feed Social

## 1. Perfil Pessoal & Avatar

### GET `/settings/profile` ou `/me/profile`
Exibe os dados de perfil pessoal do usuário, incluindo avatar, apelido de estrada, bio e links sociais.

**Resposta (Inertia Props)**:
```json
{
  "auth": {
    "user": {
      "id": 1,
      "name": "Carlos 'Falcão' Silva",
      "email": "carlos@motoclube.com",
      "avatar": "/storage/avatars/abc123hash.webp"
    }
  },
  "profile": {
    "road_nickname": "Falcão",
    "bio": "Apaixonado por duas rodas e viagens pelo interior.",
    "phone": "(11) 98765-4321",
    "social_links": {
      "instagram": "@falcao_moto"
    },
    "avatar_url": "/storage/avatars/abc123hash.webp"
  }
}
```

---

### POST `/me/profile/avatar`
Envia ou substitui a foto de perfil do usuário.

**Headers**: `Content-Type: multipart/form-data`

**Request Payload**:
```text
avatar: (binary image file - jpg, png, webp, max 5MB)
```

**Respostas**:
- `302 Redirect` (back com toast de sucesso) em caso de sucesso.
- `422 Unprocessable Entity` com erros de validação:
```json
{
  "errors": {
    "avatar": ["O arquivo deve ser uma imagem válida (JPEG, PNG ou WebP) de até 5MB."]
  }
}
```

---

### DELETE `/me/profile/avatar`
Remove a foto personalizada e restaura as iniciais padrão.

**Respostas**:
- `302 Redirect` (back com toast de sucesso).

---

### PATCH `/me/profile/details`
Atualiza dados sociais e biografia.

**Request Payload (JSON / Form Data)**:
```json
{
  "road_nickname": "Falcão da Estrada",
  "bio": "Mais de 100.000 km rodados em comboio.",
  "phone": "(11) 98765-4321",
  "social_links": {
    "instagram": "@falcao_estrada"
  }
}
```

**Respostas**:
- `302 Redirect` (back com toast de sucesso).

---

## 2. Feed Social

### GET `/feed`
Lista publicações do feed social com filtros por aba e paginação sob demanda.

**Query Parameters**:
- `tab`: `"regional"` | `"global"` (default: `"regional"`)
- `page`: `integer` (default: 1)

**Resposta (Inertia Props)**:
```json
{
  "currentTab": "regional",
  "posts": {
    "data": [
      {
        "id": 105,
        "content": "Excelente passeio de sábado rumo à serra! Seguem algumas fotos do comboio.",
        "created_at": "2026-10-01T14:30:00.000000Z",
        "created_at_human": "há 2 horas",
        "regional": {
          "id": 2,
          "name": "Regional Campinas",
          "code": "CPS"
        },
        "author": {
          "id": 4,
          "name": "Carlos Silva",
          "road_nickname": "Falcão",
          "avatar_url": "/storage/avatars/abc123hash.webp"
        },
        "media": [
          {
            "id": 201,
            "url": "/storage/posts/comboio_1.webp",
            "sort_order": 0
          },
          {
            "id": 202,
            "url": "/storage/posts/comboio_2.webp",
            "sort_order": 1
          }
        ],
        "likes_count": 14,
        "is_liked": true,
        "comments_count": 3,
        "can_delete": true,
        "comments": [
          {
            "id": 50,
            "content": "Passeio top demais, na próxima estou junto!",
            "created_at_human": "há 1 hora",
            "can_delete": false,
            "author": {
              "id": 7,
              "name": "Mariana Souza",
              "road_nickname": "Trovão",
              "avatar_url": null
            }
          }
        ]
      }
    ],
    "links": [],
    "next_page_url": "/feed?tab=regional&page=2"
  }
}
```

---

### POST `/feed/posts`
Cria uma nova publicação com texto e até 10 fotos.

**Headers**: `Content-Type: multipart/form-data`

**Request Payload**:
```text
content: "Relato do evento..."
regional_id: 2 (opcional, defaults to user's regional or null for global)
images[]: [arquivo 1, arquivo 2, ...] (máx 10 imagens, cada uma max 5MB)
```

**Respostas**:
- `302 Redirect` para `/feed` com toast de sucesso.
- `422 Unprocessable Content`:
```json
{
  "errors": {
    "content": ["O texto da publicação é obrigatório."],
    "images": ["Não é permitido enviar mais de 10 fotos por publicação."]
  }
}
```

---

### DELETE `/feed/posts/{post}`
Exclui uma publicação (autor do post ou moderadores).

**Respostas**:
- `302 Redirect` com toast de sucesso.
- `403 Forbidden` se o usuário não for o autor nem possuir permissão administrativa.

---

### POST `/feed/posts/{post}/likes`
Alterna (curte / descurte) a publicação.

**Respostas**:
- `302 Redirect` (ou JSON `{ "liked": true, "likes_count": 15 }`).

---

### POST `/feed/posts/{post}/comments`
Adiciona um comentário à publicação.

**Request Payload**:
```json
{
  "content": "Grande abraço a todos os irmãos de estrada!"
}
```

**Respostas**:
- `302 Redirect` com toast de sucesso.
- `422 Unprocessable Content` se `content` estiver vazio ou exceder 1000 caracteres.

---

### DELETE `/feed/comments/{comment}`
Exclui um comentário (autor do comentário, autor do post ou moderador).

**Respostas**:
- `302 Redirect` com toast de sucesso.
- `403 Forbidden` se não autorizado.

---

## 3. Perfil Público de Membro

### GET `/members/{member}/public-profile` ou `/profile/{user}`
Exibe os dados públicos e as postagens recentes do membro.

**Resposta (Inertia Props)**:
```json
{
  "member": {
    "id": 4,
    "name": "Carlos Silva",
    "road_nickname": "Falcão",
    "avatar_url": "/storage/avatars/abc123hash.webp",
    "bio": "Mais de 100.000 km rodados em comboio.",
    "regional": "Regional Campinas",
    "city": "Campinas / SP",
    "joined_at_human": "Membro desde Abril de 2021",
    "motorcycles": [
      {
        "manufacturer": "Harley-Davidson",
        "model": "Fat Boy",
        "year": 2022
      }
    ]
  },
  "posts": [
    {
      "id": 105,
      "content": "Excelente passeio de sábado rumo à serra!",
      "created_at_human": "há 2 dias",
      "likes_count": 14,
      "comments_count": 3,
      "media": [ ... ]
    }
  ]
}
```

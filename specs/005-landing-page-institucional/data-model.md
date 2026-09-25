# Data Model: Landing page institucional

## InstitutionalPage

Representa a única landing page institucional (`key = home`) e guarda seu estado corrente publicado e o rascunho de edição.

| Field | Type | Required | Rules / meaning |
|-------|------|----------|-----------------|
| `id` | integer | Yes | Identificador interno. |
| `key` | string | Yes | Valor único `home`, para manter um único registro institucional. |
| `published_content` | JSONB object, nullable | No | Snapshot que pode ser servido ao público; `null` usa a página padrão até a primeira publicação. |
| `draft_content` | JSONB object, nullable | No | Snapshot em edição; `null` significa que não há rascunho salvo. Nunca é usado pela rota pública. |
| `draft_saved_by` | user id, nullable | No | Último responsável que salvou o rascunho; torna-se nulo se a conta for removida. |
| `draft_saved_at` | timestamp, nullable | No | Momento do último salvamento do rascunho. |
| `published_by` | user id, nullable | No | Último responsável que publicou o conteúdo; torna-se nulo se a conta for removida. |
| `published_at` | timestamp, nullable | No | Momento da publicação corrente. |
| `created_at`, `updated_at` | timestamps | Yes | Datas de criação e atualização do registro. |

### Snapshot de conteúdo

`published_content` e `draft_content` usam o mesmo formato. Cada atualização substitui o snapshot inteiro; publicação promove o rascunho validado para o estado público e limpa o campo de rascunho.

```json
{
  "name": "Nome público do motoclube",
  "logo_path": "institutional/<nome-gerado>.webp",
  "sections": [
    {
      "key": "hero",
      "title": "Título",
      "body": "Texto simples",
      "image_path": null,
      "cta_label": "Conheça o clube",
      "cta_url": "/login",
      "enabled": true,
      "position": 0
    }
  ]
}
```

### Seções conhecidas

As chaves válidas são `hero`, `about`, `activities` e `contact`. A seção de chamada para ação pode ser configurada nos campos de `hero`; não há tipos de seção definidos livremente pelo usuário.

- `key`: enumeração de seção conhecida e única no snapshot.
- `title`: texto simples limitado a 160 caracteres; obrigatório para seção ativa.
- `body`: texto simples limitado a 5.000 caracteres; obrigatório para seção ativa, exceto quando o tipo for apenas chamada para ação.
- `image_path`: caminho gerado pelo armazenamento; opcional e limitado a um arquivo de imagem permitido.
- `cta_label`: texto simples limitado a 80 caracteres; rótulo e URL devem ser fornecidos juntos.
- `cta_url`: caminho local iniciado com `/` ou URL externa HTTPS; rejeitar esquemas executáveis.
- `enabled`: booleano; seção desativada não aparece publicamente.
- `position`: inteiro não negativo e único na lista para determinar a ordem.

### Identidade e estado

- O nome exibido é obrigatório, texto simples com até 120 caracteres e não pode conter apenas espaços.
- `logo_path` e `image_path` são referências a arquivos de imagem. A primeira versão aceita PNG, JPEG e WebP com no máximo 5 MB por arquivo.
- Um registro ausente ou sem `published_content` é apresentado com nome de fallback da aplicação, ícone padrão e conteúdo institucional inicial. Nenhum rascunho é usado como fallback público.
- Um rascunho representa o conteúdo completo desejado, incluindo identidade e todas as seções. Salvar substitui o rascunho corrente; não cria histórico.
- Publicar requer um rascunho válido. O snapshot público anterior permanece disponível se a validação ou persistência da publicação falhar.
- Caminhos de assets que não forem mais referenciados pelo rascunho ou pela publicação podem ser removidos após a substituição bem-sucedida, nunca antes de a nova publicação estar persistida.

## Relationships

- `InstitutionalPage.draft_saved_by` → `User.id`, opcional.
- `InstitutionalPage.published_by` → `User.id`, opcional.
- Não há relação com cadastro de membros: o conteúdo é fornecido manualmente e dados de membros não são incluídos na landing.
- Não há entidade de histórico de versões: há somente um snapshot público e um rascunho corrente.

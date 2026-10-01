# Data Model: Gerador de Post de Aniversário para Instagram

**Feature**: `008-post-aniversario-instagram`
**Date**: 2026-10-01

Este documento define os modelos de dados, estruturas de transferência (DTOs/Resources) e contratos de tipos utilizados no módulo de aniversariantes e gerador de posts.

---

## 1. Entidades Existentes Utilizadas

### Member (`members`)
- `id` (int, PK)
- `regional_id` (foreignId -> regionais.id)
- `name` (string)
- `birth_date` (date, nullable)
- `status` (string, enum: 'active', 'inactive', 'suspended')
- Relacionamentos: `user` (HasOne User), `regional` (BelongsTo Regional).

### UserProfile (`user_profiles`)
- `id` (int, PK)
- `user_id` (foreignId -> users.id, unique)
- `avatar_path` (string, nullable)
- `road_nickname` (string, nullable)
- Acessores: `avatar_url` (computado a partir de `avatar_path`).

---

## 2. Estrutura de Dados do Aniversariante (Backend DTO / Inertia Prop)

```typescript
export interface BirthdayMember {
    id: number;
    name: string;
    road_nickname: string | null;
    avatar_url: string | null;
    regional_name: string | null;
    birth_date: string; // "YYYY-MM-DD"
    birth_day_month: string; // "15 de Outubro" ou "15/10"
    day: number; // 1-31
    month: number; // 1-12
    is_today: boolean;
    days_until: number; // 0 se hoje, 1 a 365
    turning_age: number | null; // Idade calculada
}
```

---

## 3. Modelo de Configuração de Arte do Post (Frontend Canvas State)

```typescript
export type PostFormat = 'feed_square' | 'feed_portrait' | 'stories';

export interface FormatDimensions {
    width: number;
    height: number;
    label: string;
    aspectRatio: string;
}

export const POST_FORMATS: Record<PostFormat, FormatDimensions> = {
    feed_square: {
        width: 1080,
        height: 1080,
        label: 'Feed Quadrado (1:1)',
        aspectRatio: '1/1',
    },
    feed_portrait: {
        width: 1080,
        height: 1350,
        label: 'Feed Retrato (4:5)',
        aspectRatio: '4/5',
    },
    stories: {
        width: 1080,
        height: 1920,
        label: 'Stories / WhatsApp (9:16)',
        aspectRatio: '9/16',
    },
};

export type PostThemeId = 'dark_gold' | 'asphalt_speed' | 'classic_vintage';

export interface PostTheme {
    id: PostThemeId;
    name: string;
    description: string;
    bgColor: string;
    accentColor: string;
    secondaryColor: string;
    textColor: string;
    badgeText: string;
}

export interface PostGeneratorConfig {
    member: BirthdayMember;
    format: PostFormat;
    theme: PostThemeId;
    photoUrl: string | null;
    zoom: number; // 0.5 a 3.0, padrão 1.0
    panX: number; // Deslocamento horizontal em pixels
    panY: number; // Deslocamento vertical em pixels
    headline: string; // ex: "FELIZ ANIVERSÁRIO!"
    subheadline: string; // ex: "Muitos quilômetros de vida e irmandade na estrada!"
    showNickname: boolean; // padrão true
    showRegional: boolean; // padrão true
    showAge: boolean; // padrão false (opcional para quem prefere não exibir idade)
}
```

---

## 4. Regras de Validação e Limites

- **Zoom da foto**: Limitado entre `0.5x` (zoom out) e `3.0x` (zoom in).
- **Formatos de imagem exportados**: PNG (com suporte a transparência e máxima nitidez) e JPEG (qualidade 95% para menor tamanho).
- **Dimensões nativas**:
  - `1080 x 1080` (Feed quadrado)
  - `1080 x 1350` (Feed vertical 4:5)
  - `1080 x 1920` (Stories 9:16)
- **Filtros de Período**:
  - `today`: Aniversariantes do dia de hoje (dia e mês coincidem com a data atual).
  - `week`: Aniversariantes nos próximos 7 dias.
  - `month`: Aniversariantes do mês atual selecionado.

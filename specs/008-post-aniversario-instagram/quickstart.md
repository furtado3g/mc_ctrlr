# Quickstart: Validação do Gerador de Post de Aniversário para Instagram

Este guia apresenta cenários de validação automatizada e manual para comprovar o funcionamento do módulo de aniversariantes e do gerador de post para Instagram.

---

## 1. Pré-Requisitos

1. Banco de dados migrado com membros cadastrados contendo `birth_date`.
2. Link simbólico do storage configurado (`php artisan storage:link`).
3. Build dos assets frontend (`npm run build`).

---

## 2. Cenários de Validação Automatizada (PHPUnit)

Executar a suíte de testes de aniversariantes:

```bash
php artisan test --filter=BirthdayPostTest
```

Cenários cobertos pelos testes:
- `test_authenticated_user_can_view_birthdays_page`: Acesso à rota `/birthdays` com carregamento de aniversariantes.
- `test_birthdays_filter_today_week_and_month`: Verificação de que membros com aniversário hoje aparecem no filtro `today`, aniversariantes dos próximos 7 dias aparecem em `week`, e aniversariantes do mês corrente aparecem em `month`.
- `test_birthdays_regional_scoping`: Membros de outras regionais são filtrados conforme a regional selecionada ou contexto do usuário.
- `test_member_without_avatar_still_loads_with_fallback`: Membros sem foto cadastrada têm `avatar_url = null` e carregam com iniciais sem quebrar o componente.
- `test_member_search_endpoint_returns_matching_members`: Endpoint `/birthdays/members/search` encontra integrantes por nome ou apelido de estrada.

---

## 3. Roteiro de Validação Manual

### Cenário A: Visualização dos Aniversariantes do Mês
1. Acesse o sistema como membro com acesso ou administrador.
2. No menu principal da barra lateral, clique no item **Aniversariantes** (ícone de bolo de aniversário/presente).
3. Verifique os cartões de resumo no topo:
   - "Aniversariantes de Hoje"
   - "Próximos 7 Dias"
   - "Total no Mês"
4. Alterne entre as abas de período e confira os integrantes listados com foto de perfil, apelido e data.

### Cenário B: Geração do Post de Aniversário para o Instagram
1. Na lista de aniversariantes, clique no botão **"Gerar Post Instagram"** de qualquer integrante.
2. O modal do gerador é exibido em tela cheia com a pré-visualização em alta resolução.
3. Observe que a foto do membro está centralizada na moldura comemorativa com o brasão do motoclube, seu nome e apelido de estrada.
4. Ajuste o controle de **Zoom** para ampliar ou reduzir o rosto do membro.
5. Alterne entre os temas visuais:
   - **Dark Gold**: Fundo preto escuro acetinado com dourado e brasão em relevo.
   - **Asphalt & Speed**: Fundo com tema de estrada e textura asfáltica.
   - **Classic Vintage**: Moldura clássica tradicional.
6. Alterne o formato entre **Feed Quadrado (1:1)**, **Feed Retrato (4:5)** e **Stories (9:16)** e observe a reorganização harmoniosa dos elementos.

### Cenário C: Download da Imagem e Cópia de Legenda
1. Com a arte configurada, clique em **"Copiar Legenda"**:
   - Uma mensagem toast de sucesso é exibida: *"Legenda copiada para a área de transferência!"*.
   - Cole em um bloco de notas para conferir o texto com nome, apelido, votos de aniversário e hashtags.
2. Clique no botão **"Baixar Imagem (PNG)"**:
   - O arquivo de imagem é baixado no navegador com dimensões exatas de 1080x1080 (ou 1080x1920 para Stories).
   - Abra a imagem baixada para conferir a alta resolução sem perda de nitidez.
3. Se estiver em um smartphone, teste o botão **"Compartilhar"** para abrir o menu nativo de envio direto para o Instagram/WhatsApp.

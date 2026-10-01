# Quickstart: Validação de Perfil de Usuário e Feed Social

Este guia apresenta cenários de validação automatizada e manual para comprovar o funcionamento ponta a ponta do perfil de usuário, upload de avatar e feed social.

---

## 1. Pré-Requisitos

1. Banco de dados configurado e migrado:
   ```bash
   php artisan migrate
   ```
2. Link simbólico do storage público criado:
   ```bash
   php artisan storage:link
   ```
3. Dependências e build do frontend:
   ```bash
   npm run build
   ```

---

## 2. Cenários de Validação Automatizada (PHPUnit)

Executar a suíte de testes de perfil e feed:

```bash
php artisan test --filter=UserProfileAndFeedTest
```

Cenários cobertos pelos testes:
- `test_user_can_upload_valid_avatar_image`: Upload de imagem válida (JPEG/PNG/WebP até 5MB), verificação no disco `public` e exibição do avatar na resposta.
- `test_user_cannot_upload_invalid_file_as_avatar`: Envio de arquivo inválido (ex: `.pdf` ou imagem > 5MB) rejeitado com erro 422 e avatar anterior preservado.
- `test_user_can_remove_avatar`: Remoção do avatar, exclusão do arquivo físico do disco e restauração do fallback com iniciais.
- `test_member_can_create_post_with_up_to_10_photos`: Criação de post com texto e múltiplas fotos (testar com 3 fotos e com 10 fotos), confirmando persistência e ordenação `sort_order`.
- `test_post_rejects_more_than_10_photos`: Tentativa de enviar 11 imagens rejeitada com erro de validação.
- `test_feed_filters_regional_vs_global`: Post criado na Regional 1 não aparece na aba "Minha Regional" de membro da Regional 2, mas aparece na aba "Todas as Regionais" (Global).
- `test_member_can_like_and_unlike_post`: Toggle de curtidas garantindo integridade e idempotência do contador.
- `test_member_can_comment_and_delete_own_comment`: Comentário publicado e remoção pelo autor.
- `test_author_and_admin_can_delete_post`: Autor e admin com permissão conseguem excluir post; membros comuns não-autores recebem `403 Forbidden`.
- `test_public_profile_hides_sensitive_data`: Acesso ao perfil público de outro membro exibe apenas nome, apelido, motos, bio e posts, ocultando CPF, documentos e dados financeiros.

---

## 3. Roteiro de Validação Manual

### Cenário A: Gestão de Foto e Perfil Pessoal
1. Acesse o sistema como membro comum.
2. Navegue até o menu do usuário no canto inferior esquerdo e clique em **Configurações > Perfil** ou no menu lateral **Meu Perfil**.
3. Na seção de foto de perfil, clique no botão de upload e selecione uma foto pessoal (`.jpg`, `.png` ou `.webp`).
4. Clique em **Salvar Alterações**:
   - Verifique que o avatar é atualizado instantaneamente no cabeçalho e na barra de navegação.
5. Clique em **Remover Foto**:
   - Verifique que o avatar personalizado é removido e as iniciais do nome voltam a ser exibidas.

### Cenário B: Criação de Post no Feed com Múltiplas Fotos
1. No menu principal, clique no item **Feed Social**.
2. Na caixa de publicação no topo do feed:
   - Digite um relato: *"Comboio até a serra no último final de semana com os irmãos!"*.
   - Clique no ícone de imagem e anexe de 3 a 5 fotos.
   - Veja as miniaturas geradas na pré-visualização.
   - Clique em **Publicar**.
3. Verifique que a nova postagem aparece no topo do feed com seu nome, apelido de estrada, avatar, data relativa e galeria navegável de fotos.

### Cenário C: Filtragem Regional vs Global
1. No feed, selecione a aba **Minha Regional**:
   - Verifique que apenas postagens da sua regional ativa são listadas.
2. Alterne para a aba **Todas as Regionais**:
   - Verifique que postagens de outras regionais e postagens gerais do clube são exibidas.

### Cenário D: Interações (Curtir e Comentar)
1. Em qualquer postagem do feed, clique no botão de **Curtir** (ícone de coração):
   - O ícone muda de cor e o contador aumenta em 1.
2. Clique novamente para descurtir:
   - O contador diminui em 1.
3. No campo de comentários do post, digite *"Parabéns pelo evento!"* e envie:
   - O comentário aparece imediatamente abaixo da postagem com seu avatar.
4. Clique no ícone de lixeira do seu comentário para removê-lo:
   - O comentário é excluído e o contador de comentários é atualizado.

### Cenário E: Visualização de Perfil Público
1. No feed, clique sobre o nome ou avatar do autor de qualquer publicação.
2. A página de perfil público do membro é aberta:
   - Confirme a exibição do nome, apelido, cidade/regional, foto, motos cadastradas e a lista cronológica de postagens publicadas pelo membro.
   - Certifique-se de que nenhum dado confidencial (como CPF ou contatos de emergência) está visível.

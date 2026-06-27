# 💛 Paulo & Jéssica — Site de Casamento

Página web estática para o casamento de **Paulo & Jéssica** (16 · 08 · 2026), com:

- Página única, responsiva, com tema de casamento + toques nerds (Star Wars, World of Warcraft, MTG).
- Seção com **localização da cerimônia** (mapa incorporado do Google Maps).
- **Formulário de confirmação de presença (RSVP)** com nome completo, se vai comparecer, nº de acompanhantes adultos e nº de crianças (menores de 11 anos) + recado opcional.
- Armazenamento das confirmações em uma **planilha do Google Sheets** que você controla e pode consultar quando quiser.

---

## 📁 Estrutura

```
index.html          → a página
styles.css          → estilo (paleta inspirada no convite: ouro, pergaminho, noite)
script.js           → lógica do formulário e envio
config.js           → ⚙️ ÚNICO arquivo que você precisa editar para "ligar" o form
apps-script/Code.gs → código que recebe e grava as respostas na planilha
```

---

## 🚀 Como colocar no ar (passo a passo)

### 1. Conectar à sua planilha do Google (para receber as confirmações)

1. Acesse [Google Sheets](https://sheets.google.com) e crie uma **planilha em branco** (ex.: "Casamento — RSVP").
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o código que aparece e **cole todo o conteúdo** de [`apps-script/Code.gs`](apps-script/Code.gs).
4. Clique em **Salvar** (ícone do disquete).
5. Clique em **Implantar → Nova implantação**.
   - Em "Tipo", escolha **App da Web**.
   - **Executar como:** Eu (seu e-mail).
   - **Quem pode acessar:** **Qualquer pessoa**.
   - Clique em **Implantar** e autorize o acesso (é a sua própria conta).
6. Copie a **URL do app da web** gerada (termina em `/exec`).
7. Abra o arquivo [`config.js`](config.js) e cole a URL:

   ```js
   window.WEDDING_CONFIG = {
     GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/SEU_ID/exec",
   };
   ```

✅ Pronto! As confirmações vão aparecer automaticamente, uma por linha, na aba **RSVP** da sua planilha — com data/hora, nome, se vem, nº de adultos, nº de crianças, total de pessoas e recado.

> Enquanto a URL ficar vazia, o site funciona em **modo demonstração**: o formulário valida tudo e mostra os dados no console do navegador, mas não grava em lugar nenhum.

### 2. Ajustar o local da cerimônia

No [`index.html`](index.html), procure por `EDITE AQUI` na seção **A Cerimônia** e ajuste:

- `venue-name` → nome do local.
- `venue-addr` → endereço.
- O `src` do `<iframe>` do mapa: abra o [Google Maps](https://maps.google.com), busque o local, clique em **Compartilhar → Incorporar um mapa**, copie o link e substitua.
- O `href` do botão "Abrir no Google Maps".

### 3. Publicar (escolha uma opção gratuita)

- **GitHub Pages:** no repositório, vá em *Settings → Pages*, selecione a branch e a pasta raiz. Em segundos o site fica no ar.
- **Netlify / Vercel / Cloudflare Pages:** arraste a pasta ou conecte o repositório.
- Qualquer hospedagem de arquivos estáticos serve — não há backend para configurar.

---

## 🔧 Testando localmente

Abra `index.html` direto no navegador, ou rode um servidor simples:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

---

## 🎨 Sobre o design

Paleta e clima inspirados no convite: **noite estrelada**, **ouro**, **pergaminho** e **creme**, com tipografia clássica (Cinzel + Cormorant + Great Vibes) e referências nerd discretas no texto ("I love you / I know", guildas/Aliança, party, builds, 🐉🃏).

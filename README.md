# Portfólio

Site pessoal de Gabriel Abi Acl. O esqueleto (PR1–PR8) está pronto para receber conteúdo. Biografia, habilidades, projetos, marcos e contatos reais ainda não foram escritos: ficam nos JSON de `content/`, quando Gabriel os enviar.

Nenhum fato biográfico, empregador, projeto, habilidade, e-mail ou link foi inventado. `content/person.json` continua vazio. `content/skills.json`, `content/projects.json` e `content/journey.json` têm só placeholders de layout, marcados na tela. `content/knowledge/chunks.json` tem só notas placeholder sobre o site em construção.

## Requisitos

- Node.js 22 (ou 20+)
- [pnpm](https://pnpm.io/) 10

## Como rodar localmente

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000). O idioma padrão é **pt-BR** e não usa prefixo na URL, mesmo se o navegador pedir inglês. Inglês fica em [http://localhost:3000/en](http://localhost:3000/en), pelo link da página.

```bash
pnpm build
pnpm start
```

`pnpm build` gera a versão de produção. `pnpm start` sobe esse build.

## Variáveis de ambiente

Copie `.env.example` para `.env.local`. Esse arquivo é gitignored. Segredos nunca levam o prefixo `NEXT_PUBLIC_`.

| Variável                   | Obrigatória | Uso                                                     |
| -------------------------- | ----------- | ------------------------------------------------------- |
| `GEMINI_API_KEY`           | Não         | Chat do hero. Vazia deixa o chat desligado.             |
| `GEMINI_MODEL`             | Não         | Id do modelo. Vazio usa `gemini-3.5-flash-lite`.        |
| `NEXT_PUBLIC_SITE_URL`     | Não         | Origem pública, sem barra no fim. Liga o SEO indexável. |
| `UPSTASH_REDIS_REST_URL`   | Não         | Limite do chat entre instâncias. Exige o token junto.   |
| `UPSTASH_REDIS_REST_TOKEN` | Não         | Par da URL do Upstash.                                  |

### GEMINI_API_KEY

O chat chama o Gemini só no servidor, em `POST /api/chat`. A chave não vai para o browser.

1. Crie uma chave no [Google AI Studio](https://aistudio.google.com/apikey).
2. Em `.env.local`, grave `GEMINI_API_KEY=` seguido da chave.
3. Reinicie `pnpm dev` (o Next só lê o env na subida do processo).

Sem a chave, o hero mostra um aviso e desabilita o campo, as sugestões e o envio. Com a chave, a resposta chega em stream. `GEMINI_MODEL` aceita um id de modelo; se estiver vazio ou não for um id, o servidor usa `gemini-3.5-flash-lite`. Não use `gemini-2.0-flash` nem `gemini-2.0-flash-lite` (desligados).

### Limite do chat

São 10 mensagens a cada 10 minutos por IP, inclusive pedidos inválidos. O IP é o primeiro valor de `x-forwarded-for`, ou `x-real-ip`. Sem os dois, o limite cai no balde `unknown`.

Com `UPSTASH_REDIS_REST_URL` (https) e `UPSTASH_REDIS_REST_TOKEN`, o limite usa Upstash e vale entre instâncias. Se só uma das duas existir, se a URL não for https, ou se o Upstash falhar, vale um limite em memória: ele zera quando o processo reinicia e não é compartilhado. Acima do limite, a API responde `429` com `Retry-After` e a tela mostra um aviso.

O corpo do pedido é recusado acima de 100 KB.

### URL do site

`NEXT_PUBLIC_SITE_URL` é a origem pública, sem barra no fim. Exemplo: `https://example.com`.

Com uma origem http(s) válida, título, descrição, Open Graph, canonical, `sitemap.xml` e `robots.txt` usam esse endereço, e o site pode ser indexado. Sem ela, o build ainda passa: o sitemap usa `http://localhost:3000` e o `robots.txt` pede para não indexar.

## Conteúdo para preencher

Schemas em `src/content/types.ts`. Os loaders em `src/content/load.ts` leem os arquivos no servidor. JSON inválido, arquivo ausente ou item malformado vira valor vazio. A página não quebra.

| Arquivo                         | O que colocar                                                                |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `content/person.json`           | Nome, título curto, bio (`pt-BR` e `en`), e-mail, links, avatar, interesses. |
| `content/skills.json`           | Habilidades reais. Os itens atuais são placeholders de layout.               |
| `content/projects.json`         | Projetos reais, com screenshot em `public/` quando houver arquivo.           |
| `content/journey.json`          | Marcos reais. Os cartões atuais são modelo de layout.                        |
| `content/knowledge/chunks.json` | Notas que o chat pode citar. As atuais só descrevem o site em construção.    |

O `#contact` lista `contactEmail` e `socials`. E-mail vazio ou inválido, e link sem `http(s)` ou caminho local, ficam de fora e a seção mostra o placeholder. Com e-mail válido, aparece um link `mailto:`.

### Regras

- Só gravar o que Gabriel fornecer. Campo desconhecido fica vazio ou o item não entra na lista.
- Não inventar bio, cargo, cidade, empregadores, habilidades, descrições de projeto, tags, datas, e-mails ou links.
- Não preencher os stubs com texto de exemplo que pareça fato. A exceção é o placeholder de layout em skills, projects e journey: o texto diz que é exemplo e a seção mostra um aviso. Na jornada os rótulos são fichas de modelo (`AAAA`, `Marco N`, `[Empresa]`, `[Cargo]`), não empregadores nem datas.
- Screenshots de projeto seguem a mesma regra do avatar: só um arquivo local que existe em `public/`. Sem arquivo, a seção mostra um esqueleto. `public/projects/placeholder.svg` é um gradiente de layout, não um print real.
- `localeDefault: "pt-BR"` é o idioma padrão do site, não uma afirmação biográfica.
- O avatar só entra quando o arquivo real existir em `public/`. O hero usa `avatar.src` só se for um caminho local que existe (por exemplo `/avatar.jpg`). URL externa é ignorada.
- O título e a descrição da página usam `displayName`, `shortTitle` e a bio do idioma. Com os campos vazios, o meta fica no texto genérico de `messages/` — sem nome, cargo ou biografia inventados.

## Scripts

| Comando             | O que faz                               |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Servidor de desenvolvimento (Turbopack) |
| `pnpm build`        | Build de produção                       |
| `pnpm start`        | Sobe o build                            |
| `pnpm lint`         | ESLint                                  |
| `pnpm format`       | Prettier (escreve)                      |
| `pnpm format:check` | Prettier (só verifica)                  |

## Stack

- Next.js 15 (App Router) + TypeScript estrito
- Tailwind CSS v4
- ESLint + Prettier
- `next-intl` com `pt-BR` (padrão) e `en`
- Alias `@/` → `src/`

Lenis suaviza o scroll e não inicia com `prefers-reduced-motion: reduce`. O chat usa `ai` e `@ai-sdk/google` só no servidor. O arco de habilidades usa Framer Motion e, com movimento reduzido, vira uma fileira estática. Os cards de projeto e a jornada usam uma entrada curta, desligada com `prefers-reduced-motion`. A galáxia usa `three`, `@react-three/fiber` e `@react-three/drei` só dentro do modal (`ssr: false`); com movimento reduzido o modal mostra um SVG estático e o canvas não gira. GSAP não entra.

## Idiomas

Mensagens em `messages/pt-BR.json` e `messages/en.json`. A configuração fica em `src/i18n/`. A detecção automática pelo `Accept-Language` está desligada: `/` é pt-BR e `/en` é inglês. Páginas novas devem viver em `src/app/[locale]/`.

## Roteiro dos PRs

O detalhe está em [`docs/ROADMAP.md`](docs/ROADMAP.md). O esqueleto está completo. O que falta é o conteúdo real, não outra leva de estrutura.

1. **PR1** — Fundação: Next.js 15, Tailwind v4, i18n mínimo, schemas e stubs vazios. Feito.
2. **PR2** — Casca visual: fundo estático, cards de vidro, navegação. Feito.
3. **PR3** — Hero + chat (Gemini + notas placeholder). Feito.
4. **PR4** — Animação das habilidades em arco. Feito.
5. **PR5** — Projetos (screenshot, descrição, tags). Feito, com placeholders de layout.
6. **PR6** — Sobre + modal de galáxia 3D. Feito.
7. **PR7** — Linha do tempo da jornada. Feito, com placeholders de layout.
8. **PR8** — Acabamento: contato, SEO, limite do chat, `prefers-reduced-motion` e este README. Feito.

## Deploy

Não há config de Vercel neste repositório. Para publicar, defina as variáveis da tabela acima no provedor (a chave do Gemini só no servidor) e use `pnpm build`. Com `NEXT_PUBLIC_SITE_URL` apontando para a origem pública, sitemap e robots passam a usar esse endereço.

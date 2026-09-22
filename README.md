# Portfólio

Site pessoal de Gabriel Abi Acl, construído em PRs modulares.

- **PR1** — esqueleto: Next.js, idiomas, schemas vazios e uma página com âncoras.
- **PR2** — casca visual: fundo estático, cards de vidro e navegação fixa. Tokens em [`docs/DESIGN.md`](docs/DESIGN.md).

- **PR3** — hero com chat (Gemini no servidor e notas placeholder).
- **PR4** — habilidades: ícones de exemplo num arco (caminho fechado, não um globo).
- **PR5** — projetos: screenshot, descrição e tags em cards de vidro (placeholders de layout).

Sobre, jornada e textos reais ficam para os PRs seguintes.

Nenhum fato biográfico, empregador, projeto ou habilidade real foi inventado. `content/skills.json` e `content/projects.json` têm só placeholders de layout, marcados na tela. `content/person.json` e journey continuam vazios. `content/knowledge/chunks.json` tem só notas placeholder sobre o site em construção.

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

Sem `GEMINI_API_KEY`, o chat do hero aparece desligado e o envio fica desabilitado. Com a chave, `POST /api/chat` responde em stream. O modelo é `GEMINI_MODEL` (padrão `gemini-3.5-flash-lite`). A chave não vai para o browser.

O limite é 10 mensagens a cada 10 minutos por IP. Com `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`, o limite usa Upstash. Sem os dois, vale um limite em memória: ele zera quando o processo reinicia e não é compartilhado entre instâncias. Acima do limite, a tela mostra um aviso.

## Scripts

| Comando             | O que faz                               |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Servidor de desenvolvimento (Turbopack) |
| `pnpm build`        | Build de produção                       |
| `pnpm start`        | Sobe o build                            |
| `pnpm lint`         | ESLint                                  |
| `pnpm format`       | Prettier (escreve)                      |
| `pnpm format:check` | Prettier (só verifica)                  |

## Stack deste PR

- Next.js 15 (App Router) + TypeScript estrito
- Tailwind CSS v4
- ESLint + Prettier
- `next-intl` com `pt-BR` (padrão) e `en`
- Alias `@/` → `src/`

A casca visual (PR2) acrescenta Lenis para scroll suave. Ele não inicia quando `prefers-reduced-motion: reduce` está ativo. O chat (PR3) usa `ai` e `@ai-sdk/google` só no servidor. O arco de habilidades (PR4) usa Framer Motion (`offsetPath` / `offsetDistance`). Os cards de projeto (PR5) usam Framer Motion só numa entrada curta, desligada com `prefers-reduced-motion`. GSAP e React Three Fiber ainda não entram.

## Idiomas

Mensagens em `messages/pt-BR.json` e `messages/en.json`. A configuração fica em `src/i18n/`. A detecção automática pelo `Accept-Language` está desligada: `/` é pt-BR e `/en` é inglês. Páginas novas devem viver em `src/app/[locale]/`.

## Conteúdo

Schemas em `src/content/types.ts`. Dados em JSON:

| Arquivo                         | Tipo                                  |
| ------------------------------- | ------------------------------------- |
| `content/person.json`           | `Person` (campos vazios)              |
| `content/skills.json`           | `Skill[]` (placeholders de layout)    |
| `content/projects.json`         | `Project[]` (placeholders de layout)  |
| `content/journey.json`          | `JourneyMilestone[]`                  |
| `content/knowledge/chunks.json` | `ChatKnowledgeChunk[]` (placeholders) |

Os loaders em `src/content/load.ts` leem esses arquivos no servidor. JSON inválido, arquivo ausente ou item malformado vira valor vazio. A página não quebra.

### Regras

- Não inventar bio, cargo, cidade, empregadores, habilidades, descrições de projeto, tags ou datas.
- Não preencher os stubs com texto de exemplo que pareça fato. A exceção é o placeholder de layout em skills e projects: o texto diz que é exemplo e a seção mostra um aviso.
- Screenshots de projeto seguem a mesma regra do avatar: só um arquivo local que existe em `public/`. Sem arquivo, a seção mostra um esqueleto. `public/projects/placeholder.svg` é um gradiente de layout, não um print real.
- Só gravar o que Gabriel fornecer. Campo desconhecido fica vazio ou o item não entra na lista.
- `localeDefault: "pt-BR"` é o idioma padrão do site, não uma afirmação biográfica.
- O avatar só entra quando o arquivo real existir em `public/`. O hero usa `avatar.src` só se for um caminho local que existe (por exemplo `/avatar.jpg`). URL externa é ignorada.
- Segredos ficam em `.env.local` (gitignored). Nunca usar `NEXT_PUBLIC_` em chave de API.

## Roteiro dos PRs

O detalhe está em [`docs/ROADMAP.md`](docs/ROADMAP.md).

1. **PR1** — Fundação (este): Next.js 15, Tailwind v4, i18n mínimo, schemas e stubs vazios.
2. **PR2** — Casca visual: fundo estático, cards de vidro, navegação.
3. **PR3** — Hero + chat (Gemini + notas placeholder). Feito.
4. **PR4** — Animação das habilidades em arco. Feito.
5. **PR5** — Projetos (screenshot, descrição, tags). Feito, com placeholders de layout.
6. **PR6** — Sobre + modal de galáxia 3D.
7. **PR7** — Linha do tempo da jornada.
8. **PR8** — Acabamento: i18n completo, SEO, `prefers-reduced-motion`.

A âncora `#contact` aponta para o PR8 porque não há um PR só de contato.

## Fora deste PR

GSAP, React Three Fiber, galáxia, jornada, textos reais de projeto e qualquer fato biográfico.

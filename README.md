# Portfólio

Site pessoal de Gabriel Abi Acl, construído em PRs modulares.

- **PR1** — esqueleto: Next.js, idiomas, schemas vazios e uma página com âncoras.
- **PR2** — casca visual: fundo estático, cards de vidro e navegação fixa. Tokens em [`docs/DESIGN.md`](docs/DESIGN.md).

Chat, animações de conteúdo e textos reais ficam para os PRs seguintes.

Nenhum fato biográfico, empregador, habilidade ou projeto foi inventado. Os arquivos em `content/` estão vazios de propósito.

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

A chave `GEMINI_API_KEY` pode ficar vazia neste PR. O chat ainda não existe.

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

A casca visual (PR2) acrescenta Lenis para scroll suave. Ele não inicia quando `prefers-reduced-motion: reduce` está ativo. Framer Motion, GSAP, React Three Fiber e o cliente do Gemini ainda não entram.

## Idiomas

Mensagens em `messages/pt-BR.json` e `messages/en.json`. A configuração fica em `src/i18n/`. A detecção automática pelo `Accept-Language` está desligada: `/` é pt-BR e `/en` é inglês. Páginas novas devem viver em `src/app/[locale]/`.

## Conteúdo

Schemas em `src/content/types.ts`. Dados em JSON:

| Arquivo                         | Tipo                     |
| ------------------------------- | ------------------------ |
| `content/person.json`           | `Person` (campos vazios) |
| `content/skills.json`           | `Skill[]`                |
| `content/projects.json`         | `Project[]`              |
| `content/journey.json`          | `JourneyMilestone[]`     |
| `content/knowledge/chunks.json` | `ChatKnowledgeChunk[]`   |

Os loaders em `src/content/load.ts` leem esses arquivos no servidor. JSON inválido, arquivo ausente ou item malformado vira valor vazio. A página não quebra.

### Regras

- Não inventar bio, cargo, cidade, empregadores, habilidades, descrições de projeto, tags ou datas.
- Não preencher os stubs com texto de exemplo que pareça fato.
- Só gravar o que Gabriel fornecer. Campo desconhecido fica vazio ou o item não entra na lista.
- `localeDefault: "pt-BR"` é o idioma padrão do site, não uma afirmação biográfica.
- Screenshots e avatar só entram quando os arquivos reais existirem em `public/`.
- Segredos ficam em `.env.local` (gitignored). Nunca usar `NEXT_PUBLIC_` em chave de API.

## Roteiro dos PRs

O detalhe está em [`docs/ROADMAP.md`](docs/ROADMAP.md).

1. **PR1** — Fundação (este): Next.js 15, Tailwind v4, i18n mínimo, schemas e stubs vazios.
2. **PR2** — Casca visual: fundo estático, cards de vidro, navegação.
3. **PR3** — Hero + chat (Gemini + base de conhecimento).
4. **PR4** — Animação das habilidades em arco.
5. **PR5** — Projetos (screenshot, descrição, tags).
6. **PR6** — Sobre + modal de galáxia 3D.
7. **PR7** — Linha do tempo da jornada.
8. **PR8** — Acabamento: i18n completo, rate limit, SEO, `prefers-reduced-motion`.

A âncora `#contact` aponta para o PR8 porque não há um PR só de contato.

## Fora da casca visual

Chat (`/api/chat`), Framer Motion, GSAP, React Three Fiber, arco de skills, galáxia, cards de projeto com conteúdo e qualquer copy de portfólio.

# Roteiro modular

Cada PR entra em `main` sozinho e deixa o site buildando. Não antecipar a biblioteca ou a UI do PR seguinte.

Regra de conteúdo para todos os PRs: não inventar fatos sobre Gabriel (bio, empregadores, habilidades, projetos, datas, links). Stubs vazios são o estado correto até haver material real.

## PR1 — Fundação (este)

Título sugerido: `feat(pr1): foundation scaffold — Next.js 15 + Tailwind v4 + content schemas`

- Next.js 15 App Router, TypeScript estrito, Tailwind CSS v4
- ESLint + Prettier
- `next-intl` com `pt-BR` (padrão, sem prefixo) e `en` (`/en`)
- Alias `@/`
- Página única com âncoras `#hero`, `#about`, `#skills`, `#projects`, `#journey`, `#contact`
- Tipos em `src/content/types.ts` e JSON vazio em `content/`
- Loaders que toleram arquivo ausente ou JSON inválido
- `.env.example` com Gemini, URL do site e Upstash comentado

Não inclui chat, motion, 3D nem cards reais.

## PR2 — Casca visual

- Fundo estático (gradiente + campo de pontos em SVG, sem canvas e sem parallax)
- `GlassCard` e seções em painéis de vidro
- Navegação fixa com as mesmas âncoras
- Lenis só para scroll suave; desligado com `prefers-reduced-motion`
- Tokens em `docs/DESIGN.md`
- Sem Framer Motion, GSAP ou assets de referências externas

## PR3 — Hero + chat

- Hero no card de vidro: avatar só se o arquivo existir em `public/`; senão iniciais (quando há nome) ou espaço vazio
- Nome de `person.displayName`; vazio mostra o placeholder de i18n
- `POST /api/chat` com AI SDK + `@ai-sdk/google`, resposta em stream, `GEMINI_API_KEY` só no servidor
- Modelo: `GEMINI_MODEL`, padrão `gemini-3.5-flash-lite`
- Injeta `content/knowledge/chunks.json` no system prompt (sem vector DB)
- Os chunks deste PR são placeholders sobre o site em construção — não são fatos de carreira
- Recusa inventar empregadores, projetos ou habilidades
- UI: chips que preenchem o campo, bolhas, indicador de espera, envio desligado enquanto responde
- Rate limit: 10 pedidos / 10 minutos / IP. Upstash se as duas chaves existirem; senão memória do processo

## PR4 — Habilidades em arco

- Animação de ícones ao longo de um caminho fechado (arco / figura), não um globo
- Dados só de `content/skills.json`
- Lista vazia → estado vazio, sem ícones de exemplo
- `prefers-reduced-motion` pode ser o fallback estático; o acabamento fica no PR8

## PR5 — Projetos

- Card com screenshot real, descrição curta e tags
- Sem screenshot → esqueleto, nunca imagem ou texto inventados
- Fonte: `content/projects.json`

## PR6 — Sobre + galáxia 3D

- Seção sobre a partir de `content/person.json` e chunks de conhecimento
- Modal com React Three Fiber carregado sob demanda (`ssr: false`)
- Não colocar Three no caminho crítico da home
- Sem motion reduzido → imagem ou gradiente estático no lugar do canvas

## PR7 — Jornada

- Linha do tempo a partir de `content/journey.json`
- Lista vazia → estado vazio
- Sem empregadores, escolas ou datas de exemplo

## PR8 — Acabamento

- Completar mensagens `pt-BR` / `en` de tudo que ficou hardcoded
- Rate limit do chat já existe no PR3; aqui só endurecer se ainda faltar (várias instâncias, SEO)
- SEO: metadata, URL canônica (`NEXT_PUBLIC_SITE_URL`), alternates de idioma
- `prefers-reduced-motion` em arco, galáxia e qualquer motion introduzido antes
- Seção `#contact` com os links reais de `person.socials` / `contactEmail` — só o que estiver preenchido

## Mapa das âncoras

| Âncora      | PR em que a seção ganha conteúdo |
| ----------- | -------------------------------- |
| `#hero`     | PR3                              |
| `#skills`   | PR4                              |
| `#projects` | PR5                              |
| `#about`    | PR6                              |
| `#journey`  | PR7                              |
| `#contact`  | PR8                              |

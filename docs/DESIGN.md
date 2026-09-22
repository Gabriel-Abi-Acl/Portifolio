# Casca visual

Direção deste PR: um fundo escuro estático e painéis que parecem soltos acima dele (vidro, borda fina, sombra). Os tokens são deste projeto. Não reutilizar CSS, imagens ou textos de sites de referência.

## Tokens

Definidos em `src/app/globals.css` (`:root`). O Tailwind lê as cores por `@theme inline`.

| Token             | Valor                     | Uso                                     |
| ----------------- | ------------------------- | --------------------------------------- |
| `--background`    | `#070612`                 | Base da página (`bg-background`)        |
| `--foreground`    | `#f5f3fb`                 | Texto principal (`text-foreground`)     |
| `--muted`         | `#b7b3c9`                 | Texto secundário (`text-muted`)         |
| `--card`          | `rgb(18 16 38 / 0.55)`    | Preenchimento do vidro                  |
| `--card-strong`   | `rgb(16 14 34 / 0.78)`    | Vidro mais opaco (`tone="strong"`)      |
| `--card-solid`    | `rgb(14 12 28 / 0.94)`    | Fallback sem blur                       |
| `--border`        | `rgb(255 255 255 / 0.14)` | Borda fina                              |
| `--accent`        | `#3ee0c5`                 | Ciano/teal (`text-accent`, `bg-accent`) |
| `--accent-soft`   | `rgb(62 224 197 / 0.16)`  | Seleção de texto                        |
| `--radius-card`   | `1.75rem`                 | Cantos dos painéis                      |
| `--blur-glass`    | `18px`                    | `backdrop-filter`                       |
| `--header-offset` | `7rem`                    | Folga do scroll sob a navegação fixa    |
| `--shadow-float`  | sombra + brilho interno   | Profundidade dos painéis                |

Pílulas da navegação usam raio `999px` (`.glass-card-pill`).

## Camadas

1. `StarfieldBackground` — camada fixa. Gradiente navy → roxo → preto, malha de pontos e estrelas em SVG, vinheta. Sem canvas e sem parallax.
2. `GlassCard` — preenchimento translúcido, blur, borda, brilho interno e sombra. `shape="pill"` na navegação. `tone="strong"` aumenta a opacidade.
3. `SectionPlaceholder` — cada âncora da home dentro de um `GlassCard`. O texto continua sendo o placeholder (`Chega no PR N` / `Coming in PR N`).

## Navegação

`SiteHeader` fica fixo, solto do topo. O nome vem de `person.displayName` quando o campo não está vazio. Enquanto estiver vazio, o rótulo é `shell.brand` (`Portfólio` / `Portfolio`). Links: `#hero`, `#about`, `#skills`, `#projects`, `#journey`, `#contact`. No mobile, os links ficam num menu simples.

## Movimento

Lenis suaviza a roda e os cliques nas âncoras. Com `prefers-reduced-motion: reduce`:

- o Lenis não é criado
- `scroll-behavior` volta para `auto`
- o vidro perde o blur e usa `--card-solid`

## O que não entra nesta casca

Bio, habilidades, projetos, jornada, chat, screenshots ou avatar. Campos vazios em `content/` continuam vazios.

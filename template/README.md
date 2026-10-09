# Protótipo estático

Esboço visual do portfólio em HTML, CSS e JavaScript puro, para avaliar no navegador e iterar. O app Next.js na raiz do repositório continua como está. Esta pasta não tem framework nem build.

Nenhum fato sobre a pessoa do site entra aqui. Nome, bio, habilidades, projetos, marcos, e-mail e links são placeholders (`Seu nome`, `[Projeto 1]`, `[Skill 1]`, `AAAA`, `[Empresa]`, `[Cargo]`). Tudo que a página mostra está em [`js/data.js`](js/data.js).

O chat não chama rede nem IA. O campo fica desligado (`Em breve`) e a resposta marcada como **Demo** é um texto fixo.

## Abrir o arquivo

No Chrome, abra `template/index.html` direto do disco (duplo clique, ou Arquivo → Abrir). Os dados estão embutidos em `js/data.js` de propósito: um `fetch` de JSON local quebra em `file://`.

## Servir a pasta

Na raiz do repositório:

```bash
npx serve template
```

Abra o endereço que o comando mostrar (em geral `http://localhost:3000`).

Os dois jeitos usam os mesmos arquivos. CSS, scripts e imagens são caminhos relativos.

## O que a página faz

- Fundo de estrelas estático, cards de vidro e navegação fixa com âncoras.
- Idioma padrão **pt-BR**. O controle **PT/EN** troca o texto na mesma página, sem recarregar. Ao atualizar, volta para pt-BR.
- Hero com espaço de foto e um chat de demonstração.
- Habilidades em um arco fechado (não é um globo). Com `prefers-reduced-motion: reduce`, o arco para e vira uma fileira.
- Projetos com screenshot à esquerda e texto mais tags à direita. No mobile, a imagem fica em cima.
- Sobre, com um botão que abre a galáxia. Arraste para girar, use a roda para aproximar, as setas também giram e Esc fecha. Com movimento reduzido, a galáxia fica parada em SVG.
- Jornada em arco no desktop (até 4 marcos) e em lista no mobile.
- Contato e rodapé.
- Scroll suave, entrada das seções ao rolar, link de pular conteúdo e anel de foco.

## Editar o conteúdo

Só [`js/data.js`](js/data.js). Quando existir texto real, troque o placeholder daquele campo. Não preencha com exemplo que pareça fato.

| Campo                                    | Enquanto estiver vazio                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `person.displayName`                     | Hero e rodapé mostram o placeholder de nome. A marca da navegação fica "Portfólio".  |
| `person.bio`                             | Aviso para preencher a bio.                                                          |
| `person.contactEmail` e `person.socials` | Blocos tracejados. E-mail inválido e link sem `http(s)` ou caminho local não entram. |
| `person.avatarSrc`                       | Círculo tracejado. Só caminho local (`assets/...`), sem URL externa.                 |
| `skills`, `projects`, `journey`          | Tokens de layout. `placeholder: true` mantém o aviso na seção.                       |

`AAAA`, `[Empresa]` e `[Cargo]` não são data nem empregador. São fichas de modelo.

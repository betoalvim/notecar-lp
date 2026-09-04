# Notecar — Landing Duplas

Site estático (sem build) com duas linhas criativas: **emoção** (polaroides) e
**razão** (trilha do carro). Pasta pronta pra deploy: `site/`.

## Retomar por aqui

Repo no ar: **https://github.com/betoalvim/notecar-lp** (branch `main`, commit
inicial em 2026-09-04). Falta **importar na Vercel**. Caminho escolhido: opção C
— projeto proprio, subdominio separado do app.

No vercel.com/new, importando `betoalvim/notecar-lp`:

- Framework Preset: **Other**
- **Root Directory: `site`**  ← o unico campo que nao e default
- Build Command: vazio · Output Directory: `.`
- Nome do projeto define o subdominio (`notecar-lp` -> `notecar-lp.vercel.app`)

As outras duas opcoes, se um dia o `/lp` no dominio do app virar exigencia:

- **B** — `rewrites` no `vercel.json` do projeto do app (ou `next.config.js` se
  for Next) apontando `/lp/:path*` para o deploy da landing. Antes disso,
  **remover `cleanUrls: true` de `site/vercel.json`**: o redirect
  `/emocao.html` -> `/emocao` atravessa o proxy e vaza o dominio de tras.
- **A** — copiar `site/` para `public/lp/` do app. Cada ajuste de landing vira
  redeploy do app.

## Pronto

| Item | Onde | Papel |
|---|---|---|
| Página de escolha | `site/index.html` | logo + dois caminhos |
| Landing emoção | `site/emocao.html` | de `notecar-palco-v3.html` |
| Landing razão | `site/razao.html` | de `notecar-poster-v8.html` |
| Planos emoção | `site/planos-emocao.html` | de `notecar-planos-polaroide.html` |
| Planos razão | `site/planos-razao.html` | de `notecar-planos-trilha.html` |
| Config Vercel | `site/vercel.json` | `cleanUrls`, no-cache |
| Doc da pasta | `site/LEIA-ME.md` | fluxo, origem dos arquivos, correções feitas |

Originais intactos na raiz (`notecar-*.html`). `site/_to_delete/` é descarte.

## Próximo

1. Escolher A, B ou C acima e publicar.
2. Se for B: editar o `vercel.json` do projeto do app (repo separado, fora desta pasta).
3. Domínio próprio, se houver, depois do subdomínio funcionando.

## Decisões travadas

- **Sem build, sem framework.** HTML solto. Framework Preset = Other, Build
  Command vazio, Output Directory = `.`.
- **Links internos são relativos** (`emocao.html`, nunca `/emocao`). Isso é o que
  permite a landing rodar embaixo de qualquer subpasta — não trocar por caminho
  absoluto.
- Duas linhas criativas convivem; o `index.html` é o garfo entre elas.

## Pendências e dívida

- `notecar-palco-v3.html` (origem da landing emoção) tem ~1 MB. Peso não foi
  auditado depois da cópia pra `site/`. Provável imagem embutida em base64.
- Nenhum teste de deploy real feito. `vercel.json` nunca rodou na Vercel.
- `teste-stage.html` (25 bytes) foi versionado junto. Lixo, apagar.
- `site/_to_delete/` esta no `.gitignore`, entao nao subiu — mas continua no disco.
- Fluxo de CTA foi corrigido no papel (ver `LEIA-ME.md`), mas não clicado ponta
  a ponta em navegador.
- Não há analytics, favicon, meta OG ou title revisado — landing pública sem
  isso perde compartilhamento.

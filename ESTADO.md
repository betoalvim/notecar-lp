# Notecar — Landing Duplas

Site estático (sem build) com duas linhas criativas: **emoção** (polaroides) e
**razão** (trilha do carro). Pasta pronta pra deploy: `site/`.

## Retomar por aqui

Repo: **https://github.com/betoalvim/notecar-lp** (branch `main`). Projeto Vercel
`notecar-lp` criado, domínio **notecar-lp.vercel.app**, Root Directory ajustado
para `site` em 2026-09-06.

Duas mudanças no `site/index.html`, publicadas em 2026-09-06:

1. Botão **"Já conhece? Assinar agora"** abaixo do mostrador. Atalho direto pra
   página de planos, pra quem volta à landing sem querer refazer a trilha.
   Guarda em `localStorage` (`notecar-via`) por qual caminho a pessoa entrou e
   manda pra versão combinando; sem memória, cai em `planos-razao.html`.
2. **Arrastar o dedo no arco** do mostrador acende a palavra correspondente
   (arco esquerdo = Razão, direito = Emoção) — o inverso do hover, que hoje faz
   palavra acender arco. Faixa invisível de 46px sobre o arco captura o
   pointer; o resto do `.dial` segue com `pointer-events:none` pros links
   continuarem clicáveis. Classe `via-raz`/`via-emo` no `.escolha`, apaga 900ms
   depois de soltar.

**Falta testar no celular de verdade** — o arraste no arco nunca foi tocado em
tela sensível, só raciocinado. Push na `main` publica em produção sozinho.

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

# Notecar — Landing Duplas

Site estático (sem build) com duas linhas criativas: **emoção** (polaroides) e
**razão** (trilha do carro). Pasta publicada: `site/`.

Repo: **https://github.com/betoalvim/notecar-lp** · Vercel: projeto `notecar-lp`,
Root Directory = `site`, no ar em **notecar-lp.vercel.app**. Push na `main`
publica em produção sozinho.

## Retomar por aqui

Três coisas abertas, em ordem de dependência:

**O funil está no ar e funcionando.** Confirmado em 2026-09-06: a consulta
HogQL rodou contra o PostHog real, o painel mostrou números verdadeiros em
`notecar-lp.vercel.app/painel`. Variáveis de ambiente já configuradas na
Vercel (`POSTHOG_HOST`, `POSTHOG_PROJECT_ID` = 596954, `POSTHOG_API_KEY`,
`PAINEL_SENHA`), nas três environments.

**1. Apontar o domínio `notecar.com.br`** (já registrado, 2026-09-06). Vercel →
`notecar-lp` → Settings → Domains → adicionar `notecar.com.br` e
`www.notecar.com.br`; copiar os registros que a Vercel mostrar e colar no
Registro.br → DNS → Editar zona. Não precisa trocar nameserver.
Decisão: `notecar.com.br` = landing, `app.notecar.com.br` = aplicativo.

**2. Escrever os títulos e as meta tags das landings.** Ver dívida abaixo.

## Pronto

| Item | Onde | Papel |
|---|---|---|
| Página de escolha | `site/index.html` | logo, duas trilhas, mostrador |
| Landing emoção | `site/emocao.html` | de `notecar-palco-v3.html` |
| Landing razão | `site/razao.html` | de `notecar-poster-v8.html` |
| Planos emoção | `site/planos-emocao.html` | de `notecar-planos-polaroide.html` |
| Planos razão | `site/planos-razao.html` | de `notecar-planos-trilha.html` |
| Medição do funil | `site/analytics.js` | eventos PostHog + aviso de cookies |
| Consulta do funil | `site/api/funil.js` | função Vercel, HogQL, protegida por senha |
| Painel | `site/painel.html` | dashboard na identidade do Notecar |
| Config Vercel | `site/vercel.json` | `cleanUrls`, no-cache |

Originais intactos na raiz (`notecar-*.html`). `site/_to_delete/` é descarte,
ignorado pelo git.

## Decisões travadas

- **Sem build, sem framework.** HTML solto. Framework Preset = Other, Build
  Command vazio, Output Directory = `.`, Root Directory = `site`.
- **Links internos relativos** (`emocao.html`, nunca `/emocao`). É o que permite
  a landing rodar embaixo de qualquer subpasta.
- **Analytics: PostHog, não backend próprio.** A parte cara é identidade
  anônima, costura de sessão e armazenamento — deles. O desenho é nosso, em
  `/painel`, lendo `/api/funil`. Descartado construir banco + coleta do zero:
  um dia de trabalho e cada pergunta nova viraria código novo.
- **Chave de leitura do PostHog nunca vai pro navegador.** Fica em
  `api/funil.js`, atrás da senha do painel. O token `phc_` do snippet é
  público por natureza e fica no repositório sem problema.
- **Projeto PostHog está na região EUA** (`us.i.posthog.com`), não na Europa.
  Consciente: transferência internacional é permitida na LGPD desde que
  declarada na política de privacidade. Trocar para a UE exige projeto novo.
- **A consulta agrupa por `distinct_id`, não `person_id`.** O snippet usa
  `person_profiles:'identified_only'`, então visitante anônimo não ganha
  perfil de pessoa — `person_id` não serviria.
- **Sem cookie até o "aceitar".** `persistence:'sessionStorage'` por padrão,
  cookie depois do sim. **Não usar `'memory'`**: foi a primeira tentativa e
  quebrou o funil — memória não atravessa navegação, cada página gerava um
  `distinct_id` novo e nenhum degrau costurava com o seguinte. Confirmado no
  PostHog em 2026-09-06, uma visita apareceu como duas pessoas. Custo que
  permanece: sem cookie não dá pra reconhecer quem volta dias depois, que é
  o degrau "viu as duas trilhas".
- **`/lp` no domínio do app foi descartado** em favor de subdomínio próprio.

## Pendências e dívida

- **Não existe pagamento.** `planos-*.html` — "Confirmar assinatura" só troca o
  próprio texto para "Aguardando integração de pagamento". O evento é
  `confirmou_intencao`, e o painel diz isso na cara. Quando entrar Stripe ou
  Mercado Pago, o evento de compra vai no retorno do provedor, não no clique.
- **Não existe plano de frota nem empresa.** Só `free`, `plus` e `familia`. O
  painel mede o que existe.
- **Títulos e meta tags fracos.** `emocao.html` e `razao.html` têm `<title>`
  só "Notecar", sem `description` e sem Open Graph. Compartilhar no WhatsApp
  hoje não mostra nada. `emocao.html` estava com o título de trabalho
  "Notecar — palco v3" até 2026-09-06.
- **`emocao.html` não tinha `<!doctype>`, `<html>` nem `<head>`** — rodava em
  quirks mode. Corrigido em 2026-09-06, mas **o layout dela nunca foi conferido
  depois da correção**. Quirks mode muda `box-sizing` e altura de linha; pode
  ter mudado alguma coisa.
- **Os dados de 2026-09-06 estão sujos.** São testes do próprio Beto, e parte
  foi coletada antes do conserto do `persistence`, quando cada página gerava um
  `distinct_id` novo. Ignorar os primeiros dias. Se incomodar, o PostHog tem
  "Filter out internal and test users".
- **Degraus do funil eram independentes**, então contavam pessoas diferentes e
  a porcentagem podia passar de 100%. Corrigido em 2026-09-06: cada degrau
  exige todos os anteriores.
- **Bloqueador de anúncio corta o PostHog.** uBlock, AdGuard e Brave bloqueiam
  `i.posthog.com`. Custa 10-25% dos visitantes. Solução é servir o PostHog pelo
  próprio domínio (reverse proxy) — trabalho separado, ainda não feito.
- **Sem página de política de privacidade.** A barra de cookies deveria linkar
  para uma, e a LGPD pede a menção à transferência internacional.
- **Arraste no arco do mostrador nunca foi testado em tela sensível.**
- `emocao.html` tem ~1 MB. Peso não auditado; provável imagem em base64.
- `teste-stage.html` (25 bytes) versionado por engano na raiz. Lixo.

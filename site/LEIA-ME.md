# Notecar — site de escolha (emoção x razão)

Site estático, sem build. Basta subir esta pasta na Vercel.

## Arquivos

| Arquivo              | Papel                                      | Origem                        |
|----------------------|--------------------------------------------|-------------------------------|
| `index.html`         | Página de escolha (logo + dois caminhos)   | novo                          |
| `emocao.html`        | Landing das polaroides                     | notecar-palco-v3.html         |
| `razao.html`         | Landing da trilha do carro                 | notecar-poster-v8.html        |
| `planos-emocao.html` | Planos, versão polaroide                   | notecar-planos-polaroide.html |
| `planos-razao.html`  | Planos, versão trilha                      | notecar-planos-trilha.html    |
| `vercel.json`        | URLs limpas (`/emocao` em vez de `/emocao.html`) | novo                     |

## Fluxo

```
index.html
   ├── emocao.html  ──(CTA final)──►  planos-emocao.html ──(logo)──► emocao.html
   └── razao.html   ──(CTA final)──►  planos-razao.html  ──(logo)──► razao.html
```

Cada landing tem, no canto inferior esquerdo, um link discreto **"trocar de caminho"** que volta para o `index.html`.

## Deploy na Vercel

Sem repositório (mais rápido):

```bash
npm i -g vercel
cd site
vercel            # preview
vercel --prod     # produção
```

Com repositório: suba a pasta no GitHub e importe na Vercel.
Framework Preset = **Other**, Build Command = vazio, Output Directory = `.`.

## O que foi ajustado nos arquivos originais

- `emocao.html`: o CTA final apontava para `notecar-planos-polaroide_2.html` (arquivo inexistente) → agora `planos-emocao.html`.
- `razao.html`: o botão laranja "Começar o prontuário" não tinha ação nenhuma → agora leva para `planos-razao.html`.
- `planos-razao.html`: a logo do topo apontava para `notecar-6-blocos.html` (arquivo inexistente) → agora `razao.html`.
- `planos-emocao.html`: logo do topo → `emocao.html`.
- As duas landings ganharam o link "trocar de caminho".

Os originais continuam intactos na pasta de cima.

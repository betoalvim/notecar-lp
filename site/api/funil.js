/* ============================================================
   Notecar — /api/funil
   ------------------------------------------------------------
   Consulta o PostHog e devolve os números do funil já mastigados.
   A chave de leitura fica aqui no servidor, nunca no navegador.

   Variáveis de ambiente (Vercel → Settings → Environment Variables):
     POSTHOG_HOST        https://us.i.posthog.com  ou  https://eu.i.posthog.com
     POSTHOG_PROJECT_ID  o número do projeto (aparece na URL do painel deles)
     POSTHOG_API_KEY     Personal API key com escopo de leitura (phx_...)
     PAINEL_SENHA        senha do /painel — sem ela, ninguém lê os números
   ============================================================ */

const CONSULTA = (dias) => `
SELECT
  count()                                   AS visitantes,
  countIf(landing)                          AS viu_landing,
  countIf(razao OR emocao)                  AS escolheu,
  countIf(razao)                            AS viu_razao,
  countIf(emocao)                           AS viu_emocao,
  countIf(razao AND emocao)                 AS viu_ambos,
  countIf(primeira = 'razao')               AS primeira_razao,
  countIf(primeira = 'emocao')              AS primeira_emocao,
  countIf(planos)                           AS viu_planos,
  countIf(atalho)                           AS usou_atalho,
  countIf(checkout)                         AS abriu_checkout,
  countIf(plus)                             AS quis_plus,
  countIf(familia)                          AS quis_familia,
  countIf(free)                             AS quis_free,
  countIf(anual)                            AS quis_anual,
  countIf(confirmou)                        AS confirmou
FROM (
  SELECT
    person_id,
    max(event = '$pageview' AND properties.$pathname IN ('/', '/index.html'))         AS landing,
    max(event = '$pageview' AND properties.$pathname IN ('/razao', '/razao.html'))    AS razao,
    max(event = '$pageview' AND properties.$pathname IN ('/emocao', '/emocao.html'))  AS emocao,
    max(event = '$pageview' AND properties.$pathname LIKE '/planos%')                 AS planos,
    max(event = 'usou_atalho')                                                        AS atalho,
    max(event = 'abriu_checkout')                                                     AS checkout,
    max(event = 'confirmou_intencao')                                                 AS confirmou,
    max(event = 'escolheu_plano' AND properties.plano = 'plus')                       AS plus,
    max(event = 'escolheu_plano' AND properties.plano = 'familia')                    AS familia,
    max(event = 'escolheu_plano' AND properties.plano = 'free')                       AS free,
    max(event = 'escolheu_plano' AND properties.ciclo  = 'y')                         AS anual,
    argMinIf(properties.caminho, timestamp, event = 'escolheu_caminho')               AS primeira
  FROM events
  WHERE timestamp > now() - INTERVAL ${dias} DAY
  GROUP BY person_id
)`;

module.exports = async function (req, res) {
  const senha = process.env.PAINEL_SENHA;
  if (!senha) return res.status(500).json({ erro: 'PAINEL_SENHA não configurada' });
  if (req.headers['x-painel-senha'] !== senha) {
    return res.status(401).json({ erro: 'senha inválida' });
  }

  const host = process.env.POSTHOG_HOST;
  const projeto = process.env.POSTHOG_PROJECT_ID;
  const chave = process.env.POSTHOG_API_KEY;
  if (!host || !projeto || !chave) {
    return res.status(503).json({ erro: 'PostHog ainda não configurado' });
  }

  /* o período vem da query string; só aceita número, nunca texto solto */
  const dias = Math.min(365, Math.max(1, parseInt(req.query.dias, 10) || 30));

  try {
    const r = await fetch(`${host}/api/projects/${projeto}/query/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${chave}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query: CONSULTA(dias) } })
    });

    if (!r.ok) {
      return res.status(502).json({ erro: 'PostHog recusou', detalhe: await r.text() });
    }

    const dado = await r.json();
    const linha = (dado.results && dado.results[0]) || [];
    const nomes = (dado.columns || []);

    const n = {};
    nomes.forEach((nome, i) => { n[nome] = Number(linha[i]) || 0; });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ dias, numeros: n });
  } catch (e) {
    res.status(502).json({ erro: 'falha ao consultar', detalhe: String(e) });
  }
};

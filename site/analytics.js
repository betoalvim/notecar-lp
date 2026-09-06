/* ============================================================
   Notecar — medição do funil
   ------------------------------------------------------------
   Uma linha em cada página: <script src="analytics.js" defer></script>

   PASSO ÚNICO DE INSTALAÇÃO
   Cole o snippet do PostHog no bloco marcado abaixo. Ele está em
   PostHog → Settings → Project → "Web snippet". Cole inteiro,
   incluindo a chamada posthog.init(...).

   Sem o snippet o site continua funcionando normal — os eventos
   simplesmente não saem daqui.
   ============================================================ */
(function () {
  'use strict';

  /* ══════════════ COLE O SNIPPET DO POSTHOG AQUI ══════════════ */

  !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="El Rl Pl Al Ll init iu ru Xl tu au fa eu uu Jl cu fu pu capture getExtension nu Ml yu calculateEventProperties mu register register_once register_for_session unregister unregister_for_session ku Yl bu getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Su identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset xu shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty vu createPersonProfile setInternalOrTestUser wu Dl $l opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing hu debug pa ns getPageViewId captureTraceFeedback captureTraceMetric Vl".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init('phc_rnmZMigNQ8LcNij4Ngbrcw8JmNaCPfvu8m5pT3EF5jm3', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30',
    person_profiles: 'identified_only'
  });

  /* ═══════════════════ FIM DO SNIPPET ═════════════════════════ */

  var CHAVE_CONSENTIMENTO = 'notecar-cookies';

  function consentiu() {
    try { return localStorage.getItem(CHAVE_CONSENTIMENTO) === 'sim'; }
    catch (e) { return false; }
  }

  var ativo = !!(window.posthog && window.posthog.capture);

  /* Antes do consentimento: sessionStorage. Some quando a aba fecha, não
     é cookie e não reconhece ninguém numa visita futura — mas mantém o
     mesmo ID durante a visita. Sem isso o funil não costura: 'memory'
     troca de ID a cada página carregada, e o degrau 1 nunca encontra o 2.

     Com o "sim": cookie, que é o que permite medir quem voltou dias depois
     pra ver a segunda trilha. */
  if (ativo && window.posthog.set_config) {
    window.posthog.set_config({
      persistence: consentiu() ? 'localStorage+cookie' : 'sessionStorage'
    });
  }

  function ev(nome, props) {
    if (ativo) window.posthog.capture(nome, props || {});
  }
  window.notecarEvento = ev;   /* pra disparar de outros lugares, se precisar */

  function pronto(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function cadaUm(seletor, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(seletor), fn);
  }

  function cicloAtual() {
    var b = document.querySelector('[data-ciclo][aria-checked="true"]');
    return b ? b.dataset.ciclo : null;      /* 'm' mensal · 'y' anual */
  }

  pronto(function () {

    /* ── página de escolha: qual trilha a pessoa pegou ── */
    cadaUm('.escolha .p', function (a) {
      a.addEventListener('click', function () {
        ev('escolheu_caminho', {
          caminho: a.classList.contains('emo') ? 'emocao' : 'razao'
        });
      });
    });

    /* ── atalho de quem já conhece ── */
    var atalho = document.getElementById('atalho');
    if (atalho) {
      atalho.addEventListener('click', function () {
        ev('usou_atalho', { destino: atalho.getAttribute('href') });
      });
    }

    /* ── planos: os botões já carregam data-cta ── */
    var ultimoPlano = null;
    cadaUm('[data-cta]', function (b) {
      b.addEventListener('click', function () {
        ultimoPlano = b.dataset.cta;         /* free · plus · familia */
        var ciclo = cicloAtual();
        ev('escolheu_plano', { plano: ultimoPlano, ciclo: ciclo });
        /* o grátis só marca a ficha, não abre o checkout */
        if (ultimoPlano !== 'free') ev('abriu_checkout', { plano: ultimoPlano, ciclo: ciclo });
      });
    });

    /* botão flutuante: abre o checkout com o plano já marcado */
    var flutuante = document.getElementById('flBtn');
    if (flutuante) {
      flutuante.addEventListener('click', function () {
        ev('abriu_checkout', { plano: ultimoPlano, ciclo: cicloAtual() });
      });
    }

    /* ── confirmação ──
       Hoje isto é intenção, não compra: o botão só troca o próprio texto
       para "Aguardando integração de pagamento". Quando entrar o meio de
       pagamento, o evento de compra de verdade vai no retorno dele, não
       aqui. */
    var confirmar = document.getElementById('ckConfirmar');
    if (confirmar) {
      confirmar.addEventListener('click', function () {
        ev('confirmou_intencao', { plano: ultimoPlano, ciclo: cicloAtual() });
      });
    }

    /* ── aviso de cookies (LGPD) ── */
    if (!consentiu()) avisoCookies();
  });

  function avisoCookies() {
    var barra = document.createElement('div');
    barra.className = 'nc-cookies';
    barra.innerHTML =
      '<p>Usamos cookies só para entender como o site é usado. Nada de anúncio.</p>' +
      '<div><button type="button" data-nc="nao">Só o essencial</button>' +
      '<button type="button" data-nc="sim">Aceitar</button></div>';

    var css = document.createElement('style');
    css.textContent =
      '.nc-cookies{position:fixed;left:12px;right:12px;bottom:12px;z-index:99;' +
      'display:flex;flex-wrap:wrap;align-items:center;justify-content:center;' +
      'gap:10px 16px;padding:13px 16px;border-radius:14px;' +
      'background:rgba(241,239,234,.96);backdrop-filter:blur(8px);' +
      'border:1px solid rgba(16,42,67,.12);box-shadow:0 6px 24px rgba(16,42,67,.10);' +
      "font-family:'Glory',system-ui,sans-serif;font-size:13.5px;color:#34434E;" +
      'animation:ncSobe .5s cubic-bezier(.4,0,.2,1) both}' +
      '.nc-cookies p{margin:0;max-width:46ch;text-align:center}' +
      '.nc-cookies div{display:flex;gap:8px}' +
      '.nc-cookies button{font:inherit;font-weight:600;cursor:pointer;' +
      'padding:7px 15px;border-radius:999px;border:1px solid rgba(16,42,67,.18);' +
      'background:transparent;color:#34434E;transition:all .25s}' +
      '.nc-cookies button:hover{border-color:rgba(16,42,67,.4);color:#102A43}' +
      '.nc-cookies button[data-nc="sim"]{background:#102A43;border-color:#102A43;color:#F1EFEA}' +
      '.nc-cookies button[data-nc="sim"]:hover{background:#0E6474;border-color:#0E6474;color:#F1EFEA}' +
      '@keyframes ncSobe{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}' +
      '@media(prefers-reduced-motion:reduce){.nc-cookies{animation:none}}';

    document.head.appendChild(css);
    document.body.appendChild(barra);

    barra.addEventListener('click', function (e) {
      var r = e.target.dataset && e.target.dataset.nc;
      if (!r) return;
      try { localStorage.setItem(CHAVE_CONSENTIMENTO, r); } catch (err) {}
      if (r === 'sim' && ativo && window.posthog.set_config) {
        window.posthog.set_config({ persistence: 'localStorage+cookie' });
      }
      barra.remove();
    });
  }
})();

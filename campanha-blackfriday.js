/* =====================================================================
   CAMPANHA BLACK FRIDAY ORTOFLIX 2026  —  REMOVER APÓS 30/11
   ---------------------------------------------------------------------
   - Tudo da campanha está neste arquivo: datas, valores, códigos e textos.
   - Fora da janela de datas, este arquivo NÃO muda nada no site.
   - PRÉVIA antes de 15/11:  ortoflix.com/?bf=1   (sair da prévia: ?bf=0)
   - PARA ENCERRAR: apague este arquivo e a linha que carrega
     "campanha-blackfriday.js" no index.html e no assinar.html (cada uma
     tem um comentário "CAMPANHA BLACK FRIDAY" logo acima). Depois desative
     os planos "Black" na Hotmart (senão quem tiver o link ainda compra
     com desconto).
   ===================================================================== */
(function () {
  'use strict';

  // ───────────── CONFIGURAÇÃO ─────────────
  var BF = {
    inicio: '2026-11-15T00:00:00-03:00',   // domingo, 00h (Brasília)
    fim:    '2026-11-30T23:59:59-03:00',   // segunda, 23h59 (Brasília)
    fimLabel: '30/11',

    // Mude para true SÓ depois de confirmar na Hotmart que o preço dos planos Black
    // se repete nas renovações. Com true, os textos passam a dizer
    // "desconto mantido nas renovações".
    descontoRecorrente: true,

    planos: {
      mensal: {
        desconto: 20, offer: '6y7hvi2e',
        url: 'https://pay.hotmart.com/K22751315T?off=6y7hvi2e',
        precoMesNormal: '29,90', precoMesBF: '23,92',
        totalNormal: '29,90', totalBF: '23,92', cobranca: 'por mês'
      },
      semestral: {
        desconto: 30, offer: 'w7107swn',
        url: 'https://pay.hotmart.com/K22751315T?off=w7107swn',
        precoMesNormal: '23,98', precoMesBF: '16,79',
        totalNormal: '143,88', totalBF: '100,72', cobranca: 'a cada 6 meses'
      },
      anual: {
        desconto: 40, offer: 'qjbtbe75',
        url: 'https://pay.hotmart.com/K22751315T?off=qjbtbe75',
        precoMesNormal: '19,90', precoMesBF: '11,94',
        totalNormal: '238,80', totalBF: '143,28', cobranca: 'a cada 12 meses'
      }
    }
  };

  // ───────────── JANELA DE DATAS / PRÉVIA ─────────────
  var agora = new Date();
  var ini = new Date(BF.inicio), fim = new Date(BF.fim);
  var naJanela = agora >= ini && agora <= fim;

  var preview = false, forcarDesligado = false;
  try {
    var bfParam = new URLSearchParams(window.location.search).get('bf');
    if (bfParam === '1') window.sessionStorage.setItem('bf_preview', '1');
    if (bfParam === '0') { window.sessionStorage.removeItem('bf_preview'); forcarDesligado = true; }
    preview = window.sessionStorage.getItem('bf_preview') === '1';
  } catch (e) { /* armazenamento indisponível: segue só pelas datas */ }

  var ativa = !forcarDesligado && (naJanela || preview);

  // Expõe a configuração para a página de assinatura
  window.BF_CAMPANHA = { ativa: ativa, preview: preview && !naJanela, config: BF };
  if (!ativa) return;

  // ───────────── HELPERS ─────────────
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  function diaBRT(d) {
    var t = new Date(d.getTime() - 3 * 3600 * 1000);
    return Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
  }

  // Daqui para baixo é só a página inicial (a de assinatura só lê BF_CAMPANHA)
  var grid = document.querySelector('.planos-grid');
  if (!grid) return;

  // ───────────── CSS ─────────────
  var css = [
    ':root{--bf-h:0px}',
    '.bf-banner{position:fixed;top:0;left:0;right:0;z-index:120;background:#E8192C;color:#fff;font-family:"Outfit",sans-serif;font-size:.84rem;font-weight:500;line-height:1.4;text-align:center;padding:10px 16px}',
    '.bf-banner a{color:#fff;text-decoration:none;display:block}',
    '.bf-banner b{font-weight:800}',
    '.bf-banner .bf-cta{font-weight:800;text-decoration:underline;white-space:nowrap}',
    '.bf-banner .bf-prev{display:inline-block;background:#fff;color:#E8192C;font-size:.62rem;font-weight:800;padding:1px 8px;margin-right:8px;letter-spacing:.1em}',
    'body.bf-on nav{top:var(--bf-h)}',
    'body.bf-on .hero{padding-top:calc(130px + var(--bf-h))}',
    '@media (max-width:960px){body.bf-on .hero{padding-top:calc(88px + var(--bf-h))}.bf-banner{font-size:.76rem;padding:8px 12px}}',
    '.bf-pill{display:table;margin:0 auto 14px;background:#0a0a0a;color:#fff;font-size:.72rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;padding:8px 20px}',
    '.bf-novidade{margin-top:10px;font-size:.9rem;color:#E8192C}',
    '.bf-badge{position:absolute;top:-1px;left:24px;background:#0a0a0a;color:#fff;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:5px 14px}',
    '.bf-old{font-size:.82rem;color:#888880;margin-top:14px;margin-bottom:-12px}',
    '.bf-old s{text-decoration-thickness:1.5px}',
    '.bf-total{font-size:.8rem;color:#444440;margin:0 0 6px}',
    '.plano-card.bf-card .price-val{color:#E8192C}',
    '.plano-card.bf-card .plano-eco{font-weight:700}'
  ].join('\n');
  var st = document.createElement('style');
  st.setAttribute('data-bf', '');
  st.textContent = css;
  document.head.appendChild(st);

  // ───────────── BANNER ─────────────
  var restante = '';
  if (naJanela) {
    var dias = Math.round((diaBRT(fim) - diaBRT(agora)) / 86400000);
    restante = dias <= 0 ? 'último dia' : dias === 1 ? 'termina amanhã' : 'termina em ' + dias + ' dias';
  }
  var p = BF.planos;
  var banner = document.createElement('div');
  banner.className = 'bf-banner';
  banner.innerHTML =
    '<a href="#planos">' +
    (preview && !naJanela ? '<span class="bf-prev">PRÉVIA</span>' : '') +
    '🖤 <b>BLACK FRIDAY ORTOFLIX:</b> <b>' + p.mensal.desconto + '% OFF</b> no mensal · <b>' +
    p.semestral.desconto + '%</b> no semestral · <b>' + p.anual.desconto + '%</b> no anual' +
    (BF.descontoRecorrente ? ' — o desconto vale também nas renovações' : '') +
    ' · até ' + BF.fimLabel + (restante ? ' (' + restante + ')' : '') +
    ' <span class="bf-cta">Ver planos →</span></a>';
  document.body.insertBefore(banner, document.body.firstChild);
  document.body.classList.add('bf-on');
  banner.addEventListener('click', function () { track('bf_banner_click', { campanha: 'bf26' }); });

  function medir() {
    document.documentElement.style.setProperty('--bf-h', banner.offsetHeight + 'px');
  }
  medir();
  window.addEventListener('resize', medir);
  window.addEventListener('load', medir);
  if (window.ResizeObserver) new ResizeObserver(medir).observe(banner);

  // ───────────── SEÇÃO DE PLANOS ─────────────
  var head = document.querySelector('.planos-header');
  if (head) {
    var pill = document.createElement('div');
    pill.className = 'bf-pill';
    pill.textContent = 'Black Friday · até ' + BF.fimLabel;
    head.insertBefore(pill, head.firstChild);
    if (BF.descontoRecorrente) {
      var nov = document.createElement('p');
      nov.className = 'bf-novidade';
      nov.innerHTML = '<strong>Novidade deste ano:</strong> o desconto da Black Friday é mantido nas renovações.';
      head.appendChild(nov);
    }
  }

  Object.keys(p).forEach(function (chave) {
    var d = p[chave];
    var link = grid.querySelector('a[href*="plano=' + chave + '"]');
    var card = link && link.closest('.plano-card');
    if (!card) return;
    card.classList.add('bf-card');

    var val = card.querySelector('.price-val');
    if (val) val.textContent = d.precoMesBF;

    var price = card.querySelector('.plano-price');
    if (price) {
      var old = document.createElement('div');
      old.className = 'bf-old';
      old.innerHTML = 'de <s>R$ ' + d.precoMesNormal + '/mês</s>';
      card.insertBefore(old, price);

      var tot = document.createElement('div');
      tot.className = 'bf-total';
      tot.textContent = 'Cobrança de R$ ' + d.totalBF + ' ' + d.cobranca;
      price.parentNode.insertBefore(tot, price.nextSibling);
    }

    var eco = card.querySelector('.plano-eco');
    if (eco) eco.textContent = 'Black Friday: −' + d.desconto + '%' +
      (BF.descontoRecorrente ? ' · mantido nas renovações' : ' sobre o preço normal');

    var badge = document.createElement('div');
    badge.className = 'bf-badge';
    badge.textContent = 'Black −' + d.desconto + '%';
    card.insertBefore(badge, card.firstChild);

    link.addEventListener('click', function () {
      track('bf_click_plano', { campanha: 'bf26', event_label: chave });
    });
  });
})();

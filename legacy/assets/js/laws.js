/* Law library: registry of legal acts, citation labels, library pages and the law margin. */
(function () {
  'use strict';
  const NC = window.NC;
  const esc = NC.esc;

  const NL = (window.NotaryLaws = {
    catalog: {},
    order: [],
    data: {},
    en: {},
    translated: new Set()
  });

  NL.setCatalog = function (list) {
    list.forEach((entry) => {
      NL.catalog[entry.id] = entry;
      if (!NL.order.includes(entry.id)) NL.order.push(entry.id);
    });
  };

  NL.register = function (law) {
    const byNo = {};
    law.items.forEach((it) => { if (it.n) byNo[it.n] = it; });
    law.byNo = byNo;
    NL.data[law.id] = law;
    if (!NL.catalog[law.id]) NL.setCatalog([law]);
  };

  /* English translations of selected articles: { "25": { t: "heading", p: ["Art. 25. (1) ...", ...] } } */
  NL.registerTranslation = function (id, map) {
    NL.en[id] = Object.assign(NL.en[id] || {}, map);
  };
  NL.setTranslated = function (ids) { ids.forEach((id) => NL.translated.add(id)); };

  NL.load = async function (id) {
    if (!NL.catalog[id]) return null;
    if (!NL.data[id]) await NC.loadScript(`laws/data/${id}.js`);
    if (NL.translated.has(id) && !NL.en[id]) {
      try { await NC.loadScript(`laws/en/${id}.js`); } catch (e) { /* translation is optional */ }
    }
    return NL.data[id] || null;
  };

  NL.loadAll = async function () {
    for (const id of NL.order) await NL.load(id);
    return NL.order.map((id) => NL.data[id]).filter(Boolean);
  };

  /* Human label of a citation, for example "чл. 25, ал. 9 ЗННД" or "Art. 25(9) ЗННД". */
  NL.label = function (law, art, para, point) {
    const entry = NL.catalog[law];
    const abbr = entry ? entry.abbr : law;
    if (!art) return abbr;
    const bg = NC.lang === 'bg';
    if (String(art).startsWith('§')) {
      const num = String(art).slice(1);
      return bg ? `§ ${num}${para ? ', ал. ' + para : ''} ${abbr}` : `§ ${num}${para ? '(' + para + ')' : ''} ${abbr}`;
    }
    const unit = entry && entry.unit ? entry.unit : { bg: 'чл.', en: 'Art.' };
    if (bg) {
      let s = `${unit.bg} ${art}`;
      if (para) s += `, ал. ${para}`;
      if (point) s += `, т. ${point}`;
      return `${s} ${abbr}`;
    }
    let s = `${unit.en} ${art}`;
    if (para) s += `(${para})`;
    if (point) s += `, item ${point}`;
    return `${s} ${abbr}`;
  };

  /* ---------- Rendering of articles ---------- */
  const AMEND = /\((?:Нов|Нова|Ново|Нови|Изм|Доп|Отм|Предишн|Попр|Загл|Обявен|изм|доп|отм|нова|нов|предишн)[^()]*?(?:\([^()]*\)[^()]*?)*\)/g;

  function lineHtml(line) {
    let s = esc(line);
    s = s.replace(/^(Чл\.\s*\d+[а-я]?\.)/, '<b>$1</b>').replace(/^(§\s*\d+[а-я]?\.)/, '<b>$1</b>');
    s = s.replace(AMEND, (m) => `<span class="amend">${m}</span>`);
    return s;
  }

  function paraNo(line) {
    const m = line.replace(/^(Чл\.\s*\d+[а-я]?\.|§\s*\d+[а-я]?\.)\s*/, '').replace(AMEND, '').trim().match(/^\((\d+[а-я]?)\)/);
    return m ? m[1] : '';
  }

  NL.articleHtml = function (law, item, opts) {
    opts = opts || {};
    const id = `art-${law.id}-${String(item.n).replace('§', 'p')}`;
    const en = NC.lang === 'en' && NL.en[law.id] && NL.en[law.id][item.n];
    const isTariff = law.unit && law.unit.bg === 'т.';
    const heading = item.t ? `<div class="art-title">${esc(item.t)}</div>` : '';
    let paraCount = '';
    const bgLines = item.p.map((line) => {
      const no = paraNo(line) || paraCount;
      if (paraNo(line)) paraCount = no;
      const hl = opts.para && paraNo(line) === String(opts.para) ? ' hl' : '';
      return `<p class="art-line${hl}"${paraNo(line) ? ` data-para="${esc(paraNo(line))}"` : ''}>${lineHtml(line)}</p>`;
    }).join('');
    let enBlock = '';
    if (NC.lang === 'en') {
      if (en) {
        enBlock = `<div class="art-en" lang="en"><div class="art-en-label">${esc(NC.t('unofficialTranslation'))}</div>` +
          (en.t ? `<div class="art-title">${esc(en.t)}</div>` : '') +
          en.p.map((l) => `<p class="art-line">${NC.inline(l)}</p>`).join('') + '</div>';
      } else if (opts.showMissing) {
        enBlock = `<div class="art-en missing">${esc(NC.t('noTranslation'))}</div>`;
      }
    }
    const link = opts.link ? `<a class="art-link" href="#/law/${law.id}/${encodeURIComponent(item.n)}">${esc(NL.label(law.id, item.n))}</a>` : '';
    return `<article class="law-art${isTariff ? ' tariff' : ''}${opts.target ? ' target' : ''}" id="${id}">${link}${heading}<div class="art-bg" lang="bg">${bgLines}</div>${enBlock}</article>`;
  };

  /* ---------- Law library index ---------- */
  NL.renderIndex = function (main) {
    const groups = {};
    NL.order.forEach((id) => {
      const e = NL.catalog[id];
      (groups[e.group] = groups[e.group] || []).push(e);
    });
    let html = `<div class="page law-index">
      <header class="page-head">
        <h1>${esc(NC.t('laws'))}</h1>
        <p class="lede">${esc(NC.L({
          en: 'The full Bulgarian text of every act the course cites, split into articles. Course chapters link here. Type a citation such as "чл. 586 ГПК" or "ЗННД 25" to jump to it.',
          bg: 'Пълният текст на всеки акт, цитиран в курса, разделен на членове. Главите на курса препращат тук. Въведете цитат, например „чл. 586 ГПК“ или „ЗННД 25“, за да отидете направо на него.'
        }))}</p>
        <form class="cite-jump" id="citeJump">
          <input type="text" id="citeInput" placeholder="${esc(NC.L({ en: 'For example: чл. 25, ал. 9 ЗННД', bg: 'Например: чл. 25, ал. 9 ЗННД' }))}" aria-label="${esc(NC.t('jumpTo'))}">
          <button type="submit" class="btn">${esc(NC.t('jumpTo'))}</button>
        </form>
        <p class="cite-error" id="citeError" hidden></p>
      </header>
      <p class="note">${esc(NC.t('officialNote'))}</p>`;
    Object.keys(NC.T.lawGroups).forEach((g) => {
      if (!groups[g]) return;
      html += `<section class="law-group"><h2>${esc(NC.L(NC.T.lawGroups[g]))}</h2><ul class="law-list">`;
      groups[g].forEach((e) => {
        const other = NC.lang === 'en' ? e.title.bg : e.title.en;
        html += `<li><a href="#/law/${e.id}">
            <span class="law-abbr">${esc(e.abbr)}</span>
            <span class="law-name">${esc(NC.L(e.title))}</span>
            <span class="law-sub">${esc(other)}</span>
            <span class="law-meta">${e.articles} ${esc(NC.t('articles'))}${e.partial ? ' · ' + esc(NC.L({ en: 'extract', bg: 'извадка' })) : ''}${NL.translated.has(e.id) && NC.lang === 'en' ? ' · ' + esc(NC.L({ en: 'English for key articles', bg: 'с превод' })) : ''}</span>
          </a></li>`;
      });
      html += '</ul></section>';
    });
    html += '</div>';
    main.innerHTML = html;
    const form = main.querySelector('#citeJump');
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const ref = NL.parseCitation(main.querySelector('#citeInput').value);
      const err = main.querySelector('#citeError');
      if (ref) {
        location.hash = `#/law/${ref.law}/${encodeURIComponent(ref.art)}${ref.para ? '?para=' + ref.para : ''}`;
      } else {
        err.hidden = false;
        err.textContent = NC.L({
          en: 'Write the article number and the act, for example "чл. 578 ГПК" or "ЗЗД 19".',
          bg: 'Въведете номер на член и акт, например „чл. 578 ГПК“ или „ЗЗД 19“.'
        });
      }
    });
  };

  /* Parse free text such as "чл. 25, ал. 9 ЗННД", "ЗННД 25", "Art. 586 ГПК". */
  NL.parseCitation = function (text) {
    const s = String(text || '').trim();
    if (!s) return null;
    const lower = s.toLowerCase();
    let law = null;
    NL.order.forEach((id) => {
      const e = NL.catalog[id];
      const keys = [e.abbr.toLowerCase(), id];
      if (keys.some((k) => k && new RegExp(`(^|[^а-яa-z])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^а-яa-z]|$)`, 'i').test(lower))) {
        if (!law || e.abbr.length > NL.catalog[law].abbr.length) law = id;
      }
    });
    if (!law) return null;
    const rest = lower.replace(NL.catalog[law].abbr.toLowerCase(), ' ');
    const art = rest.match(/(?:чл\.?|art\.?|т\.|item|^|\s)\s*(\d+[а-я]?)/i);
    const para = rest.match(/(?:ал\.?\s*|\()(\d+)/i);
    const sect = rest.match(/§\s*(\d+[а-я]?)/);
    if (sect) return { law, art: '§' + sect[1], para: '' };
    if (!art) return { law, art: '', para: '' };
    return { law, art: art[1], para: para ? para[1] : '' };
  };

  /* ---------- One act ---------- */
  NL.renderLaw = async function (main, id, art, para) {
    main.innerHTML = `<div class="page"><p class="muted">${esc(NC.t('loading'))}</p></div>`;
    const law = await NL.load(id);
    if (!law) {
      main.innerHTML = `<div class="page"><h1>${esc(NC.t('laws'))}</h1><p>${esc(NC.t('lawNotFound'))}</p></div>`;
      return;
    }
    const e = NL.catalog[id];
    const toc = [];
    let body = '';
    let headingNo = 0;
    law.items.forEach((it) => {
      if (it.k === 'h' || it.k === 's') {
        const hid = `h-${id}-${headingNo++}`;
        toc.push({ id: hid, text: it.t, sub: it.k === 's' });
        body += `<h2 class="law-h${it.k === 's' ? ' sub' : ''}" id="${hid}">${esc(it.t)}</h2>`;
      } else if (it.k === 'x') {
        body += `<div class="law-annex">${it.t ? `<div class="art-title">${esc(it.t)}</div>` : ''}${it.p.map((l) => `<p>${esc(l)}</p>`).join('')}</div>`;
      } else {
        body += NL.articleHtml(law, it, { target: art && it.n === art, para: art && it.n === art ? para : '', showMissing: false });
      }
    });
    const euroLaw = ['tarifa', 'zmdt', 'zopvb', 'zvevro', 'znnd'].includes(id);
    main.innerHTML = `<div class="page law-page">
      <nav class="crumbs"><a href="#/laws">${esc(NC.t('laws'))}</a></nav>
      <header class="page-head law-head">
        <div class="law-abbr big">${esc(e.abbr)}</div>
        <h1 lang="bg">${esc(e.title.bg)}</h1>
        ${NC.lang === 'en' ? `<p class="lede">${esc(e.title.en)}</p>` : ''}
        <dl class="law-facts">
          ${e.inForce ? `<div><dt>${esc(NC.L({ en: 'In force', bg: 'В сила' }))}</dt><dd>${esc(e.inForce.replace(/^В сила от\s*/i, ''))}</dd></div>` : ''}
          ${e.published ? `<div><dt>${esc(NC.L({ en: 'Promulgated', bg: 'Обнародван' }))}</dt><dd>${esc(e.published.replace(/^Обн\.\s*/, ''))}</dd></div>` : ''}
          ${e.lastChange ? `<div><dt>${esc(NC.t('lastChange'))}</dt><dd>${esc(e.lastChange)}</dd></div>` : ''}
          <div><dt>${esc(NC.t('retrieved'))}</dt><dd>${esc(e.retrieved || '')}</dd></div>
          <div><dt>${esc(NC.t('source'))}</dt><dd><a href="${esc(e.source)}" target="_blank" rel="noopener">${esc(e.source.replace(/^https?:\/\//, ''))}</a></dd></div>
        </dl>
        ${e.partial ? `<p class="note">${esc(NC.t('extract'))}</p>` : ''}
        ${e.note ? `<p class="note">${esc(NC.L(e.note))}</p>` : ''}
        ${euroLaw ? `<p class="note euro">${esc(NC.t('euroNote'))}</p>` : ''}
        <p class="note">${esc(NC.t('officialNote'))}</p>
      </header>
      <div class="law-tools">
        <input type="search" id="lawFilter" placeholder="${esc(NC.t('filterLaw'))}" aria-label="${esc(NC.t('filterLaw'))}">
        <label class="check"><input type="checkbox" id="hideAmend"> ${esc(NC.L({ en: 'Hide amendment notes', bg: 'Скрий бележките за изменения' }))}</label>
      </div>
      <div class="law-layout">
        ${toc.length ? `<details class="law-toc" open><summary>${esc(NC.t('contents'))}</summary><ol>${toc.map((t) => `<li class="${t.sub ? 'sub' : ''}"><a href="#${t.id}" data-scroll="${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></details>` : ''}
        <div class="law-body" id="lawBody">${body}</div>
      </div>
    </div>`;

    main.querySelectorAll('[data-scroll]').forEach((a) => a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const target = document.getElementById(a.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    const hide = main.querySelector('#hideAmend');
    hide.addEventListener('change', () => main.querySelector('#lawBody').classList.toggle('no-amend', hide.checked));
    const filter = main.querySelector('#lawFilter');
    filter.addEventListener('input', () => {
      const q = NC.norm(filter.value.trim());
      const num = q.match(/^\d+[а-я]?$/) ? q : null;
      main.querySelectorAll('.law-art').forEach((el) => {
        if (!q) { el.hidden = false; return; }
        const n = el.id.replace(`art-${id}-`, '');
        el.hidden = num ? n !== num : !NC.norm(el.textContent).includes(q);
      });
      main.querySelectorAll('.law-h, .law-annex').forEach((el) => { el.hidden = !!q; });
    });
    if (art) {
      const target = document.getElementById(`art-${id}-${String(art).replace('§', 'p')}`);
      if (target) {
        requestAnimationFrame(() => {
          const line = target.querySelector('.art-line.hl') || target;
          line.scrollIntoView({ block: 'center' });
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  /* ---------- Law margin: shows a cited article next to the course text ---------- */
  NL.showInMargin = async function (lawId, art, para) {
    const margin = document.getElementById('margin');
    margin.hidden = false;
    document.body.classList.add('margin-open');
    margin.innerHTML = `<div class="margin-inner"><p class="muted">${esc(NC.t('loading'))}</p></div>`;
    const law = await NL.load(lawId);
    const item = law && law.byNo[art];
    let inner;
    if (!item) {
      inner = `<p>${esc(NC.t('lawNotFound'))}</p>`;
    } else {
      inner = NL.articleHtml(law, item, { para, showMissing: true });
    }
    const e = NL.catalog[lawId];
    margin.innerHTML = `<div class="margin-inner">
      <div class="margin-head">
        <div>
          <div class="margin-kicker">${esc(NC.t('lawMargin'))}</div>
          <div class="margin-cite">${esc(NL.label(lawId, art, para))}</div>
          ${e ? `<div class="margin-law" lang="bg">${esc(e.title.bg)}</div>` : ''}
        </div>
        <button class="icon-btn" type="button" id="marginClose" aria-label="${esc(NC.t('close'))}">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="margin-body">${inner}</div>
      <a class="btn btn-quiet" href="#/law/${encodeURIComponent(lawId)}/${encodeURIComponent(art)}${para ? '?para=' + encodeURIComponent(para) : ''}">${esc(NC.t('openInLibrary'))}</a>
    </div>`;
    margin.querySelector('#marginClose').addEventListener('click', NL.closeMargin);
    const hl = margin.querySelector('.art-line.hl');
    if (hl) hl.scrollIntoView({ block: 'nearest' });
    margin.querySelector('#marginClose').focus({ preventScroll: true });
  };

  NL.closeMargin = function () {
    const margin = document.getElementById('margin');
    margin.hidden = true;
    margin.innerHTML = '';
    document.body.classList.remove('margin-open');
  };
})();

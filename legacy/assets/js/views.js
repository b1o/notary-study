/* Views: home, course register, chapter reader, glossary, templates, search. */
(function () {
  'use strict';
  const NC = window.NC;
  const NL = window.NotaryLaws;
  const esc = NC.esc;
  const V = (NC.views = {});

  const ROLES = ['clerk', 'assistant', 'notary'];
  const roleLabel = (r) => NC.t({ clerk: 'roleClerk', assistant: 'roleAssistant', notary: 'roleNotary' }[r]);

  /* ---------- The seal ---------- */
  let sealNo = 0;
  NC.seal = function (opts) {
    const id = `seal${sealNo++}`;
    const size = opts.size || 220;
    const ring = NC.L({ en: 'NOTARY OFFICE COURSE ✦ REPUBLIC OF BULGARIA ✦ ', bg: 'КУРС ПО НОТАРИАЛНО ДЕЛО ✦ РЕПУБЛИКА БЪЛГАРИЯ ✦ ' });
    const frac = Math.max(0, Math.min(1, opts.fraction || 0));
    const circ = 2 * Math.PI * 70;
    return `<svg class="seal ${opts.className || ''}" viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="${esc(opts.label || '')}">
      <defs>
        <filter id="${id}ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${opts.seed || 3}" result="n"/>
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.25" result="mask"/>
          <feComposite in="SourceGraphic" in2="mask" operator="in"/>
        </filter>
        <path id="${id}path" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/>
      </defs>
      <g filter="url(#${id}ink)" class="seal-ink">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="5"/>
        <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <text font-size="13" fill="currentColor" font-family="Sofia Sans, sans-serif" font-weight="700"><textPath href="#${id}path" startOffset="0" textLength="498" lengthAdjust="spacing">${esc(ring)}</textPath></text>
        <circle class="seal-track" cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="3" opacity=".18"/>
        <circle class="seal-progress" cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="${(circ * frac).toFixed(1)} ${circ.toFixed(1)}" transform="rotate(-90 100 100)"/>
        <text x="100" y="${opts.sub ? 104 : 112}" text-anchor="middle" class="seal-main" fill="currentColor">${esc(opts.main || '')}</text>
        ${opts.sub ? `<text x="100" y="128" text-anchor="middle" class="seal-sub" fill="currentColor">${esc(opts.sub)}</text>` : ''}
      </g>
    </svg>`;
  };

  function counts() {
    const ids = NC.chapterOrder();
    const done = ids.filter((id) => NC.isCertified(id)).length;
    return { done, total: ids.length };
  }

  function statusOf(id) {
    const p = NC.store.chapter(id);
    if (p.certifiedAt) return 'certified';
    if (p.read || p.best != null) return 'progress';
    return 'none';
  }

  function chapterNo(id) { return NC.manifest.chapters[id].n; }

  function statusCell(id) {
    const st = statusOf(id);
    const p = NC.store.chapter(id);
    if (st === 'certified') return `<span class="stamp-mini" title="${esc(NC.formatDate(p.certifiedAt))}">${esc(NC.t('certified'))}</span>`;
    if (st === 'progress') {
      const parts = [];
      if (p.read) parts.push(NC.t('read'));
      if (p.best != null) parts.push(`${p.best}%`);
      return `<span class="status-progress">${esc(parts.join(', '))}</span>`;
    }
    return `<span class="status-none">${esc(NC.t('notStarted'))}</span>`;
  }

  function isEssential(id) {
    const role = NC.store.get('role');
    if (!role || role === 'all') return false;
    return (NC.manifest.chapters[id].roles || []).includes(role);
  }

  function registerTable(opts) {
    let html = '';
    NC.manifest.parts.forEach((part, pi) => {
      html += `<section class="register-part">
        <h2 class="register-vol"><span class="vol-no">${esc(NC.t('volume'))} ${NC.roman(pi + 1)}</span> ${esc(NC.L(part.title))}</h2>
        <table class="register">
          <thead><tr><th scope="col">№</th><th scope="col">${esc(NC.t('chapter'))}</th><th scope="col" class="col-time">${esc(NC.t('minutes'))}</th><th scope="col">${esc(NC.L({ en: 'Status', bg: 'Състояние' }))}</th></tr></thead><tbody>`;
      part.chapters.forEach((id) => {
        const c = NC.manifest.chapters[id];
        const ess = isEssential(id);
        html += `<tr class="${ess ? 'essential' : ''}${opts && opts.dimOthers && !ess ? ' dim' : ''}">
          <td class="col-no">${c.n}</td>
          <td><a href="#/chapter/${id}">${esc(NC.L(c.title))}</a>${ess ? `<span class="ess-mark" title="${esc(NC.t('essential'))}">●</span>` : ''}<div class="reg-sum">${esc(NC.L(c.summary))}</div></td>
          <td class="col-time">${c.minutes}</td>
          <td class="col-status">${statusCell(id)}</td>
        </tr>`;
      });
      html += '</tbody></table></section>';
    });
    return html;
  }

  function roleChips() {
    const role = NC.store.get('role') || 'all';
    const chip = (r, label) => `<button type="button" class="chip${role === r ? ' on' : ''}" data-role="${r}" aria-pressed="${role === r}">${esc(label)}</button>`;
    return `<div class="role-chips" role="group" aria-label="${esc(NC.t('yourPath'))}">
      <span class="chips-label">${esc(NC.t('yourPath'))}</span>
      ${chip('all', NC.t('pathAll'))}${ROLES.map((r) => chip(r, roleLabel(r))).join('')}
    </div>`;
  }

  function bindRoleChips(root, rerender) {
    root.querySelectorAll('[data-role]').forEach((b) => b.addEventListener('click', () => {
      NC.store.set('role', b.dataset.role);
      rerender();
    }));
  }

  function nextChapter() {
    const last = NC.store.get('last');
    const ids = NC.chapterOrder();
    if (last && ids.includes(last) && !NC.isCertified(last)) return last;
    return ids.find((id) => !NC.isCertified(id)) || ids[0];
  }

  /* ---------- Home ---------- */
  V.home = function (main) {
    const { done, total } = counts();
    const started = Object.keys(NC.store.get('progress') || {}).length > 0;
    const next = nextChapter();
    const nextMeta = NC.manifest.chapters[next];
    main.innerHTML = `<div class="page home">
      <section class="hero">
        <div class="hero-text">
          <p class="hero-kicker">${esc(NC.L({ en: 'A complete course in English and Bulgarian', bg: 'Пълен курс на български и английски' }))}</p>
          <h1 class="hero-title">${esc(NC.L({ en: 'Inside the Bulgarian notary office', bg: 'Нотариалната кантора отвътре' }))}</h1>
          <p class="lede">${esc(NC.L({
            en: 'Everything a clerk, an assistant notary or a future notary needs: the law, the procedures, the documents, the institutions and the daily work. Each chapter links to the full text of the law and ends with flashcards and a test.',
            bg: 'Всичко, което е нужно на служител, помощник-нотариус или бъдещ нотариус: законите, процедурите, документите, институциите и ежедневната работа. Всяка глава препраща към пълния текст на закона и завършва с флашкарти и тест.'
          }))}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/chapter/${next}">${esc(started ? NC.t('continue') : NC.t('startCourse'))}: ${esc(NC.L(nextMeta.title))}</a>
            <a class="btn" href="#/laws">${esc(NC.t('laws'))}</a>
          </div>
        </div>
        <div class="hero-seal">
          ${NC.seal({ fraction: total ? done / total : 0, main: `${done}/${total}`, sub: NC.t('progressLabel'), label: `${done} / ${total} ${NC.t('progressLabel')}`, size: 260 })}
        </div>
      </section>
      <section class="home-strip">
        <a href="#/cards"><strong>${esc(NC.t('cards'))}</strong><span>${esc(NC.L({ en: 'Leitner boxes for every chapter and the glossary', bg: 'Кутии по Лайтнер за всяка глава и речника' }))}</span></a>
        <a href="#/tests"><strong>${esc(NC.t('tests'))}</strong><span>${esc(NC.L({ en: 'A test per chapter and a 40-question final exam', bg: 'Тест към всяка глава и финален изпит с 40 въпроса' }))}</span></a>
        <a href="#/templates"><strong>${esc(NC.t('templates'))}</strong><span>${esc(NC.L({ en: 'Deeds, powers of attorney, declarations, invitations', bg: 'Актове, пълномощни, декларации, покани' }))}</span></a>
        <a href="#/tools/fees"><strong>${esc(NC.t('feeCalc'))}</strong><span>${esc(NC.L({ en: 'Notary fee, entry fee and local tax in euro', bg: 'Нотариална такса, такса вписване и местен данък в евро' }))}</span></a>
      </section>
      <section class="home-register">
        <div class="section-head">
          <h2>${esc(NC.t('register'))}</h2>
          <p class="muted">${esc(NC.t('registerHint'))}</p>
          ${roleChips()}
        </div>
        ${registerTable()}
      </section>
      <footer class="page-foot">
        <p class="muted">${esc(NC.t('storageNote'))} <button type="button" class="link-btn" id="resetBtn">${esc(NC.t('resetProgress'))}</button></p>
      </footer>
    </div>`;
    bindRoleChips(main, () => V.home(main));
    main.querySelector('#resetBtn').addEventListener('click', () => {
      if (confirm(NC.t('resetConfirm'))) { NC.store.reset(); NC.app.refresh(); }
    });
  };

  /* ---------- Course register page ---------- */
  V.course = function (main) {
    main.innerHTML = `<div class="page">
      <header class="page-head">
        <h1>${esc(NC.t('course'))}</h1>
        <p class="lede">${esc(NC.L({
          en: 'Seven volumes, from your first day in the office to complex transactions. Pick your path to see the chapters that matter most for your role.',
          bg: 'Седем тома – от първия ден в кантората до сложните сделки. Изберете своя път, за да видите главите, които са най-важни за вашата роля.'
        }))}</p>
        ${roleChips()}
      </header>
      ${registerTable()}
    </div>`;
    bindRoleChips(main, () => V.course(main));
  };

  /* ---------- Chapter ---------- */
  function collectCitations(src) {
    const seen = new Map();
    String(src).replace(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, (_, ref) => {
      const [law, art] = ref.split(':');
      if (!art) return;
      const key = `${law}:${art}`;
      if (!seen.has(key)) seen.set(key, { law, art });
    });
    return [...seen.values()];
  }

  V.chapter = async function (main, id) {
    const meta = NC.manifest.chapters[id];
    if (!meta) return V.notFound(main);
    main.innerHTML = `<div class="page"><p class="muted">${esc(NC.t('loading'))}</p></div>`;
    const res = await NC.loadChapter(id);
    if (!res) return V.notFound(main);
    const c = res.data;
    NC.store.set('last', id);
    const md = NC.markdown(c.body);
    const ids = NC.chapterOrder();
    const idx = ids.indexOf(id);
    const prev = ids[idx - 1];
    const next = ids[idx + 1];
    const part = NC.partOf(id);
    const pIndex = NC.manifest.parts.indexOf(part);
    const p = NC.store.chapter(id);
    const cites = collectCitations(c.body);
    const byLaw = {};
    cites.forEach((ct) => { (byLaw[ct.law] = byLaw[ct.law] || []).push(ct.art); });
    const roles = (meta.roles || []).map(roleLabel).join(', ');

    main.innerHTML = `<div class="page chapter${NC.isCertified(id) ? ' is-certified' : ''}">
      <nav class="crumbs"><a href="#/course">${esc(NC.t('volume'))} ${NC.roman(pIndex + 1)}: ${esc(NC.L(part.title))}</a></nav>
      <header class="chapter-head">
        <div class="act-no">${esc(NC.t('chapter'))} ${meta.n}</div>
        <h1>${esc(c.title)}</h1>
        <p class="lede">${esc(c.summary)}</p>
        <p class="chapter-meta">${meta.minutes} ${esc(NC.t('minutes'))}${roles ? ` · ${esc(roles)}` : ''}</p>
        ${res.lang !== NC.lang ? `<p class="note">${esc(NC.t('pendingTranslation'))}</p>` : ''}
        <div class="chapter-seal" aria-hidden="${NC.isCertified(id) ? 'false' : 'true'}">${NC.seal({ fraction: 1, main: NC.t('certified'), sub: NC.formatDate(p.certifiedAt), size: 120, seed: meta.n, className: 'stamp', label: NC.t('certified') })}</div>
      </header>
      ${c.objectives && c.objectives.length ? `<section class="objectives"><h2>${esc(NC.t('objectives'))}</h2><ul>${c.objectives.map((o) => `<li>${NC.inline(o)}</li>`).join('')}</ul></section>` : ''}
      ${md.toc.length > 2 ? `<details class="chapter-toc"><summary>${esc(NC.t('contents'))}</summary><ol>${md.toc.filter((t) => t.level === 2).map((t) => `<li><a href="#${t.id}" data-scroll="${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></details>` : ''}
      <div class="prose" lang="${res.lang}">${md.html}</div>
      ${cites.length ? `<section class="key-law"><h2>${esc(NC.t('keyLaw'))}</h2><ul>${Object.keys(byLaw).map((law) => `<li><span class="law-abbr">${esc(NL.catalog[law] ? NL.catalog[law].abbr : law)}</span> ${byLaw[law].map((a) => `<a class="cite" href="#/law/${law}/${encodeURIComponent(a)}" data-law="${esc(law)}" data-art="${esc(a)}">${esc(String(a).startsWith('§') ? a : (NC.lang === 'bg' ? (NL.catalog[law] && NL.catalog[law].unit ? NL.catalog[law].unit.bg : 'чл.') + ' ' + a : (NL.catalog[law] && NL.catalog[law].unit ? NL.catalog[law].unit.en : 'Art.') + ' ' + a))}</a>`).join(', ')}</li>`).join('')}</ul></section>` : ''}
      <section class="chapter-actions">
        <button type="button" class="btn${p.read ? ' done' : ''}" id="markRead" aria-pressed="${!!p.read}">${esc(p.read ? '✓ ' + NC.t('read') : NC.t('markRead'))}</button>
        <a class="btn btn-primary" href="#/quiz/${id}">${esc(NC.t('takeQuiz'))}${p.best != null ? ` (${esc(NC.t('bestScore'))}: ${p.best}%)` : ''}</a>
        <a class="btn" href="#/cards/${id}">${esc(NC.t('studyCards'))} (${(c.cards || []).length})</a>
      </section>
      <nav class="pager">
        ${prev ? `<a href="#/chapter/${prev}" class="pager-prev"><span>${esc(NC.t('prev'))}</span>${chapterNo(prev)}. ${esc(NC.L(NC.manifest.chapters[prev].title))}</a>` : '<span></span>'}
        ${next ? `<a href="#/chapter/${next}" class="pager-next"><span>${esc(NC.t('next'))}</span>${chapterNo(next)}. ${esc(NC.L(NC.manifest.chapters[next].title))}</a>` : ''}
      </nav>
    </div>`;

    main.querySelectorAll('[data-scroll]').forEach((a) => a.addEventListener('click', (ev) => {
      ev.preventDefault();
      document.getElementById(a.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
    }));
    main.querySelector('#markRead').addEventListener('click', (ev) => {
      const cur = NC.store.chapter(id);
      const updated = NC.store.updateChapter(id, { read: !cur.read, readAt: new Date().toISOString() });
      if (!updated.read && updated.certifiedAt) { delete updated.certifiedAt; NC.store.save(); }
      V.chapter(main, id).then(() => {
        NC.app.renderSidebar();
        if (updated.certifiedAt && !cur.certifiedAt) NC.stampAnimation(main.querySelector('.chapter-seal'));
        const btn = main.querySelector('#markRead');
        if (btn) btn.focus();
      });
      ev.preventDefault();
    });
  };

  NC.stampAnimation = function (el) {
    if (!el) return;
    el.classList.remove('stamping');
    void el.offsetWidth;
    el.classList.add('stamping');
  };

  /* ---------- Glossary ---------- */
  V.glossary = async function (main) {
    main.innerHTML = `<div class="page"><p class="muted">${esc(NC.t('loading'))}</p></div>`;
    await NC.loadScript('content/glossary.js');
    const terms = (NC.glossary || []).slice().sort((a, b) => a.bg.localeCompare(b.bg, 'bg'));
    const letters = [...new Set(terms.map((t) => t.bg[0].toUpperCase()))];
    main.innerHTML = `<div class="page glossary">
      <header class="page-head">
        <h1>${esc(NC.t('glossary'))}</h1>
        <p class="lede">${esc(NC.L({
          en: `${terms.length} terms that you hear every day in a notary office, with the Bulgarian original, an English equivalent and the law behind each one.`,
          bg: `${terms.length} термина, които чувате всеки ден в нотариалната кантора, с превод на английски и разпоредбата зад всеки от тях.`
        }))}</p>
        <input type="search" id="gFilter" class="wide-input" placeholder="${esc(NC.t('filterGlossary'))}" aria-label="${esc(NC.t('filterGlossary'))}">
        <nav class="letters">${letters.map((l) => `<a href="#g-${esc(l)}" data-scroll="g-${esc(l)}">${esc(l)}</a>`).join('')}</nav>
      </header>
      <dl class="terms">${terms.map((t, i) => {
        const first = i === 0 || terms[i - 1].bg[0].toUpperCase() !== t.bg[0].toUpperCase();
        return `${first ? `<div class="letter-head" id="g-${esc(t.bg[0].toUpperCase())}">${esc(t.bg[0].toUpperCase())}</div>` : ''}
        <div class="term-row" data-text="${esc(NC.norm(t.bg + ' ' + t.en + ' ' + NC.L(t.def)))}">
          <dt><span lang="bg">${esc(t.bg)}</span><span class="term-en" lang="en">${esc(t.en)}</span></dt>
          <dd>${NC.inline(NC.L(t.def))}${t.ref || t.ch ? `<div class="term-refs">${t.ref ? t.ref.split(',').map((r) => NC.inline(`[[${r.trim()}]]`)).join(' ') : ''}${t.ch && NC.manifest.chapters[t.ch] ? ` <a href="#/chapter/${t.ch}">${esc(NC.t('seeChapter'))} ${NC.manifest.chapters[t.ch].n}</a>` : ''}</div>` : ''}</dd>
        </div>`;
      }).join('')}</dl>
    </div>`;
    const input = main.querySelector('#gFilter');
    input.addEventListener('input', () => {
      const q = NC.norm(input.value.trim());
      main.querySelectorAll('.term-row').forEach((r) => { r.hidden = q && !r.dataset.text.includes(q); });
      main.querySelectorAll('.letter-head').forEach((h) => { h.hidden = !!q; });
    });
    main.querySelectorAll('[data-scroll]').forEach((a) => a.addEventListener('click', (ev) => {
      ev.preventDefault();
      document.getElementById(a.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
    }));
  };

  /* ---------- Templates ---------- */
  V.templates = async function (main, id) {
    main.innerHTML = `<div class="page"><p class="muted">${esc(NC.t('loading'))}</p></div>`;
    await NC.loadScript('content/templates.js');
    const list = NC.templates || [];
    if (!id) {
      const groups = {};
      list.forEach((t) => { (groups[NC.L(t.group)] = groups[NC.L(t.group)] || []).push(t); });
      main.innerHTML = `<div class="page">
        <header class="page-head"><h1>${esc(NC.t('templates'))}</h1>
        <p class="lede">${esc(NC.L({ en: 'Working templates in Bulgarian, the language of every notarial document, with an English working translation and notes on each field.', bg: 'Работни образци на български език с пояснения към всяко поле и превод на английски.' }))}</p>
        <p class="note">${esc(NC.t('templateNote'))}</p></header>
        ${Object.keys(groups).map((g) => `<section class="tpl-group"><h2>${esc(g)}</h2><ul class="tpl-list">${groups[g].map((t) => `<li><a href="#/templates/${t.id}"><strong lang="bg">${esc(t.title.bg)}</strong><span>${esc(NC.lang === 'en' ? t.title.en : NC.L(t.use))}</span></a></li>`).join('')}</ul></section>`).join('')}
      </div>`;
      return;
    }
    const t = list.find((x) => x.id === id);
    if (!t) return V.notFound(main);
    main.innerHTML = `<div class="page template">
      <nav class="crumbs"><a href="#/templates">${esc(NC.t('templates'))}</a></nav>
      <header class="page-head"><h1 lang="bg">${esc(t.title.bg)}</h1>${NC.lang === 'en' ? `<p class="lede">${esc(t.title.en)}</p>` : ''}
        <p>${NC.inline(NC.L(t.use))}</p>
        ${t.law ? `<p class="term-refs">${t.law.split(',').map((r) => NC.inline(`[[${r.trim()}]]`)).join(' ')}</p>` : ''}
      </header>
      <div class="tpl-actions"><button type="button" class="btn" id="copyTpl">${esc(NC.t('copy'))}</button><button type="button" class="btn btn-quiet" onclick="window.print()">${esc(NC.t('print'))}</button></div>
      <figure class="doc-block paper"><pre class="doc" lang="bg" id="tplText">${esc(t.text)}</pre></figure>
      ${t.notes ? `<section class="prose tpl-notes">${NC.markdown(NC.L(t.notes)).html}</section>` : ''}
      ${NC.lang === 'en' && t.en ? `<details class="tpl-en"><summary>${esc(NC.t('translationOfTemplate'))}</summary><pre class="doc" lang="en">${esc(t.en)}</pre></details>` : ''}
      <p class="note">${esc(NC.t('templateNote'))}</p>
    </div>`;
    main.querySelector('#copyTpl').addEventListener('click', async (ev) => {
      try {
        await navigator.clipboard.writeText(t.text);
        ev.target.textContent = NC.t('copied');
      } catch (e) {
        const range = document.createRange();
        range.selectNodeContents(main.querySelector('#tplText'));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  };

  /* ---------- Search ---------- */
  let courseIndex = { lang: null, docs: [] };

  async function buildCourseIndex() {
    if (courseIndex.lang === NC.lang) return courseIndex.docs;
    const chapters = await NC.loadAllChapters(NC.lang);
    const docs = [];
    chapters.forEach((c) => {
      const sections = String(c.body).split(/\n(?=##\s)/);
      const used = new Set();
      sections.forEach((sec) => {
        const hm = sec.match(/^##+\s+(.*)/);
        const title = hm ? hm[1].trim() : c.title;
        const anchor = hm ? NC.slug(title, used) : '';
        const text = NC.plain(sec);
        docs.push({ chapter: c.id, title: NC.plain(title), chapterTitle: c.title, text, norm: NC.norm(text), anchor });
      });
    });
    courseIndex = { lang: NC.lang, docs };
    return docs;
  }

  function snippet(text, q) {
    const n = NC.norm(text);
    const i = n.indexOf(q);
    if (i < 0) return esc(text.slice(0, 180)) + (text.length > 180 ? '…' : '');
    const start = Math.max(0, i - 70);
    const end = Math.min(text.length, i + q.length + 110);
    return (start > 0 ? '…' : '') + esc(text.slice(start, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length, end)) + (end < text.length ? '…' : '');
  }

  V.search = async function (main, query) {
    const q = NC.norm((query || '').trim());
    const input = document.getElementById('searchInput');
    if (input && input.value !== query) input.value = query || '';
    if (!q) { main.innerHTML = `<div class="page"><h1>${esc(NC.t('searchResults'))}</h1><p class="muted">${esc(NC.t('noResults'))}</p></div>`; return; }

    const ref = NL.parseCitation(query);
    main.innerHTML = `<div class="page"><h1>${esc(NC.t('searchResults'))}</h1><p class="muted">${esc(NC.t('searching'))}</p></div>`;
    const [docs, laws] = await Promise.all([buildCourseIndex(), NL.loadAll()]);
    await NC.loadScript('content/glossary.js').catch(() => {});
    const words = q.split(/\s+/).filter((w) => w.length > 1);
    const score = (n) => words.reduce((s, w) => s + (n.includes(w) ? 1 : 0), 0);

    const courseHits = docs.map((d) => ({ d, s: score(d.norm) + (NC.norm(d.title).includes(q) ? 2 : 0) + (d.norm.includes(q) ? 2 : 0) }))
      .filter((x) => x.s >= words.length).sort((a, b) => b.s - a.s).slice(0, 30);

    const lawHits = [];
    laws.forEach((law) => law.items.forEach((it) => {
      if (it.k !== 'a' && it.k !== 'p') return;
      const text = it.p.join(' ');
      const nt = NC.norm(text + ' ' + (it.t || ''));
      const enTr = NL.en[law.id] && NL.en[law.id][it.n];
      const ne = enTr ? NC.norm(enTr.p.join(' ')) : '';
      const s = Math.max(score(nt), score(ne));
      if (s >= words.length) lawHits.push({ law, it, s: s + (nt.includes(q) || ne.includes(q) ? 2 : 0), text: ne && score(ne) >= score(nt) ? enTr.p.join(' ') : text });
    }));
    lawHits.sort((a, b) => b.s - a.s);

    const gHits = (NC.glossary || []).filter((g) => NC.norm(`${g.bg} ${g.en} ${NC.L(g.def)}`).includes(q)).slice(0, 12);

    let html = `<div class="page search-page"><h1>${esc(NC.t('searchResults'))}: „${esc(query)}“</h1>`;
    if (ref && ref.art) {
      html += `<p class="jump"><a class="btn btn-primary" href="#/law/${ref.law}/${encodeURIComponent(ref.art)}${ref.para ? '?para=' + ref.para : ''}">${esc(NC.t('jumpTo'))} ${esc(NL.label(ref.law, ref.art, ref.para))}</a></p>`;
    }
    if (!courseHits.length && !lawHits.length && !gHits.length) html += `<p>${esc(NC.t('noResults'))}</p>`;
    if (gHits.length) {
      html += `<section><h2>${esc(NC.t('inGlossary'))}</h2><dl class="terms compact">${gHits.map((t) => `<div class="term-row"><dt><span lang="bg">${esc(t.bg)}</span><span class="term-en">${esc(t.en)}</span></dt><dd>${NC.inline(NC.L(t.def))}</dd></div>`).join('')}</dl></section>`;
    }
    if (courseHits.length) {
      html += `<section><h2>${esc(NC.t('inCourse'))} (${courseHits.length})</h2><ol class="hits">${courseHits.map(({ d }) => `<li><a href="#/chapter/${d.chapter}${d.anchor ? '?s=' + encodeURIComponent(d.anchor) : ''}"><strong>${esc(d.title)}</strong><span class="hit-ch">${esc(NC.t('chapter'))} ${NC.manifest.chapters[d.chapter].n}: ${esc(d.chapterTitle)}</span></a><p>${snippet(d.text, words[0] || q)}</p></li>`).join('')}</ol></section>`;
    }
    if (lawHits.length) {
      html += `<section><h2>${esc(NC.t('inLaws'))} (${lawHits.length > 60 ? '60+' : lawHits.length})</h2><ol class="hits">${lawHits.slice(0, 60).map(({ law, it, text }) => `<li><a href="#/law/${law.id}/${encodeURIComponent(it.n)}"><strong>${esc(NL.label(law.id, it.n))}</strong>${it.t ? `<span class="hit-ch">${esc(it.t)}</span>` : ''}</a><p lang="bg">${snippet(text, words[0] || q)}</p></li>`).join('')}</ol></section>`;
    }
    html += '</div>';
    main.innerHTML = html;
  };

  V.notFound = function (main) {
    main.innerHTML = `<div class="page"><h1>${esc(NC.t('notFound'))}</h1><p><a class="btn" href="#/">${esc(NC.t('goHome'))}</a></p></div>`;
  };
})();

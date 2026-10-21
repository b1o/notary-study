/* App shell: language, theme, sidebar, router and global events. */
(function () {
  'use strict';
  const NC = window.NC;
  const NL = window.NotaryLaws;
  const esc = NC.esc;
  const V = NC.views;
  const main = document.getElementById('main');
  const sidebar = document.getElementById('sidebar');

  const app = (NC.app = {});

  /* ---------- Language ---------- */
  function initialLang() {
    const saved = NC.store.get('lang');
    if (saved === 'bg' || saved === 'en') return saved;
    return /^bg/i.test(navigator.language || '') ? 'bg' : 'en';
  }

  function applyLang(lang) {
    NC.lang = lang;
    document.documentElement.lang = lang;
    document.title = NC.L({ en: 'Notary Office Course: Bulgaria', bg: 'Курс по нотариално дело' });
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = NC.t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = NC.t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = NC.t(el.dataset.i18nTitle); el.setAttribute('aria-label', NC.t(el.dataset.i18nTitle)); });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    const skip = document.querySelector('.skip');
    if (skip) skip.textContent = NC.L({ en: 'Skip to content', bg: 'Към съдържанието' });
  }

  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    if (NC.lang === b.dataset.lang) return;
    NC.store.set('lang', b.dataset.lang);
    applyLang(b.dataset.lang);
    NL.closeMargin();
    app.refresh();
  }));

  /* ---------- Theme ---------- */
  function applyTheme() {
    const theme = NC.store.get('theme');
    if (theme === 'dark' || theme === 'light') document.documentElement.setAttribute('data-theme', theme);
    else document.documentElement.removeAttribute('data-theme');
  }
  document.getElementById('themeBtn').addEventListener('click', () => {
    const cur = NC.store.get('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = cur === 'dark' || (cur !== 'light' && prefersDark);
    NC.store.set('theme', isDark ? 'light' : 'dark');
    applyTheme();
  });

  /* ---------- Sidebar ---------- */
  const NAV = [
    { href: '#/', key: 'home', match: /^#?\/?$/ },
    { href: '#/course', key: 'course', match: /^#\/(course|chapter|quiz)/ },
    { href: '#/laws', key: 'laws', match: /^#\/laws?/ },
    { href: '#/cards', key: 'cards', match: /^#\/cards/ },
    { href: '#/tests', key: 'tests', match: /^#\/(tests|exam)/ },
    { href: '#/glossary', key: 'glossary', match: /^#\/glossary/ },
    { href: '#/templates', key: 'templates', match: /^#\/templates/ },
    { href: '#/tools/checklists', key: 'checklists', match: /^#\/tools\/checklists/ },
    { href: '#/tools/fees', key: 'feeCalc', match: /^#\/tools\/fees/ }
  ];

  app.renderSidebar = function () {
    const hash = location.hash || '#/';
    const current = (hash.match(/^#\/(?:chapter|quiz|cards)\/([^/?]+)/) || [])[1];
    let html = `<ul class="nav-main">${NAV.map((n) => `<li><a href="${n.href}"${n.match.test(hash) ? ' aria-current="page"' : ''}>${esc(NC.t(n.key))}</a></li>`).join('')}</ul>`;
    html += `<div class="nav-register">`;
    NC.manifest.parts.forEach((part, pi) => {
      const open = part.chapters.includes(current) || (!current && pi === 0);
      html += `<details class="nav-vol"${open ? ' open' : ''}><summary><span class="vol-no">${esc(NC.t('volume'))} ${NC.roman(pi + 1)}</span><span class="vol-title">${esc(NC.L(part.title))}</span></summary><ol>`;
      part.chapters.forEach((id) => {
        const c = NC.manifest.chapters[id];
        const cert = NC.isCertified(id);
        const p = NC.store.chapter(id);
        const mark = cert ? '<span class="nav-mark cert" aria-hidden="true"></span>' : (p.read || p.best != null ? '<span class="nav-mark part" aria-hidden="true"></span>' : '<span class="nav-mark" aria-hidden="true"></span>');
        html += `<li><a href="#/chapter/${id}"${id === current ? ' aria-current="page"' : ''}><span class="nav-no">${c.n}</span><span class="nav-title">${esc(NC.L(c.title))}</span>${mark}${cert ? `<span class="sr-only">${esc(NC.t('certified'))}</span>` : ''}</a></li>`;
      });
      html += '</ol></details>';
    });
    html += '</div>';
    sidebar.innerHTML = html;
  };

  /* Mobile drawer */
  const menuBtn = document.getElementById('menuBtn');
  const scrim = document.getElementById('scrim');
  function setDrawer(open) {
    document.body.classList.toggle('drawer-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
  }
  menuBtn.addEventListener('click', () => setDrawer(!document.body.classList.contains('drawer-open')));
  scrim.addEventListener('click', () => setDrawer(false));
  sidebar.addEventListener('click', (ev) => { if (ev.target.closest('a')) setDrawer(false); });

  /* ---------- Search ---------- */
  document.getElementById('searchForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    if (q) location.hash = `#/search?q=${encodeURIComponent(q)}`;
  });

  /* ---------- Law citations open in the margin ---------- */
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a.cite');
    if (!a) return;
    if (ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    // Inside the law library the link navigates; everywhere else it opens the margin.
    if (/^#\/law/.test(location.hash) && !a.closest('.margin')) return;
    ev.preventDefault();
    NL.showInMargin(a.dataset.law, a.dataset.art, a.dataset.para);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (!document.getElementById('margin').hidden) NL.closeMargin();
      setDrawer(false);
    }
    if (ev.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      ev.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });

  /* ---------- Router ---------- */
  function parseHash() {
    const hash = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = hash.split('?');
    const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
    const params = new URLSearchParams(qs || '');
    return { parts, params };
  }

  let lastPath = null;
  async function route() {
    const { parts, params } = parseHash();
    const [a, b, c] = parts;
    const path = parts.join('/');
    if (path !== lastPath) NL.closeMargin();
    lastPath = path;
    app.renderSidebar();
    document.body.dataset.view = a || 'home';
    try {
      if (!a) V.home(main);
      else if (a === 'course') V.course(main);
      else if (a === 'chapter') {
        await V.chapter(main, b);
        const s = params.get('s');
        if (s) { const el = document.getElementById(s); if (el) el.scrollIntoView(); } else window.scrollTo(0, 0);
      } else if (a === 'quiz') await V.quiz(main, b);
      else if (a === 'laws') NL.renderIndex(main);
      else if (a === 'law') await NL.renderLaw(main, b, c, params.get('para'));
      else if (a === 'cards') await V.cards(main, b);
      else if (a === 'tests') V.tests(main);
      else if (a === 'exam') await V.exam(main);
      else if (a === 'glossary') await V.glossary(main);
      else if (a === 'templates') await V.templates(main, b);
      else if (a === 'tools' && b === 'fees') V.fees(main);
      else if (a === 'tools' && b === 'checklists') await V.checklists(main, c);
      else if (a === 'search') await V.search(main, params.get('q') || '');
      else V.notFound(main);
    } catch (err) {
      console.error(err);
      main.innerHTML = `<div class="page"><h1>${esc(NC.L({ en: 'This page did not load', bg: 'Страницата не се зареди' }))}</h1><p>${esc(String(err.message || err))}</p></div>`;
    }
    if (a !== 'chapter' && a !== 'law') window.scrollTo(0, 0);
    if (!document.body.classList.contains('booted')) document.body.classList.add('booted');
    else main.focus({ preventScroll: true });
  }

  app.refresh = route;
  window.addEventListener('hashchange', route);

  /* ---------- Boot ---------- */
  applyTheme();
  applyLang(initialLang());
  route();
})();

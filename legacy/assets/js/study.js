/* Study tools: chapter tests, final exam, flashcards with Leitner boxes. */
(function () {
  'use strict';
  const NC = window.NC;
  const esc = NC.esc;
  const V = NC.views;

  const PASS_CHAPTER = 80;
  const PASS_EXAM = 75;
  const EXAM_SIZE = 40;
  const BOX_DAYS = [0, 1, 3, 7, 14, 30];

  /* Prepare a question: shuffle the options and remember the right one. */
  function prepare(q, chapterId) {
    const order = NC.shuffle(q.o.map((_, i) => i));
    return { q: q.q, o: order.map((i) => q.o[i]), a: order.indexOf(q.a), e: q.e, r: q.r, chapter: chapterId };
  }

  function refHtml(r) {
    if (!r) return '';
    return `<div class="q-refs">${r.split(',').map((x) => NC.inline(`[[${x.trim()}]]`)).join(' ')}</div>`;
  }

  /* Runs a sequence of questions. mode "learn" shows feedback after each answer, "exam" only at the end. */
  function runQuiz(main, questions, opts) {
    let i = 0;
    const answers = [];

    function renderQuestion() {
      const q = questions[i];
      main.querySelector('.quiz-stage').innerHTML = `
        <div class="q-progress"><span>${esc(NC.t('question'))} ${i + 1} ${esc(NC.t('of'))} ${questions.length}</span>
          <span class="q-bar"><span style="width:${(i / questions.length) * 100}%"></span></span></div>
        <fieldset class="question">
          <legend>${NC.inline(q.q)}</legend>
          ${q.o.map((o, k) => `<label class="option"><input type="radio" name="opt" value="${k}"><span>${NC.inline(o)}</span></label>`).join('')}
        </fieldset>
        <div class="q-feedback" aria-live="polite"></div>
        <div class="q-actions"><button type="button" class="btn btn-primary" id="qCheck" disabled>${esc(opts.mode === 'exam' ? (i + 1 < questions.length ? NC.t('nextQuestion') : NC.t('finish')) : NC.t('check'))}</button></div>`;
      const stage = main.querySelector('.quiz-stage');
      const btn = stage.querySelector('#qCheck');
      stage.querySelectorAll('input[name=opt]').forEach((r) => r.addEventListener('change', () => { btn.disabled = false; }));
      const first = stage.querySelector('input[name=opt]');
      if (first) first.focus();
      btn.addEventListener('click', () => {
        const chosen = Number((stage.querySelector('input[name=opt]:checked') || {}).value);
        if (Number.isNaN(chosen)) return;
        answers[i] = chosen;
        if (opts.mode === 'exam') { advance(); return; }
        stage.querySelectorAll('input[name=opt]').forEach((r) => { r.disabled = true; });
        const labels = stage.querySelectorAll('.option');
        labels[q.a].classList.add('right');
        if (chosen !== q.a) labels[chosen].classList.add('wrong');
        stage.querySelector('.q-feedback').innerHTML = `<p class="${chosen === q.a ? 'ok' : 'bad'}"><strong>${esc(chosen === q.a ? NC.t('correct') : NC.t('wrong'))}</strong> ${NC.inline(q.e || '')}</p>${refHtml(q.r)}`;
        btn.textContent = i + 1 < questions.length ? NC.t('nextQuestion') : NC.t('finish');
        btn.onclick = null;
        const replacement = btn.cloneNode(true);
        btn.replaceWith(replacement);
        replacement.addEventListener('click', advance);
        replacement.focus();
      });
    }

    function advance() {
      i++;
      if (i < questions.length) renderQuestion(); else finish();
    }

    function finish() {
      const right = answers.filter((a, k) => a === questions[k].a).length;
      const pct = Math.round((right / questions.length) * 100);
      opts.onFinish(pct, answers);
      const mistakes = questions.map((q, k) => ({ q, a: answers[k] })).filter((x) => x.a !== x.q.a);
      const pass = pct >= opts.pass;
      main.querySelector('.quiz-stage').innerHTML = `
        <div class="q-result ${pass ? 'pass' : 'fail'}">
          <div class="q-score">${pct}%</div>
          <p>${esc(NC.t('result'))}: ${right} / ${questions.length}. ${esc(opts.message(pass))}</p>
          <div class="q-actions">${opts.actions(pass)}</div>
        </div>
        ${mistakes.length ? `<section class="mistakes"><h2>${esc(NC.t('reviewMistakes'))}</h2><ol>${mistakes.map(({ q, a }) => `<li>
          <p class="m-q">${NC.inline(q.q)}</p>
          <p class="m-a bad">${esc(NC.t('yourAnswer'))}: ${NC.inline(q.o[a])}</p>
          <p class="m-a ok">${esc(NC.t('rightAnswer'))}: ${NC.inline(q.o[q.a])}</p>
          ${q.e ? `<p class="m-e">${NC.inline(q.e)}</p>` : ''}${refHtml(q.r)}
          ${q.chapter && opts.showChapter ? `<a href="#/chapter/${q.chapter}">${esc(NC.t('chapter'))} ${NC.manifest.chapters[q.chapter].n}</a>` : ''}
        </li>`).join('')}</ol></section>` : ''}`;
      const retry = main.querySelector('[data-retry]');
      if (retry) retry.addEventListener('click', opts.onRetry);
      if (pass && opts.afterPass) opts.afterPass();
    }

    renderQuestion();
  }

  /* ---------- Chapter test ---------- */
  V.quiz = async function (main, id) {
    const meta = NC.manifest.chapters[id];
    if (!meta) return V.notFound(main);
    const res = await NC.loadChapter(id);
    if (!res) return V.notFound(main);
    const c = res.data;
    const questions = NC.shuffle(c.quiz || []).map((q) => prepare(q, id));
    main.innerHTML = `<div class="page quiz">
      <nav class="crumbs"><a href="#/chapter/${id}">${esc(NC.t('chapter'))} ${meta.n}: ${esc(c.title)}</a></nav>
      <header class="page-head"><h1>${esc(NC.t('takeQuiz'))}</h1>
      <p class="lede">${esc(NC.L({ en: `${questions.length} questions. You need ${PASS_CHAPTER}% to certify the chapter.`, bg: `${questions.length} въпроса. За да удостоверите главата, ви трябват ${PASS_CHAPTER}%.` }))}</p></header>
      <div class="quiz-stage"></div>
      <div class="chapter-seal quiz-seal" aria-hidden="true">${NC.seal({ fraction: 1, main: NC.t('certified'), sub: NC.formatDate(new Date().toISOString()), size: 140, seed: meta.n, className: 'stamp' })}</div>
    </div>`;
    if (!questions.length) { main.querySelector('.quiz-stage').innerHTML = `<p class="muted">${esc(NC.t('noResults'))}</p>`; return; }
    let wasCertified = NC.isCertified(id);
    runQuiz(main, questions, {
      mode: 'learn',
      pass: PASS_CHAPTER,
      onFinish(pct) {
        const cur = NC.store.chapter(id);
        NC.store.updateChapter(id, { best: Math.max(cur.best || 0, pct), lastScore: pct });
        NC.app.renderSidebar();
      },
      message(pass) {
        if (!pass) return NC.t('failed');
        return NC.store.chapter(id).read ? NC.t('passed') : NC.t('passedNoRead');
      },
      actions(pass) {
        return `<button type="button" class="btn" data-retry>${esc(NC.t('retry'))}</button>
          <a class="btn${pass ? '' : ' btn-primary'}" href="#/chapter/${id}">${esc(NC.t('backToChapter'))}</a>
          ${pass ? (() => { const ids = NC.chapterOrder(); const nx = ids[ids.indexOf(id) + 1]; return nx ? `<a class="btn btn-primary" href="#/chapter/${nx}">${esc(NC.t('next'))}: ${esc(NC.L(NC.manifest.chapters[nx].title))}</a>` : ''; })() : ''}`;
      },
      afterPass() {
        if (NC.isCertified(id) && !wasCertified) {
          const seal = main.querySelector('.quiz-seal');
          seal.setAttribute('aria-hidden', 'false');
          NC.stampAnimation(seal);
          wasCertified = true;
        }
      },
      onRetry() { V.quiz(main, id); }
    });
  };

  /* ---------- Tests overview and final exam ---------- */
  V.tests = function (main) {
    const exams = NC.store.get('exams') || [];
    main.innerHTML = `<div class="page tests">
      <header class="page-head"><h1>${esc(NC.t('tests'))}</h1></header>
      <section class="exam-box">
        <h2>${esc(NC.t('finalExam'))}</h2>
        <p>${esc(NC.t('finalExamIntro'))}</p>
        <a class="btn btn-primary" href="#/exam">${esc(NC.t('startExam'))}</a>
        ${exams.length ? `<h3>${esc(NC.t('examHistory'))}</h3><ul class="exam-history">${exams.slice(-8).reverse().map((e) => `<li><span>${esc(NC.formatDate(e.at))}</span><strong class="${e.pct >= PASS_EXAM ? 'ok' : 'bad'}">${e.pct}%</strong></li>`).join('')}</ul>` : ''}
      </section>
      <section>
        <h2>${esc(NC.t('chapterTests'))}</h2>
        <ol class="test-list">${NC.chapterOrder().map((id) => {
          const m = NC.manifest.chapters[id];
          const p = NC.store.chapter(id);
          return `<li><a href="#/quiz/${id}"><span class="t-no">${m.n}</span><span class="t-title">${esc(NC.L(m.title))}</span><span class="t-score">${p.best != null ? p.best + '%' : '–'}</span>${NC.isCertified(id) ? `<span class="stamp-mini">${esc(NC.t('certified'))}</span>` : ''}</a></li>`;
        }).join('')}</ol>
      </section>
    </div>`;
  };

  V.exam = async function (main) {
    main.innerHTML = `<div class="page"><p class="muted">${esc(NC.t('loading'))}</p></div>`;
    const chapters = await NC.loadAllChapters(NC.lang);
    const pool = [];
    chapters.forEach((c) => (c.quiz || []).forEach((q) => pool.push(prepare(q, c.id))));
    const questions = NC.shuffle(pool).slice(0, EXAM_SIZE);
    main.innerHTML = `<div class="page quiz">
      <nav class="crumbs"><a href="#/tests">${esc(NC.t('tests'))}</a></nav>
      <header class="page-head"><h1>${esc(NC.t('finalExam'))}</h1><p class="lede">${esc(NC.t('finalExamIntro'))}</p></header>
      <div class="quiz-stage"></div>
    </div>`;
    runQuiz(main, questions, {
      mode: 'exam',
      pass: PASS_EXAM,
      showChapter: true,
      onFinish(pct) {
        const exams = NC.store.get('exams') || [];
        exams.push({ at: new Date().toISOString(), pct });
        NC.store.set('exams', exams);
      },
      message(pass) { return pass ? NC.t('examPassed') : NC.t('examFailed'); },
      actions() { return `<button type="button" class="btn btn-primary" data-retry>${esc(NC.t('retry'))}</button><a class="btn" href="#/tests">${esc(NC.t('tests'))}</a>`; },
      onRetry() { V.exam(main); }
    });
  };

  /* ---------- Flashcards ---------- */
  function today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function cardState(key) { return (NC.store.get('cards') || {})[key] || { box: 0, due: 0 }; }
  function setCard(key, st) { const all = NC.store.get('cards') || {}; all[key] = st; NC.store.set('cards', all); }
  function isDue(key) { return cardState(key).due <= Date.now(); }

  function glossaryCards() {
    return (NC.glossary || []).map((g, i) => ({
      key: `g:${g.bg}`,
      front: NC.lang === 'en' ? `<span lang="bg">${esc(g.bg)}</span>` : esc(g.bg),
      back: `<p class="card-en">${esc(g.en)}</p><p>${NC.inline(NC.L(g.def))}</p>`,
      n: i
    }));
  }

  async function deckCards(deck) {
    if (deck === 'glossary') {
      await NC.loadScript('content/glossary.js');
      return glossaryCards();
    }
    const ids = deck === 'all' || deck === 'due' ? NC.chapterOrder() : [deck];
    const out = [];
    for (const id of ids) {
      const res = await NC.loadChapter(id);
      if (!res) continue;
      (res.data.cards || []).forEach((c, i) => out.push({ key: `${id}:${i}`, front: NC.inline(c[0]), back: NC.markdown(c[1]).html, chapter: id }));
    }
    if (deck === 'due') {
      await NC.loadScript('content/glossary.js').catch(() => {});
      return out.concat(glossaryCards()).filter((c) => isDue(c.key) && cardState(c.key).box > 0);
    }
    return out;
  }

  V.cards = async function (main, deck) {
    if (!deck) return renderDecks(main);
    main.innerHTML = `<div class="page"><p class="muted">${esc(NC.t('loading'))}</p></div>`;
    const cards = await deckCards(deck);
    const title = deck === 'all' ? NC.t('allChapters') : deck === 'due' ? NC.t('dueToday') : deck === 'glossary' ? NC.t('glossaryDeck') : `${NC.manifest.chapters[deck].n}. ${NC.L(NC.manifest.chapters[deck].title)}`;
    // Cards that are due come first; then the rest in box order.
    const queue = cards.slice().sort((a, b) => (isDue(b.key) - isDue(a.key)) || (cardState(a.key).box - cardState(b.key).box));
    let pos = 0;
    main.innerHTML = `<div class="page cards-page">
      <nav class="crumbs"><a href="#/cards">${esc(NC.t('cards'))}</a></nav>
      <header class="page-head"><h1>${esc(title)}</h1><p class="muted">${esc(NC.t('flip'))}</p></header>
      <div class="card-stage"></div>
      <div class="box-row" aria-label="${esc(NC.t('boxes'))}"></div>
      <p class="muted small">${esc(NC.t('boxes'))}</p>
    </div>`;
    const stage = main.querySelector('.card-stage');

    function renderBoxes() {
      const counts = [0, 0, 0, 0, 0, 0];
      cards.forEach((c) => { counts[Math.min(5, cardState(c.key).box)]++; });
      main.querySelector('.box-row').innerHTML = counts.map((n, b) => `<div class="box b${b}"><span class="box-n">${n}</span><span class="box-l">${b === 0 ? NC.L({ en: 'New', bg: 'Нови' }) : esc(NC.t('box')) + ' ' + b}</span></div>`).join('');
    }

    function render() {
      renderBoxes();
      if (!queue.length) { stage.innerHTML = `<p class="empty">${esc(NC.t('deckEmpty'))}</p>`; return; }
      if (pos >= queue.length) {
        stage.innerHTML = `<div class="deck-done"><p>${esc(NC.t('deckDone'))}</p><button type="button" class="btn btn-primary" id="restart">${esc(NC.t('restartDeck'))}</button></div>`;
        stage.querySelector('#restart').addEventListener('click', () => { pos = 0; render(); });
        return;
      }
      const c = queue[pos];
      const st = cardState(c.key);
      stage.innerHTML = `<div class="card-count">${pos + 1} / ${queue.length}${c.chapter && deck !== c.chapter ? ` · ${esc(NC.t('chapter'))} ${NC.manifest.chapters[c.chapter].n}` : ''} · ${st.box ? esc(NC.t('box')) + ' ' + st.box : esc(NC.L({ en: 'New', bg: 'Нова' }))}</div>
        <div class="flashcard" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(NC.t('showAnswer'))}">
          <div class="fc-inner">
            <div class="fc-face fc-front">${c.front}</div>
            <div class="fc-face fc-back" aria-live="polite">${c.back}</div>
          </div>
        </div>
        <div class="card-actions" hidden>
          <button type="button" class="btn" id="again">${esc(NC.t('again'))}</button>
          <button type="button" class="btn btn-primary" id="knew">${esc(NC.t('knewIt'))}</button>
        </div>`;
      const card = stage.querySelector('.flashcard');
      const actions = stage.querySelector('.card-actions');
      const flip = () => {
        card.classList.toggle('flipped');
        const open = card.classList.contains('flipped');
        card.setAttribute('aria-pressed', String(open));
        actions.hidden = !open;
      };
      card.addEventListener('click', flip);
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); flip(); }
      });
      card.focus();
      const grade = (ok) => {
        const box = ok ? Math.min(5, st.box + 1) : 1;
        setCard(c.key, { box, due: today() + BOX_DAYS[box] * 86400000 });
        pos++;
        render();
      };
      stage.querySelector('#again').addEventListener('click', () => grade(false));
      stage.querySelector('#knew').addEventListener('click', () => grade(true));
    }

    const onKey = (ev) => {
      if (!document.body.contains(stage)) { document.removeEventListener('keydown', onKey); return; }
      if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
      const card = stage.querySelector('.flashcard');
      if (!card) return;
      if (ev.key === ' ' && document.activeElement !== card && !/button|a/i.test(document.activeElement.tagName)) { ev.preventDefault(); card.click(); }
      if (card.classList.contains('flipped')) {
        if (ev.key === '1') stage.querySelector('#again').click();
        if (ev.key === '2') stage.querySelector('#knew').click();
      }
    };
    document.addEventListener('keydown', onKey);
    render();
  };

  async function renderDecks(main) {
    const ids = NC.chapterOrder();
    const allKeys = Object.keys(NC.store.get('cards') || {});
    const due = allKeys.filter((k) => isDue(k) && cardState(k).box > 0).length;
    main.innerHTML = `<div class="page decks">
      <header class="page-head"><h1>${esc(NC.t('cards'))}</h1>
      <p class="lede">${esc(NC.L({ en: 'Short questions and answers for every chapter, plus the glossary. Review the cards that are due each day.', bg: 'Кратки въпроси и отговори към всяка глава, както и термините от речника. Преговаряйте картите, които са за днес.' }))}</p></header>
      <ul class="deck-list top">
        <li><a href="#/cards/due"><strong>${esc(NC.t('dueToday'))}</strong><span class="deck-n">${due}</span></a></li>
        <li><a href="#/cards/all"><strong>${esc(NC.t('allChapters'))}</strong></a></li>
        <li><a href="#/cards/glossary"><strong>${esc(NC.t('glossaryDeck'))}</strong></a></li>
      </ul>
      <h2>${esc(NC.t('decks'))}</h2>
      <ol class="deck-list">${ids.map((id) => {
        const m = NC.manifest.chapters[id];
        const known = allKeys.filter((k) => k.startsWith(id + ':') && cardState(k).box >= 3).length;
        return `<li><a href="#/cards/${id}"><span class="t-no">${m.n}</span><span class="t-title">${esc(NC.L(m.title))}</span>${known ? `<span class="deck-n">${known} ✓</span>` : ''}</a></li>`;
      }).join('')}</ol>
    </div>`;
  }
})();

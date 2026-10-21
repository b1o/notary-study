/* Tools: notarial fee calculator and document checklists. */
(function () {
  'use strict';
  const NC = window.NC;
  const esc = NC.esc;
  const V = NC.views;
  const RATE = 1.95583;

  /* ---------- Tariff of notarial fees (amounts in leva, as in the official text) ---------- */
  const Tariff = (NC.tariff = {
    /* Item 8: fee by the certified material interest. */
    item8(bgn) {
      const x = Math.max(0, bgn);
      if (x <= 100) return 30;
      if (x <= 1000) return 30 + 0.015 * (x - 100);
      if (x <= 10000) return 43.5 + 0.013 * (x - 1000);
      if (x <= 50000) return 160.5 + 0.008 * (x - 10000);
      if (x <= 100000) return 480.5 + 0.005 * (x - 50000);
      if (x <= 500000) return 730.5 + 0.002 * (x - 100000);
      return Math.min(6000, 1530.5 + 0.001 * (x - 500000));
    },
    item9(bgn) { return Math.max(30, 0.5 * Tariff.item8(bgn)); },
    item10(bgn) { return Math.max(30, 0.3 * Tariff.item8(bgn)); },
    item12(bgn) { return Math.max(25, 0.5 * Tariff.item10(bgn)); }
  });

  const round2 = (n) => Math.round(n * 100) / 100;
  const toEur = (bgn) => round2(bgn / RATE);
  const toBgn = (eur) => eur * RATE;

  const ACTIONS = [
    { id: 'deed', item: '8', entry: true, mi: 'property', label: { en: 'Notarial deed: sale, gift or exchange of real estate', bg: 'Нотариален акт: продажба, дарение или замяна на имот' } },
    { id: 'mortgage', item: '8', entry: true, mi: 'claim', label: { en: 'Notarial deed for a contractual mortgage', bg: 'Нотариален акт за договорна ипотека' } },
    { id: 'building', item: '8', entry: true, mi: 'building', label: { en: 'Notarial deed for a building right', bg: 'Нотариален акт за учредяване на право на строеж' } },
    { id: 'contract30', item: '10', entry: false, mi: 'price', label: { en: 'Certification of signatures on a contract with a material interest (for example a preliminary contract)', bg: 'Заверка на подписи по договор с материален интерес (например предварителен договор)' } },
    { id: 'contract50', item: '9', entry: true, mi: 'price', label: { en: 'Certification of signatures on a contract that is entered in a register, or of content with a material interest', bg: 'Заверка на подписи по договор, който се вписва, или на съдържание с материален интерес' } },
    { id: 'vehicle', item: '11', entry: false, mi: 'vehicle', label: { en: 'Sale of a motor vehicle (signatures)', bg: 'Продажба на моторно превозно средство (подписи)' } },
    { id: 'circumstantial', item: '11', entry: true, mi: 'assessment', label: { en: 'Circumstantial verification (ownership by prescription)', bg: 'Обстоятелствена проверка (собственост по давност)' } },
    { id: 'will', item: '9', entry: false, mi: 'price', label: { en: 'Notarial will', bg: 'Нотариално завещание' } },
    { id: 'onesided', item: '12', entry: false, mi: 'price', label: { en: 'One-sided statement with a material interest (receipt, consent to delete a mortgage)', bg: 'Едностранно изявление с материален интерес (разписка, съгласие за заличаване на ипотека)' } },
    { id: 'signatures', item: '5', entry: false, mi: 'none', label: { en: 'Certification of signatures without a material interest (power of attorney, declaration)', bg: 'Заверка на подписи без материален интерес (пълномощно, декларация)' } },
    { id: 'copies', item: '6', entry: false, mi: 'none', label: { en: 'Certification of copies', bg: 'Заверка на преписи' } }
  ];

  const EXTRA = [
    { v: 0, label: { en: 'In the office, in working hours', bg: 'В кантората, в работно време' } },
    { v: 0.25, label: { en: 'Outside the office in working hours, or in the office out of hours (+25%)', bg: 'Извън кантората в работно време или в кантората в неработно време (+25%)' } },
    { v: 0.5, label: { en: 'Outside the office out of hours, or outside the town (+50%)', bg: 'Извън кантората в неработно време или извън населеното място (+50%)' } },
    { v: 1, label: { en: 'Outside the office, out of hours and outside the town (double)', bg: 'Извън кантората, в неработно време и извън населеното място (двоен размер)' } }
  ];

  V.fees = function (main) {
    main.innerHTML = `<div class="page fees">
      <header class="page-head">
        <h1>${esc(NC.t('feeCalc'))}</h1>
        <p class="lede">${esc(NC.L({
          en: 'Estimate the notarial fee, the entry fee of the Registry Agency and the local acquisition tax. The result has the form of a notary\'s bill (сметка) with the provision behind each line.',
          bg: 'Пресметнете нотариалната такса, таксата за вписване и местния данък при придобиване. Резултатът е във вид на сметка по чл. 89 ЗННД с разпоредбата зад всеки ред.'
        }))}</p>
        <p class="note euro">${esc(NC.t('euroNote'))}</p>
      </header>
      <div class="calc">
        <form class="calc-form" id="calcForm">
          <label class="field"><span>${esc(NC.L({ en: 'Notarial action', bg: 'Нотариално действие' }))}</span>
            <select id="action">${ACTIONS.map((a) => `<option value="${a.id}">${esc(NC.L(a.label))}</option>`).join('')}</select></label>
          <div id="miFields"></div>
          <label class="field"><span>${esc(NC.L({ en: 'Place and time', bg: 'Място и време' }))}</span>
            <select id="extra">${EXTRA.map((e) => `<option value="${e.v}">${esc(NC.L(e.label))}</option>`).join('')}</select></label>
          <label class="check"><input type="checkbox" id="vat" checked> ${esc(NC.L({ en: 'The notary is registered for VAT (20% on the notarial fee)', bg: 'Нотариусът е регистриран по ЗДДС (20% върху нотариалната такса)' }))}</label>
          <label class="check" id="entryWrap"><input type="checkbox" id="entry" checked> ${esc(NC.L({ en: 'Add the entry fee of the Registry Agency (0.1%, minimum 10 лв. = 5.11 €)', bg: 'Добави таксата за вписване в Агенцията по вписванията (0,1%, минимум 10 лв. = 5,11 €)' }))}</label>
          <fieldset class="tax" id="taxWrap">
            <legend>${esc(NC.L({ en: 'Local tax on acquisition (Art. 44–49 ЗМДТ)', bg: 'Местен данък при придобиване (чл. 44–49 ЗМДТ)' }))}</legend>
            <label class="field"><span>${esc(NC.L({ en: 'Type of acquisition', bg: 'Вид придобиване' }))}</span>
              <select id="taxKind">
                <option value="sale">${esc(NC.L({ en: 'Purchase or exchange: 0.1–3% set by the municipal council', bg: 'Покупка или замяна: 0,1–3% по решение на общинския съвет' }))}</option>
                <option value="giftFree">${esc(NC.L({ en: 'Gift between relatives in the direct line or spouses: exempt', bg: 'Дарение между роднини по права линия или съпрузи: освободено' }))}</option>
                <option value="giftSib">${esc(NC.L({ en: 'Gift between siblings and their children: 0.4–0.8%', bg: 'Дарение между братя и сестри и техните деца: 0,4–0,8%' }))}</option>
                <option value="giftOther">${esc(NC.L({ en: 'Gift to other persons: 3.3–6.6%', bg: 'Дарение на други лица: 3,3–6,6%' }))}</option>
                <option value="prescription">${esc(NC.L({ en: 'Prescription: the rate in the ordinance of the municipality (Art. 44(3) ЗМДТ)', bg: 'Давност: ставката по наредбата на общината (чл. 44, ал. 3 ЗМДТ)' }))}</option>
                <option value="none">${esc(NC.L({ en: 'Do not calculate the tax', bg: 'Без данък' }))}</option>
              </select></label>
            <label class="field"><span>${esc(NC.L({ en: 'Rate of the municipality, %', bg: 'Ставка на общината, %' }))}</span>
              <input type="number" id="taxRate" step="0.05" min="0" max="6.6" value="3"></label>
          </fieldset>
        </form>
        <section class="bill" aria-live="polite" id="bill"></section>
      </div>
      <section class="prose calc-notes">${NC.markdown(NC.L({
        en: `## How the calculator works
- The official tariff states amounts in leva. The calculator converts the material interest into leva at 1.95583, applies the tariff, and converts the result back into euro. Offices can show differences of a few cents.
- For real estate, the material interest is the higher of the agreed price and the tax assessment ([[znnd:96:3]], [[zmdt:46:2]]).
- For a vehicle, the material interest is the value for which the vehicle is insured ([[znnd:97:1]]), or the agreed price if it is higher ([[znnd:97:3]]).
- The additional fee for work outside the office follows item 23 of the tariff ([[tarifa:23]]). [[znnd:95:2]] states a total of one half of the fee. Ask the notary which rule the office applies.
- The tax is paid to the municipality where the property is ([[zmdt:49]]). Each municipality fixes its own rate in its ordinance. Check the rate before you quote a total to a client.`,
        bg: `## Как работи калкулаторът
- Тарифата посочва сумите в левове. Калкулаторът превръща материалния интерес в левове по курс 1,95583, прилага тарифата и превръща резултата обратно в евро. Възможни са разлики от няколко цента.
- При имоти материалният интерес е по-високото от уговорената цена и данъчната оценка ([[znnd:96:3]], [[zmdt:46:2]]).
- При превозно средство материалният интерес е стойността, по която то е застраховано ([[znnd:97:1]]), или уговорената цена, ако е по-висока ([[znnd:97:3]]).
- Допълнителната такса за действия извън кантората следва т. 23 от тарифата ([[tarifa:23]]). [[znnd:95:2]] посочва общо половината от таксата. Попитайте нотариуса кое правило прилага кантората.
- Данъкът се плаща в общината по местонахождението на имота ([[zmdt:49]]). Всяка община определя своя ставка с наредба. Проверете ставката, преди да съобщите сума на клиента.`
      })).html}</section>
    </div>`;

    const $ = (s) => main.querySelector(s);
    const miFields = $('#miFields');

    function renderMiFields() {
      const a = ACTIONS.find((x) => x.id === $('#action').value);
      const num = (id, label, value) => `<label class="field"><span>${esc(NC.L(label))}</span><input type="number" id="${id}" min="0" step="0.01" value="${value}"></label>`;
      let html = '';
      if (a.mi === 'property' || a.mi === 'building') {
        html += num('price', { en: 'Agreed price, €', bg: 'Уговорена цена, €' }, 150000);
        html += num('assess', { en: 'Tax assessment (данъчна оценка), €', bg: 'Данъчна оценка, €' }, 60000);
        if (a.mi === 'building') html += `<p class="hint">${esc(NC.L({ en: 'For a building right the material interest is 90% of the market price of the land (Art. 96(2) ЗННД). Enter the land value.', bg: 'При право на строеж материалният интерес е 90% от пазарната цена на мястото (чл. 96, ал. 2 ЗННД). Въведете стойността на мястото.' }))}</p>`;
      } else if (a.mi === 'claim') {
        html += num('price', { en: 'Secured amount (loan), €', bg: 'Обезпечена сума (кредит), €' }, 100000);
      } else if (a.mi === 'vehicle') {
        html += num('price', { en: 'Insured value of the vehicle, €', bg: 'Застрахователна стойност на автомобила, €' }, 8000);
        html += num('agreed', { en: 'Agreed price, €', bg: 'Уговорена цена, €' }, 8000);
        html += `<p class="hint">${esc(NC.L({ en: 'The fee uses the insured value, or the agreed price if it is higher (Art. 97(1) and (3) ЗННД). The local tax uses the insured value (Art. 46(2) and 33(1) ЗМДТ).', bg: 'Таксата се изчислява върху застрахователната стойност или върху уговорената цена, ако е по-висока (чл. 97, ал. 1 и 3 ЗННД). Местният данък се изчислява върху застрахователната стойност (чл. 46, ал. 2 и чл. 33, ал. 1 ЗМДТ).' }))}</p>`;
      } else if (a.mi === 'assessment') {
        html += num('price', { en: 'Market value of the property, €', bg: 'Пазарна стойност на имота, €' }, 20000);
      } else if (a.mi === 'price') {
        html += num('price', { en: 'Material interest (price or amount), €', bg: 'Материален интерес (цена или сума), €' }, 50000);
      } else if (a.id === 'signatures') {
        html += num('count', { en: 'Number of signatures', bg: 'Брой подписи' }, 1);
        html += `<label class="check"><input type="checkbox" id="property"> ${esc(NC.L({ en: 'The document serves for rights over real estate (10 лв. per signature)', bg: 'Документът е за права върху имот (10 лв. на подпис)' }))}</label>`;
        html += `<label class="check"><input type="checkbox" id="redelegation"> ${esc(NC.L({ en: 'Re-delegation of a power of attorney (double fee)', bg: 'Преупълномощаване (двойна такса)' }))}</label>`;
      } else if (a.id === 'copies') {
        html += num('pages', { en: 'Number of pages', bg: 'Брой страници' }, 1);
        html += num('count', { en: 'Number of copies', bg: 'Брой преписи' }, 1);
      }
      miFields.innerHTML = html;
      $('#entryWrap').hidden = !a.entry;
      $('#taxWrap').hidden = !(a.mi === 'property' || a.mi === 'building' || a.id === 'vehicle' || a.id === 'circumstantial');
      // Acquisition by prescription has its own tax rule; the other actions never use it.
      const kind = $('#taxKind');
      if (a.id === 'circumstantial') kind.value = 'prescription';
      else if (kind.value === 'prescription') { kind.value = 'sale'; $('#taxRate').value = 3; }
      miFields.querySelectorAll('input').forEach((i) => i.addEventListener('input', compute));
      compute();
    }

    function compute() {
      const a = ACTIONS.find((x) => x.id === $('#action').value);
      const val = (id) => { const el = $('#' + id); return el ? Math.max(0, Number(el.value) || 0) : 0; };
      const lines = [];
      let miEur = 0;
      let baseBgn = 0;
      let item = a.item;
      if (a.mi === 'property') miEur = Math.max(val('price'), val('assess'));
      else if (a.mi === 'building') miEur = 0.9 * Math.max(val('price'), val('assess'));
      else if (a.mi === 'vehicle') miEur = Math.max(val('price'), val('agreed'));
      else if (a.mi !== 'none') miEur = val('price');
      const miBgn = toBgn(miEur);

      if (a.item === '8' || a.item === '11') baseBgn = Tariff.item8(miBgn);
      else if (a.item === '9') baseBgn = Tariff.item9(miBgn);
      else if (a.item === '10') baseBgn = Tariff.item10(miBgn);
      else if (a.item === '12') baseBgn = Tariff.item12(miBgn);
      else if (a.item === '5') {
        const n = Math.max(1, Math.round(val('count')));
        const prop = $('#property') && $('#property').checked;
        const redel = $('#redelegation') && $('#redelegation').checked;
        baseBgn = prop ? 10 * n : 5 + 2 * (n - 1);
        if (redel) baseBgn = prop ? 20 * n : 10 + 2 * (n - 1);
        item = prop ? (redel ? '5, б. „д“' : '5, б. „г“') : (redel ? '5, б. „б“' : '5, б. „а“ и „в“');
      } else if (a.item === '6') {
        const pages = Math.max(1, Math.round(val('pages')));
        const copies = Math.max(1, Math.round(val('count')));
        baseBgn = copies * (3 + 2 * (pages - 1));
      }
      const feeEur = toEur(baseBgn);
      lines.push({ label: NC.L({ en: 'Notarial fee', bg: 'Нотариална такса' }), ref: `[[tarifa:${String(item).split(',')[0]}]]`, eur: feeEur, bgn: baseBgn });

      const extra = Number($('#extra').value);
      if (extra) {
        lines.push({ label: NC.L({ en: 'Additional fee', bg: 'Допълнителна такса' }), ref: '[[tarifa:23]]', eur: toEur(baseBgn * extra), bgn: baseBgn * extra });
      }
      const notaryEur = round2(lines.reduce((s, l) => s + l.eur, 0));
      if ($('#vat').checked) {
        lines.push({ label: NC.L({ en: 'VAT 20% on the notarial fee', bg: 'ДДС 20% върху нотариалната такса' }), ref: '', eur: round2(notaryEur * 0.2), bgn: null });
      }
      if (a.entry && $('#entry').checked) {
        const entryBgn = Math.max(10, 0.001 * miBgn);
        lines.push({ label: NC.L({ en: 'Entry fee, Registry Agency (no VAT)', bg: 'Такса за вписване, Агенция по вписванията (без ДДС)' }), ref: NC.L({ en: 'Art. 2, Tariff of the Registry Agency', bg: 'чл. 2 от Тарифата за таксите на АВп' }), eur: toEur(entryBgn), bgn: entryBgn, plainRef: true });
      }
      const taxKind = $('#taxKind').value;
      const showTax = !$('#taxWrap').hidden && taxKind !== 'none';
      if (showTax) {
        const limits = { sale: [0.1, 3], giftFree: [0, 0], giftSib: [0.4, 0.8], giftOther: [3.3, 6.6], prescription: [0, 6.6] }[taxKind];
        let rate = Number($('#taxRate').value) || 0;
        const clamped = Math.min(limits[1], Math.max(limits[0], rate));
        if (clamped !== rate) { rate = clamped; $('#taxRate').value = rate; }
        const base = a.mi === 'property' || a.mi === 'building' ? Math.max(val('price'), val('assess')) : a.mi === 'vehicle' ? val('price') : miEur;
        const taxRef = taxKind === 'prescription' ? '[[zmdt:44:3]]' : taxKind.startsWith('gift') ? '[[zmdt:47:1]]' : '[[zmdt:47:2]]';
        lines.push({ label: NC.L({ en: `Local tax on acquisition, ${rate}%`, bg: `Местен данък при придобиване, ${rate}%` }), ref: taxRef, eur: round2(base * rate / 100), bgn: null });
      }
      const total = round2(lines.reduce((s, l) => s + l.eur, 0));
      $('#bill').innerHTML = `<div class="bill-paper">
        <div class="bill-title">${esc(NC.L({ en: 'Bill (estimate)', bg: 'Сметка (ориентировъчна)' }))}</div>
        <div class="bill-sub">${esc(NC.L(a.label))}</div>
        ${a.mi !== 'none' ? `<div class="bill-mi">${esc(NC.L({ en: 'Material interest', bg: 'Материален интерес' }))}: <strong>${NC.money(miEur)}</strong> <span class="muted">(${NC.money(miBgn, 'BGN')})</span></div>` : ''}
        <table class="bill-lines"><tbody>
          ${lines.map((l) => `<tr><td>${esc(l.label)}<div class="bill-ref">${l.plainRef ? esc(l.ref) : NC.inline(l.ref)}</div></td><td class="num">${NC.money(l.eur)}${l.bgn != null ? `<div class="muted small">${NC.money(l.bgn, 'BGN')}</div>` : ''}</td></tr>`).join('')}
        </tbody><tfoot><tr><th>${esc(NC.L({ en: 'Total', bg: 'Общо' }))}</th><td class="num"><strong>${NC.money(total)}</strong></td></tr></tfoot></table>
        <p class="muted small">${NC.inline(NC.L({ en: 'Who pays: for a sale of real estate the parties pay the costs of the contract equally, unless they agree otherwise; for other sales the buyer pays ([[zzd:186]]). The acquirer pays the local tax unless agreed otherwise ([[zmdt:45]]).', bg: 'Кой плаща: при продажба на имот разноските по договора се поемат от страните по равно, освен ако е уговорено друго; при другите продажби плаща купувачът ([[zzd:186]]). Местният данък се плаща от приобретателя, освен ако е уговорено друго ([[zmdt:45]]).' }))}</p>
      </div>`;
    }

    $('#action').addEventListener('change', renderMiFields);
    ['#extra', '#vat', '#entry', '#taxKind', '#taxRate'].forEach((s) => $(s).addEventListener('input', compute));
    $('#taxKind').addEventListener('change', () => {
      const d = { sale: 3, giftFree: 0, giftSib: 0.6, giftOther: 5 }[$('#taxKind').value];
      if (d != null) $('#taxRate').value = d;
      compute();
    });
    renderMiFields();
  };

  /* ---------- Document checklists ---------- */
  V.checklists = async function (main, id) {
    main.innerHTML = `<div class="page"><p class="muted">${esc(NC.t('loading'))}</p></div>`;
    await NC.loadScript('content/checklists.js');
    const lists = NC.checklists || [];
    if (!id) {
      main.innerHTML = `<div class="page">
        <header class="page-head"><h1>${esc(NC.t('checklists'))}</h1>
        <p class="lede">${esc(NC.L({ en: 'What to ask the client for, and what the office checks itself, for each common transaction. Tick the items as you go. The ticks stay in this browser.', bg: 'Какво да поискате от клиента и какво проверява кантората сама при всяка честа сделка. Отмятайте точките в движение. Отметките остават в този браузър.' }))}</p></header>
        <ul class="tpl-list">${lists.map((l) => `<li><a href="#/tools/checklists/${l.id}"><strong>${esc(NC.L(l.title))}</strong><span>${esc(NC.L(l.when))}</span></a></li>`).join('')}</ul>
      </div>`;
      return;
    }
    const l = lists.find((x) => x.id === id);
    if (!l) return V.notFound(main);
    const key = `nc.check.${id}`;
    let ticks = {};
    try { ticks = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { ticks = {}; }
    main.innerHTML = `<div class="page checklist">
      <nav class="crumbs"><a href="#/tools/checklists">${esc(NC.t('checklists'))}</a></nav>
      <header class="page-head"><h1>${esc(NC.L(l.title))}</h1><p class="lede">${esc(NC.L(l.when))}</p>
      <div class="tpl-actions"><button type="button" class="btn btn-quiet" id="clearTicks">${esc(NC.L({ en: 'Clear the ticks', bg: 'Изчисти отметките' }))}</button><button type="button" class="btn btn-quiet" onclick="window.print()">${esc(NC.t('print'))}</button></div></header>
      ${l.sections.map((s, si) => `<section class="check-section"><h2>${esc(NC.L(s.title))}</h2><ul class="check-list">${s.items.map((it, ii) => {
        const k = `${si}.${ii}`;
        return `<li><label><input type="checkbox" data-k="${k}"${ticks[k] ? ' checked' : ''}><span>${NC.inline(NC.L(it))}</span></label></li>`;
      }).join('')}</ul></section>`).join('')}
      ${l.chapter ? `<p><a class="btn" href="#/chapter/${l.chapter}">${esc(NC.t('chapter'))} ${NC.manifest.chapters[l.chapter].n}: ${esc(NC.L(NC.manifest.chapters[l.chapter].title))}</a></p>` : ''}
    </div>`;
    main.querySelectorAll('input[data-k]').forEach((c) => c.addEventListener('change', () => {
      ticks[c.dataset.k] = c.checked;
      try { localStorage.setItem(key, JSON.stringify(ticks)); } catch (e) { /* ignore */ }
    }));
    main.querySelector('#clearTicks').addEventListener('click', () => {
      ticks = {};
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
      main.querySelectorAll('input[data-k]').forEach((c) => { c.checked = false; });
    });
  };
})();

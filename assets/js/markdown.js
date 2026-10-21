/* A small Markdown renderer for the course texts.
 *
 * Blocks: ## headings, paragraphs, - and 1. lists (nested by two spaces), | tables |,
 * > [!type] Title callouts ([!solution] renders closed), ``` fenced documents, --- rules.
 * Inline: **bold**, *italic*, `code`, [text](link), [[law:article:paragraph:point|label]] law citations,
 * {{термин}} Bulgarian terms.
 */
(function () {
  'use strict';
  const NC = window.NC;
  const esc = NC.esc;

  const CALLOUTS = {
    law: { en: 'The law says', bg: 'Законът казва' },
    tip: { en: 'Practice tip', bg: 'Съвет от практиката' },
    warn: { en: 'Watch out', bg: 'Внимание' },
    example: { en: 'Example', bg: 'Пример' },
    note: { en: 'Note', bg: 'Бележка' },
    task: { en: 'Try it', bg: 'Упражнение' },
    reform: { en: 'Pending reform', bg: 'Предстоящи промени' },
    solution: { en: 'Model solution', bg: 'Примерно решение' }
  };

  /* Stable id for a heading. The search index uses the same function, so links to sections match. */
  function slug(text, used) {
    let base = NC.norm(NC.plain(text)).replace(/[^a-z0-9а-я]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'section';
    let s = base;
    let i = 2;
    while (used.has(s)) s = `${base}-${i++}`;
    used.add(s);
    return s;
  }

  function citation(spec) {
    const [ref, label] = spec.split('|');
    const parts = ref.split(':');
    const law = parts[0];
    const art = parts[1] || '';
    const para = parts[2] || '';
    const point = parts[3] || '';
    const text = label || (window.NotaryLaws ? window.NotaryLaws.label(law, art, para, point) : ref);
    const href = `#/law/${encodeURIComponent(law)}${art ? '/' + encodeURIComponent(art) : ''}`;
    return `<a class="cite" href="${href}" data-law="${esc(law)}" data-art="${esc(art)}" data-para="${esc(para)}">${esc(text)}</a>`;
  }

  function inline(src) {
    const slots = [];
    const keep = (html) => `\u0000${slots.push(html) - 1}\u0000`;
    let s = String(src);
    s = s.replace(/`([^`]+)`/g, (_, c) => keep(`<code>${esc(c)}</code>`));
    s = s.replace(/\[\[([^\]]+)\]\]/g, (_, c) => keep(citation(c)));
    s = s.replace(/\{\{([^}]+)\}\}/g, (_, c) => keep(`<span class="term" lang="bg">${esc(c)}</span>`));
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
      const external = /^https?:/i.test(href);
      return keep(`<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${inline(text)}</a>`);
    });
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[\s(„"])\*([^*\s][^*]*?)\*(?=[\s).,;:!?“"]|$)/g, '$1<em>$2</em>');
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => slots[Number(i)]);
    return s;
  }

  function parseList(lines, start, indent) {
    const ordered = /^\s*\d+\.\s/.test(lines[start]);
    const tag = ordered ? 'ol' : 'ul';
    // A list that continues after a table or a paragraph keeps its first number.
    const first = ordered ? Number(lines[start].match(/^\s*(\d+)\./)[1]) : 1;
    let html = first > 1 ? `<ol start="${first}">` : `<${tag}>`;
    let i = start;
    while (i < lines.length) {
      const line = lines[i];
      const m = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (!m) {
        // Continuation line of the current item.
        if (line.trim() && line.match(/^\s+/) && line.match(/^\s*/)[0].length > indent) {
          html = html.replace(/<\/li>$/, ` ${inline(line.trim())}</li>`);
          i++;
          continue;
        }
        break;
      }
      const ind = m[1].length;
      if (ind < indent) break;
      if (ind > indent) {
        const sub = parseList(lines, i, ind);
        html = html.replace(/<\/li>$/, `${sub.html}</li>`);
        i = sub.next;
        continue;
      }
      if (/^\d+\./.test(m[2]) !== ordered) break;
      html += `<li>${inline(m[3])}</li>`;
      i++;
    }
    html += `</${tag}>`;
    return { html, next: i };
  }

  function parseTable(rows) {
    const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells);
    let html = '<div class="table-wrap"><table><thead><tr>';
    head.forEach((c) => { html += `<th>${inline(c)}</th>`; });
    html += '</tr></thead><tbody>';
    body.forEach((r) => {
      html += '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>';
    });
    return html + '</tbody></table></div>';
  }

  /* Render Markdown to HTML. Returns { html, toc }. */
  NC.markdown = function (src) {
    const lines = String(src || '').replace(/\r/g, '').split('\n');
    const out = [];
    const toc = [];
    const used = new Set();
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }

      const fence = line.match(/^```(\w*)\s*(.*)$/);
      if (fence) {
        const buf = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
        i++;
        const title = fence[2] ? `<div class="doc-title">${inline(fence[2])}</div>` : '';
        out.push(`<figure class="doc-block">${title}<pre class="doc" lang="bg">${esc(buf.join('\n'))}</pre></figure>`);
        continue;
      }

      const hm = line.match(/^(#{2,4})\s+(.*)$/);
      if (hm) {
        const level = hm[1].length;
        const text = hm[2].trim();
        const id = slug(text, used);
        if (level <= 3) toc.push({ level, id, text: text.replace(/\[\[[^\]]+\]\]|\{\{|\}\}|\*\*/g, '').trim() });
        out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
        i++;
        continue;
      }

      if (/^---\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

      if (/^>/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
        const head = buf[0].match(/^\[!(\w+)\]\s*(.*)$/);
        if (head) {
          const type = head[1].toLowerCase();
          const label = CALLOUTS[type] ? NC.L(CALLOUTS[type]) : type;
          const title = head[2] ? inline(head[2]) : esc(label);
          const inner = NC.markdown(buf.slice(1).join('\n')).html;
          if (type === 'solution') {
            // Closed until the learner opens it, so the case can be worked first.
            out.push(`<details class="callout callout-solution"><summary class="callout-title">${title}</summary>${inner}</details>`);
          } else {
            out.push(`<aside class="callout callout-${esc(type)}"><div class="callout-title">${title}</div>${inner}</aside>`);
          }
        } else {
          out.push(`<blockquote>${NC.markdown(buf.join('\n')).html}</blockquote>`);
        }
        continue;
      }

      if (/^\|/.test(line) && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1])) {
        const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
        out.push(parseTable(rows));
        continue;
      }

      if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
        const res = parseList(lines, i, line.match(/^\s*/)[0].length);
        out.push(res.html);
        i = res.next;
        continue;
      }

      const buf = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,4}\s|>|```|\|)/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i]) && !/^---\s*$/.test(lines[i])) {
        buf.push(lines[i++].trim());
      }
      out.push(`<p>${inline(buf.join(' '))}</p>`);
    }
    return { html: out.join('\n'), toc };
  };

  NC.inline = inline;
  NC.slug = slug;

  /* Plain text of a Markdown source, for search indexes. */
  NC.plain = function (src) {
    return String(src || '')
      .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, ref, label) => label || (window.NotaryLaws ? window.NotaryLaws.label(...ref.split(':')) : ref))
      .replace(/\{\{([^}]+)\}\}/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*`#>|]/g, ' ')
      .replace(/\[!\w+\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };
})();

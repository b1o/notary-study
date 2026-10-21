"""Import Bulgarian legal acts from lex.bg into the course Law Library.

The script downloads each act in tools/laws.config.json, splits it into
headings, articles (чл.) and provisions (§), and writes one JSON file per act
to public/data/laws/acts/<id>.json plus the catalog public/data/laws/catalog.json.
Hand-made acts (the fee tariff) come from tools/manual/<id>.json.

An act with "include" is a partial import: only the listed articles ("25", "7-8", "24а-24б") and
the listed provisions of the act's own final blocks ("§5") are kept. The final blocks of
amending acts ("... КЪМ ЗАКОНА ЗА ИЗМЕНЕНИЕ ...") are never kept. A full import keeps all
articles and provisions of the act, and keeps an annex ("Приложение") as a note under its own heading.

Usage (from the project root):
    python tools/import_laws.py            # import all acts
    python tools/import_laws.py znnd zzd   # import only these acts
    python tools/import_laws.py --cache DIR  # reuse/save the raw HTML in DIR

Only the Python standard library is used. Legislative texts are not subject to
copyright in Bulgaria (Art. 4, item 1 of the Copyright and Related Rights Act).
Always compare with the official text in the State Gazette (Държавен вестник).
"""
import datetime
import html
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, "tools", "laws.config.json")
DATA_DIR = os.path.join(ROOT, "public", "data", "laws", "acts")
CATALOG = os.path.join(ROOT, "public", "data", "laws", "catalog.json")
MANUAL_DIR = os.path.join(ROOT, "tools", "manual")

BLOCK_RE = re.compile(
    r'<div xmlns="" class="(Heading|Section|Article|AdditionalEdicts|'
    r'TransitionalFinalEdicts|FinalEdicts|FinalEdictsArticle)"[^>]*>'
)
ARTICLE_NO_RE = re.compile(r"^Чл\.\s*(\d+)\s*([а-я]?)\s*\.")
# A few old acts on lex.bg (for example the Persons and Family Act) number articles as "1." without "Чл.".
BARE_ARTICLE_NO_RE = re.compile(r"^(\d+)\s*([а-я]?)\.\s")
PARAGRAPH_NO_RE = re.compile(r"^§\s*(\d+)\s*([а-я]?)\s*\.")

# Numbering styles of headings, for acts whose headings lex.bg marks all alike (see outline_levels).
HEADING_STYLES = [
    ("part", re.compile(r"^(?:(?:ОБЩА|ОСОБЕНА)\s+ЧАСТ|(?:ЧАСТ|Част|ДЯЛ|Дял)\s)")),
    ("chapter", re.compile(r"^(?:ГЛАВА|Глава)\s")),
    ("section", re.compile(r"^(?:РАЗДЕЛ|Раздел)\s")),
    ("roman", re.compile(r"^[IVXLCІХ]+\.")),  # Latin letters, or the Cyrillic І and Х that some acts use
    ("arabic", re.compile(r"^\d+\.\s")),
    ("letter-paren", re.compile(r"^[А-Я]\)\s")),
    ("letter-dot", re.compile(r"^[А-Я]\.\s")),
]
# The closing parts of an act, which always return to the top level.
FINAL_HEADING_RE = re.compile(
    r"^(?:(?:преходн|заключителн|допълнителн)[аи](?:\s+и\s+(?:преходн|заключителн)[аи])?\s+"
    r"(?:разпоредб[аи]|правила)|изменени[ея]\s+на\s+други\s+закони)",
    re.I,
)
AMENDMENT_RE = re.compile(r"\((?:нов|изм|доп|отм|предиш|попр|загл|обн)[^()]*(?:\([^()]*\)[^()]*)*\)", re.I)
# A closing tag that lost its "<", with the dot before it: "Чл. 574./span>." becomes "Чл. 574.".
STRAY_TAG_RE = re.compile(r"\.?/span>")
# Deepest heading level that the app shows (h2 to h5).
MAX_HEADING_LEVEL = 4


def fetch(lex_id, cache_dir):
    if cache_dir:
        path = os.path.join(cache_dir, f"{lex_id}.html")
        if os.path.exists(path):
            return open(path, "rb").read()
    url = f"https://lex.bg/laws/ldoc/{lex_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    raw = urllib.request.urlopen(req, timeout=120).read()
    if cache_dir:
        open(os.path.join(cache_dir, f"{lex_id}.html"), "wb").write(raw)
    return raw


def decode(raw):
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1251")


def clean_text(fragment):
    """Turn an HTML fragment into a list of plain-text lines.

    lex.bg sometimes leaves a closing tag without its "<" after an article number:

    >>> clean_text('<p>Чл. 574./span>. Не могат</p>')
    ['Чл. 574. Не могат']
    """
    s = re.sub(r"(?is)<(script|style|ins)[^>]*>.*?</\1>", " ", fragment)
    s = re.sub(r"(?i)</t[dh]>", " | ", s)
    s = re.sub(r"(?i)<(br|/?div|/?p|/?tr|/?table)[^>]*>", "\n", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = STRAY_TAG_RE.sub("", s)
    s = html.unescape(s).replace(" ", " ")
    lines = []
    for line in s.split("\n"):
        line = re.sub(r"[ \t]+", " ", line).strip().strip("|").strip()
        if line:
            lines.append(line)
    return lines


def title_of(block):
    m = re.search(r'<p class="Title">(.*?)</p>', block, re.S)
    if not m:
        return ""
    return " ".join(clean_text(m.group(1)))


def body_of(block):
    block = re.sub(r"(?s)<!--.*?-->", "", block)
    block = re.sub(r"(?s)<p class=\"?buttons\"?>.*?</p>", "", block)
    block = re.sub(r'(?s)<p class="Title">.*?</p>', "", block, count=1)
    end = re.search(r"</div>\s*<br>\s*</div>", block)
    if end:
        block = block[: end.start() + len("</div>")]
    return clean_text(block)


def number_key(num):
    m = re.match(r"(\d+)([а-я]?)$", num)
    return (int(m.group(1)), m.group(2))


def parse_ranges(specs):
    ranges = []
    for spec in specs:
        if spec.startswith("§"):
            continue  # a provision of the final blocks, see included_provisions
        lo, _, hi = spec.partition("-")
        hi = hi or lo
        lo_key = number_key(lo)
        hi_key = number_key(hi)
        if not hi_key[1]:
            hi_key = (hi_key[0], "я")
        ranges.append((lo_key, hi_key))
    return ranges


def included(num, ranges):
    if ranges is None:
        return True
    key = number_key(num)
    return any(lo <= key <= hi for lo, hi in ranges)


def included_provisions(specs):
    """The provisions of the final blocks that a partial import keeps, for example {"§5"}.

    >>> sorted(included_provisions(["1", "7-8", "§5", "§ 1а"]))
    ['§1а', '§5']
    """
    return {spec.replace(" ", "") for spec in specs if spec.startswith("§")}


def parse_law(text, ranges, bare_numbers=False, provisions=frozenset()):
    # The act ends where the right-hand column of the page (ads, news) begins. Without this cut
    # the last block of the act runs to the end of the page and takes in the news headlines.
    end = text.find('<div id="colright"')
    if end != -1:
        text = text[:end]
    items = []
    pending_headings = []
    in_skipped_final_block = False
    # Final blocks of an amending act ("... КЪМ ЗАКОНА ЗА ИЗМЕНЕНИЕ ...") are never kept.
    in_amending_block = False
    # In a partial import, the heading of a final block waits for the first provision it keeps.
    pending_final_heading = None
    starts = [m for m in BLOCK_RE.finditer(text)]
    for i, m in enumerate(starts):
        kind = m.group(1)
        stop = starts[i + 1].start() if i + 1 < len(starts) else len(text)
        block = text[m.start():stop]
        if kind == "Heading" and title_of(block).upper().startswith("КЪМ "):
            # lex.bg sometimes opens the provisions of an amending act with a plain heading.
            in_skipped_final_block = in_amending_block = True
            pending_final_heading = None
            continue
        if kind in ("Heading", "Section"):
            heading = {"k": "h" if kind == "Heading" else "s", "t": title_of(block)}
            if ranges is None:
                items.append(heading)
            else:
                if kind == "Heading":
                    pending_headings = [heading]
                else:
                    pending_headings = [h for h in pending_headings if h["k"] == "h"] + [heading]
            continue
        if kind in ("AdditionalEdicts", "TransitionalFinalEdicts", "FinalEdicts"):
            heading_text = title_of(block)
            in_amending_block = " към " in f" {heading_text.lower()} "
            in_skipped_final_block = ranges is not None or in_amending_block
            pending_final_heading = None
            if not in_skipped_final_block:
                items.append({"k": "h", "t": heading_text})
            elif not in_amending_block:
                pending_final_heading = {"k": "h", "t": heading_text}
            continue
        lines = body_of(block)
        if not lines:
            continue
        if kind == "FinalEdictsArticle":
            pm = PARAGRAPH_NO_RE.match(lines[0])
            num = "§" + (pm.group(1) + pm.group(2) if pm else str(len(items)))
            if in_skipped_final_block:
                if in_amending_block or num not in provisions:
                    continue
                if pending_final_heading:
                    items.append(pending_final_heading)
                    pending_final_heading = None
            items.append({"k": "p", "n": num, "p": lines})
            continue
        am = ARTICLE_NO_RE.match(lines[0])
        if not am and bare_numbers:
            am = BARE_ARTICLE_NO_RE.match(lines[0])
            if am:
                lines[0] = "Чл. " + lines[0]
        if not am:
            # Annex text or an unnumbered element: keep it only in full imports.
            if ranges is None:
                if lines[0].startswith("Приложение"):
                    # An annex ("Приложение към чл. 3, ал. 2") ends the final blocks and gets a heading.
                    in_skipped_final_block = in_amending_block = False
                    items.append({"k": "h", "t": lines[0]})
                    lines = lines[1:]
                items.append({"k": "x", "t": title_of(block), "p": lines})
            continue
        num = am.group(1) + am.group(2)
        if not included(num, ranges):
            continue
        if pending_headings:
            items.extend(pending_headings)
            pending_headings = []
        article = {"k": "a", "n": num, "p": lines}
        heading_text = title_of(block)
        if heading_text:
            article["t"] = heading_text
        items.append(article)
    return items


def heading_style(text):
    """The numbering style of a heading, for example "roman" for "II. ДОГОВОРИ"."""
    if FINAL_HEADING_RE.match(text):
        return "final"
    for name, pattern in HEADING_STYLES:
        if pattern.match(text):
            return name
    letters = re.sub(r"[^А-Яа-яA-Za-z]", "", AMENDMENT_RE.sub("", text))
    return "caps" if letters and letters == letters.upper() else "plain"


def outline_levels(texts):
    """Heading levels (1 = outermost) from the numbering of the headings.

    lex.bg marks every heading of some acts (for example ЗЗД) in the same way, so the outline
    comes from the text: a numbering style seen before on the current path starts a sibling,
    a new style starts a level below. Unnumbered titles in capitals rank above unnumbered
    titles in sentence case. Final provisions always go back to the top, and so does every
    unnumbered heading after them (for example the provisions of an amending act).

    >>> outline_levels(["ОБЩА ЧАСТ", "I. ОСНОВНИ", "1. ДОГОВОРИ", "А) СКЛЮЧВАНЕ", "Б) ДЕЙСТВИЕ",
    ...                 "2. ДРУГИ", "II. ВТОРИ", "V.ЗАЕМ", "ОСОБЕНА ЧАСТ", "Заключителни разпоредби"])
    [1, 2, 3, 4, 4, 3, 2, 2, 1, 1]
    >>> outline_levels(["II. СЕМЕЙСТВО", "А. Брак", "Сключване на брак", "Б. Произход",
    ...                 "III. ЮРИДИЧЕСКИ ЛИЦА", "Общи разпоредби", "ЛИЦА С НЕСТОПАНСКА ЦЕЛ", "Сдружения"])
    [1, 2, 3, 2, 1, 2, 2, 3]
    >>> outline_levels(["Глава първа. ОБЩИ", "Глава трета. ЗАВЕЩАНИЕ", "1. ФОРМА", "Глава четвърта. ОТКАЗ"])
    [1, 1, 2, 1]
    >>> outline_levels(["Глава шеста. НАКАЗАНИЯ", "Допълнителна разпоредба", "Преходни разпоредби",
    ...                 "ПОСТАНОВЛЕНИЕ № 339 ЗА ИЗМЕНЕНИЕ"])
    [1, 1, 1, 1]
    """
    stack = []  # numbering styles from the outermost heading to the current one
    levels = []
    for text in texts:
        style = heading_style(text)
        if stack[:1] == ["final"] and style in ("caps", "plain"):
            style = "final"
        if style == "final":
            stack = [style]
        elif style in stack:
            del stack[stack.index(style) + 1:]
        else:
            if style == "caps" and stack and stack[-1] == "plain":
                stack.pop()
            stack.append(style)
        levels.append(min(len(stack), MAX_HEADING_LEVEL))
    return levels


def assign_heading_levels(items):
    """Give every heading a level ("l"). lex.bg levels win when the act has both kinds of heading."""
    headings = [it for it in items if it["k"] in ("h", "s")]
    if any(h["k"] == "s" for h in headings):
        for h in headings:
            h["l"] = 1 if h["k"] == "h" else 2
        return
    for heading, level in zip(headings, outline_levels([h["t"] for h in headings])):
        heading["l"] = level


def document_meta(text):
    meta = {}
    m = re.search(r'id="preHistory">(.*?)</div>', text, re.S)
    if m:
        meta["inForce"] = " ".join(clean_text(m.group(1)))
    history = re.findall(r'class=\\?"HistoryItem\\?">(.*?)</span>\s*[,<]', text, re.S)
    if history:
        cleaned = [" ".join(clean_text(h)) for h in history]
        meta["published"] = cleaned[0]
        meta["lastChange"] = cleaned[-1]
    return meta


def to_public_item(item):
    """Convert a parsed item ({"k", "n", "t", "p"}) to the JSON shape that the app reads."""
    kind = item["k"]
    if kind in ("h", "s"):
        return {"kind": "heading", "level": item["l"], "text": item["t"]}
    if kind == "x":
        return {"kind": "note", "title": item["t"], "paragraphs": item["p"]}
    public = {"kind": "article" if kind == "a" else "provision", "number": item["n"]}
    if item.get("t"):
        public["title"] = item["t"]
    public["paragraphs"] = item["p"]
    return public


def write_act(entry, items):
    os.makedirs(DATA_DIR, exist_ok=True)
    assign_heading_levels(items)
    payload = {**entry, "items": [to_public_item(it) for it in items]}
    with open(os.path.join(DATA_DIR, f"{entry['id']}.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")


def load_catalog():
    if not os.path.exists(CATALOG):
        return {}
    return {entry["id"]: entry for entry in json.load(open(CATALOG, encoding="utf-8"))}


def main(argv):
    sys.stdout.reconfigure(encoding="utf-8")
    cache_dir = None
    if "--cache" in argv:
        i = argv.index("--cache")
        cache_dir = argv[i + 1]
        os.makedirs(cache_dir, exist_ok=True)
        argv = argv[:i] + argv[i + 2:]
    wanted = set(argv)
    config = json.load(open(CONFIG, encoding="utf-8"))
    catalog = load_catalog()
    today = datetime.date.today().isoformat()
    for law in config:
        if wanted and law["id"] not in wanted:
            continue
        text = decode(fetch(law["lex"], cache_dir))
        ranges = parse_ranges(law["include"]) if law.get("include") else None
        provisions = included_provisions(law.get("include", []))
        items = parse_law(text, ranges, law.get("bareNumbers", False), provisions)
        articles = sum(1 for it in items if it["k"] == "a")
        if articles == 0:
            print(f"!! {law['id']}: no articles parsed, keeping the old data")
            continue
        meta = document_meta(text)
        entry = {
            "id": law["id"],
            "abbr": law["abbr"],
            "title": law["title"],
            "group": law["group"],
            "source": f"https://lex.bg/laws/ldoc/{law['lex']}",
            "retrieved": today,
            "partial": bool(law.get("include")),
            "articles": articles,
            **meta,
        }
        write_act(entry, items)
        catalog[law["id"]] = entry
        print(f"ok {law['id']}: {articles} articles, {len(items)} items")
    # Hand-made acts (for example the fee tariff) live in laws/manual and keep their catalog entry.
    order = [law["id"] for law in config]
    for name in sorted(os.listdir(MANUAL_DIR)) if os.path.isdir(MANUAL_DIR) else []:
        if name.endswith(".json"):
            manual = json.load(open(os.path.join(MANUAL_DIR, name), encoding="utf-8"))
            items = manual.pop("items")
            manual["articles"] = sum(1 for it in items if it["k"] == "a")
            write_act(manual, items)
            catalog[manual["id"]] = manual
            if manual["id"] not in order:
                order.append(manual["id"])
    ordered = [catalog[i] for i in order if i in catalog]
    with open(CATALOG, "w", encoding="utf-8", newline="\n") as f:
        json.dump(ordered, f, ensure_ascii=False, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main(sys.argv[1:])

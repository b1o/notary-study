"""Import Bulgarian legal acts from lex.bg into the course Law Library.

The script downloads each act in tools/laws.config.json, splits it into
headings, articles (чл.) and provisions (§), and writes one JSON file per act
to public/data/laws/acts/<id>.json plus the catalog public/data/laws/catalog.json.
Hand-made acts (the fee tariff) come from tools/manual/<id>.json.

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
    """Turn an HTML fragment into a list of plain-text lines."""
    s = re.sub(r"(?is)<(script|style|ins)[^>]*>.*?</\1>", " ", fragment)
    s = re.sub(r"(?i)</t[dh]>", " | ", s)
    s = re.sub(r"(?i)<(br|/?div|/?p|/?tr|/?table)[^>]*>", "\n", s)
    s = re.sub(r"<[^>]+>", "", s)
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


def parse_law(text, ranges, bare_numbers=False):
    items = []
    pending_headings = []
    in_skipped_final_block = False
    starts = [m for m in BLOCK_RE.finditer(text)]
    for i, m in enumerate(starts):
        kind = m.group(1)
        stop = starts[i + 1].start() if i + 1 < len(starts) else len(text)
        block = text[m.start():stop]
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
            in_skipped_final_block = ranges is not None or " към " in f" {heading_text.lower()} "
            if not in_skipped_final_block:
                items.append({"k": "h", "t": heading_text})
            continue
        lines = body_of(block)
        if not lines:
            continue
        if kind == "FinalEdictsArticle":
            if in_skipped_final_block:
                continue
            pm = PARAGRAPH_NO_RE.match(lines[0])
            num = "§" + (pm.group(1) + pm.group(2) if pm else str(len(items)))
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
        return {"kind": "heading", "level": 1 if kind == "h" else 2, "text": item["t"]}
    if kind == "x":
        return {"kind": "note", "title": item["t"], "paragraphs": item["p"]}
    public = {"kind": "article" if kind == "a" else "provision", "number": item["n"]}
    if item.get("t"):
        public["title"] = item["t"]
    public["paragraphs"] = item["p"]
    return public


def write_act(entry, items):
    os.makedirs(DATA_DIR, exist_ok=True)
    payload = {**entry, "items": [to_public_item(it) for it in items]}
    with open(os.path.join(DATA_DIR, f"{entry['id']}.json"), "w", encoding="utf-8") as f:
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
        items = parse_law(text, ranges, law.get("bareNumbers", False))
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
    with open(CATALOG, "w", encoding="utf-8") as f:
        json.dump(ordered, f, ensure_ascii=False, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main(sys.argv[1:])

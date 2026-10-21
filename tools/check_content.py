"""Check the course content.

Checks:
  * every law citation [[law:article:...]] and every quiz reference r: '...' points to an
    act and an article that exist in laws/data;
  * the English and the Bulgarian file of each chapter have the same number of cards and
    quiz questions;
  * each quiz question has at least two options and a valid answer index;
  * every chapter link (ch: '...', chapter: '...') names a chapter of the manifest;
  * every key in laws/en/*.js names an article of its act, and (warning only) every
    article that the English course cites has an English translation;
  * every content file parses as JavaScript (needs Node.js on the PATH).

Usage (from the project root):  python tools/check_content.py
Exit code 1 when a problem is found.
"""
import glob
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding="utf-8")

LATIN_TO_CYR = str.maketrans("aeopcxyABEKMHOPCTX", "аеорсхуАВЕКМНОРСТХ")


def load_laws():
    laws = {}
    for path in glob.glob(os.path.join(ROOT, "laws", "data", "*.js")):
        text = open(path, encoding="utf-8").read()
        data = json.loads(text[text.index("(") + 1: text.rindex(")")])
        laws[data["id"]] = {it["n"] for it in data["items"] if it.get("n")}
    return laws


def check_ref(ref, laws, where, problems):
    parts = ref.strip().split(":")
    law = parts[0]
    art = parts[1] if len(parts) > 1 else ""
    if law not in laws:
        problems.append(f"{where}: unknown act '{law}' in '{ref}'")
        return
    if not art:
        return
    if art.startswith("§"):
        key = art
    else:
        key = art.translate(LATIN_TO_CYR)
        if key != art:
            problems.append(f"{where}: Latin letter in article number '{art}' (use Cyrillic '{key}')")
    if key not in laws[law]:
        problems.append(f"{where}: {law} has no article '{art}'")


def count_entries(text, name):
    """Count top-level entries in the cards: [...] or quiz: [...] array."""
    m = re.search(rf"\n  {name}: \[(.*?)\n  \]", text, re.S)
    if not m:
        return 0
    body = m.group(1)
    if name == "cards":
        return len(re.findall(r"\n    \[", body))
    return len(re.findall(r"\n    \{", body))


def load_chapter_ids():
    text = open(os.path.join(ROOT, "content", "manifest.js"), encoding="utf-8").read()
    ids = set()
    for m in re.finditer(r"chapters: \[([^\]]*)\]", text):
        ids.update(re.findall(r"'([^']+)'", m.group(1)))
    return ids


# Collects the article keys of the English translations in laws/en (needs Node.js).
TR_KEYS_JS = (
    "const fs=require('fs'),path=require('path');const dir=process.argv[1];const tr={};"
    "global.NotaryLaws={registerTranslation:(id,m)=>{tr[id]=Object.assign(tr[id]||{},m)},setTranslated:()=>{}};"
    "for(const f of fs.readdirSync(dir)) require(path.join(dir,f));"
    "const out={};for(const k in tr) out[k]=Object.keys(tr[k]);console.log(JSON.stringify(out));"
)


def load_translation_keys(node):
    res = subprocess.run([node, "-e", TR_KEYS_JS, os.path.join(ROOT, "laws", "en")],
                         capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        return None
    return {k: set(v) for k, v in json.loads(res.stdout).items()}


def main():
    laws = load_laws()
    chapter_ids = load_chapter_ids()
    problems = []
    files = sorted(glob.glob(os.path.join(ROOT, "content", "**", "*.js"), recursive=True))
    for path in files:
        rel = os.path.relpath(path, ROOT)
        text = open(path, encoding="utf-8").read()
        for m in re.finditer(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]", text):
            check_ref(m.group(1), laws, rel, problems)
        for m in re.finditer(r"\br: '([^']+)'", text):
            for ref in m.group(1).split(","):
                check_ref(ref, laws, rel + " (quiz ref)", problems)
        for m in re.finditer(r"\bref: '([^']+)'", text):
            for ref in m.group(1).split(","):
                check_ref(ref, laws, rel + " (ref)", problems)
        for m in re.finditer(r"\blaw: '([^']+)'", text):
            for ref in m.group(1).split(","):
                check_ref(ref, laws, rel + " (law)", problems)
        for m in re.finditer(r"\{ q: .*?, a: (\d+)", text):
            line = m.group(0)
            opts = re.search(r"o: \[(.*?)\], a:", line)
            n = len(re.findall(r"'(?:[^'\\]|\\.)*'", opts.group(1))) if opts else 0
            if n < 2 or int(m.group(1)) >= n:
                problems.append(f"{rel}: bad quiz entry near: {line[:80]}")
        for m in re.finditer(r"(?:ch|chapter): '([^']+)'", text):
            if m.group(1) not in chapter_ids:
                problems.append(f"{rel}: unknown chapter '{m.group(1)}'")
        if "${" in text and "content" in rel and "manifest" not in rel:
            problems.append(f"{rel}: contains '${{' inside a template string")

    for en in sorted(glob.glob(os.path.join(ROOT, "content", "en", "*.js"))):
        name = os.path.basename(en)
        bg = os.path.join(ROOT, "content", "bg", name)
        if not os.path.exists(bg):
            problems.append(f"content/bg/{name}: missing Bulgarian version")
            continue
        te, tb = open(en, encoding="utf-8").read(), open(bg, encoding="utf-8").read()
        for kind in ("cards", "quiz"):
            ce, cb = count_entries(te, kind), count_entries(tb, kind)
            if ce != cb:
                problems.append(f"{name}: {kind} count differs (en {ce}, bg {cb})")
    for bg in sorted(glob.glob(os.path.join(ROOT, "content", "bg", "*.js"))):
        if not os.path.exists(os.path.join(ROOT, "content", "en", os.path.basename(bg))):
            problems.append(f"content/en/{os.path.basename(bg)}: missing English version")

    warnings = []
    node = shutil.which("node")
    tr = load_translation_keys(node) if node else None
    if tr is not None:
        for law, keys in tr.items():
            for art in sorted(keys - laws.get(law, set())):
                problems.append(f"laws/en/{law}.js: {law} has no article '{art}'")
        en_files = glob.glob(os.path.join(ROOT, "content", "en", "*.js")) + [
            os.path.join(ROOT, "content", n + ".js") for n in ("glossary", "templates", "checklists")]
        missing = set()
        for path in en_files:
            if not os.path.exists(path):
                continue
            text = open(path, encoding="utf-8").read()
            refs = [m.group(1) for m in re.finditer(r"\[\[([^\]|]+)", text)]
            for m in re.finditer(r"(?:r|ref|law): '([^']+)'", text):
                refs += [r.strip() for r in m.group(1).split(",")]
            for ref in refs:
                parts = ref.split(":")
                if len(parts) > 1 and parts[1] not in tr.get(parts[0], set()):
                    missing.add(f"{parts[0]}:{parts[1]}")
        if missing:
            warnings.append(f"{len(missing)} cited article(s) have no English translation: " + ", ".join(sorted(missing)[:30]))

    if node:
        for path in files + sorted(glob.glob(os.path.join(ROOT, "assets", "js", "*.js"))) + sorted(glob.glob(os.path.join(ROOT, "laws", "en", "*.js"))):
            res = subprocess.run([node, "--check", path], capture_output=True, text=True, encoding="utf-8")
            if res.returncode != 0:
                problems.append(f"{os.path.relpath(path, ROOT)}: JavaScript error\n{res.stderr.strip()[:400]}")
    else:
        print("Node.js not found: skipped the JavaScript syntax check.")

    for w in warnings:
        print("Warning:", w)
    if problems:
        print(f"{len(problems)} problem(s):")
        for p in problems:
            print(" -", p)
        sys.exit(1)
    print(f"OK: {len(files)} content files, {len(laws)} acts.")


if __name__ == "__main__":
    main()

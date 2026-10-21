"""Print law texts from public/data/laws, to check a statement before you write it.

Usage (from the project root):
    python tools/law_text.py znnd:25:9 gpk:580::3   # an article, a paragraph or an item
    python tools/law_text.py --notes zzd:26          # keep the amendment notes
    python tools/law_text.py --en zaz:3              # the English translation, if there is one
    python tools/law_text.py --grep zmdt "наследств" # the articles of an act that contain a text

A reference has the form of a citation: act:article:paragraph:item. An item without a paragraph
is written with an empty paragraph ("gpk:580::3"). Paragraphs follow the rules of
src/app/core/laws/law-text.ts: "(9)" marks paragraph 9, also after the notes of the article;
in an act without such numbers, every line that is not an item starts the next paragraph.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAWS = os.path.join(ROOT, "public", "data", "laws")
LINE_NUMBER = re.compile(r"^(?:(?:Чл|Art)\.\s*\d+[а-яa-z]?\.|§\s*\d+[а-яa-z]?\.)")
NOTE = re.compile(
    r"\((?:Нов|Изм|Доп|Отм|Предиш|Попр|Загл|Обявен|Обн|(?:Ал|Т)\.\s*\d+[а-я]?\s+(?:отм|изм|доп))"
    r"[^()]*?(?:\([^()]*\)[^()]*?)*\)\s*",
    re.I,
)
PARAGRAPH_NUMBER = re.compile(r"^\s*\((\d+[а-яa-z]?)\)")
ITEM = re.compile(r"^(\d+[а-яa-z]?)\.\s|^([а-яa-z])\)\s")


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def lines_of(act, article, english=False):
    if english:
        path = os.path.join(LAWS, "en", f"{act}.json")
        entry = load(path).get(article) if os.path.exists(path) else None
        return entry["paragraphs"] if entry else None
    for item in load(os.path.join(LAWS, "acts", f"{act}.json"))["items"]:
        if item.get("number") == article:
            return item["paragraphs"]
    return None


def strip_leading_notes(text):
    while (m := re.match(r"\s*" + NOTE.pattern, text, re.I)):
        text = text[m.end():]
    return text


def paragraph_numbers(lines):
    """The paragraph of each line, as paragraphOfLines in law-text.ts."""
    own = [m.group(1) if (m := PARAGRAPH_NUMBER.match(strip_leading_notes(LINE_NUMBER.sub("", l)))) else None
           for l in lines]
    if any(own):
        current, numbers = None, []
        for number in own:
            current = number or current
            numbers.append(current)
        return numbers
    count, numbers = 0, []
    for index, line in enumerate(lines):
        if index > 0 and ITEM.match(line):
            numbers.append(str(max(count, 1)))
        else:
            count += 1
            numbers.append(str(count))
    return numbers


def select(lines, paragraph=None, item=None):
    numbers = paragraph_numbers(lines)
    chosen = [l for l, n in zip(lines, numbers) if not paragraph or n == paragraph]
    if item:
        picked, inside = [], False
        for index, line in enumerate(chosen):
            m = ITEM.match(line) if index > 0 or not paragraph else None
            if m:
                inside = (m.group(1) or m.group(2)) == item
            if inside:
                picked.append(line)
        chosen = picked
    return chosen


def main(argv):
    sys.stdout.reconfigure(encoding="utf-8")
    notes = "--notes" in argv
    english = "--en" in argv
    argv = [a for a in argv if a not in ("--notes", "--en")]
    if argv[:1] == ["--grep"]:
        act, text = argv[1], argv[2].lower()
        for item in load(os.path.join(LAWS, "acts", f"{act}.json"))["items"]:
            hits = [l for l in item.get("paragraphs", []) if text in l.lower()]
            if hits and "number" in item:
                print(f"{act}:{item['number']}")
                for line in hits:
                    print("   ", line if notes else NOTE.sub("", line))
        return 0
    status = 0
    for ref in argv:
        act, article, paragraph, item = (ref.split(":") + ["", "", ""])[:4]
        lines = lines_of(act, article, english)
        print(f"=== {ref}")
        if lines is None:
            print("    not in the library" + (" (no English translation)" if english else ""))
            status = 1
            continue
        chosen = select(lines, paragraph or None, item or None)
        if not chosen:
            print(f"    {act}:{article} has no paragraph {paragraph!r} / item {item!r}")
            status = 1
        for line in chosen:
            print(line if notes else NOTE.sub("", line))
    return status


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

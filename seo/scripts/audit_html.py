#!/usr/bin/env python3
"""Audit built HTML for meta description length (70-160 chars)."""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class MetaDescriptionParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.descriptions: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "meta":
            return
        attr = {k.lower(): (v or "") for k, v in attrs}
        if attr.get("name", "").lower() == "description" and "content" in attr:
            self.descriptions.append(attr["content"])


def descriptions(html: str) -> list[str]:
    parser = MetaDescriptionParser()
    parser.feed(html)
    out: list[str] = []
    for d in parser.descriptions:
        if d not in out:
            out.append(d)
    return out


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
    if not root.exists():
        print(f"ERROR: {root} does not exist", file=sys.stderr)
        return 2
    files = sorted(
        p
        for p in root.rglob("*.html")
        # Skip non-page verification / tooling HTML dropped into public/
        if not re.match(r"^google[0-9a-f]+\.html$", p.name, re.I)
    )
    if not files:
        print(f"ERROR: no HTML under {root}", file=sys.stderr)
        return 2
    bad = 0
    missing = 0
    for path in files:
        html = path.read_text(encoding="utf-8", errors="replace")
        descs = descriptions(html)
        rel = path.relative_to(root)
        if not descs:
            print(f"MISSING\t{rel}")
            missing += 1
            continue
        for d in descs:
            n = len(d)
            status = "OK" if 70 <= n <= 160 else "BAD"
            if status == "BAD":
                bad += 1
            print(f"{status}\t{n}\t{rel}\t{d}")
    print(f"---\nfiles={len(files)} bad={bad} missing={missing}")
    return 1 if bad or missing else 0


if __name__ == "__main__":
    raise SystemExit(main())

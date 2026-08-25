#!/usr/bin/env python3
"""Прибирає імена та телефони з сирих CSV у sternenko/data перед публікацією."""

from __future__ import annotations

import csv
import re
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = APP_ROOT.parents[2] / "sternenko" / "data"
INCOME_CSV = DATA_DIR / "sqllab_untitled_query_1_20260706T131329.csv"

ANONYMOUS_COUNTERPARTY = "Донор"
ANONYMOUS_FOP = "ФОП"

ORG_MARKERS = (
    "бітлз",
    "рахунок",
    "банк",
    "транз",
    "e-comm",
    r"\bбф\b",
    "бф\"",
    r"\bтов\b",
    'тов "',
    r"\bат\b",
    "go_",
    "bp ",
    "accord",
    "кредитор",
    "єдрпоу",
    "платеж",
    "продаж",
    "dn,",
    "dg,",
    "спільнота",
    "монобанк",
    r"\bфк\b",
    "контракт",
    "сенс",
    r"\bвст\b",
    "клієнт",
)


def has_org_marker(text: str) -> bool:
    lower = text.lower()
    return any(
        re.search(marker, lower, re.IGNORECASE) if "\\b" in marker else marker in lower
        for marker in ORG_MARKERS
    )

NAME_WORD = re.compile(r"^[\w''ʼ`\-]+$", re.UNICODE)
CYRILLIC_LATIN_NAME = re.compile(
    r"^(?:[\u0400-\u04FFA-Z][\u0400-\u04FFa-z''ʼ`\-]+\s+){1,3}"
    r"[\u0400-\u04FFA-Z][\u0400-\u04FFa-z''ʼ`\-]+$",
    re.UNICODE,
)

NAME_AFTER_COMMA = re.compile(
    r"(?:,\s*"
    r"(?:"
    r"(?:[\u0400-\u04FFA-Z\u0400-\u04FFa-z][\w''ʼ`\-]+\s+){1,3}[\u0400-\u04FFA-Z\u0400-\u04FFa-z][\w''ʼ`\-]+"
    r"|"
    r"[\u0400-\u04FFA-Z][\w''ʼ`\-]+\s+[\u0400-\u04FFA-Z]\.[\u0400-\u04FFA-Z]\.?"
    r")"
    r")+",
    re.UNICODE,
)
FROM_PERSON_SUFFIX = re.compile(
    r"\s+від\s+"
    r"(?:[@\w''ʼ`\.][\w''ʼ`\.@-]*"
    r"(?:\s+[@\w''ʼ`\.][\w''ʼ`\.@-]*){0,3})"
    r"(?:\s+20\d{6})?",
    re.IGNORECASE | re.UNICODE,
)
COMPACT_BANK_DATE = re.compile(r"\s+20\d{6}\b")
CCID = re.compile(
    r",?\s*ccid:\s*[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b",
    re.IGNORECASE,
)
IPN = re.compile(r"\s*ІПН\s*\d{8,12}\b", re.IGNORECASE)
IPN_LATIN = re.compile(r"\s*IPN\s*\d{8,12}\b", re.IGNORECASE)
PAYER_ACCOUNT = re.compile(
    r"\s*Рахунок платника\s*UA[0-9A-Z]{25,34}\b", re.IGNORECASE
)
UA_ACCOUNT = re.compile(r"\bUA[0-9A-Z]{25,34}\b")
PHONE = re.compile(r"\+?\d[\d\s\-()]{7,}\d")
LONG_DIGITS = re.compile(r"\b\d{10,}\b")
PAYER_TAIL = re.compile(r"\s*Платник\s+.+$", re.IGNORECASE | re.UNICODE)
DONATION_ASSISTANCE_TAIL = re.compile(
    r"(Благодійн[аі]\s+допомог[аі])\s+від\s+.+$", re.IGNORECASE | re.UNICODE
)
LATIN_I_IN_CYRILLIC = re.compile(r"(?<=[\u0400-\u04FF])i(?=[\u0400-\u04FF])")

PURPOSE_KEYWORDS = re.compile(
    r"благодійн|внесок|допомог|конверт|дрон|донат|русоріз|справ|програм|переказ|фонд",
    re.IGNORECASE | re.UNICODE,
)


def normalize_comment_script(text: str) -> str:
    return LATIN_I_IN_CYRILLIC.sub("і", text)


def is_likely_personal_name_only(text: str) -> bool:
    if PURPOSE_KEYWORDS.search(text):
        return False
    words = [word for word in text.strip().split() if word]
    if len(words) < 2 or len(words) > 3:
        return False
    return all(NAME_WORD.fullmatch(word) for word in words)


def sanitize_income_comment(raw: str) -> str:
    text = normalize_comment_script(raw.strip())
    if not text:
        return ""

    text = CCID.sub("", text)
    text = IPN.sub("", text)
    text = IPN_LATIN.sub("", text)
    text = PAYER_ACCOUNT.sub("", text)
    text = UA_ACCOUNT.sub("", text)
    text = PHONE.sub("", text)
    text = LONG_DIGITS.sub("", text)
    text = FROM_PERSON_SUFFIX.sub("", text)
    text = COMPACT_BANK_DATE.sub("", text)
    text = DONATION_ASSISTANCE_TAIL.sub(r"\1", text)
    text = PAYER_TAIL.sub("", text)
    text = NAME_AFTER_COMMA.sub("", text)

    if is_likely_personal_name_only(text):
        return ""

    text = re.sub(r"\s{2,}", " ", text)
    text = re.sub(r"^[\s,.;:-]+|[\s,.;:-]+$", "", text)
    return text.strip()


def is_personal_counterparty(value: str) -> bool:
    text = value.strip()
    if not text:
        return False

    lower = text.lower()
    if has_org_marker(text):
        return False
    if any(char in text for char in ('"', "«", "»", "(", ")")):
        return False

    return bool(CYRILLIC_LATIN_NAME.fullmatch(text))


def sanitize_counterparty(value: str) -> str:
    text = value.strip()
    if not text:
        return text

    lower = text.lower()
    if "фоп" in lower or "підприємець" in lower:
        return ANONYMOUS_FOP
    if is_personal_counterparty(text):
        return ANONYMOUS_COUNTERPARTY

    if re.fullmatch(r"[А-ЯІЇЄҐA-Z\s\.]+", text) and len(text.split()) <= 4:
        if not has_org_marker(text):
            return ANONYMOUS_COUNTERPARTY

    return text


def sanitize_income_csv(path: Path) -> tuple[int, int]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
        fieldnames = rows[0].keys() if rows else []

    counterparty_changes = 0
    comment_changes = 0

    for row in rows:
        counterparty = row["Контрагент"].strip()
        sanitized_counterparty = sanitize_counterparty(counterparty)
        if sanitized_counterparty != counterparty:
            row["Контрагент"] = sanitized_counterparty
            counterparty_changes += 1

        comment = row["Коментар"]
        sanitized = sanitize_income_comment(comment)
        if sanitized != comment.strip():
            row["Коментар"] = sanitized
            comment_changes += 1

    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return counterparty_changes, comment_changes


def main() -> None:
    if not INCOME_CSV.exists():
        raise SystemExit(f"Income CSV not found: {INCOME_CSV}")

    counterparty_changes, comment_changes = sanitize_income_csv(INCOME_CSV)
    print(
        f"Sanitized {INCOME_CSV.name}: "
        f"{counterparty_changes} counterparties, {comment_changes} comments"
    )


if __name__ == "__main__":
    main()

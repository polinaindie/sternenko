#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import re
from datetime import datetime, timezone
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = APP_ROOT.parents[2] / "sternenko" / "data"
INCOME_CSV = DATA_DIR / "sqllab_untitled_query_1_20260706T131329.csv"
ISSUANCE_CSV = DATA_DIR / "zvitnist_merged_2025-02_2026-05.csv"
OUT_INCOME_JSON = APP_ROOT / "public/data/income-transactions.json"
OUT_ISSUANCE_TS = APP_ROOT / "src/pages/reports/data/issuance-rows.generated.ts"
OUT_ISSUANCE_UNITS = APP_ROOT / "src/pages/reports/data/issuance-units.ts"
OUT_ISSUANCE_REPORTING = APP_ROOT / "src/pages/reports/data/issuance-reporting.ts"
OUT_INCOME_TS = APP_ROOT / "src/pages/reports/data/income-transactions.ts"

ACCOUNT_TO_SOURCE = {
    "Моно UAH ЗСУ": "Monobank",
    "Моно UAH Операційний": "Monobank",
    "Приват UAH Операційний": "ПриватБанк",
    "Приват EUR ЗСУ": "Валютний рахунок",
    "Приват PLN ЗСУ": "Валютний рахунок",
    "Поточний рахунок + Конверт": "Гривневий рахунок",
}

FX_TO_UAH = {
    "UAH": 1,
    "EUR": 45,
    "PLN": 11,
    "USD": 41,
}

PROJECT_TO_FUNDRAISING = {
    "Поточний": "Тотальний Русоріз",
    "Шахедоріз": "Шахедоріз",
    "Небесний": "Небесний Русоріз",
    "ReDrone": "ReDrone",
    "Оптоволоконні": "Опторіз",
}

# Канонічні назви лінійок проєктів у звітах (Оптоволоконні = Опторіз).
PROJECT_LINE_CANONICAL = {
    **{name: name for name in PROJECT_TO_FUNDRAISING},
    "Оптоволоконні": "Опторіз",
}

DEFAULT_INCOME_FUNDRAISING = PROJECT_TO_FUNDRAISING["Поточний"]

VALID_INCOME_FUNDRAISINGS = {
    "Русоріз",
    "Шахедоріз",
    "Небесний Русоріз",
    "Опторіз",
    "ReDrone",
    "Секретний RUSORIZ 2.0",
    "Секретний RUSORIZ",
    "HAPPY OPTORIZ",
    "Конверт на перехоплення",
    "Дронвестиція",
    "Тотальний Русоріз",
    "Оптичний Русоріз",
    "Грім для ворогів",
    "Небесна інвестиція",
}


def infer_income_fundraising(comment: str) -> str:
    """Визначає збір з коментаря до платежу; без згадки — поточний (Тотальний Русоріз)."""
    if not comment or not comment.strip():
        return DEFAULT_INCOME_FUNDRAISING

    text = comment.strip().lower()

    if "благодійний внесок на конверт" in text or (
        text.startswith("благодійний внесок") and "на конверт" in text
    ):
        return "Конверт на перехоплення"
    if "конверт на перехоплення" in text or re.search(r"\bна конверт\b", text):
        return "Конверт на перехоплення"
    if "happy optoriz" in text:
        return "HAPPY OPTORIZ"
    if re.search(r"rusoriz\s*2\.?0|rusoriz\s*2\b", text):
        return "Секретний RUSORIZ 2.0"
    if "секретний" in text and (
        "rusoriz" in text or "русоріз" in text or "русориз" in text
    ):
        return "Секретний RUSORIZ"
    if "небесна інвестиція" in text or ("небесн" in text and "інвест" in text):
        return "Небесна інвестиція"
    if "поточний" in text and (
        "rusoriz" in text or "русоріз" in text or "русориз" in text
    ):
        return DEFAULT_INCOME_FUNDRAISING
    if "на поточний" in text:
        return DEFAULT_INCOME_FUNDRAISING
    if "тотальний" in text and (
        "rusoriz" in text or "русоріз" in text or "русорез" in text
    ):
        return DEFAULT_INCOME_FUNDRAISING
    if "небесний" in text and ("rusoriz" in text or "русоріз" in text):
        return "Небесний Русоріз"
    if "оптичний" in text and ("rusoriz" in text or "русоріз" in text):
        return "Оптичний Русоріз"
    if "шахедоріз" in text or re.search(r"\bшахед\b", text):
        return "Шахедоріз"
    if "redrone" in text or "re-drone" in text or "re drone" in text:
        return "ReDrone"
    if "дронвест" in text:
        return "Дронвестиція"
    if "опторіз" in text or "опториз" in text or re.search(r"\bоптор\b", text):
        return "Опторіз"
    if "грім" in text and "ворог" in text:
        return "Грім для ворогів"
    if "rusoriz digital" in text or "русоріз digital" in text:
        return "Русоріз"
    if (
        re.search(r"\bна русоріз\b", text)
        or re.search(r"\brusoriz\b", text)
        or re.search(r"\bрусоріз\b", text)
        or re.search(r"\bрусориз\b", text)
    ):
        return "Русоріз"

    return DEFAULT_INCOME_FUNDRAISING

def parse_ua_amount(value: str) -> int:
    normalized = value.replace("\u00a0", "").replace(" ", "").replace(",", ".")
    return round(float(normalized))


INVISIBLE_UNICODE = (
    "\ufeff",
    "\u200b",
    "\u200c",
    "\u200d",
    "\u2060",
    "\u00ad",
    "\u2061",
    "\u2062",
    "\u2063",
    "\u2064",
    "\u200e",
    "\u200f",
    "\u202a",
    "\u202b",
    "\u202c",
    "\u202d",
    "\u202e",
    "\u2066",
    "\u2067",
    "\u2068",
    "\u2069",
)
INVISIBLE_UNICODE_TABLE = str.maketrans("", "", "".join(INVISIBLE_UNICODE))


def normalize_unicode_text(value: str) -> str:
    """Прибирає невидимі символи (ZWSP, WJ, BOM тощо), що ламають порівняння рядків."""
    return value.translate(INVISIBLE_UNICODE_TABLE).strip()


def normalize_issuance_field(value: str) -> str:
    """Однорядкові значення полів видач без невидимих символів і зайвих пробілів."""
    text = normalize_unicode_text(value)
    text = re.sub(r"[\r\n]+", " ", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def dedupe_concatenated_unit(value: str) -> str:
    """Виправляє злиплі дублікати на кшталт «147 ОАБр рУБпАК147 ОАБр рУБпАК»."""
    text = normalize_issuance_field(value).rstrip(",")
    if len(text) % 2 == 0:
        half = len(text) // 2
        if text[:half] == text[half:]:
            return text[:half]
    return text


def normalize_unit_field(value: str) -> str:
    return dedupe_concatenated_unit(value)


def parse_issuance_date(value: str) -> str:
    month, day, year = value.split("-")
    return f"{int(day):02d}.{int(month):02d}.{2000 + int(year)}"


def infer_category(name: str) -> str:
    lower = name.lower()
    if any(
        token in lower
        for token in ("fpv", "дрон", "коптер", "strix", "літак")
    ):
        return "FPV-дрони"
    if any(token in lower for token in ("оптик", "приціл", "теплов", "бінок")):
        return "Оптика"
    if any(token in lower for token in ("антен", "раці", "зв'яз", "starlink")):
        return "Зв'язок"
    return "БК"


AWAITING_MARKER = "awaiting"


def is_awaiting_report(value: str) -> bool:
    """`awaiting` у реєстрі — документ ще очікується, а не відсутній назавжди."""
    return value.strip().lower() == AWAITING_MARKER


def is_placeholder_url(value: str) -> bool:
    normalized = value.strip().lower()
    return normalized in {
        "",
        AWAITING_MARKER,
        "example.com",
        "http://example.com",
        "https://example.com",
    }


def document_attachment(url: str, alt: str) -> list[dict[str, str]]:
    if is_placeholder_url(url):
        return []
    return [{"src": url.strip(), "alt": alt}]


def media_attachment(url: str, product_name: str) -> list[dict[str, str]]:
    if is_placeholder_url(url):
        return []
    return [
        {
            "type": "image",
            "src": url.strip(),
            "alt": f"Фото передачі — {product_name}",
        }
    ]


def import_income_rows(csv_rows: list[dict[str, str]]) -> dict:
    rows: list[dict] = []
    min_at = None
    max_at = None

    for index, row in enumerate(csv_rows, start=1):
        account = normalize_unicode_text(row["Рахунок"])
        source = ACCOUNT_TO_SOURCE.get(account)
        if source is None:
            raise ValueError(f"Невідомий рахунок надходжень: {account}")

        currency = normalize_unicode_text(row["Валюта"])
        if currency not in FX_TO_UAH:
            raise ValueError(f"Невідома валюта: {currency}")

        amount = float(row["Сума"])
        amount_uah = (
            amount
            if currency == "UAH"
            else round(amount * FX_TO_UAH[currency], 2)
        )
        at = normalize_unicode_text(row["Дата і час"]).replace(" ", "T")
        comment = normalize_unicode_text(row["Коментар"])
        fundraising = infer_income_fundraising(comment)
        if fundraising not in VALID_INCOME_FUNDRAISINGS:
            raise ValueError(
                f"Невідомий збір з коментаря {comment!r}: {fundraising!r}"
            )

        min_at = at if min_at is None or at < min_at else min_at
        max_at = at if max_at is None or at > max_at else max_at

        rows.append(
            {
                "id": str(index),
                "at": at,
                "source": source,
                "amount": amount,
                "currency": currency,
                "amountUah": amount_uah,
                "fundraising": fundraising,
                "counterparty": normalize_unicode_text(row["Контрагент"]),
                "comment": comment,
            }
        )

    return {
        "meta": {
            "start": (min_at or "2026-06-06")[:10],
            "end": (max_at or "2026-07-06")[:10],
            "importedAt": datetime.now(timezone.utc).isoformat(),
            "rowCount": len(rows),
        },
        "rows": rows,
    }


def import_issuance_rows(csv_rows: list[dict[str, str]]) -> tuple[list[dict], str, str]:
    rows: list[dict] = []
    min_date: datetime | None = None
    max_date: datetime | None = None

    for index, row in enumerate(csv_rows, start=1):
        project_raw = normalize_issuance_field(row["Проєкт"])
        fundraising = PROJECT_TO_FUNDRAISING.get(project_raw)
        if fundraising is None:
            raise ValueError(f"Невідомий проєкт видачі: {project_raw!r}")
        project = PROJECT_LINE_CANONICAL[project_raw]

        product_name = normalize_issuance_field(row["Номенклатура"])
        quantity = int(row["Кількість"])
        total = parse_ua_amount(row["Сума"])
        unit_price = round(total / quantity) if quantity > 0 else total
        unit = normalize_unit_field(row["Підрозділ"])
        date = parse_issuance_date(normalize_issuance_field(row["Дата"]))
        category = infer_category(product_name)
        code = normalize_issuance_field(row["Код запису"])
        media_raw = normalize_issuance_field(row["Фото/Відео звіт"])
        act_raw = normalize_issuance_field(row["Акт прийому-передачі"])
        payment_raw = normalize_issuance_field(row["Платіжний документ"])

        month, day, year = normalize_issuance_field(row["Дата"]).split("-")
        parsed = datetime(2000 + int(year), int(month), int(day))
        min_date = parsed if min_date is None or parsed < min_date else min_date
        max_date = parsed if max_date is None or parsed > max_date else max_date

        rows.append(
            {
                "id": f"{code}-{index}" if code else str(index),
                "date": date,
                "productName": product_name,
                "quantity": quantity,
                "unitPrice": unit_price,
                "total": total,
                "fundraising": fundraising,
                "recipient": f"{unit}, ЗСУ",
                "project": project,
                "direction": "ППО" if category == "FPV-дрони" else "Розвідка",
                "agency": "ЗСУ",
                "unit": unit,
                "category": category,
                "attachments": {
                    "media": media_attachment(media_raw, product_name),
                    "act": document_attachment(
                        act_raw,
                        f"Акт видачі — {product_name} від {date}",
                    ),
                    "payment": document_attachment(
                        payment_raw,
                        f"Платіжний документ — {product_name}",
                    ),
                },
                "pendingAttachments": {
                    "media": is_awaiting_report(media_raw),
                    "act": is_awaiting_report(act_raw),
                    "payment": is_awaiting_report(payment_raw),
                },
            }
        )

    start = (min_date or datetime(2026, 5, 1)).strftime("%Y-%m-%d")
    end = (max_date or datetime(2026, 5, 30)).strftime("%Y-%m-%d")
    return rows, start, end


def write_issuance_units(units: list[str]) -> None:
    body = ",\n".join(
        f"  {json.dumps(unit, ensure_ascii=False)}"
        for unit in sorted(units, key=lambda value: value.casefold())
    )
    OUT_ISSUANCE_UNITS.write_text(
        "/** Підрозділи-одержувачі закупівель — з реєстру видач фонду. */\n"
        f"export const ISSUANCE_UNITS = [\n{body}\n] as const\n\n"
        "export type IssuanceUnit = (typeof ISSUANCE_UNITS)[number]\n",
        encoding="utf-8",
    )


def write_issuance_reporting_constants(start: str, end: str) -> None:
    start_parts = [int(part) for part in start.split("-")]
    end_parts = [int(part) for part in end.split("-")]
    start_year, start_month, start_day = start_parts
    end_year, end_month, end_day = end_parts

    OUT_ISSUANCE_REPORTING.write_text(
        "/** Вікно звітності видач — оновлюється scripts/import_report_data.py */\n"
        f"export const ISSUANCE_REPORTING_START = new Date({start_year}, {start_month - 1}, {start_day})\n"
        f"export const ISSUANCE_REPORTING_END = new Date({end_year}, {end_month - 1}, {end_day}, 23, 59, 59, 999)\n",
        encoding="utf-8",
    )


def write_issuance_ts(rows: list[dict]) -> None:
    body = ",\n".join(
        f"  {json.dumps(row, ensure_ascii=False, indent=2).replace(chr(10), chr(10) + '  ')}"
        for row in rows
    )
    OUT_ISSUANCE_TS.write_text(
        "// Generated by scripts/import_report_data.py — do not edit manually.\n\n"
        f"export const ISSUANCE_IMPORTED_ROWS = [\n{body}\n] as const\n",
        encoding="utf-8",
    )


def write_income_reporting_constants(start: str, end: str) -> None:
    start_parts = [int(part) for part in start.split("-")]
    end_parts = [int(part) for part in end.split("-")]
    start_year, start_month, start_day = start_parts
    end_year, end_month, end_day = end_parts

    contents = OUT_INCOME_TS.read_text(encoding="utf-8")
    contents = re.sub(
        r"export const INCOME_REPORTING_START = new Date\([^)]+\)",
        f"export const INCOME_REPORTING_START = new Date({start_year}, {start_month - 1}, {start_day})",
        contents,
        count=1,
    )
    contents = re.sub(
        r"export const INCOME_REPORTING_END = new Date\([^)]+\)",
        (
            "export const INCOME_REPORTING_END = new Date("
            f"{end_year}, {end_month - 1}, {end_day}, 23, 59, 59, 999)"
        ),
        contents,
        count=1,
    )
    OUT_INCOME_TS.write_text(contents, encoding="utf-8")


def clean_issuance_source_csv(path: Path = ISSUANCE_CSV) -> int:
    """Нормалізує сирий CSV видач перед імпортом і публікацією."""
    with path.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
        fieldnames = rows[0].keys() if rows else []

    cleaners = {
        "Номенклатура": normalize_issuance_field,
        "Підрозділ": normalize_unit_field,
        "Проєкт": normalize_issuance_field,
        "Код запису": normalize_issuance_field,
        "Дата": normalize_issuance_field,
        "Платіжний документ": normalize_issuance_field,
        "Акт прийому-передачі": normalize_issuance_field,
        "Фото/Відео звіт": normalize_issuance_field,
    }

    changes = 0
    for row in rows:
        for field, cleaner in cleaners.items():
            cleaned = cleaner(row[field])
            if cleaned != row[field]:
                row[field] = cleaned
                changes += 1

    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    return changes


def main() -> None:
    OUT_INCOME_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_ISSUANCE_TS.parent.mkdir(parents=True, exist_ok=True)

    with INCOME_CSV.open(encoding="utf-8-sig", newline="") as handle:
        income_csv = list(csv.DictReader(handle))
    with ISSUANCE_CSV.open(encoding="utf-8", newline="") as handle:
        issuance_csv = list(csv.DictReader(handle))

    income = import_income_rows(income_csv)
    issuance_rows, issuance_start, issuance_end = import_issuance_rows(issuance_csv)
    issuance_units = sorted(
        {normalize_unit_field(row["Підрозділ"]) for row in issuance_csv},
        key=lambda value: value.casefold(),
    )

    OUT_INCOME_JSON.write_text(
        json.dumps(income, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    write_issuance_ts(issuance_rows)
    write_issuance_units(issuance_units)
    write_income_reporting_constants(income["meta"]["start"], income["meta"]["end"])
    write_issuance_reporting_constants(issuance_start, issuance_end)

    print(
        f"Imported {income['meta']['rowCount']} income rows "
        f"({income['meta']['start']} … {income['meta']['end']})"
    )
    print(
        f"Imported {len(issuance_rows)} issuance rows "
        f"({issuance_start} … {issuance_end}, {len(issuance_units)} units)"
    )


if __name__ == "__main__":
    main()

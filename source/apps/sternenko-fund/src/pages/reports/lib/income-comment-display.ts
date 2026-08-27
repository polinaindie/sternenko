import { EMPTY_TABLE_VALUE } from "./empty-table-value"

/** Латинська i всередині кириличних слів (банківські виписки) → і. */
function normalizeIncomeCommentScript(text: string): string {
  return text.replace(/(?<=[\u0400-\u04FF])i(?=[\u0400-\u04FF])/g, "і")
}

const NAME_AFTER_COMMA =
  /(?:,\s*(?:[\p{Lu}\p{Lt}][\p{L}'`ʼ\-]+\s*){2,4})+/gu

/** «від Прізвище Ім'я По батькові [20260701]» у шаблонних переказах Monobank. */
const FROM_PERSON_SUFFIX =
  /\s+від\s+(?:[\p{Lu}\p{Lt}][\p{L}'`ʼ\-]+\s+){1,3}[\p{Lu}\p{Lt}][\p{L}'`ʼ\-]+(?:\s+20\d{6})?/giu

const COMPACT_BANK_DATE = /\s+20\d{6}\b/g

/** Прибирає ПДн з банківського коментаря — лишає змістовний текст донату. */
export function sanitizeIncomeComment(raw: string): string {
  let text = normalizeIncomeCommentScript(raw.trim())
  if (!text) return ""

  text = text.replace(
    /,?\s*ccid:\s*[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
    ""
  )
  text = text.replace(/\s*ІПН\s*\d{8,12}\b/gi, "")
  text = text.replace(/\s*IPN\s*\d{8,12}\b/gi, "")
  text = text.replace(/\s*Рахунок платника\s*UA[0-9A-Z]{25,34}\b/gi, "")
  text = text.replace(/\bUA[0-9A-Z]{25,34}\b/g, "")
  text = text.replace(/\+?\d[\d\s\-()]{7,}\d/g, "")
  text = text.replace(/\b\d{10,}\b/g, "")
  text = text.replace(FROM_PERSON_SUFFIX, "")
  text = text.replace(COMPACT_BANK_DATE, "")

  text = text.replace(/(Благодійн[аі]\s+допомог[аі])\s+від\s+.+$/giu, "$1")
  text = text.replace(/\s*Платник\s+.+$/giu, "")
  text = text.replace(NAME_AFTER_COMMA, "")

  if (isLikelyPersonalNameOnly(text)) return ""

  return text
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s,.;:-]+|[\s,.;:-]+$/g, "")
    .trim()
}

function isLikelyPersonalNameOnly(text: string): boolean {
  if (
    /благодійн|внесок|допомог|конверт|дрон|донат|русоріз|справ|програм|переказ|фонд/i.test(
      text
    )
  ) {
    return false
  }

  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length < 2 || words.length > 3) return false

  return words.every((word) => /^[\p{L}'`ʼ\-]+$/u.test(word))
}

/** Публічний коментар для таблиці; без імен, телефонів і ідентифікаторів. */
export function formatIncomeCommentDisplay(raw: string | undefined): string {
  const sanitized = sanitizeIncomeComment(raw ?? "")
  return sanitized || EMPTY_TABLE_VALUE
}

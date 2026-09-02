/** Нормалізація для пошуку: регістр, діакритика, лапки, зайві пробіли. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[''`´''""«»„“]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("uk")
}

function sequentialScore(haystack: string, needle: string): number | null {
  if (!needle) return 0
  const substringIndex = haystack.indexOf(needle)
  if (substringIndex !== -1) {
    const atWordStart =
      substringIndex === 0 || haystack[substringIndex - 1] === " "
    return 400 + (atWordStart ? 80 : 0) - substringIndex + needle.length
  }

  let cursor = 0
  let score = 0
  let previous = -2
  for (const char of needle) {
    const found = haystack.indexOf(char, cursor)
    if (found === -1) return null
    score += found === previous + 1 ? 12 : 2
    if (found === 0 || haystack[found - 1] === " ") score += 8
    previous = found
    cursor = found + 1
  }
  return score
}

function wordsOf(value: string): string[] {
  return value.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
}

/** Одна заміна, вставка або видалення. */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true
  if (a.length > b.length) return withinOneEdit(b, a)

  const lengthGap = b.length - a.length
  if (lengthGap > 1) return false

  let i = 0
  let j = 0
  let edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1
      j += 1
      continue
    }
    edits += 1
    if (edits > 1) return false
    if (lengthGap === 0) {
      i += 1
      j += 1
    } else {
      j += 1
    }
  }
  if (i < a.length || j < b.length) edits += 1
  return edits <= 1
}

function tokenScore(haystack: string, token: string): number | null {
  const sequential = sequentialScore(haystack, token)
  if (sequential !== null) return sequential
  if (token.length < 4) return null
  for (const word of wordsOf(haystack)) {
    if (withinOneEdit(token, word)) return 50
  }
  return null
}

/** `null`, якщо рядок не відповідає запиту. Більше число — кращий збіг. */
export function scoreFuzzyMatch(
  haystack: string,
  query: string
): number | null {
  const hay = normalizeSearchText(haystack)
  const needle = normalizeSearchText(query)
  if (!needle) return 0

  const tokens = needle.split(" ").filter(Boolean)
  let total = 0
  for (const token of tokens) {
    const part = tokenScore(hay, token)
    if (part === null) return null
    total += part
  }
  return total
}

export function matchesNameQuery(name: string, query: string): boolean {
  if (!query.trim()) return true
  return scoreFuzzyMatch(name, query) !== null
}

export const NAME_SUGGESTION_LIMIT = 8

export function rankNameSuggestions(
  names: readonly string[],
  query: string,
  limit = NAME_SUGGESTION_LIMIT
): string[] {
  if (!query.trim()) return []

  return names
    .map((name) => ({ name, score: scoreFuzzyMatch(name, query) }))
    .filter(
      (item): item is { name: string; score: number } => item.score !== null
    )
    .sort(
      (left, right) =>
        right.score - left.score || left.name.localeCompare(right.name, "uk")
    )
    .slice(0, limit)
    .map((item) => item.name)
}

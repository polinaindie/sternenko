/** Прапорець живе до наступного завантаження сторінки — саме там його читає заставка. */
const RELOAD_SPLASH_KEY = "sternenko:reports-reload-splash"

export function buildReloadUrl(pathname: string, query: string): string {
  return query ? `${pathname}?${query}` : pathname
}

export function markReportsReload(): void {
  try {
    window.sessionStorage.setItem(RELOAD_SPLASH_KEY, "1")
  } catch {
    // Приватний режим без sessionStorage — просто без заставки.
  }
}

export function consumeReportsReloadFlag(): boolean {
  try {
    const flagged = window.sessionStorage.getItem(RELOAD_SPLASH_KEY) === "1"
    if (flagged) window.sessionStorage.removeItem(RELOAD_SPLASH_KEY)
    return flagged
  } catch {
    return false
  }
}

/** Повне перезавантаження: результат гарантовано збігається з адресою. */
export function reloadReportsWithQuery(query: string): void {
  const { pathname, search } = window.location
  const next = buildReloadUrl(pathname, query)

  markReportsReload()

  if (next === `${pathname}${search}`) {
    window.location.reload()
    return
  }

  window.location.replace(next)
}

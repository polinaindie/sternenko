import { describe, expect, it } from "vitest"

import {
  matchesNameQuery,
  rankNameSuggestions,
  scoreFuzzyMatch,
} from "./fuzzy-text-match"

const NAMES = [
  "FPV Коптер Hornet F10",
  "STRIX (ReDrone)",
  "ReDrone",
  "FPV дрон Winfly Hunter",
  "Літак-перехоплювач “Тарас П”",
] as const

describe("matchesNameQuery", () => {
  it("treats an empty query as a match", () => {
    expect(matchesNameQuery("STRIX (ReDrone)", "  ")).toBe(true)
  })

  it("matches a substring regardless of case and quotes", () => {
    expect(matchesNameQuery("Літак-перехоплювач “Тарас П”", "тарас")).toBe(true)
    expect(matchesNameQuery("STRIX (ReDrone)", "strix")).toBe(true)
  })

  it("matches skipped letters and a one-letter typo", () => {
    expect(matchesNameQuery("FPV Коптер Hornet F10", "hornt")).toBe(true)
    expect(matchesNameQuery("STRIX (ReDrone)", "strik")).toBe(true)
  })

  it("requires every query word to match", () => {
    expect(matchesNameQuery("FPV Коптер Hornet F10", "fpv hornet")).toBe(true)
    expect(matchesNameQuery("FPV Коптер Hornet F10", "fpv strix")).toBe(false)
  })
})

describe("rankNameSuggestions", () => {
  it("returns nothing until the user types", () => {
    expect(rankNameSuggestions(NAMES, "")).toEqual([])
  })

  it("ranks a tighter substring above a looser subsequence", () => {
    const ranked = rankNameSuggestions(NAMES, "redrone")
    expect(ranked[0]).toBe("ReDrone")
    expect(ranked).toContain("STRIX (ReDrone)")
  })

  it("does not invent names that fail the matcher", () => {
    expect(rankNameSuggestions(NAMES, "нічого-такого-немає")).toEqual([])
  })
})

describe("scoreFuzzyMatch", () => {
  it("scores an exact prefix higher than a later substring", () => {
    const prefix = scoreFuzzyMatch("STRIX (ReDrone)", "strix")
    const later = scoreFuzzyMatch("інше STRIX", "strix")
    expect(prefix).not.toBeNull()
    expect(later).not.toBeNull()
    expect(prefix!).toBeGreaterThan(later!)
  })
})

import { describe, expect, it } from "vitest"

import { FUNDRAISINGS } from "../mock-data"
import { FUNDRAISING_FILL, FUNDRAISING_SWATCH } from "./fundraising-colors"

describe("fundraising-colors", () => {
  it("assigns a unique tag background to every fundraising", () => {
    const backgrounds = FUNDRAISINGS.map((name) => FUNDRAISING_FILL[name])

    expect(backgrounds).toHaveLength(FUNDRAISINGS.length)
    expect(new Set(backgrounds).size).toBe(FUNDRAISINGS.length)
  })

  it("covers all fundraisings from the catalog", () => {
    for (const name of FUNDRAISINGS) {
      expect(FUNDRAISING_SWATCH[name]).toBeDefined()
    }
  })
})

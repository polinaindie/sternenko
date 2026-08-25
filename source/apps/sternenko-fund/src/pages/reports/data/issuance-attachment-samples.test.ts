import { describe, expect, it } from "vitest"

import { applyIssuanceAttachmentSamples } from "./issuance-attachment-samples"

const baseRow = (id: string, date: string) => ({
  id,
  date,
  productName: `Товар ${id}`,
  attachments: { media: [], act: [], payment: [] },
})

describe("applyIssuanceAttachmentSamples", () => {
  it("adds media and act to the first two rows on the default first page", () => {
    const rows = applyIssuanceAttachmentSamples([
      baseRow("later", "30.05.2026"),
      baseRow("first", "29.05.2026"),
      baseRow("second", "28.05.2026"),
      baseRow("outside", "01.06.2026"),
    ])

    expect(rows.find((row) => row.id === "later")?.attachments.media).toHaveLength(2)
    expect(rows.find((row) => row.id === "later")?.attachments.act).toHaveLength(1)
    expect(rows.find((row) => row.id === "first")?.attachments.media).toHaveLength(1)
    expect(rows.find((row) => row.id === "first")?.attachments.act).toHaveLength(1)
    expect(rows.find((row) => row.id === "second")?.attachments.media).toHaveLength(0)
    expect(rows.find((row) => row.id === "outside")?.attachments.media).toHaveLength(0)
  })
})

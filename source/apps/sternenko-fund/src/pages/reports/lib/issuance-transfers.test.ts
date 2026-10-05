import { describe, expect, it } from "vitest"

import {
  computeTransferCellPlacements,
  flattenTransferGroups,
  groupIssuanceTransfers,
  issuanceTransferKey,
  paginateIssuanceTransferRows,
  paginateTransferGroups,
  sortIssuanceTransferGroups,
  type IssuanceTransferSortable,
} from "./issuance-transfers"

function row(
  partial: Partial<IssuanceTransferSortable> &
    Pick<IssuanceTransferSortable, "id" | "date" | "recipient">
): IssuanceTransferSortable {
  const { attachments, ...rest } = partial
  return {
    project: "Поточний",
    quantity: 1,
    unitPrice: 100,
    total: 100,
    ...rest,
    attachments: {
      payment: attachments?.payment ?? [],
      act: attachments?.act ?? [],
      media: attachments?.media ?? [],
    },
  }
}

describe("issuanceTransferKey", () => {
  it("uses payment url when present", () => {
    const a = row({
      id: "1",
      date: "09.03.2026",
      recipient: "ARARAT FPV",
      attachments: {
        payment: [{ src: "pay-1" }],
        act: [{ src: "act-other" }],
        media: [],
      },
    })
    const b = row({
      id: "2",
      date: "09.03.2026",
      recipient: "ARARAT FPV",
      attachments: {
        payment: [{ src: "pay-1" }],
        act: [],
        media: [],
      },
    })
    expect(issuanceTransferKey(a)).toBe(issuanceTransferKey(b))
  })

  it("keeps different recipients on the same day apart", () => {
    const a = row({
      id: "1",
      date: "09.03.2026",
      recipient: "ARARAT FPV",
      attachments: { payment: [{ src: "pay-1" }], act: [], media: [] },
    })
    const b = row({
      id: "2",
      date: "09.03.2026",
      recipient: "78 ОДШБр",
      attachments: { payment: [{ src: "pay-1" }], act: [], media: [] },
    })
    expect(issuanceTransferKey(a)).not.toBe(issuanceTransferKey(b))
  })
})

describe("groupIssuanceTransfers", () => {
  it("treats a single row as a group of one", () => {
    const groups = groupIssuanceTransfers([
      row({ id: "a", date: "01.05.2026", recipient: "Альфа", total: 50 }),
    ])

    expect(groups).toHaveLength(1)
    expect(groups[0]!.rows.map((item) => item.id)).toEqual(["a"])
    expect(groups[0]!.total).toBe(50)
  })

  it("merges three kit lines that share the transfer key", () => {
    const shared = {
      date: "09.03.2026" as const,
      recipient: "ARARAT FPV",
      project: "Опторіз",
      attachments: {
        payment: [{ src: "pay-kit" }],
        act: [],
        media: [],
      },
    }
    const groups = groupIssuanceTransfers([
      row({ id: "fiber", ...shared, total: 900_000 }),
      row({ id: "ibor", ...shared, total: 380_000 }),
      row({ id: "gs", ...shared, total: 217_000 }),
    ])

    expect(groups).toHaveLength(1)
    expect(groups[0]!.rows).toHaveLength(3)
    expect(groups[0]!.total).toBe(1_497_000)
  })

  it("keeps different units on the same day in separate groups", () => {
    const groups = groupIssuanceTransfers([
      row({
        id: "a",
        date: "09.03.2026",
        recipient: "ARARAT FPV",
        attachments: { payment: [{ src: "p1" }], act: [], media: [] },
      }),
      row({
        id: "b",
        date: "09.03.2026",
        recipient: "КОНДОР",
        attachments: { payment: [{ src: "p1" }], act: [], media: [] },
      }),
      row({
        id: "c",
        date: "09.03.2026",
        recipient: "ARARAT FPV",
        attachments: { payment: [{ src: "p1" }], act: [], media: [] },
      }),
    ])

    expect(groups).toHaveLength(2)
    expect(groups[0]!.rows.map((item) => item.id)).toEqual(["a", "c"])
    expect(groups[1]!.rows.map((item) => item.id)).toEqual(["b"])
  })
})

describe("computeTransferCellPlacements", () => {
  it("rowspans consecutive kit rows", () => {
    const shared = {
      date: "09.03.2026" as const,
      recipient: "ARARAT FPV",
      attachments: { payment: [{ src: "pay" }], act: [], media: [] },
    }
    const rows = [
      row({ id: "a", ...shared }),
      row({ id: "b", ...shared }),
      row({ id: "c", date: "09.03.2026", recipient: "Інший" }),
    ]
    const placements = computeTransferCellPlacements(rows)

    expect(placements.get("a")).toEqual({
      show: true,
      rowSpan: 2,
      isTransferStart: true,
    })
    expect(placements.get("b")).toEqual({
      show: false,
      rowSpan: 1,
      isTransferStart: false,
    })
    expect(placements.get("c")).toEqual({
      show: true,
      rowSpan: 1,
      isTransferStart: true,
    })
  })
})

describe("paginateTransferGroups", () => {
  it("does not split a kit across pages", () => {
    const shared = {
      date: "09.03.2026" as const,
      recipient: "ARARAT FPV",
      attachments: { payment: [{ src: "pay" }], act: [], media: [] },
    }
    const rows = [
      row({ id: "solo", date: "09.03.2026", recipient: "Інший", total: 10 }),
      row({ id: "k1", ...shared, total: 1 }),
      row({ id: "k2", ...shared, total: 1 }),
      row({ id: "k3", ...shared, total: 1 }),
    ]
    const { pages } = paginateIssuanceTransferRows(rows, 2)

    expect(pages).toHaveLength(2)
    expect(pages[0]!.map((item) => item.id)).toEqual(["solo"])
    expect(pages[1]!.map((item) => item.id)).toEqual(["k1", "k2", "k3"])
  })

  it("keeps a group larger than pageSize on one page", () => {
    const shared = {
      date: "01.05.2026" as const,
      recipient: "Альфа",
      attachments: { payment: [{ src: "p" }], act: [], media: [] },
    }
    const groups = groupIssuanceTransfers([
      row({ id: "a", ...shared }),
      row({ id: "b", ...shared }),
      row({ id: "c", ...shared }),
    ])
    const pages = paginateTransferGroups(groups, 2)

    expect(pages).toHaveLength(1)
    expect(flattenTransferGroups(pages[0]!)).toHaveLength(3)
  })
})

describe("sortIssuanceTransferGroups", () => {
  it("sorts kits by group total, not line total", () => {
    const kit = {
      date: "01.05.2026" as const,
      recipient: "Альфа",
      attachments: { payment: [{ src: "kit" }], act: [], media: [] },
    }
    const groups = groupIssuanceTransfers([
      row({ id: "solo", date: "01.05.2026", recipient: "Бета", total: 800 }),
      row({ id: "k1", ...kit, total: 400 }),
      row({ id: "k2", ...kit, total: 500 }),
    ])
    const sorted = sortIssuanceTransferGroups(groups, "total", -1)

    expect(sorted.map((group) => group.rows[0]!.id)).toEqual(["k1", "solo"])
  })
})

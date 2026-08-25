import type { Meta, StoryObj } from "@storybook/react-vite"
import { useMemo, useState } from "react"

import { formatReportNumber } from "@workspace/ui/components/report-metric"
import {
  ReportTable,
  ReportTableBody,
  ReportTableCell,
  ReportTableHead,
  ReportTableHeadSortable,
  ReportTableHeader,
  ReportTableHeaderRow,
  ReportTableRow,
  type ReportSortDirection,
} from "@workspace/ui/components/report-table"

const ROWS = [
  {
    id: "1",
    at: "18.06.26, 09:42:00",
    atTs: 1718696520000,
    source: "Monobank",
    amount: 500,
    currency: "UAH",
    amountUah: 500,
    fundraising: "Шахедоріз",
    donorType: "Фізична особа",
  },
  {
    id: "2",
    at: "18.06.26, 09:41:00",
    atTs: 1718696460000,
    source: "PayPal",
    amount: 50,
    currency: "USD",
    amountUah: 2080,
    fundraising: "Русоріз",
    donorType: "Фізична особа",
  },
  {
    id: "3",
    at: "18.06.26, 09:38:00",
    atTs: 1718696280000,
    source: "Валютний рахунок",
    amount: 100,
    currency: "EUR",
    amountUah: 4500,
    fundraising: "Небесний Русоріз",
    donorType: "Юридична особа",
  },
] as const

type SortKey = "date" | "amount" | "amountUah"

const DEFAULT_SORT_KEY: SortKey = "date"
const DEFAULT_SORT_DIR: ReportSortDirection = "desc"

function cycleSort(
  key: SortKey,
  activeKey: SortKey | null,
  activeDir: ReportSortDirection
): { activeKey: SortKey | null; direction: ReportSortDirection } {
  if (activeKey !== key) {
    return { activeKey: key, direction: "asc" }
  }
  if (activeDir === "asc") {
    return { activeKey: key, direction: "desc" }
  }
  return { activeKey: null, direction: DEFAULT_SORT_DIR }
}

function IncomeTransactionsTableDemo() {
  const [activeSortKey, setActiveSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<ReportSortDirection>(DEFAULT_SORT_DIR)
  const sortKey = activeSortKey ?? DEFAULT_SORT_KEY

  const sortedRows = useMemo(() => {
    const rows = [...ROWS]
    const direction = sortDir === "asc" ? 1 : -1

    rows.sort((a, b) => {
      if (sortKey === "date") {
        return (a.atTs - b.atTs) * direction
      }
      if (sortKey === "amount") {
        return (a.amount - b.amount) * direction
      }
      return (a.amountUah - b.amountUah) * direction
    })

    return rows
  }, [sortKey, sortDir])

  const handleCycleSort = (key: SortKey) => {
    const next = cycleSort(key, activeSortKey, sortDir)
    setActiveSortKey(next.activeKey)
    setSortDir(next.direction)
  }

  return (
    <ReportTable className="max-w-5xl" tableClassName="table-fixed">
      <ReportTableHeader>
        <ReportTableHeaderRow>
          <ReportTableHeadSortable
            label="Дата"
            sortDirection={activeSortKey === "date" ? sortDir : null}
            onCycleSort={() => handleCycleSort("date")}
            className="w-[14%]"
          />
          <ReportTableHead className="w-[17%]">Джерело надходження</ReportTableHead>
          <ReportTableHeadSortable
            label="Сума"
            sortDirection={activeSortKey === "amount" ? sortDir : null}
            onCycleSort={() => handleCycleSort("amount")}
            align="right"
            className="w-[10%]"
          />
          <ReportTableHead className="w-[7%]">Валюта</ReportTableHead>
          <ReportTableHeadSortable
            label="Сума еквівалент у ₴"
            sortDirection={activeSortKey === "amountUah" ? sortDir : null}
            onCycleSort={() => handleCycleSort("amountUah")}
            align="right"
            className="w-[20%]"
          />
          <ReportTableHead className="w-[17%]">Проєкт</ReportTableHead>
          <ReportTableHead className="w-[15%]">Тип донора</ReportTableHead>
        </ReportTableHeaderRow>
      </ReportTableHeader>
      <ReportTableBody>
        {sortedRows.map((row) => (
          <ReportTableRow key={row.id}>
            <ReportTableCell className="whitespace-nowrap tabular-nums">{row.at}</ReportTableCell>
            <ReportTableCell>{row.source}</ReportTableCell>
            <ReportTableCell className="text-right tabular-nums">
              {formatReportNumber(row.amount)}
            </ReportTableCell>
            <ReportTableCell>{row.currency}</ReportTableCell>
            <ReportTableCell className="text-right tabular-nums">
              {formatReportNumber(row.amountUah)}
            </ReportTableCell>
            <ReportTableCell>{row.fundraising}</ReportTableCell>
            <ReportTableCell>{row.donorType}</ReportTableCell>
          </ReportTableRow>
        ))}
      </ReportTableBody>
    </ReportTable>
  )
}

const meta = {
  title: "Report/Table",
  component: ReportTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ReportTable>

export default meta
type Story = StoryObj<typeof meta>

export const IncomeTransactions: Story = {
  render: () => <IncomeTransactionsTableDemo />,
}

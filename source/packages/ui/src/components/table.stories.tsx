import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

const INVOICES = [
  { id: "INV-001", status: "Paid", total: "$250.00" },
  { id: "INV-002", status: "Pending", total: "$150.00" },
  { id: "INV-003", status: "Unpaid", total: "$350.00" },
]

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  render: () => (
    <div className="w-96">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVOICES.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell className="text-right">{invoice.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

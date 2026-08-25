import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { BlockShell } from "./block-shell"

const TASKS = [
  {
    id: "TASK-8782",
    title: "Update documentation",
    status: "In progress",
    priority: "High",
    done: false,
  },
  {
    id: "TASK-7878",
    title: "Fix navigation bug",
    status: "Todo",
    priority: "Medium",
    done: false,
  },
  {
    id: "TASK-7839",
    title: "Review pull requests",
    status: "Done",
    priority: "Low",
    done: true,
  },
  {
    id: "TASK-5562",
    title: "Prepare release notes",
    status: "Todo",
    priority: "High",
    done: false,
  },
]

function priorityVariant(priority: string) {
  if (priority === "High") return "destructive" as const
  if (priority === "Medium") return "secondary" as const
  return "outline" as const
}

export function TasksBlock() {
  return (
    <BlockShell className="p-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground text-sm">
              Manage and track your team&apos;s work.
            </p>
          </div>
          <Button>Add task</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Task board</CardTitle>
            <CardDescription>
              A simple task list with status and priority.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input placeholder="Filter tasks…" className="max-w-sm" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead>Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TASKS.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Checkbox defaultChecked={task.done} aria-label="Done" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-muted-foreground text-xs">{task.id}</div>
                    </TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </BlockShell>
  )
}

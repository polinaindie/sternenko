import { useState } from "react"
import { CalendarIcon, ClockIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"

import { BlockShell } from "./block-shell"

const EVENTS = [
  { time: "09:00", title: "Team standup", type: "Meeting" },
  { time: "11:30", title: "Design review", type: "Review" },
  { time: "14:00", title: "Client call", type: "Call" },
]

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function CalendarBlock() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <BlockShell>
      <SidebarProvider>
        <Sidebar className="border-r">
          <SidebarHeader className="px-3 py-3 font-medium">Schedule</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Views</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {MONTHS.slice(0, 4).map((month, index) => (
                    <SidebarMenuItem key={month}>
                      <SidebarMenuButton isActive={index === 0}>
                        <CalendarIcon />
                        <span>{month}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="font-medium">Calendar</h1>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Pick a date</CardTitle>
                <CardDescription>
                  Browse your schedule by day or month.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border"
                />
              </CardContent>
            </Card>
            <Card className="w-full lg:max-w-xs">
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>Events for the selected day</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {EVENTS.map((event, index) => (
                  <div key={event.title}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-muted-foreground flex items-center gap-1 text-sm">
                          <ClockIcon className="size-3.5" />
                          {event.time}
                        </p>
                      </div>
                      <Badge variant="secondary">{event.type}</Badge>
                    </div>
                    {index < EVENTS.length - 1 ? (
                      <Separator className="mt-4" />
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BlockShell>
  )
}

import {
  BarChart3Icon,
  CalendarIcon,
  HomeIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import { Bar, BarChart, XAxis } from "recharts"

import { Badge } from "@workspace/ui/components/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
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
import { Grid } from "@workspace/ui/layout/grid"
import { PageShell } from "@workspace/ui/layout/page-shell"
import { Stack } from "@workspace/ui/layout/stack"

const NAV = [
  { title: "Overview", icon: HomeIcon },
  { title: "Analytics", icon: BarChart3Icon },
  { title: "Team", icon: UsersIcon },
  { title: "Calendar", icon: CalendarIcon },
  { title: "Settings", icon: SettingsIcon },
]

const CHART_DATA = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 3800 },
  { month: "Mar", revenue: 5100 },
  { month: "Apr", revenue: 4600 },
  { month: "May", revenue: 5400 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const STATS = [
  { title: "Total revenue", value: "$45,231", change: "+20.1%" },
  { title: "Subscriptions", value: "+2,350", change: "+12.5%" },
  { title: "Active users", value: "1,204", change: "+4.2%" },
]

export function DashboardBlock() {
  return (
    <PageShell>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="px-3 py-3 font-medium">Acme Inc</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={item.title === "Overview"}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <Stack className="flex-1 gap-4 p-4">
            <Grid className="md:grid-cols-3">
              {STATS.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="pb-2">
                    <CardDescription>{stat.title}</CardDescription>
                    <CardTitle className="text-2xl">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{stat.change} from last month</Badge>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[220px] w-full">
                  <BarChart data={CHART_DATA}>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </Stack>
        </SidebarInset>
      </SidebarProvider>
    </PageShell>
  )
}

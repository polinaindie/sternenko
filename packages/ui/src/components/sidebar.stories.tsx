import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarIcon, HomeIcon, SettingsIcon } from "lucide-react"

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

const ITEMS = [
  { title: "Home", icon: HomeIcon },
  { title: "Calendar", icon: CalendarIcon },
  { title: "Settings", icon: SettingsIcon },
]

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-3 py-2 font-medium">Acme Inc</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ITEMS.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
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
      <SidebarInset className="p-4">
        <SidebarTrigger />
        <p className="text-muted-foreground mt-4 text-sm">
          Main content area. Toggle the sidebar with the trigger.
        </p>
      </SidebarInset>
    </SidebarProvider>
  ),
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

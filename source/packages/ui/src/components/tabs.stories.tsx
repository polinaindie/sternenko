import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  render: () => (
    <Tabs defaultValue="overview" className="w-72">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground pt-2 text-sm">
        Overview content.
      </TabsContent>
      <TabsContent value="details" className="text-muted-foreground pt-2 text-sm">
        Details content.
      </TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

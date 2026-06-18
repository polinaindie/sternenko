import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Progress } from "@workspace/ui/components/progress"
import { Switch } from "@workspace/ui/components/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Container } from "@workspace/ui/layout/container"
import { PageShell } from "@workspace/ui/layout/page-shell"

const meta = {
  title: "Overview/Theme Preview",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Panel: Story = {
  render: () => (
    <PageShell>
      <Container className="py-10 md:py-16">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Use the toolbar to re-skin</CardTitle>
              <CardDescription>
                Switch the brand theme and light/dark above — every component
                updates from CSS variables, no code changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Badge>Badge</Badge>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" defaultChecked />
                  <Label htmlFor="terms" className="font-normal">
                    Accept terms
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="emails" defaultChecked />
                  <Label htmlFor="emails" className="font-normal">
                    Emails
                  </Label>
                </div>
              </div>

              <Progress value={62} />

              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="overview"
                  className="text-muted-foreground pt-2 text-sm"
                >
                  One component library, many brands.
                </TabsContent>
                <TabsContent
                  value="details"
                  className="text-muted-foreground pt-2 text-sm"
                >
                  Tokens drive color, radius, shadow and font.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Container>
    </PageShell>
  ),
}

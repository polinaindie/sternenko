import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { BlockShell } from "./block-shell"

export function PlaygroundBlock() {
  const [variant, setVariant] = useState("default")
  const [size, setSize] = useState("default")
  const [disabled, setDisabled] = useState(false)

  return (
    <BlockShell className="p-6">
      <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>
              Tweak props and see the preview update live.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Variant</Label>
              <Select value={variant} onValueChange={setVariant}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="disabled">Disabled</Label>
              <Switch
                id="disabled"
                checked={disabled}
                onCheckedChange={setDisabled}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Button component playground</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-48 items-center justify-center rounded-lg border border-dashed">
            <Tabs defaultValue="button">
              <TabsList>
                <TabsTrigger value="button">Button</TabsTrigger>
                <TabsTrigger value="group">Group</TabsTrigger>
              </TabsList>
              <TabsContent value="button" className="pt-4">
                <Button
                  variant={
                    variant as
                      | "default"
                      | "secondary"
                      | "outline"
                      | "ghost"
                      | "destructive"
                  }
                  size={size as "sm" | "default" | "lg"}
                  disabled={disabled}
                >
                  Playground button
                </Button>
              </TabsContent>
              <TabsContent value="group" className="flex gap-2 pt-4">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </BlockShell>
  )
}

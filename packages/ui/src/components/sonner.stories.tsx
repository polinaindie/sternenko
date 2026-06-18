import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"
import { Toaster, toast } from "@workspace/ui/components/sonner"

const meta = {
  title: "Components/Sonner (Toast)",
  component: Toaster,
  tags: ["autodocs"],
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Saved", { description: "Your changes are live." })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </>
  ),
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

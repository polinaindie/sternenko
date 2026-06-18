import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import {
  Card,
  CardContent,
} from "@workspace/ui/components/card"

const SLIDES = [1, 2, 3, 4, 5]

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  render: () => (
    <Carousel className="mx-auto w-full max-w-xs">
      <CarouselContent>
        {SLIDES.map((slide) => (
          <CarouselItem key={slide}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{slide}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

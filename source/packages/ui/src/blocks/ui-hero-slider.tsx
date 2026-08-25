"use client"

import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@workspace/ui/components/carousel"
import { cn } from "@workspace/ui/lib/utils"

import type { UiHeroSlide } from "./ui-types"

type UiHeroSliderProps = {
  slides: UiHeroSlide[]
  className?: string
}

function UiHeroSlider({ slides, className }: UiHeroSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <section
      data-slot="ui-hero-slider"
      aria-label="Головний слайдер"
      className={cn("relative w-full bg-black", className)}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.href} className="pl-0">
              <a
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                tabIndex={index === current ? 0 : -1}
                aria-hidden={index !== current}
              >
                <img
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  className="aspect-[1920/1000] w-full object-cover"
                />
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <ol
        aria-label="Навігація слайдера"
        className="absolute bottom-4 right-4 flex list-none gap-2 md:bottom-6 md:right-8"
      >
        {slides.map((slide, index) => (
          <li key={slide.href}>
            <button
              type="button"
              aria-label={`Слайд ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "flex size-8 items-center justify-center border text-sm font-bold transition-colors",
                index === current
                  ? "border-white bg-white text-black"
                  : "border-white/60 bg-transparent text-white hover:border-white"
              )}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}

export { UiHeroSlider }

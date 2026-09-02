import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/layout/container"
import { PageShell } from "@workspace/ui/layout/page-shell"
import { Stack } from "@workspace/ui/layout/stack"

import { SkipToContentLink } from "../../components/SkipToContentLink"
import { SiteHeader } from "../../components/site-header/SiteHeader"
import { homeHref } from "../../components/site-header/nav"

export function ServerErrorPage() {
  return (
    <PageShell>
      <SkipToContentLink />
      <SiteHeader markCurrentNav={false} />

      <div style={{ paddingTop: "var(--site-header-offset, 4.75rem)" }}>
        <main
          id="main"
          className="flex min-h-[calc(100svh-var(--site-header-offset,4.75rem))] items-center"
        >
          <Container className="py-[46px]">
            <Stack className="gap-8 md:gap-10">
              <Stack className="gap-6">
                <h1 className="uppercase">
                  <span
                    className="text-primary block text-[clamp(4.5rem,18vw,11rem)] leading-[0.85] tracking-tight [font-family:var(--font-display-black)]"
                    aria-hidden="true"
                  >
                    500
                  </span>
                  <span className="sr-only">Помилка 500. </span>
                  <span className="mt-4 block text-3xl tracking-tight md:mt-6 md:text-4xl">
                    Внутрішня помилка сервера
                  </span>
                </h1>

                <span aria-hidden="true" className="bg-primary block h-px w-24" />

                <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
                  Сервер не зміг обробити запит. Дані звітності не втрачені —
                  спробуйте оновити сторінку за кілька хвилин або поверніться на
                  головну.
                </p>
              </Stack>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  className="h-[46px] w-[13.75rem] px-5 text-base normal-case [font-family:var(--font-display-dark)]"
                  onClick={() => window.location.reload()}
                >
                  Оновити сторінку
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-foreground/40 hover:bg-foreground/10 dark:border-foreground/40 dark:hover:bg-foreground/10 h-[46px] w-[13.75rem] bg-transparent px-5 text-base normal-case dark:bg-transparent [font-family:var(--font-display-dark)]"
                >
                  <a href={homeHref}>На головну</a>
                </Button>
              </div>
            </Stack>
          </Container>
        </main>
      </div>
    </PageShell>
  )
}

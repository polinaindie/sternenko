import { Container } from "@workspace/ui/layout/container"
import { Grid } from "@workspace/ui/layout/grid"
import { cn } from "@workspace/ui/lib/utils"

type UiSiteFooterProps = {
  logoSrc: string
  className?: string
}

function UiSiteFooter({ logoSrc, className }: UiSiteFooterProps) {
  return (
    <footer
      data-slot="ui-site-footer"
      role="contentinfo"
      className={cn("bg-primary text-primary-foreground", className)}
    >
      <Container className="py-10 md:py-14">
        <Grid className="gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <img
              src={logoSrc}
              alt="Український інститут"
              className="mb-6 h-auto w-3/5 max-w-[12rem] brightness-0 invert"
            />
            <p className="text-base leading-relaxed md:text-xl">
              Зміцнення міжнародної і внутрішньої суб&apos;єктивності України
              за допомогою культурної дипломатії
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold tracking-[-0.04em] md:text-xl">
              Адреса:
            </h2>
            <address className="not-italic text-base leading-relaxed md:text-xl">
              01001, Україна, Київ,
              <br />
              вул. Лютеранська, 12
            </address>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold tracking-[-0.04em] md:text-xl">
              Напишіть нам:
            </h2>
            <p className="text-base leading-relaxed md:text-xl">
              <strong>
                <a
                  href="mailto:media@ui.org.ua"
                  className="underline underline-offset-4"
                >
                  media@ui.org.ua
                </a>
              </strong>
              {" — для медіа"}
            </p>
          </div>
        </Grid>
      </Container>
    </footer>
  )
}

export { UiSiteFooter }

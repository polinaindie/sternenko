import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/layout/container"
import { PageShell } from "@workspace/ui/layout/page-shell"
import { Stack } from "@workspace/ui/layout/stack"

import logoHorizon from "../../assets/brand/logo-horizon-dark.png"

export function HomePage() {
  return (
    <PageShell>
      <Container className="py-10">
        <Stack className="gap-10">
          <img
            src={logoHorizon}
            alt="Благодійний фонд Спільнота Стерненка"
            className="h-14 w-auto md:h-16"
            width={320}
            height={64}
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Спільнота Стерненка
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
              Благодійний фонд для постійного забезпечення Сил безпеки та
              оборони дронами та розвитку безпілотних технологій.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Підтримати фонд</Button>
            <Button variant="outline">Дізнатися більше</Button>
          </div>
        </Stack>
      </Container>
    </PageShell>
  )
}

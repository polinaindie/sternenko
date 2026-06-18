import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/layout/container"
import { PageShell } from "@workspace/ui/layout/page-shell"
import { Stack } from "@workspace/ui/layout/stack"

export function HomePage() {
  return (
    <PageShell>
      <Container className="py-10">
        <Stack>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">__SITE_TITLE__</h1>
            <p className="text-muted-foreground text-sm">
              Build pages in{" "}
              <code className="text-xs">apps/__SITE_NAME__/src/pages/</code>. Use
              Storybook as the component reference.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Primary action</Button>
            <Button variant="outline">Secondary</Button>
          </div>
        </Stack>
      </Container>
    </PageShell>
  )
}

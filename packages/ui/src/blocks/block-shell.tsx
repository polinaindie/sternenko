import { PageShell } from "@workspace/ui/layout/page-shell"

// Thin alias kept for existing blocks; PageShell is the canonical primitive.
export function BlockShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <PageShell className={className}>{children}</PageShell>
}

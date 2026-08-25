import { PageShell } from "@workspace/ui/layout/page-shell"
import { cn } from "@workspace/ui/lib/utils"

import { LoginForm } from "./login-form"

export function LoginBlock({ className }: { className?: string }) {
  return (
    <PageShell
      className={cn("flex items-center justify-center p-6 md:p-10", className)}
    >
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </PageShell>
  )
}

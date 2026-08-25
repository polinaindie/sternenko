import { cn } from "@workspace/ui/lib/utils"

import { BlockShell } from "./block-shell"
import { SignupForm } from "./signup-form"

export function SignupBlock({ className }: { className?: string }) {
  return (
    <BlockShell
      className={cn("flex items-center justify-center p-6 md:p-10", className)}
    >
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </BlockShell>
  )
}

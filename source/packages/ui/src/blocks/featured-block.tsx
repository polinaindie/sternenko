import { GalleryVerticalEndIcon } from "lucide-react"

import { PageShell } from "@workspace/ui/layout/page-shell"

import { LoginForm } from "./login-form"

export function FeaturedBlock() {
  return (
    <PageShell className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden flex-col justify-between p-10 lg:flex">
        <div className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Acme Inc
        </div>
        <blockquote className="max-w-sm text-lg leading-snug">
          &ldquo;This library saved us countless hours and aligned design with
          code from day one.&rdquo;
        </blockquote>
        <p className="text-muted-foreground text-sm">— Sofia, Product Designer</p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </PageShell>
  )
}

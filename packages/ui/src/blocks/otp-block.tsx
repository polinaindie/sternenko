import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { cn } from "@workspace/ui/lib/utils"

import { BlockShell } from "./block-shell"

export function OtpBlock({ className }: { className?: string }) {
  return (
    <BlockShell
      className={cn("flex items-center justify-center p-6 md:p-10", className)}
    >
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to m@example.com
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <FieldGroup>
                <Field className="items-center">
                  <FieldLabel htmlFor="otp" className="sr-only">
                    One-time password
                  </FieldLabel>
                  <InputOTP id="otp" maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription className="text-center">
                    Enter the code from your email.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" className="w-full">
                    Verify
                  </Button>
                  <FieldDescription className="text-center">
                    Didn&apos;t receive a code? <a href="#">Resend</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </BlockShell>
  )
}

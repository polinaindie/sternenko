import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { BlockShell } from "./block-shell"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"

export function AuthenticationBlock() {
  return (
    <BlockShell className="flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Tabs defaultValue="login">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </BlockShell>
  )
}

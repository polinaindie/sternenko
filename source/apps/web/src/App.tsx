import { useState } from "react"
import {
  BellIcon,
  BoldIcon,
  CalendarIcon,
  ItalicIcon,
  TriangleAlertIcon,
  UnderlineIcon,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Progress } from "@workspace/ui/components/progress"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Slider } from "@workspace/ui/components/slider"
import { Switch } from "@workspace/ui/components/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Textarea } from "@workspace/ui/components/textarea"
import { Toaster, toast } from "@workspace/ui/components/sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

import {
  BRAND_THEMES,
  useBrandTheme,
} from "@workspace/ui/providers/brand-theme-provider"

const INVOICES = [
  { id: "INV-001", status: "Paid", total: "$250.00" },
  { id: "INV-002", status: "Pending", total: "$150.00" },
  { id: "INV-003", status: "Unpaid", total: "$350.00" },
]

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">{children}</CardContent>
    </Card>
  )
}

export function App() {
  const { brandTheme, setBrandTheme } = useBrandTheme()
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground min-h-svh p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Design System
              </h1>
              <p className="text-muted-foreground text-sm">
                One <code className="text-xs">@workspace/ui</code>, many designs
                via theme tokens.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {BRAND_THEMES.map((theme) => (
                <Button
                  key={theme}
                  variant={brandTheme === theme ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBrandTheme(theme)}
                >
                  {theme}
                </Button>
              ))}
            </div>
          </header>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Gallery</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Section
            title="Actions & identity"
            description="Buttons, badges, avatar and tooltip — all driven by the active theme."
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">Ghost</Button>
                </TooltipTrigger>
                <TooltipContent>Tooltip follows the theme</TooltipContent>
              </Tooltip>
              <Button variant="destructive">Destructive</Button>
              <Badge>Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Avatar>
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
            </div>
          </Section>

          <Section
            title="Form controls"
            description="Inputs, selects, choices and toggles share one token contract."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan">Plan</Label>
                <Select>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Choose a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Tell us what you think…" />
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground text-xs uppercase">
                  Notifications
                </Label>
                <RadioGroup defaultValue="all" className="gap-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="all" id="r-all" />
                    <Label htmlFor="r-all" className="font-normal">
                      All
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="mentions" id="r-mentions" />
                    <Label htmlFor="r-mentions" className="font-normal">
                      Mentions
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="font-normal">
                    Accept terms
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="marketing" />
                  <Label htmlFor="marketing" className="font-normal">
                    Marketing emails
                  </Label>
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="Navigation & disclosure"
            description="Tabs and accordion match the Figma shadcn kit structure."
          >
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent
                value="overview"
                className="text-muted-foreground pt-2 text-sm"
              >
                Tabs, inputs and triggers share the same token contract.
              </TabsContent>
              <TabsContent
                value="details"
                className="text-muted-foreground pt-2 text-sm"
              >
                Switch the brand theme to re-skin everything at once.
              </TabsContent>
            </Tabs>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Product Information</AccordionTrigger>
                <AccordionContent>
                  Matches the Accordion from the Figma shadcn kit.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Shipping Details</AccordionTrigger>
                <AccordionContent>
                  Theme changes colors and radius without forking components.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          <Section
            title="Feedback"
            description="Alerts and toasts pick up the theme's colors and radius."
          >
            <Alert>
              <BellIcon />
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>
                This alert uses the card and border tokens.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <TriangleAlertIcon />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                Destructive variant maps to the destructive token.
              </AlertDescription>
            </Alert>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  toast.success("Saved", {
                    description: "Your changes are live.",
                  })
                }
              >
                Show toast
              </Button>
            </div>
          </Section>

          <Section
            title="Overlays"
            description="Dialogs, sheets, popovers and confirmations inherit the theme."
          >
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Themed dialog</DialogTitle>
                    <DialogDescription>
                      Overlays inherit the active theme too.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Side sheet</SheetTitle>
                    <SheetDescription>
                      Slide-over panel for mobile and settings flows.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="font-medium">Quick settings</p>
                  <p className="text-muted-foreground">
                    Popovers reuse the popover and ring tokens.
                  </p>
                </PopoverContent>
              </Popover>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Section>

          <Section
            title="Data display"
            description="Table and pagination for admin and dashboard screens."
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INVOICES.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell className="text-right">{invoice.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>

          <Section
            title="Date & command"
            description="Calendar and command palette round out the kit."
          >
            <div className="flex flex-wrap items-start gap-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon />
                    {date ? date.toLocaleDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>

              <Command className="max-w-xs border">
                <CommandInput placeholder="Type a command…" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>Profile</CommandItem>
                    <CommandItem>Billing</CommandItem>
                    <CommandItem>Settings</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </Section>

          <Section
            title="Indicators & toggles"
            description="Progress, slider, toggle group and hover card round out the kit."
          >
            <div className="grid gap-2">
              <Label>Upload progress</Label>
              <Progress value={62} />
            </div>

            <div className="grid gap-2">
              <Label>Volume</Label>
              <Slider defaultValue={[40]} max={100} step={1} />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground text-xs uppercase">
                  Format
                </Label>
                <ToggleGroup type="multiple" variant="outline">
                  <ToggleGroupItem value="bold" aria-label="Bold">
                    <BoldIcon />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Italic">
                    <ItalicIcon />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Underline">
                    <UnderlineIcon />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">@design-system</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="font-medium">Design System</p>
                  <p className="text-muted-foreground text-sm">
                    One component library, re-skinned per brand via tokens.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </Section>

          <p className="text-muted-foreground text-xs">
            Press <kbd className="rounded border px-1">d</kbd> for light/dark
            mode. Brand theme: <strong>{brandTheme}</strong>
          </p>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}

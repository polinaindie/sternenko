import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { cn } from "@workspace/ui/lib/utils"

import { siteControlClass, useFilterControlId } from "./report-ui"

type NameSearchFilterProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  id?: string
  className?: string
}

export function NameSearchFilter({
  value,
  onChange,
  onSubmit,
  placeholder = "",
  id,
  className,
}: NameSearchFilterProps) {
  const controlId = useFilterControlId(id)

  return (
    <InputGroup className={cn(siteControlClass, "h-[38px] rounded-none", className)}>
      <InputGroupAddon>
        <SearchIcon className="size-4 opacity-60" aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        id={controlId}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            onSubmit?.()
          }
        }}
      />
    </InputGroup>
  )
}

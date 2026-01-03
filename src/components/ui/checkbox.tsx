import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
      onCheckedChange?.(event.target.checked)
    }

    return (
      <div className="relative flex items-center justify-center w-4 h-4">
        <input
          type="checkbox"
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-transparent checked:bg-primary checked:text-primary-foreground",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" />
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

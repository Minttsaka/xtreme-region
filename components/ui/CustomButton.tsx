import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
        outline: "border border-primary bg-background hover:bg-primary/10 text-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
      hasArrow: {
        true: "pr-10",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hasArrow: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, hasArrow,disabled, children, ...props }, ref) => {
    return (
      <button disabled={disabled} className={cn(buttonVariants({ variant, size, hasArrow, className }))} ref={ref} {...props}>
        <span className="relative z-10">{children}</span>
        {hasArrow && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 transition-transform group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
        <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
      </button>
    )
  },
)
CustomButton.displayName = "CustomButton"

export { CustomButton, buttonVariants }

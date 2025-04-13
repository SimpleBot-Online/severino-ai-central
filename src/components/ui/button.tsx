
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-black border border-green-500/50 text-green-500 hover:bg-green-500/10 hover:border-green-500/90 hover:shadow-[0_0_10px_rgba(0,255,200,0.3)]",
        destructive:
          "bg-black border border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500/80",
        outline:
          "border border-green-500/30 bg-black hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/70",
        secondary:
          "bg-black border border-green-500/30 text-green-500/80 hover:bg-green-500/10 hover:text-green-400",
        ghost: "text-green-500/80 hover:bg-green-500/10 hover:text-green-400",
        link: "text-green-500 underline-offset-4 hover:underline hover:text-green-400",
        terminal: "bg-black border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/70 hover:text-green-300 font-mono",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

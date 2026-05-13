import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

// This creates different button styles using class-variance-authority (cva)
// Think of it like a "style factory" that generates CSS classes based on props
const buttonVariants = cva(
  // Base styles that ALL buttons get (regardless of variant/size)
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Different button types (primary, secondary, etc.)
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground", // No background until hover
        link: "text-primary underline-offset-4 hover:underline", // Looks like a link
      },
      // Different button sizes
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",        // Smaller button
        lg: "h-11 rounded-md px-8",       // Larger button
        icon: "h-10 w-10",                // Square button for icons
      },
    },
    // What happens if no variant/size is specified
    defaultVariants: {
      variant: "default",  // Blue primary button
      size: "default",     // Normal size
    },
  }
)

// TypeScript interface - defines what props the Button can accept
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, // All normal button props (onClick, disabled, etc.)
    VariantProps<typeof buttonVariants> {                // Our custom variant/size props
  asChild?: boolean  // Special prop: if true, renders as whatever child element you pass
}

// The actual Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If asChild is true, use Radix's Slot component (advanced feature)
    // Otherwise, use a regular HTML button
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))} // Combine generated styles
        ref={ref}
        {...props} // Spread all other props (onClick, children, etc.)
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

export default Button;

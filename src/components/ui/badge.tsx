import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

// Badge styles using class-variance-authority
// Badges are small labels/tags (like "Pro", "Completed", "85%")
const badgeVariants = cva(
  // Base styles for ALL badges
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary badge (blue background)
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        
        // Secondary badge (gray background) 
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        // Destructive badge (red background) - for errors, warnings
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        
        // Outline badge (just border, no background)
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default", // Blue badge if no variant specified
    },
  }
)

// TypeScript interface for Badge props
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, // Normal div props (className, onClick, etc.)
    VariantProps<typeof badgeVariants> {}       // Our custom variant prop

// The Badge component - much simpler than Button!
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} // Apply the correct variant styles
      {...props} // Spread other props (children, onClick, etc.)
    />
  )
}

export { Badge, badgeVariants }
export default Badge;


/*
USAGE EXAMPLES:

<Badge>Pro</Badge>                          // Blue badge with "Pro"
<Badge variant="secondary">Beginner</Badge> // Gray badge with "Beginner" 
<Badge variant="destructive">Error</Badge>  // Red badge with "Error"
<Badge variant="outline">85%</Badge>        // Outline badge with "85%"

Common use cases:
- User roles: "Pro", "Student", "Admin"
- Status: "Completed", "In Progress", "Failed"
- Scores: "85%", "A+", "Excellent"
- Categories: "HPV", "Vaccines", "Communication"
*/
import * as React from "react"
import { cn } from "../../lib/utils"

// Main Card container - like a paper card with rounded corners and shadow
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Basic card styling
      className // Allow custom classes to be added
    )}
    {...props} // Spread all other props (onClick, children, etc.)
  />
))
Card.displayName = "Card"

// Card Header - top section of the card (usually contains title)
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)} // Padding and spacing
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Card Title - main heading inside a card
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Large, bold text
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// Card Description - subtitle or description text
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Smaller, gray text
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// Card Content - main body of the card
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} // Padding, but no top padding (header handles that)
    {...props} 
  />
))
CardContent.displayName = "CardContent"

// Card Footer - bottom section (usually for buttons/actions)
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)} // Horizontal layout for buttons
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Export all the card pieces so you can use them
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

/*
USAGE EXAMPLE:

<Card>
  <CardHeader>
    <CardTitle>Session Stats</CardTitle>
    <CardDescription>Your practice progress this week</CardDescription>
  </CardHeader>
  <CardContent>
    <p>You completed 5 sessions</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

This creates a nicely structured card with:
- Header (title + description)
- Content (main info)
- Footer (action buttons)
*/
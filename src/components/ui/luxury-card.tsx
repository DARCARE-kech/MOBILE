
import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

const LuxuryCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border p-6 backdrop-blur-sm shadow-md",
        isDarkMode
          ? "border-darcare-gold/20 bg-darcare-navy/80"
          : "border-darcare-deepGold/20 bg-white",
        className
      )}
      {...props}
    />
  );
})
LuxuryCard.displayName = "LuxuryCard"

const LuxuryCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 pb-4 border-b",
        isDarkMode ? "border-darcare-gold/10" : "border-darcare-deepGold/10",
        className
      )}
      {...props}
    />
  );
})
LuxuryCardHeader.displayName = "LuxuryCardHeader"

const LuxuryCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-serif font-medium text-primary",
      className
    )}
    {...props}
  />
))
LuxuryCardTitle.displayName = "LuxuryCardTitle"

const LuxuryCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-foreground/70", className)}
    {...props}
  />
))
LuxuryCardDescription.displayName = "LuxuryCardDescription"

const LuxuryCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-4 space-y-4", className)} {...props} />
))
LuxuryCardContent.displayName = "LuxuryCardContent"

const LuxuryCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center pt-4 border-t",
        isDarkMode ? "border-darcare-gold/10" : "border-darcare-deepGold/10",
        className
      )}
      {...props}
    />
  );
})
LuxuryCardFooter.displayName = "LuxuryCardFooter"

export { 
  LuxuryCard, 
  LuxuryCardHeader, 
  LuxuryCardFooter, 
  LuxuryCardTitle, 
  LuxuryCardDescription, 
  LuxuryCardContent 
}

import { cn } from "@/lib/utils"

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-[10px] font-mono uppercase tracking-widest text-primary",
        className
      )}
    >
      {children}
    </p>
  )
}

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "accent";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ className, variant = "default", dot, ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/80",
    outline: "text-foreground",
    success: "border-transparent bg-[var(--success)]/10 text-[var(--success)]",
    warning: "border-transparent bg-[var(--warning)]/10 text-[var(--warning)]",
    info: "border-transparent bg-blue-500/10 text-blue-500",
    accent: "border-transparent bg-accent text-accent-foreground",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className="mr-1.5 flex h-1.5 w-1.5 rounded-full"
          style={{ background: "currentColor" }}
        />
      )}
      {props.children}
    </div>
  );
}

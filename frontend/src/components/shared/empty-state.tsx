import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon
    title: string
    description?: string
    action?: React.ReactNode
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-card/50 dashed border-2 border-dashed",
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="bg-muted p-3 rounded-full mb-4">
                    <Icon className="w-6 h-6 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}

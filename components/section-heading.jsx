import { cn } from "@/lib/utils";

export default function SectionHeading({
    eyebrow,
    title,
    description,
    align = "center",
    inverted = false,
    className,
}) {
    return (
        <div
            className={cn(
                "mb-12 max-w-2xl",
                align === "center" && "mx-auto text-center",
                className
            )}
        >
            {eyebrow && (
                <p
                    className={cn(
                        "text-sm font-semibold uppercase tracking-wider",
                        inverted ? "text-primary" : "text-orange-700 dark:text-primary"
                    )}
                >
                    {eyebrow} 
                </p>
            )}
            <h2
                className={cn(
                    "mt-2 text-3xl font-bold tracking-tight sm:text-4xl",
                    inverted ? "text-white" : "text-foreground"
                )}
            >
                {title}
            </h2>
            {description && (
                <p
                    className={cn(
                        "mt-4 text-base leading-relaxed",
                        inverted ? "text-white/70" : "text-muted-foreground"
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    );
}
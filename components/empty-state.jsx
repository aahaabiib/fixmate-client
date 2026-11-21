import { SearchX } from "lucide-react";

export default function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  children,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-8" />
      </div>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
export default function ChartCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="font-bold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}
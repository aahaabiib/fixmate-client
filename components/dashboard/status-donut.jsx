"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { STATUS_META } from "@/lib/status";

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--card-foreground)",
};

// data: [{ status: "completed", count: 3 }, ...]
export default function StatusDonut({ data }) {
  const rows = data.filter((d) => d.count > 0);

  if (rows.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No data yet
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={rows}
            dataKey="count"
            nameKey="status"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            stroke="none"
          >
            {rows.map((row) => (
              <Cell
                key={row.status}
                fill={STATUS_META[row.status]?.color || "#9ca3af"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [value, STATUS_META[name]?.label || name]}
          />
          <Legend formatter={(value) => STATUS_META[value]?.label || value} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
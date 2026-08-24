interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  items: BarChartItem[];
  valueSuffix?: string;
}

export function BarChart({ items, valueSuffix = "" }: BarChartProps) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">Brak danych.</p>;
  }

  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-3 text-sm mb-1">
            <span className="text-gray-700 truncate">{item.label}</span>
            <span className="text-gray-500 flex-shrink-0 tabular-nums">
              {item.value}
              {valueSuffix}
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
        {value}
      </p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

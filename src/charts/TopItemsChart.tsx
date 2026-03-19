// src/pages/admin/reports/charts/TopItemsChart.tsx
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import { Card, EmptyState } from "../UiComponents/Index";
import {
  GREEN_L,
  MUTED,
  baseOptions,
  baseTooltip,
  axisStyle,
} from "../features/admin/reports/ChartsConfig";
import type { TopItem } from "../features/admin/reports/reports.types";

interface Props {
  topItems: TopItem[];
  loading: boolean;
}

function HourlySkeleton() {
  return (
    <div className="flex items-end gap-2 h-52">
      {[40, 65, 30, 80, 55, 90, 45, 70].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-kot-chart rounded-t-lg animate-pulse"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function TopItemsChart({ topItems, loading }: Props) {
  const sliced = topItems.slice(0, 8);

  const data = {
    labels: sliced.map((i) => i.name),
    datasets: [
      {
        label: "Qty",
        data: sliced.map((i) => i.quantity),
        backgroundColor: sliced.map((_, idx) =>
          idx === 0
            ? "#f59e0b"
            : idx === 1
              ? "#9ca3af"
              : idx === 2
                ? "#f97316"
                : GREEN_L,
        ),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    ...baseOptions,
    indexAxis: "y",
    plugins: {
      ...baseOptions.plugins,
      tooltip: {
        ...baseTooltip,
        callbacks: { label: (c) => ` ${c.raw} orders` },
      },
    },
    scales: {
      x: { ...axisStyle, ticks: { ...axisStyle.ticks, stepSize: 1 } },
      y: {
        grid: { display: false },
        ticks: {
          color: MUTED,
          font: { size: 11 },
          callback: (_: unknown, idx: number) => {
            const name = sliced[idx]?.name ?? "";
            return name.length > 14 ? name.slice(0, 14) + "…" : name;
          },
        },
      },
    },
  };

  return (
    <>
      {/* Bar chart */}
      <Card className="p-4 sm:p-5">
        <h2 className="font-bold text-kot-darker text-sm sm:text-base mb-4">
          🏆 Top Selling Items
        </h2>
        <div className="h-52 sm:h-60">
          {loading ? (
            <HourlySkeleton />
          ) : topItems.length === 0 ? (
            <EmptyState icon="📋" title="No items data" />
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
      </Card>

      {/* Ranking list */}
      {!loading && topItems.length > 0 && (
        <Card className="p-4 sm:p-5">
          <h2 className="font-bold text-kot-darker text-sm sm:text-base mb-4">
            📋 Items Ranking
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {topItems.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 bg-kot-light rounded-xl"
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${
                    i === 0
                      ? "bg-yellow-500"
                      : i === 1
                        ? "bg-gray-400"
                        : i === 2
                          ? "bg-orange-500"
                          : "bg-kot-dark"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-kot-darker text-xs sm:text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-kot-text">
                    {item.quantity} orders
                  </p>
                </div>
                <p className="font-bold text-kot-dark text-xs sm:text-sm flex-shrink-0">
                  ₹{item.revenue.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}

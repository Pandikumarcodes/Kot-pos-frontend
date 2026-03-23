import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import { Card, EmptyState } from "../UiComponents/Index";
import {
  GREEN,
  MUTED,
  baseOptions,
  baseTooltip,
  axisStyle,
} from "../features/admin/reports/ChartsConfig";
import type { HourlyStat } from "../features/admin/reports/reports.types";

interface Props {
  hourly: HourlyStat[];
  loading: boolean;
}

function HourlySkeleton() {
  return (
    <div className="flex items-end gap-2 h-52">
      {[40, 65, 30, 80, 55, 90, 45, 70, 35, 60, 75, 50].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-kot-chart rounded-t-lg animate-pulse"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function RevenueTrendChart({ hourly, loading }: Props) {
  const hourlyRevenue = hourly.map((h) => h.revenue);
  const peakIdx = hourlyRevenue.indexOf(Math.max(...hourlyRevenue, 0));

  const data = {
    labels: hourly.map((h) => h.hour),
    datasets: [
      {
        label: "Revenue",
        data: hourlyRevenue,
        borderColor: GREEN,
        backgroundColor: (ctx: { chart: import("chart.js").Chart }) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          g.addColorStop(0, "rgba(74,95,82,0.20)");
          g.addColorStop(1, "rgba(74,95,82,0.00)");
          return g;
        },
        fill: true,
        tension: 0.4,
        pointRadius: hourlyRevenue.map((_, i) => (i === peakIdx ? 6 : 3)),
        pointBackgroundColor: hourlyRevenue.map((_, i) =>
          i === peakIdx ? "#ef4444" : GREEN,
        ),
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      tooltip: {
        ...baseTooltip,
        callbacks: {
          label: (c) => ` ₹${Number(c.raw).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: MUTED, font: { size: 11 } },
      },
      y: {
        ...axisStyle,
        ticks: {
          ...axisStyle.ticks,
          callback: (v) => `₹${Number(v).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-bold text-kot-darker text-sm sm:text-base">
            Revenue Trend
          </h2>
          <p className="text-xs text-kot-text mt-0.5">
            Hourly pattern · peak marked in red
          </p>
        </div>
        {!loading && hourly.length > 0 && (
          <div className="text-right flex-shrink-0 ml-3">
            <p className="text-[10px] text-kot-text">Peak</p>
            <p className="text-sm font-bold text-red-500">
              {hourly[peakIdx]?.hour ?? "—"}
            </p>
          </div>
        )}
      </div>
      <div className="h-52 sm:h-60">
        {loading ? (
          <HourlySkeleton />
        ) : hourly.length === 0 ? (
          <EmptyState icon="📈" title="No revenue data" />
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </Card>
  );
}

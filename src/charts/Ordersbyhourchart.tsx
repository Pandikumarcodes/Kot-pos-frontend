import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import { Card, EmptyState } from "../UiComponents/Index";
import {
  GREEN,
  GREEN_L,
  MUTED,
  baseOptions,
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

export function OrdersByHourChart({ hourly, loading }: Props) {
  const hourlyOrders = hourly.map((h) => h.orders);
  const peakIdx = hourlyOrders.indexOf(Math.max(...hourlyOrders, 0));

  const data = {
    labels: hourly.map((h) => h.hour),
    datasets: [
      {
        label: "Orders",
        data: hourlyOrders,
        backgroundColor: hourlyOrders.map((_, i) =>
          i === peakIdx ? GREEN : GREEN_L,
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    ...baseOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: MUTED, font: { size: 11 } },
      },
      y: { ...axisStyle, ticks: { ...axisStyle.ticks, stepSize: 1 } },
    },
  };

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-bold text-kot-darker text-sm sm:text-base">
            Orders by Hour
          </h2>
          <p className="text-xs text-kot-text mt-0.5">
            Busiest hour highlighted
          </p>
        </div>
        {!loading && hourly.length > 0 && (
          <div className="flex items-center gap-3 text-[10px] text-kot-text flex-shrink-0 ml-3">
            <span className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ background: GREEN_L }}
              />{" "}
              Normal
            </span>
            <span className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ background: GREEN }}
              />{" "}
              Peak
            </span>
          </div>
        )}
      </div>
      <div className="h-52 sm:h-60">
        {loading ? (
          <HourlySkeleton />
        ) : hourly.length === 0 ? (
          <EmptyState icon="📊" title="No order data" />
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </Card>
  );
}

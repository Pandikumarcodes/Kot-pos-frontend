import { Doughnut } from "react-chartjs-2";
import { Card, Pulse, EmptyState } from "../UiComponents/Index";
import {
  baseOptions,
  baseTooltip,
  PAYMENT_PALETTE,
} from "../features/admin/reports/ChartsConfig";
import type { PaymentStat } from "../features/admin/reports/reports.types";

interface Props {
  payments: PaymentStat[];
  loading: boolean;
}

export function PaymentBreakdownChart({ payments, loading }: Props) {
  const data = {
    labels: payments.map((p) => PAYMENT_PALETTE[p.method]?.label ?? p.method),
    datasets: [
      {
        data: payments.map((p) => p.amount),
        backgroundColor: payments.map(
          (p) => PAYMENT_PALETTE[p.method]?.fill ?? "#e5e7eb",
        ),
        borderColor: payments.map(
          (p) => PAYMENT_PALETTE[p.method]?.border ?? "#9ca3af",
        ),
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="font-bold text-kot-darker text-sm sm:text-base mb-4">
        💳 Payment Breakdown
      </h2>

      {loading ? (
        <div className="flex items-center gap-6">
          <Pulse className="w-36 h-36 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            {[1, 2, 3].map((i) => (
              <Pulse key={i} className="h-5 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : payments.length === 0 ? (
        <EmptyState icon="💳" title="No payment data" />
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Doughnut */}
          <div className="w-36 h-36 flex-shrink-0">
            <Doughnut
              data={data}
              options={{
                ...baseOptions,
                cutout: "65%",
                plugins: {
                  ...baseOptions.plugins,
                  tooltip: {
                    ...baseTooltip,
                    callbacks: {
                      label: (c) =>
                        ` ₹${Number(c.raw).toLocaleString("en-IN")}`,
                    },
                  },
                },
              }}
            />
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2.5 w-full">
            {payments.map((p) => {
              const pal = PAYMENT_PALETTE[p.method] ?? PAYMENT_PALETTE.none;
              return (
                <div
                  key={p.method}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: pal.border }}
                    />
                    <span className="text-sm text-kot-darker">
                      {pal.emoji} {pal.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-kot-darker">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-kot-text">
                      {p.count} txns · {p.percentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

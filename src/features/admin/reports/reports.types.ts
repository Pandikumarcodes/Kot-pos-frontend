import type {
  DateRange,
  SummaryStats,
  TopItem,
  PaymentStat,
  HourlyStat,
} from "../../../services/adminApi/Reports.api";

export type { DateRange, SummaryStats, TopItem, PaymentStat, HourlyStat };

export interface ReportsPresenterProps {
  // data
  summary: SummaryStats | null;
  topItems: TopItem[];
  payments: PaymentStat[];
  hourly: HourlyStat[];
  // ui state
  loading: boolean;
  refreshing: boolean;
  range: DateRange;
  from: string;
  to: string;
  // actions
  onRangeChange: (r: DateRange) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onRefresh: () => void;
  onApplyCustom: () => void;
}

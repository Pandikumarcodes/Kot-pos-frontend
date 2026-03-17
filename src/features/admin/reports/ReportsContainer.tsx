import { useState, useEffect, useCallback, useRef } from "react";
import {
  getSummaryApi,
  getTopItemsApi,
  getPaymentsApi,
  getHourlyApi,
} from "../../../services/adminApi/Reports.api";
import type {
  DateRange,
  SummaryStats,
  TopItem,
  PaymentStat,
  HourlyStat,
} from "../../../services/adminApi/Reports.api";
import { ReportsPresenter } from "./ReportsPresenter";

export default function ReportsPageContainer() {
  const [range, setRange] = useState<DateRange>("today");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [payments, setPayments] = useState<PaymentStat[]>([]);
  const [hourly, setHourly] = useState<HourlyStat[]>([]);

  const customDatesRef = useRef({ from, to });
  useEffect(() => {
    customDatesRef.current = { from, to };
  }, [from, to]);

  // ✅ Only depends on `range` — not from/to
  const fetchAll = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);

        // Read latest custom dates from ref at call time
        const f = range === "custom" ? customDatesRef.current.from : undefined;
        const t = range === "custom" ? customDatesRef.current.to : undefined;

        const [sRes, tRes, pRes, hRes] = await Promise.all([
          getSummaryApi(range, f, t),
          getTopItemsApi(range, f, t),
          getPaymentsApi(range, f, t),
          getHourlyApi(range, f, t),
        ]);
        setSummary(sRes.data);
        setTopItems(tRes.data.topItems);
        setPayments(pRes.data.payments);
        setHourly(hRes.data.hourly);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [range], // ✅ from/to removed — no more keystroke re-fires
  );

  // ✅ Only auto-fetch for preset ranges, not custom
  useEffect(() => {
    if (range !== "custom") fetchAll();
  }, [fetchAll, range]);

  return (
    <ReportsPresenter
      summary={summary}
      topItems={topItems}
      payments={payments}
      hourly={hourly}
      loading={loading}
      refreshing={refreshing}
      range={range}
      from={from}
      to={to}
      onRangeChange={setRange}
      onFromChange={setFrom}
      onToChange={setTo}
      onRefresh={() => fetchAll(true)}
      onApplyCustom={() => from && to && fetchAll()} // ✅ manual trigger only
    />
  );
}

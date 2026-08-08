import { useState, useEffect, useCallback } from "react";
import {
  getSummaryApi,
  getTopItemsApi,
  getPaymentsApi,
  getHourlyApi,
} from "../../../services/admin/reports.api";
import type {
  DateRange,
  SummaryStats,
  TopItem,
  PaymentStat,
  HourlyStat,
} from "../../../services/admin/reports.api";
import { ReportsPresenter } from "./ReportsPresenter";
import { useAppSelector } from "../../../state/hooks";
import { resolveOperationalBranchId } from "../../../state/branchContext";

export default function ReportsPageContainer() {
  const user = useAppSelector((state) => state.auth.user);
  const selectedBranchId = useAppSelector((state) => state.ui.selectedBranchId);
  const requiresBranchSelection = user?.role === "admin" && !user.branchId;
  const branchId = resolveOperationalBranchId(user?.branchId, selectedBranchId);
  const [range, setRange] = useState<DateRange>("today");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [payments, setPayments] = useState<PaymentStat[]>([]);
  const [hourly, setHourly] = useState<HourlyStat[]>([]);

  const fetchAll = useCallback(
    async (nextRange: DateRange, customFrom?: string, customTo?: string) => {
      try {
        const f = nextRange === "custom" ? customFrom : undefined;
        const t = nextRange === "custom" ? customTo : undefined;

        const [sRes, tRes, pRes, hRes] = await Promise.all([
          getSummaryApi(nextRange, f, t, branchId),
          getTopItemsApi(nextRange, f, t, branchId),
          getPaymentsApi(nextRange, f, t, branchId),
          getHourlyApi(nextRange, f, t, branchId),
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
    [branchId],
  );

  useEffect(() => {
    let ignore = false;
    if (requiresBranchSelection && !branchId) {
      setSummary(null);
      setTopItems([]);
      setPayments([]);
      setHourly([]);
      setLoading(false);
      return;
    }
    Promise.all([
      getSummaryApi("today", undefined, undefined, branchId),
      getTopItemsApi("today", undefined, undefined, branchId),
      getPaymentsApi("today", undefined, undefined, branchId),
      getHourlyApi("today", undefined, undefined, branchId),
    ])
      .then(([sRes, tRes, pRes, hRes]) => {
        if (ignore) return;
        setSummary(sRes.data);
        setTopItems(tRes.data.topItems);
        setPayments(pRes.data.payments);
        setHourly(hRes.data.hourly);
      })
      .catch((err) => {
        if (!ignore) console.error(err);
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [branchId, requiresBranchSelection]);

  const handleRangeChange = (nextRange: DateRange) => {
    setRange(nextRange);
    if (nextRange !== "custom") {
      setLoading(true);
      void fetchAll(nextRange);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    void fetchAll(range, from, to);
  };

  const handleApplyCustom = () => {
    if (!from || !to) return;
    setLoading(true);
    void fetchAll("custom", from, to);
  };

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
      onRangeChange={handleRangeChange}
      onFromChange={setFrom}
      onToChange={setTo}
      onRefresh={handleRefresh}
      onApplyCustom={handleApplyCustom}
    />
  );
}

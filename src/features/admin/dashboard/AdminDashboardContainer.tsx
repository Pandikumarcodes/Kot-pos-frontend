import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../state/hooks";
import { resolveOperationalBranchId } from "../../../state/branchContext";
import {
  getDashboardSummaryApi,
  getTopItemsApi,
  getDashboardTablesApi,
  getHourlySalesApi,
  getPaymentMethodsApi,
} from "../../../services/admin/adminDashboard.api";
import { AdminDashboardPresenter } from "./DashboardPresenter";
import type {
  RangeType,
  ViewType,
  Summary,
  TopItem,
  DashboardTable,
  HourlyData,
  PaymentMethod,
} from "./dashboard.types";

export default function AdminDashboardContainer() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const selectedBranchId = useAppSelector((state) => state.ui.selectedBranchId);
  const branchId = resolveOperationalBranchId(user?.branchId, selectedBranchId);
  const requiresBranchSelection = user?.role === "admin" && !user.branchId;

  const [selectedView, setSelectedView] = useState<ViewType>("overview");
  const [range, setRange] = useState<RangeType>("today");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [tables, setTables] = useState<DashboardTable[]>([]);
  const [hourly, setHourly] = useState<HourlyData[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);

  const fetchData = useCallback(
    async (nextRange: RangeType) => {
      try {
        const [summaryRes, topItemsRes, tablesRes, hourlyRes, paymentsRes] =
          await Promise.all([
            getDashboardSummaryApi(nextRange, branchId),
            getTopItemsApi(nextRange, branchId),
            getDashboardTablesApi(branchId),
            getHourlySalesApi(nextRange, branchId),
            getPaymentMethodsApi(nextRange, branchId),
          ]);
        setSummary(summaryRes.data);
        setTopItems(topItemsRes.data.topItems || []);
        setTables(tablesRes.data.tables || []);
        setHourly(hourlyRes.data.hourly || []);
        setPayments(paymentsRes.data.payments || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
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
      setSummary(null); setTopItems([]); setTables([]); setHourly([]); setPayments([]);
      setLoading(false);
      return () => { ignore = true; };
    }
    Promise.all([
      getDashboardSummaryApi("today", branchId),
      getTopItemsApi("today", branchId),
      getDashboardTablesApi(branchId),
      getHourlySalesApi("today", branchId),
      getPaymentMethodsApi("today", branchId),
    ])
      .then(
        ([summaryRes, topItemsRes, tablesRes, hourlyRes, paymentsRes]) => {
          if (ignore) return;
          setSummary(summaryRes.data);
          setTopItems(topItemsRes.data.topItems || []);
          setTables(tablesRes.data.tables || []);
          setHourly(hourlyRes.data.hourly || []);
          setPayments(paymentsRes.data.payments || []);
        },
      )
      .catch((err) => {
        if (!ignore) console.error("Dashboard fetch error:", err);
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

  const handleRangeChange = (nextRange: RangeType) => {
    setRange(nextRange);
    setLoading(true);
    void fetchData(nextRange);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    void fetchData(range);
  };

  return (
    <AdminDashboardPresenter
      summary={summary}
      topItems={topItems}
      tables={tables}
      hourly={hourly}
      payments={payments}
      loading={loading}
      refreshing={refreshing}
      range={range}
      selectedView={selectedView}
      onRangeChange={handleRangeChange}
      onViewChange={setSelectedView}
      onRefresh={handleRefresh}
      onNavigate={navigate}
    />
  );
}

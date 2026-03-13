import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardSummaryApi,
  getTopItemsApi,
  getDashboardTablesApi,
  getHourlySalesApi,
  getPaymentMethodsApi,
} from "../../../services/adminApi/Admindashboard.api";
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
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      try {
        const [summaryRes, topItemsRes, tablesRes, hourlyRes, paymentsRes] =
          await Promise.all([
            getDashboardSummaryApi(range),
            getTopItemsApi(range),
            getDashboardTablesApi(),
            getHourlySalesApi(range),
            getPaymentMethodsApi(range),
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
    [range],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      onRangeChange={setRange}
      onViewChange={setSelectedView}
      onRefresh={() => fetchData(true)}
      onNavigate={navigate}
    />
  );
}

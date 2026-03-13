import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../Store/hooks";
import { useToast } from "../../../Context/ToastContext";
import {
  getTablesApi,
  createTableApi,
  deleteTableApi,
  allocateTableApi,
} from "../../../services/waiterApi/Table.api";
import type { Table } from "../../../services/waiterApi/Table.api";
import { TablesPresenter } from "./TablePresenter";
import type { FilterValue } from "./Table.types";

export default function TablesContainer() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role === "admin" || user?.role === "manager";
  const canDelete = user?.role === "admin";

  const [tables, setTables] = useState<Table[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ tableNumber: "", capacity: "" });
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [allocateForm, setAllocateForm] = useState({ name: "", phone: "" });
  const [, setTick] = useState(0);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getTablesApi();
      setTables(data.tables);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const filtered =
    filter === "all" ? tables : tables.filter((t) => t.status === filter);
  const counts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    billing: tables.filter((t) => t.status === "billing").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createTableApi({
        tableNumber: parseInt(addForm.tableNumber),
        capacity: parseInt(addForm.capacity),
      });
      setTables([...tables, data.table]);
      setShowAddModal(false);
      setAddForm({ tableNumber: "", capacity: "" });
      toast.success("Table added successfully!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to add table");
    }
  };

  const handleDeleteTable = async (table: Table, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete Table ${table.tableNumber}?`)) return;
    try {
      await deleteTableApi(table._id);
      setTables(tables.filter((t) => t._id !== table._id));
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete table");
    }
  };

  const handleTableClick = (table: Table) => {
    if (table.status === "reserved" || table.status === "cleaning") return;
    if (table.status === "available" && !isAdmin) {
      setSelectedTable(table);
      setAllocateForm({ name: "", phone: "" });
      setShowAllocateModal(true);
    } else {
      navigate(`/waiter/order/${table._id}`);
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;
    try {
      const { data } = await allocateTableApi(selectedTable._id, allocateForm);
      setTables(
        tables.map((t) => (t._id === selectedTable._id ? data.table : t)),
      );
      setShowAllocateModal(false);
      navigate(`/waiter/order/${selectedTable._id}`, {
        state: {
          customerName: allocateForm.name,
          customerPhone: allocateForm.phone,
        },
      });
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to allocate table");
    }
  };

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary px-4">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3 text-sm sm:text-base">
            {error}
          </p>
          <button
            onClick={fetchTables}
            className="px-4 py-2 bg-kot-dark text-white rounded-lg hover:bg-kot-darker"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <TablesPresenter
      tables={tables}
      filtered={filtered}
      counts={counts}
      filter={filter}
      loading={loading}
      isAdmin={isAdmin}
      canDelete={canDelete}
      showAddModal={showAddModal}
      addForm={addForm}
      onOpenAddModal={() => setShowAddModal(true)}
      onCloseAddModal={() => setShowAddModal(false)}
      onAddFormChange={(f, v) => setAddForm((p) => ({ ...p, [f]: v }))}
      onAddTable={handleAddTable}
      showAllocateModal={showAllocateModal}
      selectedTable={selectedTable}
      allocateForm={allocateForm}
      onCloseAllocateModal={() => setShowAllocateModal(false)}
      onAllocateFormChange={(f, v) =>
        setAllocateForm((p) => ({ ...p, [f]: v }))
      }
      onAllocate={handleAllocate}
      onFilterChange={setFilter}
      onTableClick={handleTableClick}
      onDeleteTable={handleDeleteTable}
      onRefresh={fetchTables}
    />
  );
}

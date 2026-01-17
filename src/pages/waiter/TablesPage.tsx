import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableGrid from "../../design-system/organisms/TableGrid";

type TableStatus = "available" | "occupied" | "reserved";

interface Table {
  id: string;
  number: string;
  seats: number;
  status: TableStatus;
  orderTime?: string;
  guests?: number;
  waiter?: string;
}

// Mock data - replace with API call
const MOCK_TABLES: Table[] = [
  { id: "1", number: "T-01", seats: 4, status: "available" },
  {
    id: "2",
    number: "T-02",
    seats: 2,
    status: "occupied",
    orderTime: "12:30 PM",
    guests: 2,
    waiter: "Raj",
  },
  {
    id: "3",
    number: "T-03",
    seats: 6,
    status: "reserved",
    orderTime: "2:00 PM",
  },
  { id: "4", number: "T-04", seats: 4, status: "available" },
  {
    id: "5",
    number: "T-05",
    seats: 2,
    status: "occupied",
    orderTime: "1:15 PM",
    guests: 1,
    waiter: "Priya",
  },
  { id: "6", number: "T-06", seats: 8, status: "available" },
  {
    id: "7",
    number: "T-07",
    seats: 4,
    status: "occupied",
    orderTime: "11:45 AM",
    guests: 4,
    waiter: "Amit",
  },
  { id: "8", number: "T-08", seats: 2, status: "available" },
  {
    id: "9",
    number: "T-09",
    seats: 4,
    status: "reserved",
    orderTime: "3:00 PM",
  },
  { id: "10", number: "T-10", seats: 6, status: "available" },
  {
    id: "11",
    number: "T-11",
    seats: 4,
    status: "occupied",
    orderTime: "12:00 PM",
    guests: 3,
    waiter: "Sita",
  },
  { id: "12", number: "T-12", seats: 2, status: "available" },
];

export default function TablesPage() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tables on mount
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchTables().then(data => setTables(data));

    // Simulate API call
    setTimeout(() => {
      setTables(MOCK_TABLES);
      setLoading(false);
    }, 500);
  }, []);

  // Handle table selection
  const handleSelectTable = (table: Table) => {
    if (table.status === "available") {
      // Navigate to order page for new order
      navigate(`/waiter/order/${table.id}`);
    } else if (table.status === "occupied") {
      // Navigate to existing order
      navigate(`/waiter/order/${table.id}`);
    } else if (table.status === "reserved") {
      // Show confirmation or handle reserved tables
      const confirm = window.confirm(
        `Table ${table.number} is reserved for ${table.orderTime}.\nDo you want to proceed?`
      );
      if (confirm) {
        navigate(`/waiter/order/${table.id}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <TableGrid tables={tables} onSelectTable={handleSelectTable} />
    </div>
  );
}

/* // In your router
import TablesPage from "./templates/TablesPage";

<Route path="/waiter/tables" element={<TablesPage />} /> */

/* useEffect(() => {
  fetchTables().then(data => setTables(data));
}, []); */

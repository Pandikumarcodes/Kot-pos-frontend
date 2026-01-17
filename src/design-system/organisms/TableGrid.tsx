import { useState } from "react";
import { Users, Clock, Search } from "lucide-react";

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

interface TableGridProps {
  tables: Table[];
  onSelectTable?: (table: Table) => void;
  className?: string;
}

export default function TableGrid({
  tables,
  onSelectTable,
  className = "",
}: TableGridProps) {
  const [filterStatus, setFilterStatus] = useState<TableStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter by status
  const filteredByStatus =
    filterStatus === "all"
      ? tables
      : tables.filter((table) => table.status === filterStatus);

  // Filter by search
  const filteredTables = searchQuery
    ? filteredByStatus.filter((table) =>
        table.number.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByStatus;

  // Count by status
  const statusCounts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  };

  // Status colors
  const getStatusStyles = (status: TableStatus) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          badge: "bg-green-100 text-green-700",
        };
      case "occupied":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          badge: "bg-red-100 text-red-700",
        };
      case "reserved":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          badge: "bg-purple-100 text-purple-700",
        };
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Tables</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search table number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({tables.length})
          </button>
          <button
            onClick={() => setFilterStatus("available")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "available"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Available ({statusCounts.available})
          </button>
          <button
            onClick={() => setFilterStatus("occupied")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "occupied"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Occupied ({statusCounts.occupied})
          </button>
          <button
            onClick={() => setFilterStatus("reserved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "reserved"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Reserved ({statusCounts.reserved})
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {filteredTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search size={48} className="mb-3 text-gray-300" />
            <p className="text-lg font-medium">No tables found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTables.map((table) => {
              const styles = getStatusStyles(table.status);
              return (
                <button
                  key={table.id}
                  onClick={() => onSelectTable?.(table)}
                  className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer text-left`}
                >
                  {/* Table Number */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-2xl font-bold ${styles.text}`}>
                      {table.number}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.badge}`}
                    >
                      {table.status}
                    </span>
                  </div>

                  {/* Seats */}
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {table.seats} seats
                    </span>
                  </div>

                  {/* Occupied Details */}
                  {table.status === "occupied" && (
                    <>
                      {table.guests && (
                        <div className="flex items-center gap-2 mb-2">
                          <Users size={16} className={styles.text} />
                          <span
                            className={`text-sm font-medium ${styles.text}`}
                          >
                            {table.guests} guests
                          </span>
                        </div>
                      )}
                      {table.orderTime && (
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {table.orderTime}
                          </span>
                        </div>
                      )}
                      {table.waiter && (
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-300">
                          Waiter: {table.waiter}
                        </div>
                      )}
                    </>
                  )}

                  {/* Reserved Details */}
                  {table.status === "reserved" && table.orderTime && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Reserved at {table.orderTime}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer - Stats */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {filteredTables.length}
            </span>{" "}
            tables
          </p>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">
              {statusCounts.available} Available
            </span>
            <span className="text-red-600 font-medium">
              {statusCounts.occupied} Occupied
            </span>
            <span className="text-purple-600 font-medium">
              {statusCounts.reserved} Reserved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* <TableGrid
  tables={tablesData}
  onSelectTable={(table) => handleSelectTable(table)}
/> */

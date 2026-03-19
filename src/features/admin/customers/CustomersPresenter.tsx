import {
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  Card,
  Button,
  IconButton,
  Input,
  Select,
  Pulse,
  PageHeader,
  SearchInput,
  EmptyState,
  Modal,
  TableWrapper,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
} from "../../../UiComponents/Index";
import type { CustomerPresenterProps } from "./customers.types";

export function CustomerPresenter({
  customers,
  filteredCustomers,
  totalOrders,
  avgOrderValue,
  loading,
  error,
  searchQuery,
  showModal,
  editingCustomer,
  formData,
  isAdmin,
  onSearchChange,
  onOpenModal,
  onCloseModal,
  onFormChange,
  onSubmit,
  onDelete,
  onRetry,
}: CustomerPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-3 sm:p-4 lg:p-6 max-w-[2400px] mx-auto space-y-4">
        <PageHeader
          title="Customers"
          sub={`${customers.length} total customers`}
          actions={
            <Button
              size="sm"
              onClick={() => onOpenModal()}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          }
        />

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        )}

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Customers",
              value: customers.length,
              bg: "bg-kot-white",
            },
            { label: "Total Orders", value: totalOrders, bg: "bg-kot-stats" },
            {
              label: "Avg Order Value",
              value: `₹${avgOrderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
              bg: "bg-blue-50",
            },
          ].map((s) => (
            <Card key={s.label} className={`p-4 ${s.bg}`}>
              <p className="text-xs text-kot-text font-medium">{s.label}</p>
              {loading ? (
                <Pulse className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-kot-darker mt-1">
                  {s.value}
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by name, email or phone…"
        />

        {/* Table */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-kot-white rounded-xl p-4 flex gap-4">
                <Pulse className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Pulse className="h-4 w-40" />
                  <Pulse className="h-3 w-56" />
                </div>
                <Pulse className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No customers found"
            sub={
              searchQuery ? "Try a different search" : "Add your first customer"
            }
            action={
              !searchQuery && (
                <Button size="sm" onClick={() => onOpenModal()}>
                  Add Customer
                </Button>
              )
            }
          />
        ) : (
          <TableWrapper>
            <Thead>
              <tr>
                <Th>Customer</Th>
                <Th>Contact</Th>
                <Th>Address</Th>
                <Th>Orders</Th>
                <Th>Spent</Th>
                <Th>Joined</Th>
                {isAdmin && <Th>Actions</Th>}
              </tr>
            </Thead>
            <Tbody>
              {filteredCustomers.map((c) => (
                <Tr key={c._id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-kot-light flex items-center justify-center text-sm font-bold text-kot-dark flex-shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-kot-darker">
                        {c.name}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <div className="space-y-0.5">
                      {c.phone && (
                        <p className="flex items-center gap-1 text-xs text-kot-text">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </p>
                      )}
                      {c.email && (
                        <p className="flex items-center gap-1 text-xs text-kot-text">
                          <Mail className="w-3 h-3" />
                          {c.email}
                        </p>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <p className="flex items-center gap-1 text-xs text-kot-text">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {c.address || "—"}
                    </p>
                  </Td>
                  <Td>
                    <span className="text-sm font-semibold text-kot-darker">
                      {c.totalOrders ?? 0}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-sm font-semibold text-kot-darker">
                      ₹{(c.totalSpent ?? 0).toLocaleString("en-IN")}
                    </span>
                  </Td>
                  <Td>
                    <p className="flex items-center gap-1 text-xs text-kot-text">
                      <Calendar className="w-3 h-3" />
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </p>
                  </Td>
                  {isAdmin && (
                    <Td>
                      <div className="flex gap-1">
                        <IconButton onClick={() => onOpenModal(c)}>
                          <Edit2 className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="danger"
                          onClick={() => onDelete(c)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </div>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </TableWrapper>
        )}

        {/* Modal */}
        <Modal
          open={showModal}
          title={editingCustomer ? "Edit Customer" : "Add Customer"}
          onClose={onCloseModal}
        >
          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              label="Full Name *"
              value={formData.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Phone"
              value={formData.phone ?? ""}
              onChange={(e) => onFormChange("phone", e.target.value)}
              placeholder="+91 9876543210"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email ?? ""}
              onChange={(e) => onFormChange("email", e.target.value)}
              placeholder="john@email.com"
            />
            <Input
              label="Address"
              value={formData.address ?? ""}
              onChange={(e) => onFormChange("address", e.target.value)}
              placeholder="123 Main St"
            />
            <Select
              label="Gender"
              value={formData.gender ?? ""}
              onChange={(e) => onFormChange("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={onCloseModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button size="md" type="submit" className="flex-1">
                {editingCustomer ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

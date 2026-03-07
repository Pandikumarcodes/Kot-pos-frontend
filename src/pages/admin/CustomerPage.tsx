// src/pages/admin/CustomersPage.tsx
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "../../services/adminApi/Customer.api";
import type {
  Customer,
  CreateCustomerPayload,
} from "../../services/adminApi/Customer.api";
import { useToast } from "../../Context/ToastContext";
export default function CustomersPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const toast = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CreateCustomerPayload>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // ── Fetch customers ────────────────────────────────────────
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getCustomersApi();
      setCustomers(data.customers);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ── Filter ─────────────────────────────────────────────────
  const filteredCustomers = searchQuery
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery) ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : customers;

  // ── Modal ──────────────────────────────────────────────────
  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: "", phone: "", email: "", address: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        const { data } = await updateCustomerApi(editingCustomer._id, formData);
        setCustomers(
          customers.map((c) =>
            c._id === editingCustomer._id ? data.customer : c,
          ),
        );
      } else {
        const { data } = await createCustomerApi(formData);
        setCustomers([data.customer, ...customers]);
      }
      handleCloseModal();
      toast.success(editingCustomer ? "Customer updated!" : "Customer added!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save customer");
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (customer: Customer) => {
    if (!window.confirm(`Delete "${customer.name}"?`)) return;
    try {
      await deleteCustomerApi(customer._id);
      setCustomers(customers.filter((c) => c._id !== customer._id));
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete customer");
    }
  };

  // ── Stats ──────────────────────────────────────────────────
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

  const inputClass =
    "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-kot-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-kot-text">Loading customers...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-kot-dark text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kot-darker">Customers</h1>
            <p className="text-sm text-kot-text mt-0.5">
              {customers.length} customers registered
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl transition-colors"
          >
            <Plus size={18} /> Add Customer
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total Customers",
              value: customers.length,
              bg: "bg-kot-stats",
            },
            { label: "Total Orders", value: totalOrders, bg: "bg-blue-50" },
            {
              label: "Total Revenue",
              value: `₹${totalSpent.toLocaleString()}`,
              bg: "bg-emerald-50",
            },
            {
              label: "Avg Order Value",
              value: `₹${avgOrderValue}`,
              bg: "bg-purple-50",
            },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 shadow-kot`}>
              <p className="text-xs text-kot-text font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-kot-darker mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-kot-chart rounded-xl bg-kot-white text-kot-darker text-sm focus:outline-none focus:border-kot-dark placeholder:text-kot-text/50"
          />
        </div>

        {/* Customer Cards */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-kot-white rounded-2xl p-16 text-center shadow-kot">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-lg font-bold text-kot-darker">
              No customers found
            </p>
            <p className="text-sm text-kot-text mt-1">
              {searchQuery
                ? "Try a different search"
                : "Customers appear automatically when orders are placed"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="bg-kot-white rounded-2xl shadow-kot p-5 hover:shadow-kot-lg transition-all"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-kot-stats flex items-center justify-center text-kot-darker font-bold text-lg flex-shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-kot-darker">
                        {customer.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-kot-text mt-0.5">
                        <Phone size={11} /> {customer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(customer)}
                      className="p-2 text-kot-dark hover:bg-kot-light rounded-lg transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(customer)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-1 mb-4">
                  {customer.email && (
                    <div className="flex items-center gap-1.5 text-xs text-kot-text">
                      <Mail size={11} /> {customer.email}
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center gap-1.5 text-xs text-kot-text">
                      <MapPin size={11} /> {customer.address}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-kot-light rounded-xl p-3">
                    <p className="text-xs text-kot-text">Orders</p>
                    <p className="text-xl font-bold text-kot-darker">
                      {customer.totalOrders}
                    </p>
                  </div>
                  <div className="bg-kot-stats rounded-xl p-3">
                    <p className="text-xs text-kot-text">Spent</p>
                    <p className="text-xl font-bold text-kot-darker">
                      ₹{customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-kot-text pt-3 border-t border-kot-chart">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} />
                    Last:{" "}
                    {new Date(customer.lastVisit).toLocaleDateString("en-IN")}
                  </div>
                  <div>
                    Joined:{" "}
                    {new Date(customer.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-kot-white rounded-2xl shadow-kot-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-kot-chart">
              <h2 className="text-xl font-bold text-kot-darker">
                {editingCustomer
                  ? `Edit: ${editingCustomer.name}`
                  : "Add New Customer"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-kot-text hover:text-kot-darker"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass}
                  placeholder="e.g. Rahul Kumar"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={inputClass}
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputClass}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Enter address"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-lg hover:bg-kot-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-lg"
                >
                  {editingCustomer ? "Update" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

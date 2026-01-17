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

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastVisit: string;
  joinedDate: string;
}

// Mock data - replace with API call
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@example.com",
    address: "123 MG Road, Bangalore",
    totalOrders: 15,
    totalSpent: 12500,
    lastVisit: "2024-01-10",
    joinedDate: "2023-06-15",
  },
  {
    id: "2",
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    email: "priya.sharma@example.com",
    address: "456 Indiranagar, Bangalore",
    totalOrders: 8,
    totalSpent: 6800,
    lastVisit: "2024-01-12",
    joinedDate: "2023-08-20",
  },
  {
    id: "3",
    name: "Amit Patel",
    phone: "+91 76543 21098",
    totalOrders: 22,
    totalSpent: 18900,
    lastVisit: "2024-01-14",
    joinedDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    phone: "+91 65432 10987",
    email: "sneha.reddy@example.com",
    address: "789 Koramangala, Bangalore",
    totalOrders: 12,
    totalSpent: 9200,
    lastVisit: "2024-01-11",
    joinedDate: "2023-07-05",
  },
  {
    id: "5",
    name: "Vikram Singh",
    phone: "+91 54321 09876",
    totalOrders: 5,
    totalSpent: 3500,
    lastVisit: "2024-01-08",
    joinedDate: "2023-11-12",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Fetch customers on mount
  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setCustomers(MOCK_CUSTOMERS);
      setLoading(false);
    }, 500);
  }, []);

  // Filter customers
  const filteredCustomers = searchQuery
    ? customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery) ||
          customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customers;

  // Open modal for add/edit
  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCustomer) {
      // Update existing customer
      // TODO: API call - updateCustomer(editingCustomer.id, formData)
      setCustomers(
        customers.map((customer) =>
          customer.id === editingCustomer.id
            ? { ...customer, ...formData }
            : customer
        )
      );
      alert(`"${formData.name}" updated successfully!`);
    } else {
      // Add new customer
      // TODO: API call - createCustomer(formData)
      const newCustomer: Customer = {
        // id: Date.now().toString(),
        ...(formData as Customer),
        totalOrders: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString().split("T")[0],
        joinedDate: new Date().toISOString().split("T")[0],
      };
      setCustomers([...customers, newCustomer]);
      alert(`"${formData.name}" added successfully!`);
    }

    handleCloseModal();
  };

  // Delete customer
  const handleDelete = async (customer: Customer) => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${customer.name}"?`
    );
    if (!confirm) return;

    // TODO: API call - deleteCustomer(customer.id)
    setCustomers(customers.filter((c) => c.id !== customer.id));
    alert(`"${customer.name}" deleted successfully!`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your customer database
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Customer
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 px-6 pb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Total Customers</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {customers.length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              ₹
              {customers
                .reduce((sum, c) => sum + c.totalSpent, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-orange-600 font-medium">
              Avg. Order Value
            </p>
            <p className="text-2xl font-bold text-orange-700 mt-1">
              ₹
              {customers.length > 0
                ? Math.round(
                    customers.reduce((sum, c) => sum + c.totalSpent, 0) /
                      customers.reduce((sum, c) => sum + c.totalOrders, 0)
                  )
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search size={64} className="mb-4 text-gray-300" />
            <p className="text-xl font-medium">No customers found</p>
            <p className="text-sm mt-2">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow"
              >
                {/* Customer Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {customer.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                      <Phone size={14} />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(customer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(customer)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Address */}
                {customer.address && (
                  <div className="flex items-start gap-1.5 text-sm text-gray-600 mb-4">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{customer.address}</span>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium">Orders</p>
                    <p className="text-xl font-bold text-blue-700 mt-1">
                      {customer.totalOrders}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium">Spent</p>
                    <p className="text-xl font-bold text-green-700 mt-1">
                      ₹{customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    Last:{" "}
                    {new Date(customer.lastVisit).toLocaleDateString("en-IN")}
                  </div>
                  <div>
                    Joined:{" "}
                    {new Date(customer.joinedDate).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCustomer ? "Update" : "Add"} Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

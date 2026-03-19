import { useState, useEffect } from "react";
import { useAppSelector } from "../../../Store/hooks";
import {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "../../../services/adminApi/Customer.api";
import type { Customer } from "../../../services/adminApi/Customer.api";
import type { CreateCustomerPayload } from "./customers.types";
import { useToast } from "../../../Context/ToastContext";
import { CustomerPresenter } from "./CustomersPresenter";

export default function CustomerPageContainer() {
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

  // Derived / filtered — computed in container, passed as prop
  const filteredCustomers = searchQuery
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery) ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : customers;

  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

  // Handlers
  const handleOpenModal = (customer?: Customer) => {
    setEditingCustomer(customer || null);
    setFormData(
      customer
        ? {
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
          }
        : { name: "", phone: "", email: "", address: "" },
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleFormChange = (
    field: keyof CreateCustomerPayload,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleDelete = async (customer: Customer) => {
    if (!window.confirm(`Delete "${customer.name}"?`)) return;
    try {
      await deleteCustomerApi(customer._id);
      setCustomers(customers.filter((c) => c._id !== customer._id));
      toast.success("Customer deleted!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete customer");
    }
  };

  return (
    <CustomerPresenter
      customers={customers}
      filteredCustomers={filteredCustomers}
      totalOrders={totalOrders}
      avgOrderValue={avgOrderValue}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      showModal={showModal}
      editingCustomer={editingCustomer}
      formData={formData}
      isAdmin={isAdmin}
      onSearchChange={setSearchQuery}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onRetry={fetchCustomers}
    />
  );
}

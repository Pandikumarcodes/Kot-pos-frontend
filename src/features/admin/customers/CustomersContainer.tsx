import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../state/hooks";
import {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "../../../services/admin/customer.api";
import type {
  Customer,
  CustomersQuery,
} from "../../../services/admin/customer.api";
import type { CreateCustomerPayload } from "./customers.types";
import { useToast } from "../../../contexts/toastContext";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import type { PaginationMeta } from "../../../types/query";
import { CustomerPresenter } from "./CustomersPresenter";

const DEFAULT_QUERY: CustomersQuery = { page: 1, limit: 20, search: "" };

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

export default function CustomerPageContainer() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const toast = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState<CustomersQuery>(DEFAULT_QUERY);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const debouncedSearch = useDebouncedValue(query.search ?? "");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CreateCustomerPayload>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if ((query.search ?? "").trim() !== debouncedSearch.trim()) {
      activeRequest.current?.abort();
      return;
    }

    const controller = new AbortController();
    activeRequest.current?.abort();
    activeRequest.current = controller;
    let redirectingToValidPage = false;
    const requestQuery: CustomersQuery = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: debouncedSearch.trim() || undefined,
      sort: query.sort,
      order: query.order,
    };

    void getCustomersApi(requestQuery, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (!data.pagination) {
          throw new Error("Paginated customer response did not include metadata");
        }
        const lastValidPage = Math.max(1, data.pagination.pages);
        if (data.pagination.page > lastValidPage) {
          redirectingToValidPage = true;
          setQuery((previous) => ({ ...previous, page: lastValidPage }));
          return;
        }
        setCustomers(data.customers);
        setPagination(data.pagination);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const apiError = err as { response?: { data?: { error?: string } } };
        setError(apiError.response?.data?.error || "Failed to load customers");
      })
      .finally(() => {
        if (!controller.signal.aborted && !redirectingToValidPage) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    debouncedSearch,
    query.limit,
    query.order,
    query.page,
    query.search,
    query.sort,
    refreshKey,
  ]);

  const refreshCustomers = () => {
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setRefreshKey((value) => value + 1);
  };

  const updateQueryAndResetPage = (updates: Partial<CustomersQuery>) => {
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, ...updates, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page === query.page) return;
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, page }));
  };

  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.totalOrders,
    0,
  );
  const totalSpent = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0,
  );
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

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
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomerApi(editingCustomer._id, formData);
      } else {
        await createCustomerApi(formData);
      }
      handleCloseModal();
      toast.success(editingCustomer ? "Customer updated!" : "Customer added!");
      refreshCustomers();
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(apiError.response?.data?.error || "Failed to save customer");
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!window.confirm(`Delete "${customer.name}"?`)) return;
    try {
      await deleteCustomerApi(customer._id);
      toast.success("Customer deleted!");
      refreshCustomers();
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(apiError.response?.data?.error || "Failed to delete customer");
    }
  };

  return (
    <CustomerPresenter
      customers={customers}
      pagination={pagination}
      totalOrders={totalOrders}
      avgOrderValue={avgOrderValue}
      loading={loading}
      error={error}
      searchQuery={query.search ?? ""}
      showModal={showModal}
      editingCustomer={editingCustomer}
      formData={formData}
      isAdmin={isAdmin}
      onSearchChange={(search) => updateQueryAndResetPage({ search })}
      onPageChange={handlePageChange}
      onLimitChange={(limit) => updateQueryAndResetPage({ limit })}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onRetry={refreshCustomers}
    />
  );
}

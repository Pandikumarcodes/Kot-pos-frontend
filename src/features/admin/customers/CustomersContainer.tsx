import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../../state/hooks";
import {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "../../../services/admin/customer.api";
import type { Customer, CustomerSortField } from "../../../services/admin/customer.api";
import type { CreateCustomerPayload } from "./customers.types";
import { useToast } from "../../../contexts/toastContext";
import { CustomerPresenter } from "./CustomersPresenter";
import { useQueryState } from "../../../hooks/useQueryState";
import { usePagination, useSearch, useSorting } from "../../../query/hooks";

const EMPTY_PAGINATION = { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false };
const isCustomerSortField = (value: string | undefined): value is CustomerSortField => value === "name" || value === "createdAt";

export default function CustomerPageContainer() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const toast = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { query, updateQuery } = useQueryState({ initialState: { page: 1, pageSize: 20 } });
  const searchState = useSearch(query.search ?? "");
  const sortingState = useSorting({ sortBy: query.sortBy, sortOrder: query.sortOrder });
  const paginationState = usePagination({ page: query.page, pageSize: query.pageSize });
  const sortBy = isCustomerSortField(sortingState.sortBy) ? sortingState.sortBy : "";
  const sortOrder = sortingState.sortOrder ?? "asc";
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CreateCustomerPayload>({ name: "", phone: "", email: "", address: "" });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getCustomersApi({
        page: query.page,
        limit: query.pageSize,
        search: searchState.debouncedSearch.trim() || undefined,
        sort: isCustomerSortField(query.sortBy) ? query.sortBy : undefined,
        order: query.sortOrder,
      });
      setCustomers(data.customers);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [query.page, query.pageSize, query.sortBy, query.sortOrder, searchState.debouncedSearch]);

  useEffect(() => {
    const request = window.setTimeout(() => void fetchCustomers(), 0);
    return () => window.clearTimeout(request);
  }, [fetchCustomers]);
  useEffect(() => { updateQuery({ search: searchState.debouncedSearch || undefined, page: 1 }); }, [searchState.debouncedSearch, updateQuery]);
  useEffect(() => { updateQuery({ sortBy: sortingState.sortBy, sortOrder: sortingState.sortOrder, page: 1 }); }, [sortingState.sortBy, sortingState.sortOrder, updateQuery]);
  useEffect(() => { updateQuery({ page: paginationState.page, pageSize: paginationState.pageSize }); }, [paginationState.page, paginationState.pageSize, updateQuery]);

  const handleRetry = () => { setLoading(true); setError(null); void fetchCustomers(); };
  const handleOpenModal = (customer?: Customer) => {
    setEditingCustomer(customer || null);
    setFormData(customer ? { name: customer.name, phone: customer.phone, email: customer.email, address: customer.address } : { name: "", phone: "", email: "", address: "" });
    setShowModal(true);
  };
  const handleCloseModal = () => { setShowModal(false); setEditingCustomer(null); };
  const handleFormChange = (field: keyof CreateCustomerPayload, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        const { data } = await updateCustomerApi(editingCustomer._id, formData);
        setCustomers((current) => current.map((c) => c._id === editingCustomer._id ? data.customer : c));
      } else {
        const { data } = await createCustomerApi(formData);
        setCustomers((current) => [data.customer, ...current]);
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
      setCustomers((current) => current.filter((c) => c._id !== customer._id));
      toast.success("Customer deleted!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete customer");
    }
  };
  const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0);
  const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

  return <CustomerPresenter
    customers={customers} pagination={pagination} totalOrders={totalOrders} avgOrderValue={avgOrderValue}
    loading={loading} error={error} search={searchState.search} sortBy={sortBy} sortOrder={sortOrder}
    showModal={showModal} editingCustomer={editingCustomer} formData={formData} isAdmin={isAdmin}
    onSearchChange={(value) => { searchState.onSearchChange(value); paginationState.setPage(1); }}
    onSortChange={(value) => { sortingState.setSort((value || undefined) as CustomerSortField | undefined, sortOrder); paginationState.setPage(1); }}
    onSortOrderChange={() => { if (sortBy) sortingState.setSort(sortBy, sortOrder === "asc" ? "desc" : "asc"); }}
    onPageChange={paginationState.setPage} onOpenModal={handleOpenModal} onCloseModal={handleCloseModal}
    onFormChange={handleFormChange} onSubmit={handleSubmit} onDelete={handleDelete} onRetry={handleRetry}
  />;
}

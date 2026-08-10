import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import {
  allocateTableApi,
  createTableApi,
  deleteTableApi,
  freeTableApi,
  getTableByIdApi,
  getTablesApi,
  updateTableApi,
} from "../../services/waiter/table.api";

vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("table API contracts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps the existing table read and CRUD requests unchanged", () => {
    void getTablesApi();
    void getTableByIdApi("table-1");
    void createTableApi({ tableNumber: 7, capacity: 4 });
    void updateTableApi("table-1", { capacity: 6, status: "reserved" });
    void deleteTableApi("table-1");

    expect(api.get).toHaveBeenNthCalledWith(1, "/admin/tables");
    expect(api.get).toHaveBeenNthCalledWith(2, "/admin/tables/table-1");
    expect(api.post).toHaveBeenCalledWith("/admin/tables", {
      tableNumber: 7,
      capacity: 4,
    });
    expect(api.put).toHaveBeenCalledWith("/admin/tables/table-1", {
      capacity: 6,
      status: "reserved",
    });
    expect(api.delete).toHaveBeenCalledWith("/admin/tables/table-1");
  });

  it("keeps waiter allocate and free requests unchanged", () => {
    void allocateTableApi("table-1", { name: "Guest", phone: "1234567890" });
    void freeTableApi("table-1");

    expect(api.post).toHaveBeenCalledWith("/waiter/allocate/table-1", {
      name: "Guest",
      phone: "1234567890",
    });
    expect(api.put).toHaveBeenCalledWith("/waiter/free/table-1");
  });
});

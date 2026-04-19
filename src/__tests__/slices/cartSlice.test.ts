import { describe, it, expect } from "vitest";
import cartReducer, {
  setTable,
  addItem,
  removeItem,
  updateQuantity,
  setItemNote,
  clearCart,
} from "../../Store/Slices/cartSlice";
import type { CartItem } from "../../Store/Slices/cartSlice";

// addItem takes Omit<CartItem, "quantity"> — no quantity field
const PIZZA: Omit<CartItem, "quantity"> = {
  menuItemId: "menu_01",
  name: "Margherita Pizza",
  price: 250,
};

const BURGER: Omit<CartItem, "quantity"> = {
  menuItemId: "menu_02",
  name: "Veg Burger",
  price: 150,
};

const LASSI: Omit<CartItem, "quantity"> = {
  menuItemId: "menu_03",
  name: "Mango Lassi",
  price: 80,
};

const TABLE = { tableId: "table_01", tableName: "Table 1" };

const emptyState = {
  tableId: null,
  tableName: null,
  items: [],
};

// ─── Initial state ────────────────────────────────────────────────────────────
describe("cartSlice — initial state", () => {
  it("starts with no table, no items", () => {
    const state = cartReducer(undefined, { type: "@@INIT" });
    expect(state.tableId).toBeNull();
    expect(state.tableName).toBeNull();
    expect(state.items).toHaveLength(0);
  });
});

// ─── setTable ─────────────────────────────────────────────────────────────────
describe("cartSlice — setTable", () => {
  it("sets tableId and tableName", () => {
    const state = cartReducer(emptyState, setTable(TABLE));
    expect(state.tableId).toBe("table_01");
    expect(state.tableName).toBe("Table 1");
  });

  it("replaces existing table when switched", () => {
    const first = cartReducer(emptyState, setTable(TABLE));
    const second = cartReducer(
      first,
      setTable({ tableId: "table_02", tableName: "Table 2" }),
    );
    expect(second.tableId).toBe("table_02");
    expect(second.tableName).toBe("Table 2");
  });

  it("does not affect existing items when table is set", () => {
    const withItem = cartReducer(emptyState, addItem(PIZZA));
    const state = cartReducer(withItem, setTable(TABLE));
    expect(state.items).toHaveLength(1);
  });
});

// ─── addItem ──────────────────────────────────────────────────────────────────
describe("cartSlice — addItem", () => {
  it("adds a new item with quantity 1", () => {
    const state = cartReducer(emptyState, addItem(PIZZA));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].menuItemId).toBe(PIZZA.menuItemId);
    expect(state.items[0].quantity).toBe(1);
  });

  it("increments quantity when the same item is added again", () => {
    const first = cartReducer(emptyState, addItem(PIZZA));
    const second = cartReducer(first, addItem(PIZZA));
    expect(second.items).toHaveLength(1);
    expect(second.items[0].quantity).toBe(2);
  });

  it("adds multiple distinct items independently", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, addItem(BURGER));
    expect(state.items).toHaveLength(2);
  });

  it("stores name and price correctly", () => {
    const state = cartReducer(emptyState, addItem(PIZZA));
    expect(state.items[0].name).toBe("Margherita Pizza");
    expect(state.items[0].price).toBe(250);
  });

  it("initialises note as undefined for new items", () => {
    const state = cartReducer(emptyState, addItem(PIZZA));
    expect(state.items[0].note).toBeUndefined();
  });

  it("preserves existing items when a new one is added", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, addItem(LASSI));
    const pizza = state.items.find((i) => i.menuItemId === PIZZA.menuItemId);
    expect(pizza).toBeDefined();
    expect(pizza?.quantity).toBe(1);
  });

  it("handles item with optional note field", () => {
    const itemWithNote: Omit<CartItem, "quantity"> = {
      ...PIZZA,
      note: "extra cheese",
    };
    const state = cartReducer(emptyState, addItem(itemWithNote));
    expect(state.items[0].note).toBe("extra cheese");
  });
});

// ─── removeItem ───────────────────────────────────────────────────────────────
describe("cartSlice — removeItem", () => {
  it("removes an existing item by menuItemId", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, addItem(BURGER));
    state = cartReducer(state, removeItem(PIZZA.menuItemId));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].menuItemId).toBe(BURGER.menuItemId);
  });

  it("removes the item regardless of its quantity", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, addItem(PIZZA)); // qty = 2
    state = cartReducer(state, removeItem(PIZZA.menuItemId));
    expect(state.items).toHaveLength(0);
  });

  it("results in empty items array after removing the last item", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, removeItem(PIZZA.menuItemId));
    expect(state.items).toHaveLength(0);
  });

  it("is a no-op when menuItemId does not exist", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, removeItem("non_existent_id"));
    expect(state.items).toHaveLength(1);
  });

  it("does not affect tableId or tableName", () => {
    let state = cartReducer(emptyState, setTable(TABLE));
    state = cartReducer(state, addItem(PIZZA));
    state = cartReducer(state, removeItem(PIZZA.menuItemId));
    expect(state.tableId).toBe(TABLE.tableId);
    expect(state.tableName).toBe(TABLE.tableName);
  });
});

// ─── updateQuantity ───────────────────────────────────────────────────────────
describe("cartSlice — updateQuantity", () => {
  it("updates quantity for a given menuItemId", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(
      state,
      updateQuantity({ menuItemId: PIZZA.menuItemId, quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it("does not affect other items", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, addItem(BURGER));
    state = cartReducer(
      state,
      updateQuantity({ menuItemId: PIZZA.menuItemId, quantity: 4 }),
    );
    const burger = state.items.find((i) => i.menuItemId === BURGER.menuItemId);
    expect(burger?.quantity).toBe(1);
  });

  it("removes item when quantity is set to 0", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(
      state,
      updateQuantity({ menuItemId: PIZZA.menuItemId, quantity: 0 }),
    );
    expect(state.items).toHaveLength(0);
  });

  it("removes item when quantity is negative", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(
      state,
      updateQuantity({ menuItemId: PIZZA.menuItemId, quantity: -1 }),
    );
    expect(state.items).toHaveLength(0);
  });

  it("is a no-op for an unknown menuItemId", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(
      state,
      updateQuantity({ menuItemId: "unknown_id", quantity: 10 }),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });
});

// ─── setItemNote ──────────────────────────────────────────────────────────────
describe("cartSlice — setItemNote", () => {
  it("adds a note to an existing item", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(
      state,
      setItemNote({ menuItemId: PIZZA.menuItemId, note: "no onions" }),
    );
    expect(state.items[0].note).toBe("no onions");
  });

  it("updates an existing note", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(
      state,
      setItemNote({ menuItemId: PIZZA.menuItemId, note: "no onions" }),
    );
    state = cartReducer(
      state,
      setItemNote({ menuItemId: PIZZA.menuItemId, note: "extra cheese" }),
    );
    expect(state.items[0].note).toBe("extra cheese");
  });

  it("does not affect other items' notes", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, addItem(BURGER));
    state = cartReducer(
      state,
      setItemNote({ menuItemId: PIZZA.menuItemId, note: "no onions" }),
    );
    const burger = state.items.find((i) => i.menuItemId === BURGER.menuItemId);
    expect(burger?.note).toBeUndefined();
  });

  it("is a no-op for an unknown menuItemId", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(
      state,
      setItemNote({ menuItemId: "unknown_id", note: "test" }),
    );
    expect(state.items[0].note).toBeUndefined();
  });
});

// ─── clearCart ────────────────────────────────────────────────────────────────
describe("cartSlice — clearCart", () => {
  it("empties all items", () => {
    let state = cartReducer(emptyState, addItem(PIZZA));
    state = cartReducer(state, addItem(BURGER));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });

  it("resets tableId to null", () => {
    let state = cartReducer(emptyState, setTable(TABLE));
    state = cartReducer(state, clearCart());
    expect(state.tableId).toBeNull();
  });

  it("resets tableName to null", () => {
    let state = cartReducer(emptyState, setTable(TABLE));
    state = cartReducer(state, clearCart());
    expect(state.tableName).toBeNull();
  });

  it("is idempotent — clearing an already-empty cart stays empty", () => {
    const state = cartReducer(emptyState, clearCart());
    expect(state.items).toHaveLength(0);
    expect(state.tableId).toBeNull();
    expect(state.tableName).toBeNull();
  });

  it("clears everything together — table + items", () => {
    let state = cartReducer(emptyState, setTable(TABLE));
    state = cartReducer(state, addItem(PIZZA));
    state = cartReducer(state, addItem(BURGER));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
    expect(state.tableId).toBeNull();
    expect(state.tableName).toBeNull();
  });
});

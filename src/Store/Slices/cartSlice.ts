// ✅ After
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string; // special instruction per item
}

interface CartState {
  tableId: string | null;
  tableName: string | null;
  items: CartItem[];
}

const initialState: CartState = {
  tableId: null,
  tableName: null,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set which table this order is for
    setTable(
      state,
      action: PayloadAction<{ tableId: string; tableName: string }>,
    ) {
      state.tableId = action.payload.tableId;
      state.tableName = action.payload.tableName;
    },
    // Add item or increment if already exists
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existing = state.items.find(
        (i) => i.menuItemId === action.payload.menuItemId,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Remove item completely
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.menuItemId !== action.payload);
    },
    // Set exact quantity (e.g. from +/- buttons)
    updateQuantity(
      state,
      action: PayloadAction<{ menuItemId: string; quantity: number }>,
    ) {
      const item = state.items.find(
        (i) => i.menuItemId === action.payload.menuItemId,
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.menuItemId !== action.payload.menuItemId,
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    // Add note to a specific item
    setItemNote(
      state,
      action: PayloadAction<{ menuItemId: string; note: string }>,
    ) {
      const item = state.items.find(
        (i) => i.menuItemId === action.payload.menuItemId,
      );
      if (item) item.note = action.payload.note;
    },
    // Wipe entire cart (after order placed)
    clearCart(state) {
      state.tableId = null;
      state.tableName = null;
      state.items = [];
    },
  },
});

export const {
  setTable,
  addItem,
  removeItem,
  updateQuantity,
  setItemNote,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

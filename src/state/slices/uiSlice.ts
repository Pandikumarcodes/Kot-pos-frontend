import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface UiState {
  sidebarOpen: boolean;
  toasts: Toast[];
  selectedBranchId: string | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  toasts: [],
  selectedBranchId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setSelectedBranchId(state, action: PayloadAction<string | null>) {
      state.selectedBranchId = action.payload;
    },
    addToast(state, action: PayloadAction<Omit<Toast, "id">>) {
      state.toasts.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebar,
  setSelectedBranchId,
  addToast,
  removeToast,
} =
  uiSlice.actions;
export default uiSlice.reducer;

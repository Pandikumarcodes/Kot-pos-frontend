import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import cartReducer from "./Slices/cartSlice";
import uiReducer from "./Slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

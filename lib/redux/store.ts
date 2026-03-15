import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/redux/Features/authSlice";
import clientReducer from "@/lib/redux/Features/clientSlice";
import expenseReducer from "@/lib/redux/Features/expenseSlice";
import { invoiceApi } from "@/lib/redux/Features/invoiceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    expense: expenseReducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(invoiceApi.middleware), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

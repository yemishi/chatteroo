import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import toastReducer from "./toastSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

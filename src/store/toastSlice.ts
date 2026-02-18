import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Toast = {
  id: string;
  title: string;
  icon?: string;
  message?: { text?: string; imgs: string[] };
  type: "success" | "error" | "info" | "message";
  duration?: number;
  onClick?: () => void;
};

type ToastsState = {
  list: Toast[];
};

const initialState: ToastsState = {
  list: [],
};

export const toastsSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Toast>) {
      state.list.push(action.payload);
    },
    removeToast(state, action: PayloadAction<string>) {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastsSlice.actions;
export default toastsSlice.reducer;

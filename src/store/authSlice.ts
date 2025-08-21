import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getUserApi } from "@/lib/api";
import { connectSocket, getSocket, disconnectSocket } from "@/lib/socket";
import type { User } from "@/types";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async () => {
  const user = await getUserApi();
  if (user && !getSocket()) {
    connectSocket(user.id);
  }
  return user as User;
});

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      disconnectSocket();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to load user";
        state.isLoading = false;
      });
  },
});

export const { updateUser, logout } = authSlice.actions;
export default authSlice.reducer;

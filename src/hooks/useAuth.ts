import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { fetchCurrentUser, updateUser, logout } from "@/store/authSlice";
import type { User } from "@/types";

export default function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);

  return {
    user,
    isLoading,
    error,
    fetchUser: () => dispatch(fetchCurrentUser()),
    updateUser: (u: User | null) => dispatch(updateUser(u)),
    logout: () => dispatch(logout()),
  };
}

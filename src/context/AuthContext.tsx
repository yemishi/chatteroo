import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser as queryFn } from "@/lib/api";
import { connectSocket, getSocket } from "@/lib/socket";
import type { User } from "@/types";

const AuthContext = createContext<{
  isLoading: boolean;
  user: User | null;
  refetch: () => void;
  error: Error | null;
  updateUser: (user: User | null) => void;
}>({
  user: null,
  isLoading: true,
  refetch: () => {},
  updateUser: () => {},
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data, isLoading, isRefetching, isFetching, refetch, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn,
  });
  useEffect(() => {
    if (data && !getSocket()) {
      connectSocket(data.id);
      setUser(data);
    }
  }, [data]);
  const updateUser = (user: User | null) => setUser(user);
  return (
    <AuthContext value={{ user, isLoading: isLoading || isRefetching || isFetching, refetch, error, updateUser }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => useContext(AuthContext);

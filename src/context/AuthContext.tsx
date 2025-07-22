import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser as queryFn } from "@/lib/api";
import { connectSocket, getSocket } from "@/lib/socket";

type User = {
  id: string;
  email: string;
  picture: string;
  username: string;
  guestId?: string;
};
const AuthContext = createContext<{ isLoading: boolean; user: User | null; refetch: () => void; error: Error | null }>({
  user: null,
  isLoading: true,
  refetch: () => {},
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isRefetching, isFetching, refetch, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn,
  });
  useEffect(() => {
    if (data && !getSocket()) {
      connectSocket(data.id);
    }
  }, [data]);
  return (
    <AuthContext value={{ user: data, isLoading: isLoading || isRefetching || isFetching, refetch, error }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => useContext(AuthContext);

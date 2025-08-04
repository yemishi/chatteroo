import { createContext, useContext, useEffect, useState, type ReactNode, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser as queryFn } from "@/lib/api";
import { connectSocket, getSocket } from "@/lib/socket";
import type { User } from "@/types";

type AuthContextType = {
  isLoading: boolean;
  user: User | null;
  refetch: () => void;
  error: Error | null;
  updateUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const {
    data,
    isLoading: queryLoading,
    isFetching,
    isRefetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn,
  });

  const effectiveLoading = queryLoading || (!user && (isFetching || isRefetching));

  useEffect(() => {
    if (data) {
      setUser(data);
      if (!getSocket()) {
        connectSocket(data.id);
      }
    }
  }, [data]);

  const updateUser = (user: User | null) => {
    setUser(user);
  };

  const contextValue = useMemo(
    () => ({
      user,
      isLoading: effectiveLoading,
      refetch,
      error,
      updateUser,
    }),
    [user, effectiveLoading, refetch, error]
  );
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

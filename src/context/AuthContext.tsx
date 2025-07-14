import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUser } from "../lib/api";

type User = {
  id: string;
  email: string;
  picture: string;
  username: string;
  guestId?: string;
};
const AuthContext = createContext<{ isLoading: boolean; user: User | null }>({
  user: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getUser()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return <AuthContext value={{ user, isLoading }}>{children}</AuthContext>;
};

export const useAuth = () => useContext(AuthContext);

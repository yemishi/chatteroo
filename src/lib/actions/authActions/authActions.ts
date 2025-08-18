import { useMutation } from "@tanstack/react-query";
import {
  loginApi,
  registerApi,
  guestLoginApi,
  guestRegisterApi,
  signoutApi,
  type AuthGuestUser,
  generateGuestApi,
} from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import type { User } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "@/hooks";

export const authActions = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const handleLogin = (data: { message: string; user: User }) => {
    connectSocket(data.user.id);
    updateUser(data.user);
    navigate({ to: search?.redirect || "/" });
  };

  const login = useMutation({
    mutationFn: ({ name, password }: { name: string; password: string }) => loginApi(name, password),
    onSuccess: handleLogin,
  });

  const register = useMutation({
    mutationFn: (values: {
      username: string;
      email: string;
      password: string;
      tag: string;
      bio?: string;
      picture?: string;
    }) => registerApi(values),
    onSuccess: handleLogin,
  });
  const guestRegister = useMutation({
    mutationFn: (values: AuthGuestUser) => guestRegisterApi(values),
    onSuccess: handleLogin,
  });

  const generateGuestUser = useMutation({
    mutationFn: () => generateGuestApi(),
  });
  const guestLogin = useMutation({
    mutationFn: ({ guestCode }: { guestCode: string }) => guestLoginApi(guestCode),
    onSuccess: handleLogin,
  });
  const signout = useMutation({
    mutationFn: signoutApi,
    onSuccess: () => {
      disconnectSocket();
      updateUser(null);
    },
  });

  return {
    login,
    signout,
    register,
    guestLogin,
    guestRegister,
    generateGuestUser,
  };
};

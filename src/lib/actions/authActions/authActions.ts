import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi, guestLoginApi, guestRegisterApi, signoutApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import type { User } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";

export const authActions = () => {
  const { refetch, updateUser } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const onSuccess = (data: { message: string; user: User }) => {
    refetch();
    connectSocket(data.user.id);
    updateUser(data.user);
    navigate({ to: search?.redirect || "/" });
  };
  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginApi(email, password),
    onSuccess,
  });

  const register = useMutation({
    mutationFn: ({
      username,
      email,
      bio,
      picture,
    }: {
      username: string;
      email: string;
      bio?: string;
      picture?: string;
    }) => registerApi(username, email, bio, picture),
    onSuccess,
  });
  const guestRegister = useMutation({
    mutationFn: () => guestRegisterApi(),
    onSuccess,
  });
  const guestLogin = useMutation({
    mutationFn: ({ guestId }: { guestId: string }) => guestLoginApi(guestId),
    onSuccess,
  });
  const signout = useMutation({
    mutationFn: signoutApi,
    onSuccess: () => {
      disconnectSocket();
      updateUser(null);
      refetch();
    },
  });

  return {
    login,
    signout,
    register,
    guestLogin,
    guestRegister,
  };
};

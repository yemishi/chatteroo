import { useMutation } from "@tanstack/react-query";
import {
  login as loginFn,
  userRegister as registerFn,
  guestLogin as guestLoginFn,
  guestRegister as guestRegisterFn,
  signout as signoutFn,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { disconnectSocket } from "@/lib/socket";
import type { User } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";

export const authActions = () => {
  const { refetch, updateUser } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const onSuccess = (data: { message: string; user: User }) => {
    refetch();

    updateUser(data.user);
    navigate({ to: search?.redirect || "/" });
  };
  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginFn(email, password),
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
    }) => registerFn(username, email, bio, picture),
    onSuccess,
  });
  const guestRegister = useMutation({
    mutationFn: () => guestRegisterFn(),
    onSuccess,
  });
  const guestLogin = useMutation({
    mutationFn: ({ guestId }: { guestId: string }) => guestLoginFn(guestId),
    onSuccess,
  });
  const signout = useMutation({
    mutationFn: signoutFn,
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

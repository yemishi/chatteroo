import { useMutation } from "@tanstack/react-query";
import {
  login as loginFn,
  userRegister as registerFn,
  guestLogin as guestLoginFn,
  guestRegister as guestRegisterFn,
  signout as signoutFn,
} from "@/lib/api";
import { useAuth as useAuthContext } from "@/context/AuthContext";

export const authActions = () => {
  const { refetch: onSuccess } = useAuthContext();

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
    onSuccess,
  });

  return {
    login,
    signout,
    register,
    guestLogin,
    guestRegister,
  };
};

import { useAuth } from "@/hooks";
import { deleteUserApi, updateFromGuestApi, updateUserApi, type UpdateUserProps } from "@/lib/api";
import type { User } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useUserUpdates() {
  const { updateUser: authUpdateUser, logout } = useAuth();
  const onSuccess = (data: { user: User; message: string }) => {
    authUpdateUser(data.user);
  };
  const updateUser = () => {
    return useMutation({
      mutationFn: (user: UpdateUserProps) => updateUserApi(user),
      mutationKey: ["update-user"],
      onSuccess,
    });
  };

  const upgradeGuestAccount = () => {
    return useMutation({
      mutationFn: (user: { email: string; password: string }) => updateFromGuestApi(user),
      mutationKey: ["update-user"],
      onSuccess,
    });
  };
  const deleteAccount = () => {
    return useMutation({
      mutationFn: (password: string) => deleteUserApi(password),
      mutationKey: ["deleted-user"],
      onSuccess: () => {
        logout();
      },
    });
  };

  return {
    updateUser,
    upgradeGuestAccount,
    deleteAccount,
  };
}

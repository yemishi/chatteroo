import useScrollQuery from "@/hooks/useScrollQuery";
import { deleteNotificationsApi, readNotificationsApi } from "@/lib/api";
import type { Notification } from "@/types/notificationType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const getNotifications = () => {
  return useScrollQuery<Notification>({ queryKey: ["user-notification"], url: "/notification" });
};

export const markAsReadNotification = () => {
  return useMutation({
    mutationFn: (notificationId: string) => readNotificationsApi(notificationId),
    mutationKey: ["markAsRead-notification"],
  });
};

export const deleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => deleteNotificationsApi(notificationId),
    mutationKey: ["delete-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-notification"] });
    },
  });
};

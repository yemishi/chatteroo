import useScrollQuery from "@/hooks/useScrollQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequestApi, deleteFriendRequestApi, sendFriendRequestApi } from "../../api";
import type { FriendRequest } from "@/types";

export const getReceivedFriendRequests = (userId?: string) => {
  return useScrollQuery<FriendRequest>({
    url: `/request/receives?userId=${userId || ""}`,
    queryKey: ["receives-friend-requests"],
  });
};

export const getSentFriendRequests = (userId?: string) => {
  return useScrollQuery<FriendRequest>({
    url: `/request/sent?userId=${userId || ""}`,
    queryKey: ["sent-friend-requests"],
  });
};

export const sendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => sendFriendRequestApi(userId),
    mutationKey: ["sent-friend-requests"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
    },
  });
};

export const acceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => acceptFriendRequestApi(requestId),
    mutationKey: ["accept-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
      queryClient.invalidateQueries({ queryKey: ["receives-friend-requests"] });
    },
  });
};

export const rejectFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => deleteFriendRequestApi(requestId),
    mutationKey: ["delete-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["receives-friend-requests"] });
    },
  });
};

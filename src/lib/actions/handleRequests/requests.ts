import useScrollQuery from "@/hooks/useScrollQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, deleteFriendRequest, sendFriendRequest } from "../../api";
import type { FriendRequest } from "@/types";

export const getReceivedFriendRequests = (userId?: string) => {
  return useScrollQuery<FriendRequest>({
    url: `/request/receives?userId=${userId || ""}`,
    queryKey: ["receive-friend-requests"],
  });
};

export const getSentFriendRequests = (userId?: string) => {
  return useScrollQuery<FriendRequest>({ url: `/request/sent?userId=${userId || ""}`, queryKey: ["send-friend-requests"] });
};

export const sendFriendReq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => sendFriendRequest(userId),
    mutationKey: ["send-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
    },
  });
};

export const acceptFriendReq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => acceptFriendRequest(requestId),
    mutationKey: ["accept-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
      queryClient.invalidateQueries({ queryKey: ["receive-friend-requests"] });
    },
  });
};

export const rejectFriendReq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => deleteFriendRequest(requestId),
    mutationKey: ["delete-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["sends-friend-requests"] });
      queryClient.invalidateQueries({ queryKey: ["receives-friend-requests"] });
    },
  });
};

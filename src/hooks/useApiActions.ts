import { useMutation, useQueryClient } from "@tanstack/react-query";
import useScrollQuery from "./useScrollQuery";
import {
  editMessage as editMessageFn,
  getChatInfo,
  removeFriend as removeFriendFn,
  sendFriendRequest as sendFriendRequestFn,
  acceptFriendRequest as acceptFriendRequestFn,
  deleteFriendRequest as deleteFriendRequestFn,
} from "@/lib/api";

const useGetChats = () => {
  return useScrollQuery({ url: "/chat", queryKey: ["chats"] });
};

const useGetMessages = (chatId: string) => {
  return useScrollQuery({ url: `/message/${chatId}`, queryKey: ["messages", chatId] });
};

const useChatInfo = () => {
  return useMutation({
    mutationFn: ({ chatId }: { chatId: string }) => getChatInfo(chatId),
    mutationKey: ["chatInfo"],
  });
};

const useEditMessage = () => {
  return useMutation({
    mutationFn: ({ msgId, content }: { msgId: string; content: string }) => editMessageFn(msgId, content),
    mutationKey: ["edit-message"],
  });
};

const useGetFriends = (userId: string) => {
  return useScrollQuery({ url: `/friends/${userId}`, queryKey: ["friends", userId] });
};
const useSearchUser = (q?: string) => {
  return useScrollQuery({ url: `/search/user?q=${q}`, queryKey: ["search-users", q || ""] });
};
const useRemoveFriend = () => {
  return useMutation({
    mutationFn: (userId: string) => removeFriendFn(userId),
    mutationKey: ["unfriend"],
  });
};

const useGetReceivesReq = (userId?: string) => {
  return useScrollQuery({ url: `/request/receives?userId=${userId || ""}`, queryKey: ["receive-friend-requests"] });
};

const useGetSendsReq = (userId?: string) => {
  return useScrollQuery({ url: `/request/sends?userId=${userId || ""}`, queryKey: ["send-friend-requests"] });
};

const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => sendFriendRequestFn(userId),
    mutationKey: ["send-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
    },
  });
};

const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => acceptFriendRequestFn(requestId),
    mutationKey: ["accept-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["search-users"] });
      queryClient.invalidateQueries({ queryKey: ["receive-friend-requests"] });
    },
  });
};

const useDeleteFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => deleteFriendRequestFn(requestId),
    mutationKey: ["delete-friend-request"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["sends-friend-requests"] });
      queryClient.invalidateQueries({ queryKey: ["receives-friend-requests"] });
    },
  });
};

export {
  useDeleteFriendRequest,
  useAcceptFriendRequest,
  useSendFriendRequest,
  useGetReceivesReq,
  useGetSendsReq,
  useRemoveFriend,
  useGetFriends,
  useChatInfo,
  useEditMessage,
  useGetChats,
  useGetMessages,
  useSearchUser,
};

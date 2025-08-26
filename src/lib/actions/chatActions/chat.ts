import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatInfoApi, getChatsApi } from "../../api";
import { markChatAsReadApi, quitChatApi } from "@/lib/api/chat/updateChat";

export const getChatInfo = (chatId: string) => {
  return useQuery({
    queryFn: () => getChatInfoApi(chatId),
    queryKey: ["chat-info", chatId],
  });
};

export const getChatInfoMutate = () => {
  return useMutation({
    mutationFn: (chatId: string) => getChatInfoApi(chatId),
    mutationKey: ["chat-info-mutate"],
  });
};

export const markChatAsRead = () => {
  return useMutation({
    mutationFn: (chatId: string) => markChatAsReadApi(chatId),
    mutationKey: ["chat-read"],
  });
};

export const quitChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: string) => quitChatApi(chatId),
    mutationKey: ["quit-chat"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-chats"] });
    },
  });
};

export const getChats = () => {
  return useQuery({ queryFn: getChatsApi, queryKey: ["user-chats"] });
};

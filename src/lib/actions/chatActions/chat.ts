import { useMutation, useQuery } from "@tanstack/react-query";
import { getChatInfoApi, getChatsApi } from "../../api";

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

export const getChats = () => {
  return useQuery({ queryFn: getChatsApi, queryKey: ["user-chats"] });
};

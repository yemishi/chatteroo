import { useQuery } from "@tanstack/react-query";
import { getChatInfoApi, getChatsApi } from "../../api";

export const getChatInfo = (chatId: string) => {
  return useQuery({
    queryFn: () => getChatInfoApi(chatId),
    queryKey: ["chat-info", chatId],
  });
};

export const getChats = () => {
  return useQuery({ queryFn: getChatsApi, queryKey: ["user-chats"] });
};

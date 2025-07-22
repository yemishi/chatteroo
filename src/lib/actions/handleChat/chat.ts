import { useQuery } from "@tanstack/react-query";
import { getChatInfo as getChatInfoFn, getChats as getChatsFn } from "../../api";

export const getChatInfo = (chatId: string) => {
  return useQuery({
    queryFn: () => getChatInfoFn(chatId),
    queryKey: ["chat-info", chatId],
  });
};

export const getChats = () => {
  return useQuery({ queryFn: getChatsFn, queryKey: ["user-chats"] });
};

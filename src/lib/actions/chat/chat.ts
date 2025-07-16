import { useMutation } from "@tanstack/react-query";
import { getChatInfo as getChatInfoFn } from "../../api";
import useScrollQuery from "@/hooks/useScrollQuery";

export const getChatInfo = () => {
  return useMutation({
    mutationFn: ({ chatId }: { chatId: string }) => getChatInfoFn(chatId),
    mutationKey: ["chatInfo"],
  });
};

export const getChats = () => {
  return useScrollQuery({ url: "/chat", queryKey: ["chats"] });
};

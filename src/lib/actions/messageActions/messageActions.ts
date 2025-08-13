import { useMutation } from "@tanstack/react-query";
import { editMessageApi } from "../../api";
import useScrollQuery from "@/hooks/useScrollQuery";
import type { Message } from "@/types";

export const getMessages = (chatId: string) => {
  return useScrollQuery<Message>({ url: `/message/${chatId}`, queryKey: [chatId] });
};

export const editMessage = () => {
  return useMutation({
    mutationFn: ({ msgId, content }: { msgId: string; content: string }) => editMessageApi(msgId, content),
    mutationKey: ["edit-message"],
  });
};

import { useMutation } from "@tanstack/react-query";
import { editMessage as editMessageFn } from "../../api";
import useScrollQuery from "@/hooks/useScrollQuery";
import type { Message } from "@/types";

export const getMessages = (chatId: string) => {
  return useScrollQuery<Message>({ url: `/message/${chatId}`, queryKey: ["messages", chatId] });
};

export const editMessage = () => {
  return useMutation({
    mutationFn: ({ msgId, content }: { msgId: string; content: string }) => editMessageFn(msgId, content),
    mutationKey: ["edit-message"],
  });
};

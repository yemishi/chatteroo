import { useMutation } from "@tanstack/react-query";
import { editMessage as editMessageFn } from "../../api";
import useScrollQuery from "@/hooks/useScrollQuery";

export const getMessages = (chatId: string) => {
  return useScrollQuery({ url: `/message/${chatId}`, queryKey: ["messages", chatId] });
};

export const editMessage = () => {
  return useMutation({
    mutationFn: ({ msgId, content }: { msgId: string; content: string }) => editMessageFn(msgId, content),
    mutationKey: ["edit-message"],
  });
};

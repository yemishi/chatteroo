import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMessageApi, deleteMessageApi } from "../../api";
import useScrollQuery from "@/hooks/useScrollQuery";
import type { Message } from "@/types";

export const getMessages = (chatId: string) => {
  return useScrollQuery<Message>({ url: `/message/${chatId}`, queryKey: [`get-message-${chatId}`] });
};

export const editMessage = (chatId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      msgId,
      content,
      removedImgs,
    }: {
      msgId: string;
      content: { text?: string; imgs: string[] };
      removedImgs?: string[];
    }) => editMessageApi(msgId, content, removedImgs || []),
    mutationKey: ["edit-message"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`get-message-${chatId}`] });
    },
  });
};

export const deleteMessage = (chatId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ msgId, imgs }: { msgId: string; imgs: string[] }) => deleteMessageApi(msgId, imgs),
    mutationKey: ["edit-message"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`get-message-${chatId}`] });
    },
  });
};

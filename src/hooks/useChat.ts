import { useCallback, useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import type { Message as MessageData } from "@/types";

export interface Message {
  id: string;
  room: string;
  senderId: string;
  senderName?: string;
  senderPicture?: string;
  content: { text?: string; imgs: string[] };
  timestamp: Date;
}
export interface MessageEdited extends MessageData {
  deleted?: boolean;
}

const useChat = (
  userId: string,
  chatId: string,
  membersId: string[],
  setMsgs: React.Dispatch<React.SetStateAction<MessageData[]>>
) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !userId || !chatId) return;

    socket.emit("subscribe", chatId);

    const handleMessage = (data: MessageData) => setMsgs((prev) => [...prev, data]);
    const handleMessageOnEdit = (data: MessageEdited) => {
      setMsgs((prev) => {
        if (!prev.some((m) => m.id === data.id)) return prev;
        return data.deleted
          ? prev.filter((m) => m.id !== data.id)
          : prev.map((m) => (m.id === data.id ? data : m) as MessageData);
      });
    };
    const handleTyping = ({ userId: typingId }: { userId: string }) => {
      if (typingId === userId) return;
      setTypingUsers((prev) => [...new Set([...prev, typingId])]);
    };

    const handleStopTyping = ({ userId: typingId }: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== typingId));
    };
    socket.on("update-message", handleMessageOnEdit);
    socket.on("message", handleMessage);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    return () => {
      socket.emit("unsubscribe", chatId);
      socket.off("message", handleMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };
  }, [userId, chatId]);

  const sendMessage = useCallback(
    (message: Omit<Message, "timestamp">) => {
      const socket = getSocket();
      if (!socket) return;

      socket.emit("send-message", { message, membersId });
    },
    [membersId]
  );

  const onEditMessage = useCallback(
    (message: MessageEdited) => {
      const socket = getSocket();
      if (!socket) return;

      socket.emit("edit-message", { message, chatRoom: chatId });
    },
    [chatId]
  );

  const startTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("typing", { roomId: chatId, userId, usersId: membersId });
  }, [chatId, userId, membersId]);

  const stopTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("stop-typing", { roomId: chatId, userId, usersId: membersId });
  }, [chatId, userId, membersId]);

  return { sendMessage, typingUsers, startTyping, stopTyping, onEditMessage };
};

export default useChat;

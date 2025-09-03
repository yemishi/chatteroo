import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";

export interface Message {
  room: string;
  senderId: string;
  senderName?: string;
  senderPicture?: string;
  content: { text?: string; imgs: string[] };
  timestamp: Date;
}

const useChat = (userId: string) => {
  const [msgs, setMsgs] = useState<Message[]>([]);
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !userId) return;

    socket.emit("subscribe", userId);

    socket.on("message", (data: Message) => {
      setMsgs((prevMsgs) => [...prevMsgs, data]);
    });

    return () => {
      socket.emit("unsubscribe", userId);
      socket.off("message");
    };
  }, [userId]);

  const sendMessage = (message: Omit<Message, "timestamp">, membersId: string[]) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("send-message", { message, membersId });
    }
  };

  return { sendMessage, messages: msgs };
};

export default useChat;

import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";

interface Message {
  room: string;
  senderId: string;
  content: string;
}

const useChat = (userId: string, messages: Message[]) => {
  const [msgs, setMsgs] = useState(messages);

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
      socket.off("connect");
      socket.off("online-users");
    };
  }, [userId]);

  const sendMessage = (message: Message, membersId: string[]) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("send-message", { message, membersId });
    }
  };

  return { sendMessage, messages: msgs };
};

export default useChat;

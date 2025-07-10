import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";

export interface Message {
  room: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const useChat = (userChats: string[]) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !userChats.length) return;

    console.log("Subscribing to rooms:", userChats);
    userChats.forEach((room) => socket.emit("subscribe", room));

    socket.on("message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("connect", () => {
      console.log("Reconnected! Resubscribing to rooms...");
      userChats.forEach((room) => socket.emit("subscribe", room));
      socket.emit("getOnlineUsers");
    });

    socket.emit("getOnlineUsers");

    return () => {
      userChats.forEach((room) => socket.emit("unsubscribe", room));
      socket.off("message");
      socket.off("connect");
      socket.off("online-users");
    };
  }, [userChats, setMessages]);

  const sendMessage = (message: Message) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("send", { message });
    }
  };

  return { sendMessage, messages };
};

export default useChat;

import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useAuth, useToast } from "./hooks";
import { useEffect, useState } from "react";
import { getSocket } from "./lib/socket";
import type { Toast } from "./store/toastSlice";
import { getChatInfoMutate } from "./lib/actions";
import type { Chat } from "./types";
import ChatRoom from "./components/chatRoom/ChatRoom";

export default function App() {
  const { fetchUser } = useAuth();
  const { sendToast } = useToast();
  const { mutateAsync, isPending, data: chatInfo } = getChatInfoMutate();
  const [chatRoom, setChatRoom] = useState<Chat | null>(null);

  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  useEffect(() => {
    fetchUser();
  }, []);

  const socket = getSocket();
  useEffect(() => {
    if (!socket) return;
    interface SocketToast extends Toast {
      chatId: string;
    }
    socket.on("toast", async (data: SocketToast) => {
      const onClick = async () => {
        try {
          const chat = await mutateAsync(data.chatId);
          setChatRoom(chat);
        } catch (error) {
          console.error("Failed to fetch chat on toast click:", error);
        }
      };
      sendToast({ ...data, type: "message", onClick });
    });
    return () => {
      socket.off("toast");
    };
  }, [socket, sendToast]);

  return (
    <>
      {chatRoom && (
        <ChatRoom
          scrollPositions={scrollPositions}
          setScrollPositions={setScrollPositions}
          chatInfo={chatInfo!}
          onClose={() => setChatRoom(null)}
        />
      )}
      <RouterProvider router={router} />
    </>
  );
}

import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { authActions } from "@/lib/actions";
import ChatList from "./components/chatList/ChatList";
import type { Chat as ChatType } from "./types";
import Chat from "./components/chatRoom/ChatRoom";
import getOnlineUsers from "./lib/getOnlineUsers";
import { getSocket } from "./lib/socket";

export default function App() {
  const { user, isLoading, error } = useAuth();
  const { guestRegister, guestLogin, signout } = authActions();

  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const [guestId, setGuestId] = useState("");

  const [chatInfo, setChatInfo] = useState<ChatType | null>(null);
  const handleGuestLogin = () => {
    guestLogin.mutate({ guestId });
  };

  const handleGuestRegister = () => {
    guestRegister.mutate();
  };

  const onlineUsers = getOnlineUsers();
  if (isLoading) return <div>Loading...</div>;

  if (!user || error) {
    return (
      <div className="p-4 space-y-3">
        <button onClick={handleGuestRegister}>Register as Guest</button>
        <input type="text" value={guestId} placeholder="Enter guest ID" onChange={(e) => setGuestId(e.target.value)} />
        <button onClick={handleGuestLogin}>Login as Guest</button>
      </div>
    );
  }
  return (
    <main>
      <button
        onClick={() => {
          signout.mutate();
          const s = getSocket()!;
          s.disconnect()
        }}
      >
        get off
      </button>
      <ChatList setChat={setChatInfo} onlineUsers={onlineUsers} />
      {chatInfo && (
        <Chat
          scrollPositions={scrollPositions}
          setScrollPositions={setScrollPositions}
          chatInfo={chatInfo!}
          onClose={() => setChatInfo(null)}
        />
      )}
    </main>
  );
}

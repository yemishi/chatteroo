import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { authActions } from "@/lib/actions";
import ChatList from "./components/ChatLits";
import type { Chat as ChatType } from "./types";
import Chat from "./components/chatRoom/ChatRoom";

export default function App() {
  const { user, isLoading, error } = useAuth();
  const { guestRegister, guestLogin, signout } = authActions();

  const [guestId, setGuestId] = useState("");

  const [chatInfo, setChatInfo] = useState<ChatType | null>(null);
  const handleGuestLogin = () => {
    guestLogin.mutate({ guestId });
  };

  const handleGuestRegister = () => {
    guestRegister.mutate();
  };

  const handleSignOut = () => {
    signout.mutate();
  };

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
    <main className="p-4">
      <p className="text-lg font-bold mb-4">Welcome, {user.username}!</p>

      <div className="chat-list">
        <ChatList setChat={setChatInfo} />
      </div>

      <div className={`chat ${chatInfo ? "open" : ""}`}>
        {chatInfo && <Chat chatInfo={chatInfo!} onClose={() => setChatInfo(null)} />}
      </div>
    </main>
  );
}

import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { authActions } from "@/lib/actions";
import ChatList from "./components/chatList/ChatList";
import type { Chat as ChatType } from "./types";
import Chat from "./components/chatRoom/ChatRoom";
import HomeHeader from "./components/homeHeader/Header";

export default function App() {
  const { user, isLoading, error } = useAuth();
  const { guestRegister, guestLogin } = authActions();
  const [searchChat, setSearchChat] = useState("");
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const [guestId, setGuestId] = useState("");

  const handleSearchChat = (search: string) => setSearchChat(search.replace("  ", " "));

  const [chatInfo, setChatInfo] = useState<ChatType | null>(null);
  const handleGuestLogin = () => {
    guestLogin.mutate({ guestId });
  };

  const handleGuestRegister = () => {
    guestRegister.mutate();
  };

  if (isLoading) return <div>Loading...</div>;

  if (!user && error) {
    return (
      <div className="p-4 space-y-3">
        <button onClick={() => console.log(user)}>Check user</button>
        <button onClick={handleGuestRegister}>Register as Guest</button>
        <input type="text" value={guestId} placeholder="Enter guest ID" onChange={(e) => setGuestId(e.target.value)} />
        <button onClick={handleGuestLogin}>Login as Guest</button>
      </div>
    );
  }
  return (
    <main>
      <HomeHeader onChangeSearch={handleSearchChat} search={searchChat} user={user!} />
      <ChatList setChat={setChatInfo} searchChat={searchChat} />

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

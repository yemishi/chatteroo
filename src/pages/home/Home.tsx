import ChatList from "@/components/chatList/ChatList";
import ChatRoom from "@/components/chatRoom/ChatRoom";
import { useAuth } from "@/context/AuthContext";
import { authActions } from "@/lib/actions";
import HomeHeader from "@/pages/home/homeHeader/Header";
import type { Chat } from "@/types";
import { useState } from "react";

export default function Home() {
  const { user, isLoading, error } = useAuth();
  const { guestRegister, guestLogin } = authActions();
  const [searchChat, setSearchChat] = useState("");
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const [guestId, setGuestId] = useState("");

  const handleSearchChat = (search: string) => setSearchChat(search.replace("  ", " "));

  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
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
    <div>
      <HomeHeader onChangeSearch={handleSearchChat} search={searchChat} user={user!} />
      <ChatList setChat={setChatInfo} searchChat={searchChat} />

      {chatInfo && (
        <ChatRoom
          scrollPositions={scrollPositions}
          setScrollPositions={setScrollPositions}
          chatInfo={chatInfo!}
          onClose={() => setChatInfo(null)}
        />
      )}
    </div>
  );
}

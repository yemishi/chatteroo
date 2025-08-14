import "./style.scss";
import ChatList from "@/components/chatList/ChatList";
import ChatRoom from "@/components/chatRoom/ChatRoom";
import HomeHeader from "@/pages/home/homeHeader/Header";
import type { Chat } from "@/types";
import { useState } from "react";

export default function Home() {
  const [searchChat, setSearchChat] = useState("");
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});

  const handleSearchChat = (search: string) => setSearchChat(search.replace("  ", " "));

  const [chatInfo, setChatInfo] = useState<Chat | null>(null);

  return (
    <div className="home-page">
      <HomeHeader onChangeSearch={handleSearchChat} search={searchChat} />
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

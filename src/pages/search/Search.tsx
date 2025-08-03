import { searchUser } from "@/lib/actions";
import "./styles.scss";
import { useNavigate, useSearch } from "@tanstack/react-router";
import ChatRoom from "@/components/chatRoom/ChatRoom";
import { useState } from "react";
import type { Chat } from "@/types";
import UserList from "./userList/UserList";

export default function Search() {
  const { q = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate();
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const [chat, setChat] = useState<Chat | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    navigate({
      to: "/search",
      search: { q: query.trim() },
      replace: true,
    });
  };
  const { values } = searchUser(q);
  return (
    <div className="search-page">
      <header className="search-header">
        <input
          value={q}
          type="text"
          name="search"
          className="primary-input"
          onChange={handleSearch}
          placeholder="Search..."
        />
      </header>
      <UserList setChat={setChat} users={values} />
      {chat && (
        <ChatRoom
          scrollPositions={scrollPositions}
          setScrollPositions={setScrollPositions}
          chatInfo={chat!}
          onClose={() => setChat(null)}
        />
      )}
    </div>
  );
}

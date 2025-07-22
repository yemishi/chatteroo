import { getChats } from "@/lib/actions";
import { getSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import type { Chat as ChatType } from "@/types";

export default function ChatList() {
  const { data } = getChats();

  useEffect(() => {
    if (!data) return;
    const socket = getSocket();
    const userChats = data?.map((c) => c.id);
    if (!socket || !userChats?.length) return;
    socket.emit("subscribe-all", userChats);
    socket.on("chat-updated", (data) => {
      console.log(data, "AAAAA");
    });
  }, [data]);
  const [chatInfo, setChatInfo] = useState<ChatType>();
  const sortedChats = (data ?? []).sort((a, b) => {
    const aTime = a.messages[0]?.timestamp ?? 0;
    const bTime = b.messages[0]?.timestamp ?? 0;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });
  return (
    <div>
      {sortedChats.map((c) => {
        const user = c.members[0];
        return (
          <div key={c.id}>
            <div className="flex items-center gap-2 bg-black rounded-2xl p-2" onClick={() => setChatInfo(c)}>
              <img className="size-12" src={user.picture} alt="user pfp" />
              <p>{user.username}</p>
            </div>
            {c.messages.length > 0 && <p>{c.messages[0].content}</p>}
          </div>
        );
      })}
      {chatInfo && <Chat chatInfo={chatInfo} />}
    </div>
  );
}

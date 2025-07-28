import { getChats } from "@/lib/actions";
import { getSocket } from "@/lib/socket";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Chat as ChatType } from "@/types";

export default function ChatList({ setChat }: { setChat: Dispatch<SetStateAction<ChatType | null>> }) {
  type Message = { chatId: string; content: string; senderId: string };
  const { data } = getChats();
  const [newMsgs, setNewMsgs] = useState<Message[]>([]);

  useEffect(() => {
    if (!data) return;

    const socket = getSocket();
    const userChats = data.map((c) => c.id);

    if (!socket || !userChats.length) return;

    socket.emit("subscribe-all", userChats);

    const handleUpdate = (data: Message) => {
      setNewMsgs((prev) => {
        const updated = [...prev.filter((m) => m.chatId !== data.chatId), { ...data }];
        return updated;
      });
    };

    socket.on("chat-updated", handleUpdate);

    return () => {
      socket.off("chat-updated", handleUpdate);
    };
  }, [data]);

  const sortedChats = (data ?? []).sort((a, b) => {
    const aTime = a.messages[0]?.timestamp ?? 0;
    const bTime = b.messages[0]?.timestamp ?? 0;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <div>
      {sortedChats.map((c) => {
        const user = c.members[0];
        const newMsg = newMsgs.find((msg) => msg.chatId === c.id);
        return (
          <div key={c.id} className="">
            <div className="flex items-center gap-2" onClick={() => setChat(c)}>
              <img src={user.picture} alt="user pfp" />
              <p>{user.username}</p>
            </div>
            {(c.messages.length > 0 || newMsg) && <p>{newMsg?.content || c.messages[0].content}</p>}
          </div>
        );
      })}
    </div>
  );
}

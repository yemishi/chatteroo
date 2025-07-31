import "./styles.scss";
import { getChats } from "@/lib/actions";
import { getSocket } from "@/lib/socket";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Chat as ChatType } from "@/types";
import { isSameDay, isYesterday } from "@/helpers";
import getOnlineUsers from "@/lib/getOnlineUsers";

type Props = {
  setChat: Dispatch<SetStateAction<ChatType | null>>;
  searchChat: string;
};
export default function ChatList({ setChat, searchChat }: Props) {
  type Message = { chatId: string; content: string; senderId: string; timestamp: Date };
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
  const onlineUsers = getOnlineUsers();
  const sortedChats = (data ?? [])
    .filter(
      (c) =>
        c.messages[0].content.toLowerCase().includes(searchChat.toLowerCase()) ||
        c.members[0].username.toLowerCase().includes(searchChat.toLowerCase())
    )
    .sort((a, b) => {
      const aTime = a.messages[0]?.timestamp ?? 0;
      const bTime = b.messages[0]?.timestamp ?? 0;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

  return (
    <div className="chat-list">
      {sortedChats.map((c) => {
        const user = c.members[0];
        const newMsg = newMsgs.find((msg) => msg.chatId === c.id);
        const isOnline = onlineUsers.some((i) => i === user.id);
        const messageTime = new Date(newMsg?.timestamp || c.messages[0].timestamp);
        return (
          <div key={c.id} className="chat-preview" onClick={() => setChat(c)}>
            <div className="chat-preview__icon">
              <img src={user.picture} alt={`${user.username} picture`} />
              <span className={`chat-preview__presence ${isOnline ? "online" : "offline"}`} />
            </div>

            <div className="chat-preview__info">
              <div className="chat-preview__header">
                <p className="chat-preview__username">{user.username}</p>
                {(c.messages.length > 0 || newMsg) && (
                  <p className="chat-preview__timestamp">
                    {isSameDay(messageTime, new Date())
                      ? messageTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false })
                      : isYesterday(messageTime, new Date())
                      ? "Yesterday"
                      : messageTime.toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="chat-preview__content">
                {(c.messages.length > 0 || newMsg) && (
                  <p className="chat-preview__message">{newMsg?.content || c.messages[0].content}</p>
                )}
                <div className="chat-preview__unread">{/* todo implement unread message flow */}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

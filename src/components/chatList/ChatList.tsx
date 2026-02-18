import "./styles.scss";
import { useEffect, useState } from "react";
import { getChats } from "@/lib/actions";
import { getSocket } from "@/lib/socket";
import type { Chat as ChatType } from "@/types";
import { isSameDay, isYesterday } from "@/helpers";
import { useAuth } from "@/hooks";
import getOnlineUsers from "@/lib/getOnlineUsers";
import TypingIndicator from "../typingIndicator/TypingIndicator";

type Props = {
  setChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
  searchChat: string;
};

export default function ChatList({ setChat, searchChat }: Props) {
  const currUser = useAuth().user!;
  const { data } = getChats();

  const [newMsgs, setNewMsgs] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({}); // roomId -> userIds

  useEffect(() => {
    if (!data) return;
    const socket = getSocket();
    if (!socket) return;

    const handleUpdate = (msg: any) => {
      setNewMsgs((prev) => [...prev.filter((m) => m.chatId !== msg.chatId), msg]);
    };

    const handleTyping = ({ roomId, userId }: { roomId: string; userId: string }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [roomId]: [...new Set([...(prev[roomId] || []), userId])],
      }));
    };

    const handleStopTyping = ({ roomId, userId }: { roomId: string; userId: string }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || []).filter((id) => id !== userId),
      }));
    };

    socket.on("chat-updated", handleUpdate);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    return () => {
      socket.off("chat-updated", handleUpdate);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };
  }, [data]);

  const onlineUsers = getOnlineUsers();

  const getDataLastMsg = (i: number) => (data && data[i] && data[i].messages.length ? data[i].messages[0] : null);

  const sortedChats = (data ?? [])
    .filter(
      (c, i) =>
        (getDataLastMsg(i)?.content.text?.toLowerCase().includes(searchChat.toLowerCase()) ?? false) ||
        c.highlight.username.toLowerCase().includes(searchChat.toLowerCase())
    )
    .sort((a, b) => {
      const aTime = a.messages[0]?.timestamp ?? 0;
      const bTime = b.messages[0]?.timestamp ?? 0;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

  const isRead = (date?: Date, uLastTimeRead?: Date) => new Date(uLastTimeRead || 0) > new Date(date || 0);

  return (
    <div className="chat-list">
      {sortedChats.map((c, i) => {
        const user = c.highlight;
        const lastTimeRead = c.members.find((m) => m.id === currUser.id)?.lastMessageReadAt;
        const newMsg = newMsgs.find((msg) => msg.chatId === c.id);
        const isOnline = onlineUsers.includes(user?.id ?? "");
        const messageTime = new Date(newMsg?.timestamp || getDataLastMsg(i)?.timestamp!);
        const latestMessage = c.messages.length > 0 || newMsg ? newMsg || c.messages[0] : null;

        const isTyping = typingUsers[c.id]?.length > 0;

        return (
          <div
            key={c.id}
            className={`chat-preview ${
              isRead(latestMessage?.timestamp, lastTimeRead) || latestMessage?.senderId === currUser.id
                ? ""
                : "chat-preview--unread"
            }`}
            onClick={() => setChat(c)}
          >
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
                {isTyping ? (
                  <TypingIndicator isTyping={true} withDesc />
                ) : (
                  <p className="chat-preview__message">{latestMessage?.content.text}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

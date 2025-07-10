import React, { useMemo, useState } from "react";
import useChat, { type Message } from "../hooks/useChat";

interface ChatRoomProps {
  userId: string;
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ userId, roomId }) => {
  const [newMessage, setNewMessage] = useState("");
  const userChats = useMemo(() => [roomId], [roomId]);
  const { sendMessage, messages } = useChat(userChats);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      room: roomId,
      sender: userId,
      content: newMessage,
      timestamp: new Date(),
    };

    sendMessage(message);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-zinc-900 text-white rounded-xl shadow-md p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md ${msg.sender === userId ? "bg-blue-600 self-end" : "bg-zinc-700 self-start"}`}
          >
            <div className="text-sm font-semibold">{msg.sender}</div>
            <div>{msg.content}</div>
            <div className="text-xs text-zinc-400">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

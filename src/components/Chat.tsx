import { useAuth } from "@/context/AuthContext";
import useChat from "@/hooks/useChat";
import { getMessages } from "@/lib/actions";
import type { Chat } from "@/types";
import { useState, useEffect, useRef } from "react";

export default function Chat({ chatInfo }: { chatInfo: Chat }) {
  const { values } = getMessages(chatInfo.id);
  const { user } = useAuth();
  const { messages, sendMessage } = useChat(chatInfo.id, []);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage(
      { content: message, room: chatInfo.id, senderId: user?.id! },
      chatInfo.members.map((m) => m.id)
    );
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto border border-zinc-700 rounded-md shadow-sm overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 dark:bg-zinc-800">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm ${
                  isMe ? "bg-blue-600 text-white" : "bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

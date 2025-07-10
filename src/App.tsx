import "./index.css";
import ChatRoom from "./components/ChatRoom";
import { useState } from "react";
import { connectSocket } from "./lib/socket";

function App() {
  const [userId, setUserId] = useState("");
  const [room, setRoom] = useState("");
  const [isChat, setIsChat] = useState(false);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="bg-black  text-white p-4 flex flex-col gap-3">
        {isChat ? (
          <>
            <ChatRoom userId={userId} roomId={room} />
          </>
        ) : (
          <>
            <input
              placeholder="userId"
              onChange={(e) => setUserId(e.target.value)}
              value={userId}
              className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
            />
            <input
              placeholder="room"
              onChange={(e) => setRoom(e.target.value)}
              value={room}
              className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
            />
            <button
              onClick={() => {
                {
                  connectSocket(userId);
                  setIsChat(true);
                }
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-white"
            >
              Get on!!
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

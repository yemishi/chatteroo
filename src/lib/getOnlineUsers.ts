import { useEffect, useState } from "react";
import { waitForSocketConnection } from "./socket";

const getOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const setup = async () => {
      try {
        const socket = await waitForSocketConnection();
        const handleUpdate = (onlineUserIds: string[]) => {
          setOnlineUsers(onlineUserIds);
        };

        socket.on("online-users", handleUpdate);
        socket.emit("getOnlineUsers");

        return () => {
          socket.off("online-users", handleUpdate);
        };
      } catch (err) {
        console.error("Failed to connect socket:", err);
      }
    };

    const cleanupPromise = setup();

    return () => {
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
    };
  }, []);

  return onlineUsers;
};

export default getOnlineUsers;

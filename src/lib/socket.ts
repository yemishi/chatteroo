import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      query: { userId },
    });
  }
  return socket;
};

export const waitForSocketConnection = async (timeout = 3000): Promise<Socket> => {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const s = getSocket();
      if (s && s.connected) {
        resolve(s);
      } else if (Date.now() - start > timeout) {
        reject(new Error("Socket connection timed out"));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};
export const getSocket = () => socket;

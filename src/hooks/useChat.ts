import { useEffect } from "react";
import socket from "../../socket";

export interface Message {
    room: string;
    sender: string;
    content: string;
    timestamp: Date;
}

const useChat = (
    userChats: string[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
    useEffect(() => {
        if (!userChats.length) return;

        console.log("Subscribing to rooms:", userChats);
        userChats.forEach((room) => socket.emit("subscribe", room));

        socket.on("message", (data: Message) => {
            console.log("Received message:", data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on("connect", () => {
            console.log("Reconnected! Resubscribing to rooms...");
            userChats.forEach((room) => socket.emit("subscribe", room));
        });

        return () => {
            userChats.forEach((room) => socket.emit("unsubscribe", room));
            socket.off("message");
            socket.off("connect");
        };
    }, [userChats, setMessages]);

    const sendMessage = (message: Message) => {
        socket.emit("send", { message });
    };

    return { sendMessage };
};

export default useChat;

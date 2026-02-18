import "./styles.scss";
import SendIcon from "@/assets/icons/send.svg?react";
import { InputFile } from "@/components/common/input";
import { useCallback, useRef, useState } from "react";
import PreviewImg from "./previewImg/previewImg";
import { uploadImg as uploadImgFn } from "@/lib/actions/uploadImgActions/uploadImg";
import { getSocket } from "@/lib/socket";

type Props = {
  sendMessage: (message: { text?: string; imgs: string[] }) => void;
  userId: string;
  membersId: string[];
  chatId: string;
};
export default function ChatInput({ sendMessage, userId, chatId, membersId }: Props) {

  const [message, setMessage] = useState("");
  const [imgs, setImgs] = useState<{ preview: string; file: File }[]>([]);

  const removeImg = (i: number) => setImgs(imgs.filter((_, idx) => idx !== i));
  const addImg = (newImg: { preview: string; file: File }) => setImgs([...imgs, newImg]);
  const uploadImg = uploadImgFn();
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const handleOnSend = async () => {
    if (!message.trim() && !imgs.length) return;
    const uploadedImgs = await Promise.allSettled(
      imgs.map(({ file }) => uploadImg.mutateAsync({ file }).then((res) => res.imageUrl))
    );
    const validImgs = uploadedImgs
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<string>).value);

    sendMessage({ text: message, imgs: validImgs });
    setMessage("");
    setImgs([]);
  };
  const onTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    const start = () => {
      socket.emit("typing", { roomId: chatId, userId, usersId: membersId });
    };

    const stop = () => {
      socket.emit("stop-typing", { roomId: chatId, userId, usersId: membersId });
    };

    return {
      stop,
      start,
    };
  }, [chatId, userId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping()?.start();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTyping()?.stop(), 2000);
  };

  return (
    <div className="chat-input">
      <PreviewImg imgs={imgs.map((i) => i.preview)} removeImg={removeImg} />
      <div className="chat-input__content">
        <button className="btn btn--img-input">
          <InputFile onChange={addImg} />
        </button>
        <input
          type="text"
          name="message"
          className="primary-input"
          value={message}
          onChange={onChange}
          onBlur={() => {
            onTyping()?.stop();
          }}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleOnSend();
          }}
        />
        <button className="btn" onClick={handleOnSend}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

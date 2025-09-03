import "./styles.scss";
import SendIcon from "@/assets/icons/send.svg?react";
import { InputFile } from "@/components/common/input";
import { useState } from "react";
import PreviewImg from "./previewImg/previewImg";
import { uploadImg as uploadImgFn } from "@/lib/actions/uploadImgActions/uploadImg";
type Props = {
  sendMessage: (message: { text?: string; imgs: string[] }) => void;
};
export default function ChatInput({ sendMessage }: Props) {
  const [message, setMessage] = useState("");
  const [imgs, setImgs] = useState<{ preview: string; file: File }[]>([]);
  const removeImg = (i: number) => setImgs(imgs.filter((_, idx) => idx !== i));
  const addImg = (newImg: { preview: string; file: File }) => setImgs([...imgs, newImg]);
  const uploadImg = uploadImgFn();
  const handleSendImg = async () => {
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
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            ``;
            if (e.key === "Enter") handleSendImg();
          }}
        />
        <button className="btn" onClick={handleSendImg}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

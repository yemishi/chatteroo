import "./styles.scss";
import PreviewImg from "../../chatInput/previewImg/previewImg";
import { useRef, useState } from "react";
import { Textarea } from "@/components/common/input";
import { editMessage as editMessageFn } from "@/lib/actions";
import { useOverlay } from "@/hooks";
import type { MessageEdited } from "@/hooks/useChat";

type Props = {
  message: { id: string; content: { text?: string; imgs: string[] } };
  onClose: () => void;
  chatId: string;
  onEditMessage: (message: MessageEdited) => void;
};
export default function MessageEdit({ message: { content, id }, onClose, onEditMessage }: Props) {
  const [text, setText] = useState(content.text);
  const [removedImgs, setRemovedImgs] = useState<string[]>([]);
  const editMessage = editMessageFn();
  const ref = useRef<HTMLDivElement | null>(null);
  useOverlay({ isOpen: true, onClose, refs: [ref] });

  const onEditMsg = async () => {
    const newContent = { text: text?.trim(), imgs: content.imgs.filter((i) => !removedImgs.includes(i)) };
    try {
      const updatedMessage = await editMessage.mutateAsync({ content: newContent, msgId: id, removedImgs });
      onEditMessage(updatedMessage.updatedMessage);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div ref={ref} className="message-edit">
      <div className="message-edit__content">
        {content.imgs && (
          <PreviewImg
            imgs={content.imgs.filter((i) => !removedImgs.includes(i))}
            removeImg={(_, url) => setRemovedImgs([...removedImgs, url!])}
          />
        )}
        <Textarea value={text} onChange={(e) => setText(e.target.value)} label="" />
      </div>

      <div className="message-edit__actions">
        <button onClick={onClose}>cancel</button>
        <button onClick={onEditMsg}>save</button>
      </div>
    </div>
  );
}

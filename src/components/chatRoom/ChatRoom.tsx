import "./styles.scss";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import type { Chat } from "@/types";

import Modal from "../modal/Modal";
import Messages from "./messages/Messages";
import ChatHeader from "./chatHeader/ChatHeader";
import { useAuth, useChatRoom } from "@/hooks";
import ConfirmModal from "../confirmModal/ConfirmModal";
import { quitChat } from "@/lib/actions";
import ChatInput from "./chatInput/ChatInput";
import GalleryZoom from "./galleryZoom/GalleryZoom";
import ArrowLeft from "@/assets/icons/arrow.svg?react";
type Props = {
  chatInfo: Chat;
  onClose: () => void;
  scrollPositions: Record<string, number>;
  setScrollPositions: Dispatch<SetStateAction<Record<string, number>>>;
};

export default function ChatRoom({ chatInfo, onClose, scrollPositions, setScrollPositions }: Props) {
  const { user } = useAuth();
  if (!user) return;

  const {
    containerRef,
    handleSend,
    scrollToBottom,
    showScrollButton,
    values,
    isFetchingNextPage,
    currMember,
    hasUnreadMessage,
  } = useChatRoom({
    chatInfo,
    scrollPositions,
    setScrollPositions,
    user,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isQuitChat, setIsQuitChat] = useState(false);
  const [zoomImgs, setZoomImgs] = useState<string[]>([]);
  const { mutateAsync, status } = quitChat();
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (containerRef.current)
      setScrollPositions({ ...scrollPositions, [chatInfo.id]: containerRef.current?.scrollTop! });
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const onQuitChat = async () => {
    try {
      await mutateAsync(chatInfo.id);
      setIsQuitChat(false);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal onClose={handleClose} isOpen={isOpen} className="chat-modal">
        <div ref={containerRef} className="chat-room">
          <button
            onClick={scrollToBottom}
            className={`scroll-btn ${hasUnreadMessage ? "badged" : ""} ${showScrollButton ? "show" : "hide"}`}
          >
            <ArrowLeft className="scroll-btn__icon" />
          </button>
          <ChatHeader
            toggleQuitChat={() => setIsQuitChat(!isQuitChat)}
            onClose={handleClose}
            userHighlight={chatInfo.highlight}
          />

          {isFetchingNextPage && <div>Loading older messages</div>}
          <Messages
            messages={values}
            zoomImgs={(imgs: string[]) => setZoomImgs(imgs)}
            members={chatInfo.members}
            currMember={currMember!}
            highLight={chatInfo.highlight}
          />

          <div className="chat-room__footer">
            <ChatInput sendMessage={handleSend} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        warnMsg="Leaving this chat will also remove the participants from your friends list."
        isLoading={status === "pending"}
        onConfirm={onQuitChat}
        isOpen={isQuitChat}
        onClose={() => setIsQuitChat(false)}
      />
      {zoomImgs.length > 0 && <GalleryZoom onClose={() => setZoomImgs([])} imgs={zoomImgs} />}
    </>
  );
}

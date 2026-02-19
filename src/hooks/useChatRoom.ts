import { getMessages, markChatAsRead } from "@/lib/actions";
import type { Chat, Message, User } from "@/types";
import useChat from "./useChat";
import { nanoid } from "nanoid";
import { useEffect, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

type Props = {
  user: User;
  chatInfo: Chat;
  scrollPositions: Record<string, number>;
  setScrollPositions: Dispatch<SetStateAction<Record<string, number>>>;
};

export default function useChatRoom({ user, chatInfo, scrollPositions, setScrollPositions }: Props) {
  const { values = [], hasNextPage, fetchNextPage, isFetchingNextPage } = getMessages(chatInfo.id);
  const [msgs, setMsgs] = useState<Message[]>([]);

  useEffect(() => {
    setMsgs((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newValues = values.filter((m) => !existingIds.has(m.id));
      return [...prev, ...newValues].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
  }, [values]);

  const { sendMessage, typingUsers, onEditMessage } = useChat(
    user.id,
    chatInfo.id,
    chatInfo.members.map((m) => m.id),
    setMsgs,
  );
  const { mutateAsync: markChatAsReadMutate, data: lastTimeReadData } = markChatAsRead();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollCorrectionRef = useRef<{
    prevHeight: number;
    prevScrollTop: number;
  } | null>(null);

  const currMember = chatInfo.members.find((m) => m.id === user.id)!;
  const lastOtherUserMsg = [...msgs].reverse().find((msg) => msg.senderId !== user.id);
  const lastMessageReadAt = lastTimeReadData?.lastMessageReadAt
    ? new Date(lastTimeReadData?.lastMessageReadAt)
    : new Date(currMember?.lastMessageReadAt || 0);

  const hasUnreadMessage = lastOtherUserMsg && lastMessageReadAt < new Date(lastOtherUserMsg.timestamp);

  const updateReadTime = async () => {
    try {
      const result = await markChatAsReadMutate(chatInfo.id);
      currMember.lastMessageReadAt = new Date(result.lastMessageReadAt);
    } catch (error) {
      console.error(error);
    }
  };

  // todo fix the scroll when finish loading

  const loadOlderMessages = async () => {
    if (!containerRef.current || isFetchingNextPage) return;

    const container = containerRef.current;

    scrollCorrectionRef.current = {
      prevHeight: container.scrollHeight,
      prevScrollTop: container.scrollTop,
    };

    await fetchNextPage();
  };

  const handleSend = async (message: { text?: string; imgs: string[] }) => {
    const tempId = nanoid();
    sendMessage({
      content: message,
      room: chatInfo.id,
      senderId: user.id!,
      senderPicture: user.picture!,
      senderName: user.username!,
      id: tempId,
    });

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };
  const scrollToBottom = () =>
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });

  // maintain scroll positions when older messages load
  useLayoutEffect(() => {
    const container = containerRef.current;
    const correction = scrollCorrectionRef.current;

    if (!container || !correction) return;

    const newHeight = container.scrollHeight;
    const scrollDiff = newHeight - correction.prevHeight;

    container.scrollTop = correction.prevScrollTop + scrollDiff;

    scrollCorrectionRef.current = null;
  }, [msgs]);

  // restore saved scroll or default to bottom
  useEffect(() => {
    const container = containerRef.current;
    console.log(container?.scrollHeight);
    if (!container) return;

    if (scrollCorrectionRef.current) return;

    const saved = scrollPositions[chatInfo.id];
    setTimeout(() => {}, 200);
    requestAnimationFrame(() => {
      if (typeof saved === "number") {
        setTimeout(() => {
          container.scrollTo({ top: saved, behavior: "auto" });
        }, 200);
      } else {
        setTimeout(() => {
          container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
        }, 200);
      }
    });
  }, [chatInfo.id]);

  // scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isAtBottom && hasUnreadMessage) {
      updateReadTime();
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      const isNearTop = scrollTop < 100;

      setShowScrollButton(!isAtBottom);
      setScrollPositions((prev) => ({
        ...prev,
        [chatInfo.id]: scrollTop,
      }));

      if (hasNextPage && isNearTop) loadOlderMessages();
      if (isAtBottom && hasUnreadMessage) updateReadTime();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, hasUnreadMessage, chatInfo.id, setScrollPositions]);

  return {
    containerRef,
    values: msgs,
    handleSend,
    scrollToBottom,
    isFetchingNextPage,
    showScrollButton,
    currMember,
    hasUnreadMessage,
    onEditMessage,
    typingUsers,
  };
}

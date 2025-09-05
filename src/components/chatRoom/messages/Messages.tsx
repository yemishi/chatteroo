import "./styles.scss";
import { formatTime, isDiffDay, isSameDay, isYesterday } from "@/helpers";
import type { Message } from "@/hooks/useChat";
import type { Message as MessageData, ChatMember } from "@/types";
import { Fragment } from "react/jsx-runtime";
import MessageImgs from "./messageImgs/MessageImgs";
import { useState } from "react";
import MessageEdit from "./messageEdit/MessageEdit";
import MessageOptions from "./messageOptions/MessageOptions";

type Props = {
  messages: (Message | MessageData)[];
  currMember: ChatMember;
  members: ChatMember[];
  zoomImgs: (imgs: string[]) => void;
  highLight: ChatMember;
  chatId: string;
};

export default function Messages({ messages, currMember, members, zoomImgs, highLight, chatId }: Props) {
  const isRead = (date: Date) => new Date(currMember?.lastMessageReadAt ?? 0) > new Date(date);
  const [editMsg, setEditMsg] = useState<{ content: { text?: string; imgs: string[] }; id: string } | null>(null);
  const [msgOptions, setMsgOptions] = useState<{ msgId: string; onEdit: () => void; imgs: string[] } | null>(null);

  return (
    <div className="message-list">
      {messages.map((msg, i) => {
        const user = members.find((u) => u.id === msg.senderId) ?? highLight;
        const isMe = msg.senderId === currMember?.id;
        const nextMessage = messages[i + 1];
        const isSameUser = nextMessage?.senderId === msg.senderId;
        const nextTime = nextMessage ? new Date(nextMessage?.timestamp) : null;
        const prevTime = messages[i - 1] ? new Date(messages[i - 1].timestamp) : null;
        const thisTime = new Date(msg.timestamp);
        const content = msg.content;
        const imgs = content.imgs;
        const isNewDay = !prevTime || isDiffDay(prevTime, thisTime);

        const isCloseInTime = nextTime && Math.abs(new Date(msg.timestamp).getTime() - nextTime.getTime()) < 60 * 1000;

        return (
          <Fragment key={`${msg.timestamp}_${i}`}>
            {isNewDay && (
              <div className="day-divider">
                {isSameDay(thisTime, new Date())
                  ? "Today"
                  : isYesterday(thisTime, new Date())
                  ? "Yesterday"
                  : thisTime.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </div>
            )}

            {editMsg?.id === msg.id ? (
              <MessageEdit
                chatId={chatId}
                message={{ content: content, id: msg.id }}
                onClose={() => setEditMsg(null)}
              />
            ) : (
              <div
                onContextMenu={(e) => {
                  if (msg.senderId !== currMember.id) return;
                  e.preventDefault();
                  setMsgOptions({ msgId: msg.id, onEdit: () => setEditMsg(msg), imgs });
                }}
                className={`message-item ${msgOptions?.msgId === msg.id ? "popover-container" : ""} ${
                  isMe ? "sent" : "received"
                }`}
              >
                {!isMe && (
                  <img
                    src={user.picture}
                    alt={`${user.username} picture`}
                    className={`${!nextMessage || !isSameUser ? "show" : ""} message-user-pic`}
                  />
                )}
                <div className="message-info">
                  <div
                    className={`message-content ${
                      !isRead(msg.timestamp) && msg.senderId !== user.id ? "message-content--unread" : ""
                    } ${isMe ? "sent" : "received"}`}
                  >
                    <MessageImgs hasText={!!content.text} imgs={imgs} zoomImgs={zoomImgs} />
                    {content.text && (
                      <p
                        className={`message-content__text ${imgs.length > 0 ? "message-content__text--with-img" : ""}`}
                      >
                        {content.text}
                      </p>
                    )}
                  </div>

                  <span className={`message-time ${isCloseInTime && isSameUser ? "hide" : ""}`}>
                    {formatTime(msg.timestamp.toString())}
                  </span>
                </div>
                {msgOptions && msgOptions.msgId === msg.id && (
                  <MessageOptions {...msgOptions} chatId={chatId} onClose={() => setMsgOptions(null)} />
                )}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

import "./styles.scss";
import { formatTime, isDiffDay, isSameDay, isYesterday } from "@/helpers";
import type { Message } from "@/hooks/useChat";
import type { Message as MessageData, ChatMember } from "@/types";
import { Fragment } from "react/jsx-runtime";

type Props = {
  messages: (Message | MessageData)[];
  currMember: ChatMember;
  members: ChatMember[];
  highLight: ChatMember;
};

export default function Messages({ messages, currMember, members, highLight }: Props) {
  const isRead = (date: Date) => new Date(currMember?.lastMessageReadAt ?? 0) > new Date(date);

  return (
    <div className="messages">
      {messages.map((msg, i) => {
        const user = members.find((u) => u.id === msg.senderId) ?? highLight;
        const isMe = msg.senderId === currMember?.id;
        const nextMessage = messages[i + 1];
        const isSameUser = nextMessage?.senderId === msg.senderId;
        const nextTime = nextMessage ? new Date(nextMessage?.timestamp) : null;
        const prevTime = messages[i - 1] ? new Date(messages[i - 1].timestamp) : null;
        const thisTime = new Date(msg.timestamp);

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
            <div className={`message-container ${isMe ? "sent" : "received"}`}>
              {!isMe && (
                <img
                  src={user.picture}
                  alt={`${user.username} picture`}
                  className={`${!nextMessage || !isSameUser ? "show" : ""} message-user-pic`}
                />
              )}
              <div
                className={`message-content ${
                  !isRead(msg.timestamp) && msg.senderId !== user.id ? "message-content--unread" : ""
                }`}
              >
                <p>{msg.content}</p>
                <span className={`message-time ${isCloseInTime && isSameUser ? "hide" : ""}`}>
                  {formatTime(msg.timestamp.toString())}
                </span>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

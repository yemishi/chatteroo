import "./styles.scss";
import { formatTime, isDiffDay, isSameDay, isYesterday } from "@/helpers";
import type { Message } from "@/hooks/useChat";
import type { Message as MessageData, ChatMember } from "@/types";
import { Fragment } from "react/jsx-runtime";

type Props = {
  messages: (Message | MessageData)[];
  currMember: ChatMember;
  members: ChatMember[];
  zoomImgs: (imgs: string[]) => void;
  highLight: ChatMember;
};

export default function Messages({ messages, currMember, members, zoomImgs, highLight }: Props) {
  const isRead = (date: Date) => new Date(currMember?.lastMessageReadAt ?? 0) > new Date(date);

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
            <div className={`message-item `}>
              {!isMe && (
                <img
                  src={user.picture}
                  alt={`${user.username} picture`}
                  className={`${!nextMessage || !isSameUser ? "show" : ""} message-user-pic`}
                />
              )}
              <div className={`message-info ${isMe ? "sent" : "received"}`}>
                <div
                  className={`message-content ${
                    !isRead(msg.timestamp) && msg.senderId !== user.id ? "message-content--unread" : ""
                  } ${isMe ? "sent" : "received"}`}
                >
                  {imgs.length > 0 &&
                    (imgs.length === 1 ? (
                      <div
                        onClick={() => zoomImgs(imgs)}
                        className={`message-content__img message-content__img--single  ${
                          content.text ? "message-content__img--with-text" : ""
                        }`}
                      >
                        <img src={imgs[0]} alt="sent image" />
                      </div>
                    ) : (
                      <div
                        onClick={() => zoomImgs(imgs)}
                        className={`message-content__img ${
                          imgs.length === 1 ? "message-content__img--single" : "message-content__img--multi"
                        } ${content.text ? "message-content__img--with-text" : ""} ${imgs.length > 2 ? "rows-2" : ""} ${
                          imgs.length === 3 ? "rows-2--fill-last" : ""
                        }`}
                      >
                        {imgs.slice(0, 4).map((url, i) => {
                          if (i === 3 && imgs.length - 4 > 0) {
                            return (
                              <div key={i} className="image-overlay">
                                <img src={url} alt={`sent image ${i + 1}`} />
                                <div className="overlay-text">+{imgs.length - 4}</div>
                              </div>
                            );
                          }
                          return <img key={i} src={url} alt={`sent image ${i + 1}`} />;
                        })}
                      </div>
                    ))}
                  {content.text && (
                    <p className={`message-content__text ${imgs.length > 0 ? "message-content__text--with-img" : ""}`}>
                      {content.text}
                    </p>
                  )}
                </div>

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

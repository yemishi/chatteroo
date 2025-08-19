import "./styles.scss";
import { getTimeDiff } from "@/helpers";
import RemoveIcon from "@/assets/icons/close.svg?react";
import {
  acceptFriendRequest,
  deleteNotification,
  getNotifications,
  markAsReadNotification,
  rejectFriendRequest,
} from "@/lib/actions";
import React, { useEffect, useRef, useState } from "react";
import { Header } from "@/components";

const NotificationPage: React.FC = () => {
  const { values: notifications, isLoading, ref, isFetchingNextPage, hasNextPage } = getNotifications();
  const [accepted, setAccepted] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const { mutate: acceptRequest } = acceptFriendRequest();
  const { mutate: rejectRequest } = rejectFriendRequest();
  const { mutate: deleteNotificationMutate } = deleteNotification();
  const { mutate: markAsRead } = markAsReadNotification();

  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            const isUnread = entry.target.classList.contains("notification-item--unread");

            if (id && isUnread) {
              markAsRead(id);
              entry.target.classList.remove("notification-item--unread");
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(itemRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [notifications, markAsRead]);

  if (isLoading) return <p>Loading notifications...</p>;
  if (!notifications) return <p>No notifications found.</p>;

  return (
    <div className="notification-page">
      <Header title="Notifications" />
      <ul className="notification-list">
        {notifications.map((n) => {
          const isResolved =
            n.requestStatus || (accepted.includes(n.id) && "ACCEPTED") || (rejected.includes(n.id) && "REJECTED");
          return (
            <li
              ref={(el) => {
                itemRefs.current[n.id] = el;
              }}
              data-id={n.id}
              className={`notification-item ${!n.read ? "notification-item--unread" : ""}`}
              key={n.id}
            >
              <button className="notification-item__remove" onClick={() => deleteNotificationMutate(n.id)}>
                <RemoveIcon className="notification-item__remove--icon" />
              </button>
              {n.icon && <img className="notification-item__icon" src={n.icon} alt={`${n.title} Icon`} />}

              <div className="notification-card">
                <div
                  className={`notification-card__content ${
                    n.type === "SYSTEM" ? "notification-card__content--system" : ""
                  }`}
                >
                  <strong className="notification-card__title">{n.title}</strong>
                  <div className="notification-card__details">
                    <p>{n.content}</p>
                    {n.type !== "FRIEND_REQUEST" && (
                      <small className="notification-time">{getTimeDiff(new Date(n.createAt))}</small>
                    )}
                  </div>
                </div>

                {n.type === "FRIEND_REQUEST" && (
                  <div className="request-actions">
                    {isResolved ? (
                      <p className="request-resolved">{isResolved}</p>
                    ) : (
                      <>
                        <button
                          className="request-actions__button request-actions__button--accept"
                          onClick={() => {
                            acceptRequest(n.requestId!);
                            setAccepted([...accepted, n.id]);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="request-actions__button request-actions__button--reject"
                          onClick={() => {
                            rejectRequest(n.requestId!);
                            setRejected([...rejected, n.id]);
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <small className="notification-time">{getTimeDiff(new Date(n.createAt))}</small>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {isFetchingNextPage ? <p>Loading more...</p> : hasNextPage && <div ref={ref} />}
    </div>
  );
};

export default NotificationPage;

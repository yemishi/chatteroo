import "./styles.scss";
import SendIcon from "@/assets/icons/send.svg?react";
import type { SearchUser } from "@/types/searchType";
import { acceptFriendReq, sendFriendReq } from "@/lib/actions";
import { useRef, type Dispatch, type SetStateAction } from "react";
import type { Chat } from "@/types";
import { getSession } from "@/helpers";

type Props = {
  users: SearchUser[];
  setChat: Dispatch<SetStateAction<Chat | null>>;
};

export default function UserList({ users, setChat }: Props) {
  const currentUser = getSession();
  const { mutate: sendRequest, isError: isSendRequestError } = sendFriendReq();
  const { mutate: acceptRequest, isError: isAcceptRequestError } = acceptFriendReq();
  const sendReqStore = useRef(new Set());
  const acceptReqStore = useRef(new Set());
  return (
    <div className="user-list">
      {users.map((user) => {
        const hasSentRequest = user.receivedRequests.some((req) => req.fromId === currentUser?.id);
        const hasReceivedRequest = user.sentRequests.find((req) => req.toId === currentUser?.id);

        const isReqPending = hasSentRequest || (sendReqStore.current.has(user.id) && !isSendRequestError);

        const isAcceptRequest = hasReceivedRequest && !acceptReqStore.current.has(user.id) && !isAcceptRequestError;

        const showSendButton =
          !user.chat && !sendReqStore.current.has(user.id) && !hasSentRequest && !hasReceivedRequest;

        return (
          <div key={user.id} className="user-list__item">
            <img className="user-list__avatar" src={user.picture} alt={`${user.username}'s avatar`} />
            <p className="user-list__username">{user.username}</p>

            {isReqPending && (
              <button className="user-list__button user-list__button--disabled" disabled>
                Request Sent
              </button>
            )}

            {isAcceptRequest && (
              <button
                className="user-list__button user-list__button--accept"
                onClick={() => {
                  acceptRequest(hasReceivedRequest?.id!);
                  acceptReqStore.current.add(user.id);
                }}
              >
                Accept
              </button>
            )}

            {showSendButton && (
              <button
                className="user-list__button user-list__button--send"
                onClick={() => {
                  sendRequest(user.id);
                  sendReqStore.current.add(user.id);
                }}
              >
                Add Friend
              </button>
            )}
            {user.chat && (
              <button className="user-list__chat-button" onClick={() => setChat(user.chat!)}>
                <SendIcon />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

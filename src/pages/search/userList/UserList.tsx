import "./styles.scss";
import type { SearchUser } from "@/types/searchType";
import sendIcon from "@/assets/icons/send.svg";
import { useAuth } from "@/context/AuthContext";
import { sendFriendReq } from "@/lib/actions";
import type { Dispatch, SetStateAction } from "react";
import type { Chat } from "@/types";

type Props = {
  users: SearchUser[];
  setChat: Dispatch<SetStateAction<Chat | null>>;
};
export default function UserList({ users, setChat }: Props) {
  const { user, error } = useAuth();
  const { mutate, data } = sendFriendReq();

  return (
    <div className="user-list">
      {users.map((u) => {
        const isPending = u.receivedRequests.some((r) => r.fromId === user?.id);
        const acceptPending = u.sentRequests.some((r) => r.toId === user?.id);
        return (
          <div key={u.id} className="user-list__item">
            <img className="user-list__avatar" src={u.picture} alt={`${u.username} picture`} />
            <p className="user-list__username">{u.username}</p>

            {(isPending || (data && !error)) && (
              <span className="user-list__status user-list__status--pending">Pending</span>
            )}

            {(acceptPending || (data && !error)) && (
              <span className="user-list__status user-list__status--pending">Accept??</span>
            )}
            {!u.chat && !data && isPending && acceptPending && <span onClick={() => mutate(u.id)}>Send</span>}
            {u?.chat && (
              <button className="user-list__chat-button" onClick={() => setChat(u.chat!)}>
                <img className="user-list__chat-icon icon" src={sendIcon} alt="send message icon" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

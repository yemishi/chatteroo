import { useState } from "react";
import "./styles.scss";
import { acceptFriendRequest, rejectFriendRequest, getReceivedFriendRequests } from "@/lib/actions";
export default function Requests() {
  const { values, hasNextPage, ref, isFetchingNextPage } = getReceivedFriendRequests();

  const { mutate: acceptRequest, isError: isAcceptRequestError } = acceptFriendRequest();
  const { mutate: rejectRequest, isError: isRejectRequestError } = rejectFriendRequest();
  const [resolved, setResolved] = useState<string[]>([]);

  return (
    <div className="request-list">
      <h1>Friend Requests</h1>
      {values.map((data, index) => {
        const user = data.from;

        const isPending = !resolved.find((i) => i === data.id) && !isAcceptRequestError && !isRejectRequestError;

        return (
          <div
            key={data.id}
            style={{
              animationDuration: `${(index + 1) * 100}ms`,
            }}
            className={`request ${!isPending ? "request--resolved" : ""}`}
          >
            <img className="request__avatar" src={user.picture} alt={`${user.username}'s avatar`} />
            <p className="request__username">{user.username}</p>

            <div className="request__actions">
              <button
                className="request__button request__button--accept"
                onClick={() => {
                  acceptRequest(data.id);
                  setResolved([...resolved, data.id]);
                }}
              >
                Accept
              </button>

              <button
                className="request__button request__button--reject"
                onClick={() => {
                  rejectRequest(data.id);
                  setResolved([...resolved, data.id]);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}

      {hasNextPage && !isFetchingNextPage && <div ref={ref}></div>}
    </div>
  );
}

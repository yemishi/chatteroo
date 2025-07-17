import "./index.css";

import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { authActions, acceptFriendReq, receivesReq, searchUser, sendFriendReq } from "@/lib/actions";

export default function App() {
  const { user, isLoading, error } = useAuth();
  const { guestRegister, guestLogin, signout } = authActions();
  const { mutate: acceptRequest } = acceptFriendReq();
  const { mutate: sendRequest } = sendFriendReq();

  const [searchQuery, setSearchQuery] = useState("");
  const [guestId, setGuestId] = useState("");

  const { values: searchResults } = searchUser(searchQuery);
  const { values: friendRequests } = receivesReq();

  const handleSendRequest = (userId: string) => {
    sendRequest(userId, {
      onSuccess: () => console.log(`Friend request sent to user ${userId}`),
      onError: (error: any) => console.error(`Failed to send request:`, error),
    });
  };

  const handleGuestLogin = () => {
    guestLogin.mutate({ guestId });
  };

  const handleGuestRegister = () => {
    guestRegister.mutate();
  };

  const handleSignOut = () => {
    signout.mutate();
  };

  if (isLoading) return <div>Loading...</div>;

  if (!user || error) {
    return (
      <div className="p-4 space-y-3">
        <button onClick={handleGuestRegister}>Register as Guest</button>
        <input type="text" value={guestId} placeholder="Enter guest ID" onChange={(e) => setGuestId(e.target.value)} />
        <button onClick={handleGuestLogin}>Login as Guest</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="text-lg font-bold mb-4">Welcome, {user.username}!</p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchQuery}
          placeholder="Search users..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-1"
        />
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <div className="flex flex-col w-80 gap-3 mt-10">
        {searchResults.map((userData: any) => {
          const isFriend = userData.friends.includes(user.id);
          const alreadySent = userData.receivedRequests.some((req: any) => req.fromId === user.id);
          const alreadyReceive = userData.sentRequests.some((req: any) => req.toId === user.id);
          return (
            <div key={userData.id} className="flex justify-between items-center border p-2 rounded">
              <span>{userData.username}</span>
              {isFriend ? (
                <span>Friend!</span>
              ) : alreadySent || alreadyReceive ? (
                <span>Pending...</span>
              ) : (
                <button
                  onClick={() => handleSendRequest(userData.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Add Friend
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="font-semibold">Your Friend Requests:</h2>
        <ul className="list-disc pl-6">
          {friendRequests.map((req: any) => (
            <li key={req.id}>
              {req.from.username} <button onClick={() => acceptRequest(req.id)}>Accept</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

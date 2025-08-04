import { authActions } from "@/lib/actions";
import { useRouter } from "@tanstack/react-router";

import { useState } from "react";

export default function Signin() {
  const { guestRegister, guestLogin } = authActions();
  const [guestId, setGuestId] = useState("");
  const { user } = useRouter().options.context;
  const handleGuestLogin = () => {
    guestLogin.mutate({ guestId });
  };

  const handleGuestRegister = () => {
    guestRegister.mutate();
  };

  return (
    <div className="p-4 space-y-3">
      <button onClick={() => console.log(user)}>Check user</button>
      <button onClick={handleGuestRegister}>Register as Guest</button>
      <input type="text" value={guestId} placeholder="Enter guest ID" onChange={(e) => setGuestId(e.target.value)} />
      <button onClick={handleGuestLogin}>Login as Guest</button>
    </div>
  );
}

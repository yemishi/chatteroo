import { useAuth } from "@/hooks";
import "../styles.scss";

import GuestRegisterForm from "./guestRegister/GuestRegister";
import UserRegisterForm from "./userRegisterForm/UserRegisterForm";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) {
    navigate({ to: "/settings" });
    return;
  }

  const [isGuestRegister, setIsGuestRegister] = useState(false);
  return (
    <div className="auth-page">
      <div className="auth-page__form-container">
        <h1>Welcome!</h1>
        {isGuestRegister ? (
          <GuestRegisterForm switchMethod={() => setIsGuestRegister(false)} />
        ) : (
          <UserRegisterForm switchMethod={() => setIsGuestRegister(true)} />
        )}
      </div>
    </div>
  );
}

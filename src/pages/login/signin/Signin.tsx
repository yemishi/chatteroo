import "../styles.scss";
import { Link, useNavigate } from "@tanstack/react-router";

import UserLoginForm from "./userLoginForm/UserLoginForm";
import { useState } from "react";
import GuestLoginForm from "./guestLoginForm/GuestLoginForm";
import { useAuth } from "@/hooks";

export default function Signin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) {
    navigate({ to: "/settings" });
    return;
  }

  const [isGuestLogin, setIsGuestLogin] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-page__form-container">
        <h1>Welcome!</h1>
        {isGuestLogin ? (
          <GuestLoginForm changeToUserMethod={() => setIsGuestLogin(false)} />
        ) : (
          <UserLoginForm changeToGuestMethod={() => setIsGuestLogin(true)} />
        )}
        <div className="auth-link__container">
          Doesn't have an account?
          <Link className="auth-link" to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

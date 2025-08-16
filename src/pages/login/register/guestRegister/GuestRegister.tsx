import "./styles.scss";
import { authActions } from "@/lib/actions";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import RefreshIcon from "@/assets/icons/refresh.svg?react";
import CopyIcon from "@/assets/icons/clipboard.svg?react";

type GuestRegisterFormProps = {
  switchMethod: () => void;
};

export default function GuestRegisterForm({ switchMethod }: GuestRegisterFormProps) {
  const { generateGuestUser, guestRegister } = authActions();
  const { mutate: generateUserMutate, data: guestUser, error: generateGuestError, status } = generateGuestUser;
  const user = guestUser?.user;
  const generateUser = () => {
    if (status === "pending") return;
    generateUserMutate();
  };
  useEffect(() => {
    generateUser();
  }, []);
  const handleSubmit = () => {
    if (!user) return;
    guestRegister.mutate(user);
  };
  return (
    <div className="guest-register">
      <button className="guest-register__refresh" onClick={generateUser}>
        <RefreshIcon className="guest-register__icon" />
      </button>
      <div className="guest-register__preview">
        <img src={user?.picture} alt="Profile picture" className="guest-register__preview-icon" />
        <div className="guest-register__info">
          <p className="guest-register__name">{user?.username}</p>
          <p className="guest-register__tag">{user?.tag}</p>
        </div>
      </div>

      <div className="guest-register__pass">
        <span className="guest-register__pass-label">Your guest pass</span>
        <p className="guest-register__pass-code">{user?.guestCode}</p>
        <button
          className="guest-register__pass-copy"
          onClick={() => navigator.clipboard.writeText(user?.guestCode || "")}
          title="Copy guest code"
        >
          <CopyIcon className="guest-register__icon" />
        </button>
      </div>
      {switchMethod && (
        <button className="auth-switch-method__button" type="button" onClick={switchMethod}>
          Login as User
        </button>
      )}
      <button onClick={handleSubmit} className="auth-submit__button" type="submit">
        Register
      </button>
      <div className="auth-link__container">
        Already have an account?
        <Link className="auth-link" to="/login">
          Sign in
        </Link>
      </div>

      {(generateGuestError?.message || guestRegister.error) && (
        <div className="auth-form__error">{generateGuestError?.message || guestRegister?.error?.message}</div>
      )}
    </div>
  );
}

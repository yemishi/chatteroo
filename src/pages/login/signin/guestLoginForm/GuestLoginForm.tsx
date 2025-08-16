import { Input } from "@/components";
import { authActions } from "@/lib/actions";
import { useState } from "react";

type GuestLoginFormProps = {
  changeToUserMethod?: () => void;
};
export default function GuestLoginForm({ changeToUserMethod }: GuestLoginFormProps) {
  const [guestCode, setGuestCode] = useState("");

  const { guestLogin } = authActions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    guestLogin.mutate({ guestCode });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    value = value.slice(0, 16);
    value = value.match(/.{1,4}/g)?.join("-") || "";
    setGuestCode(value);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <Input
        onChange={onChange}
        required
        value={guestCode}
        name="guestCode"
        label="Enter your guest code"
        placeholder="AAAA-AAAA-AAAA-AAAA"
        pattern="[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}"
        title="Guest code must be in the format AAAA-AAAA-AAAA-AAAA"
      />

      {changeToUserMethod && (
        <button className="auth-switch-method__button" type="button" onClick={changeToUserMethod}>
          Login as User
        </button>
      )}
      {guestLogin.error?.message && <div className="auth-form__error">{guestLogin.error.message}</div>}
      <button className="auth-submit__button" type="submit">
        Sign In
      </button>
    </form>
  );
}

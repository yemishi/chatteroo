import { Input } from "@/components";
import SubmitButton from "@/components/common/button/submitButton/SubmitButton";
import useForm, { type FormFields } from "@/hooks/useForm";
import { authActions } from "@/lib/actions";

type UserLoginFormProps = {
  changeToGuestMethod?: () => void;
};
export default function UserLoginForm({ changeToGuestMethod }: UserLoginFormProps) {
  const initialValues: FormFields = {
    name: { value: "" },
    password: { value: "", min: 4, max: 20, minMessage: "Password must be at least 4 characters long." },
  };
  const { login } = authActions();
  const { values, onChange, validateAll, errors } = useForm<{ name: string; password: string }>(initialValues);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) return;
    login.mutate({ ...values });
  };
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <Input
        error={errors.name || ""}
        onChange={onChange}
        required
        name="name"
        label="Name or Email"
        placeholder="Who goes there?"
      />
      <Input
        error={errors.password || ""}
        onChange={onChange}
        required
        name="password"
        label="Password"
        placeholder="Your secret key"
        isPassword
      />
      {changeToGuestMethod && (
        <button className="auth-switch-method__button" type="button" onClick={changeToGuestMethod}>
          Login as Guest
        </button>
      )}

      {login.error?.message && <div className="form__error">{login.error.message}</div>}

      <SubmitButton type="submit" isLoading={login.isPending} loadingMessage="Logging in">
        Sign in
      </SubmitButton>
    </form>
  );
}

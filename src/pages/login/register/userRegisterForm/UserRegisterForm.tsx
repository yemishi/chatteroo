import { Input } from "@/components";
import useForm, { type FormFields } from "@/hooks/useForm";
import { authActions } from "@/lib/actions";
import { Link } from "@tanstack/react-router";

type UserRegisterFormProps = {
  switchMethod: () => void;
};

export default function UserRegisterForm({ switchMethod }: UserRegisterFormProps) {
  const initialValues: FormFields = {
    name: { value: "", min: 3, max: 15, minMessage: "Name must be at least 3 characters long." },
    password: { value: "", min: 4, max: 20, minMessage: "Password must be at least 4 characters long." },
    email: { value: "", isEmail: true },
    confirmPass: { value: "", compareField: "password" },
    tag: { value: "", min: 3, max: 15, minMessage: "Tag must be at least 3 characters long." },
  };
  const { register } = authActions();
  const { values, errors, onChange, validateAll } = useForm<{
    name: string;
    password: string;
    confirmPass: string;
    tag: string;
    email: string;
  }>(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) return;
    register.mutate({ email: values.email, password: values.password, tag: values.tag, username: values.name });
  };
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <Input
        error={errors.name || ""}
        onChange={onChange}
        required
        name="name"
        label="Name"
        placeholder="Enter your name"
      />
      <Input
        error={errors.tag || ""}
        onChange={onChange}
        required
        name="tag"
        label="Tag"
        placeholder="Choose a username tag"
      />
      <Input
        error={errors.email || ""}
        onChange={onChange}
        required
        name="email"
        label="Email"
        placeholder="Your email address"
        type="email"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        title="Please enter a valid email address (e.g., user@example.com)"
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
      <Input
        error={errors.confirmPass || ""}
        onChange={onChange}
        required
        name="confirmPass"
        label="Confirm Password"
        placeholder="Repeat your password"
        isPassword
      />

      {switchMethod && (
        <button className="auth-switch-method__button" type="button" onClick={switchMethod}>
          Login as Guest
        </button>
      )}
      {register.error?.message && <div className="auth-form__error">{register.error.message}</div>}
      <button className="auth-submit__button" type="submit">
        Register
      </button>

      <div className="auth-link__container">
        Already have an account?
        <Link className="auth-link" to="/login">
          Sign in
        </Link>
      </div>
    </form>
  );
}

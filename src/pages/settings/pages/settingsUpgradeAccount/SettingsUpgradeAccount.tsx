import { Header, Input, SubmitButton } from "@/components";
import useForm, { type FormFields } from "@/hooks/useForm";
import { useUserUpdates } from "@/lib/actions";
import { useRouter } from "@tanstack/react-router";

export default function SettingsUpgradeAccount() {
  const initialValues: FormFields = {
    email: { value: "", isEmail: true },
    password: { value: "", min: 4, minMessage: "Password must be at least 4 characters long." },
    confirmPass: { value: "", compareField: "password" },
  };
  const { values, errors, onChange, validateAll } = useForm<{ email: string; password: string }>(initialValues);
  const updateUser = useUserUpdates().upgradeGuestAccount();
  const navigate = useRouter().navigate;
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) return;
    try {
      await updateUser.mutateAsync({ email: values.email, password: values.password });
      navigate({ to: "/settings" });
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <div className="settings-update-account">
      <Header title="Settings upgrade account" />
      <form onSubmit={onSubmit} className="settings-update-account settings-update-account-form">
        <Input
          error={errors.email || ""}
          value={values.email}
          className="settings-update-account-input"
          onChange={onChange}
          name="email"
          label="Email"
          placeholder="Enter your email"
          required
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
        {updateUser.error?.message && <p className="form__error">{updateUser.error.message}</p>}
        <SubmitButton
          isLoading={updateUser.isPending}
          type="submit"
          className="settings-update-account-button"
          loadingMessage="Updating..."
        >
          Confirm
        </SubmitButton>
      </form>
    </div>
  );
}

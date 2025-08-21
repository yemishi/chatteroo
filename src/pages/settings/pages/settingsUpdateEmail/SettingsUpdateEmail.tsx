import { Header, Input, SubmitButton } from "@/components";
import { useAuth } from "@/hooks";
import useForm, { type FormFields } from "@/hooks/useForm";
import { useUserUpdates } from "@/lib/actions";
import { useRouter } from "@tanstack/react-router";

export default function SettingsUpdateEmail() {
  const email = useAuth().user?.email;
  const initialValues: FormFields = {
    email: { value: email || "", isEmail: true },
  };
  const { values, errors, onChange, validateAll, setError } = useForm<{ email: string }>(initialValues);
  const updateUser = useUserUpdates().updateUser();
  const navigate = useRouter().navigate;
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateAll();

    if (values.email === email) {
      setError("email", "Did you just put the same email?");
      return;
    }
    if (!isValid) return;
    try {
      await updateUser.mutateAsync({ email: values.email });
      navigate({ to: "/settings" });
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <div className="settings-update-account">
      <Header title="Update Email" />
      <form onSubmit={onSubmit} className="settings-update-account settings-update-account-form">
        <Input
          error={errors.email || ""}
          onChange={onChange}
          required
          name="email"
          label="Email"
          placeholder="drop your email here"
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

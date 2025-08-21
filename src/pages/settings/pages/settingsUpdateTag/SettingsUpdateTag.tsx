import { Header, Input, SubmitButton } from "@/components";
import { useAuth } from "@/hooks";
import useForm, { type FormFields } from "@/hooks/useForm";
import { useUserUpdates } from "@/lib/actions";
import { useRouter } from "@tanstack/react-router";

export default function SettingsUpdateTag() {
  const tag = useAuth().user?.tag;
  const initialValues: FormFields = {
    tag: { value: tag || "", min: 3, max: 30, minMessage: "Tag must be at least 3 characters long." },
  };
  const { values, errors, onChange, validateAll, setError } = useForm<{ tag: string }>(initialValues);
  const updateUser = useUserUpdates().updateUser();
  const navigate = useRouter().navigate;
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateAll();

    if (values.tag === tag) {
      setError("tag", "Did you just put the same tag?");
      return;
    }
    if (!isValid) return;
    try {
      await updateUser.mutateAsync({ tag: values.tag });
      navigate({ to: "/settings" });
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <div className="settings-update-account">
      <Header title="Update tag" />
      <form onSubmit={onSubmit} className="settings-update-account settings-update-account-form">
        <Input
          error={errors.tag || ""}
          onChange={onChange}
          required
          name="tag"
          label="Tag"
          placeholder="Choose a username tag"
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

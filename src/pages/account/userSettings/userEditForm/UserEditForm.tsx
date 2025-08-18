import { Input, SubmitButton, Textarea } from "@/components";
import "./styles.scss";
import Modal from "@/components/modal/Modal";
import type { User } from "@/types";
import { useEffect, useState } from "react";
import useForm, { type FormFields } from "@/hooks/useForm";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { useUserUpdates } from "@/lib/actions";
type ProfileSettingsProps = {
  user: User;
  onClose: () => void;
};

export default function ProfileSettingsForm({ user, onClose }: ProfileSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initialValues: FormFields = {
    name: { value: user.username || "", min: 3, max: 15, minMessage: "Name must be at least 3 characters long." },
    bio: { value: user?.bio || "" },
  };
  const { values, errors, onChange, validateAll } = useForm<{ bio?: string; name: string }>(initialValues);
  const updateUser = useUserUpdates().updateUser();
  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }, []);

  const handleOnClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) return;
    try {
      updateUser.mutateAsync({ bio: values.bio, username: values.name });
      handleOnClose();
    } catch (error) {
      console.log("failed", error);
    }
  };
  return (
    <Modal onClose={handleOnClose} isOpen={isOpen}>
      <div className="profile-settings__container">
        <button onClick={handleOnClose} className="profile-settings-button-close">
          <ArrowIcon className="profile-settings-button-close__icon" />
        </button>
        <form onSubmit={onSubmit} className="profile-settings profile-settings-form">
          <img className="profile-settings__picture" src={user.picture} alt={`${user.username} picture`} />
          <Input
            error={errors.name || ""}
            variant="secondary"
            value={values.name}
            className="profile-settings-input"
            onChange={onChange}
            name="name"
            label="Name"
            placeholder="Enter your name"
            required
          />
          <Textarea
            onChange={onChange}
            error={errors.bio || ""}
            value={values.bio}
            name="bio"
            label="Bio"
            variant="secondary"
            placeholder="Enter your biography"
          />
          {updateUser.error?.message && <p className="form__error">{updateUser.error.message}</p>}
          <SubmitButton
            isLoading={updateUser.isPending}
            type="submit"
            className="profile-settings-button"
            loadingMessage="Confirming"
          >
            Confirm
          </SubmitButton>
        </form>
      </div>
    </Modal>
  );
}

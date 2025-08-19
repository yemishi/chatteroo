import { Input, SubmitButton } from "@/components";
import Modal from "@/components/modal/Modal";
import { useEffect, useState } from "react";
import useForm, { type FormFields } from "@/hooks/useForm";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import { useUserUpdates } from "@/lib/actions";

type ProfileSettingsProps = {
  onClose: () => void;
};

export default function UserUpgradeForm({ onClose }: ProfileSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initialValues: FormFields = {
    email: { value: "", isEmail: true },
    password: { value: "", min: 4, max: 20, minMessage: "Password must be at least 4 characters long." },
    confirmPass: { value: "", compareField: "password" },
  };
  const { values, errors, onChange, validateAll } = useForm<{ email: string; password: string }>(initialValues);
  const updateUser = useUserUpdates().upgradeGuestAccount();
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
      await updateUser.mutateAsync({ email: values.email, password: values.password });

      handleOnClose();
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <Modal onClose={handleOnClose} isOpen={isOpen}>
      <div className="profile-settings__container">
        <button onClick={handleOnClose} className="profile-settings-button-close">
          <ArrowIcon className="profile-settings-button-close__icon" />
        </button>
        <form onSubmit={onSubmit} className="profile-settings profile-settings-form">
          <h2>Upgrade your account</h2>
          <Input
            error={errors.email || ""}
            variant="secondary"
            value={values.email}
            className="profile-settings-input"
            onChange={onChange}
            name="email"
            label="Email"
            placeholder="Enter your email"
            required
          />
          <Input
            error={errors.password || ""}
            onChange={onChange}
            variant="secondary"
            required
            name="password"
            label="Password"
            placeholder="Your secret key"
            isPassword
          />
          <Input
            error={errors.confirmPass || ""}
            onChange={onChange}
            variant="secondary"
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
            className="profile-settings-button"
            loadingMessage="Updating..."
          >
            Confirm
          </SubmitButton>
        </form>
      </div>
    </Modal>
  );
}

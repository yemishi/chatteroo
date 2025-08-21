import Modal from "@/components/modal/Modal";
import { useEffect, useState } from "react";
import "./styles.scss";
import type { FormFields } from "@/hooks/useForm";
import useForm from "@/hooks/useForm";
import { useUserUpdates } from "@/lib/actions";
import { Input, SubmitButton } from "@/components";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import type { User } from "@/types";
type Props = {
  onClose: () => void;
  user: User;
};

export default function DeleteAccount({ onClose, user }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const initialValues: FormFields = {
    password: { value: "", min: 4, max: 100, minMessage: "Password must be at least 4 characters long." },
  };
  const { values, errors, onChange, validateAll } = useForm<{ password: string }>(initialValues);
  const deleteUser = useUserUpdates().deleteAccount();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = !user.guestCode ? validateAll() : true;

    if (!isValid) return;
    await deleteUser.mutateAsync(values.password);
  };
  useEffect(() => {
    setIsOpen(true);
  }, []);
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  return (
    <Modal className="delete-acc-modal" onClose={handleClose} isOpen={isOpen}>
      <div className="delete-acc-intro">
        <button className="delete-acc-close" onClick={onClose}>
          <ArrowIcon className="delete-acc-close__icon" />
        </button>
        <div className="delete-acc-warning">
          <p>This action is permanent. All your data will be lost and cannot be recovered.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="settings-update-account settings-update-account-form">
        {!user.guestCode && (
          <Input
            error={errors.password || ""}
            onChange={onChange}
            required
            name="password"
            label="Password"
            placeholder="Your secret key goes here"
            isPassword
          />
        )}
        {deleteUser.error?.message && <p className="form__error">{deleteUser.error.message}</p>}
        <SubmitButton
          isLoading={deleteUser.isPending}
          type="submit"
          className="settings-update-account-button"
          loadingMessage="Deleting..."
        >
          Confirm
        </SubmitButton>
      </form>
    </Modal>
  );
}

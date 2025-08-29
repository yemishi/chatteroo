import "./styles.scss";
import { Header, Input, InputFile, SubmitButton, Textarea } from "@/components";
import useForm, { type FormFields } from "@/hooks/useForm";

import { useUserUpdates } from "@/lib/actions";
import { useAuth } from "@/hooks";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { uploadImg } from "@/lib/actions/uploadImgActions/uploadImg";

export default function SettingsProfile() {
  const user = useAuth().user!;
  const initialValues: FormFields = {
    name: { value: user.username || "", min: 3, minMessage: "Name must be at least 3 characters long." },
    bio: { value: user?.bio || "" },
  };
  const { values, errors, onChange, validateAll } = useForm<{ bio?: string; name: string }>(initialValues);
  const [newPic, setNewPic] = useState<{ file: File; preview: string }>();
  const updateUser = useUserUpdates().updateUser();
  const navigate = useRouter().navigate;
  const { mutateAsync, isPending: isImgPending } = uploadImg();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) return;
    try {
      const uploadPic = newPic && (await mutateAsync({ file: newPic?.file!, oldImg: user.picture })).imageUrl;
      updateUser.mutateAsync({ bio: values.bio, username: values.name, picture: uploadPic });
      navigate({ to: "/settings" });
    } catch (error) {
      console.log("failed", error);
    }
  };
  return (
    <div className="settings-profile">
      <Header title="Profile settings" />
      <form onSubmit={onSubmit} className="settings-profile settings-profile-form">
        <div className="edit-picture">
          <img
            className="edit-picture__preview"
            src={newPic?.preview || user.picture}
            alt={`${user.username} picture`}
          />
          <InputFile onChange={setNewPic} />
        </div>
        <Input
          error={errors.name || ""}
          variant="secondary"
          value={values.name}
          className="settings-profile-input"
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
          isLoading={updateUser.isPending || isImgPending}
          type="submit"
          className="settings-profile-button"
          loadingMessage="Confirming"
        >
          Confirm
        </SubmitButton>
      </form>
    </div>
  );
}

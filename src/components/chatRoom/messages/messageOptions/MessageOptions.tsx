import ConfirmModal from "@/components/confirmModal/ConfirmModal";
import Popover from "@/components/popover/Popover";
import { deleteMessage } from "@/lib/actions";
import { useState } from "react";

type Props = {
  msgId: string;
  chatId: string;
  imgs: string[];
  onEdit: () => void;
  onClose: () => void;
};
export default function MessageOptions({ chatId, msgId, onEdit, onClose, imgs }: Props) {
  const { isPending, mutateAsync } = deleteMessage(chatId);
  const [isDelete, setIsDelete] = useState(false);
  const handleOnDelete = async () => {
    await mutateAsync({ imgs, msgId });
    onClose();
  };

  return (
    <>
      <Popover variant="secondary" autoClose={!isDelete} onClose={onClose} isOpen={true}>
        <button className="popover-option" onClick={onEdit}>
          Edit Message
        </button>
        <button onClick={() => setIsDelete(true)} className="popover-option">
          Delete Message
        </button>
      </Popover>
      <ConfirmModal
        isOpen={isDelete}
        desc="Delete message?"
        loadingMsg="deleting..."
        confirmMsg="Delete"
        warnMsg="This action can’t be undone. The message will be permanently removed."
        onClose={() => {
          setIsDelete(false);
          onClose();
        }}
        onConfirm={handleOnDelete}
        isLoading={isPending}
      />
    </>
  );
}

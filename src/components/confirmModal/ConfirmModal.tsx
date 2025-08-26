import "./styles.scss";

import { type HTMLAttributes, type ReactNode } from "react";
import Modal from "../modal/Modal";
import { Button, SubmitButton } from "../common/button";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  onConfirm: () => void;
  confirmMsg?: string;
  desc?: string;
  warnMsg?: string;
  isLoading?: boolean;
  loadingMsg?: string;
}

export default function ConfirmModal({
  onClose,
  onConfirm,
  isOpen,
  className = "",
  isLoading,
  loadingMsg,
  confirmMsg = "Confirm",
  warnMsg,
  desc,
}: Props) {
  if (!isOpen) return;
  return (
    <Modal isOpen={isOpen} className={`${className} modal-confirm-action`} onClose={onClose}>
      <div className="modal-confirm-action-container">
        <div className="info">
          <p>{desc || "Are you sure?"}</p>
          {warnMsg && <p className="warn-msg">{warnMsg}</p>}
        </div>
        <div className="actions">
          <Button onClick={onClose}>Cancel</Button>
          <SubmitButton
            type="button"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingMessage={loadingMsg}
            variant="danger"
          >
            {confirmMsg}
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}

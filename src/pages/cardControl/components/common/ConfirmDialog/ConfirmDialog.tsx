// components/common/confirm-dialog/ConfirmDialog.tsx
import type React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmDialogProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning' | 'success' | 'info';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show,
  onHide,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  subMessage = "This action cannot be undone",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  loading = false,
  loadingText = "Processing...",
  icon,
  size = "sm"
}) => {
  return (
    <Modal
      show={show} onHide={onHide} centered size={size}
      dialogClassName="confirm-dialog-compact"
    >
      <Modal.Header closeButton>
        <Modal.Title className='h5'>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <p className="mb-1" style={{ fontSize: '0.92rem' }}>{message}</p>
          {subMessage && <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{subMessage}</p>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {loadingText}
            </>
          ) : (
            confirmText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
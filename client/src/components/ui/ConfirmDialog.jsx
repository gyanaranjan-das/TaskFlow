import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * A reusable confirmation dialog for destructive or critical actions
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  intent = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center text-center px-4 pt-4 pb-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            intent === 'danger'
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-500'
              : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-500'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={intent === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

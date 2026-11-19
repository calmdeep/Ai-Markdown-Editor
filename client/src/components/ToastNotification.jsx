import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function ToastNotification({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    // Auto dismiss success or info toasts after 4 seconds
    if (notification.type === 'success' || notification.type === 'info') {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const { type = 'info', message } = notification;

  const icons = {
    error: <AlertCircle size={18} className="toast-icon text-error" />,
    success: <CheckCircle2 size={18} className="toast-icon text-success" />,
    info: <Info size={18} className="toast-icon text-info" />
  };

  return (
    <div className={`toast-container toast-${type}`} role="status" aria-live="polite">
      <div className="toast-body">
        {icons[type] || icons.info}
        <div className="toast-message">{message}</div>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Dismiss toast"
      >
        <X size={15} />
      </button>
    </div>
  );
}

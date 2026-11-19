import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function NotificationBanner({ notification, onClose }) {
  if (!notification) return null;

  const { type = 'info', message } = notification;

  return (
    <div className={`notification-banner banner-${type}`} role="alert">
      <div className="banner-content">
        {type === 'error' ? (
          <AlertCircle size={16} className="banner-icon icon-error" />
        ) : (
          <CheckCircle2 size={16} className="banner-icon icon-success" />
        )}
        <span className="banner-text">{message}</span>
      </div>
      <button
        type="button"
        className="banner-close-btn"
        onClick={onClose}
        aria-label="Dismiss alert"
      >
        <X size={14} />
      </button>
    </div>
  );
}

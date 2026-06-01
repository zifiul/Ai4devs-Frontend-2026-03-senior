import React from 'react';

type ToastProps = {
  message: string;
  variant: 'success' | 'error';
  onDismiss: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, variant, onDismiss }) => {
  const variantClasses =
    variant === 'success'
      ? 'bg-[#defbe6] border-l-4 border-[#24a148] text-[#0e6027]'
      : 'bg-[#ffdad6] border-l-4 border-[#ba1a1a] text-[#93000a]';

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`fixed bottom-4 right-4 z-50 min-w-[280px] max-w-[400px] pl-5 pr-4 py-4 text-[14px] font-['IBM_Plex_Sans'] ${variantClasses}`}
    >
      <p>{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="absolute top-2 right-2 text-current opacity-60 hover:opacity-100 text-[18px] leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

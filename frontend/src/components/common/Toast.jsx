import React, { useEffect } from 'react';

const Toast = ({ 
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right'
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-500 dark:bg-green-600',
      icon: 'check_circle'
    },
    error: {
      bg: 'bg-error dark:bg-red-600',
      icon: 'error'
    },
    warning: {
      bg: 'bg-yellow-500 dark:bg-yellow-600',
      icon: 'warning'
    },
    info: {
      bg: 'bg-primary dark:bg-[#2d8c4e]',
      icon: 'info'
    }
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <div className={`fixed ${positions[position]} z-50 animate-slide-in`}>
      <div className={`
        ${types[type].bg}
        text-white
        px-6 py-4
        rounded-xl
        shadow-lg
        flex items-center gap-3
        min-w-[300px]
      `}>
        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>
          {types[type].icon}
        </span>
        <p className="flex-1 font-label">{message}</p>
        <button 
          onClick={onClose}
          className="hover:bg-white/10 rounded-lg p-1 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};

// Toast Container Hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};

export default Toast;
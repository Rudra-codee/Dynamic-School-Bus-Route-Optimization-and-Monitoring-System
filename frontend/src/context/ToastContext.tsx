import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const TOAST_DURATION = 4000;

const toastStyles: Record<ToastType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
  },
  error: {
    bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800',
    icon: <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
  },
  warning: {
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800',
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
  },
  info: {
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800',
    icon: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '400px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => {
          const style = toastStyles[toast.type];
          return (
            <div
              key={toast.id}
              className={`${style.bg} ${style.border} ${style.text} border rounded-xl px-4 py-3 shadow-lg flex items-start gap-3 animate-in slide-in-from-right duration-300`}
              style={{ pointerEvents: 'auto' }}
            >
              {style.icon}
              <p className="text-sm font-semibold flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

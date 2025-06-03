import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';

// Tipos de toast
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Criar contexto
const ToastContext = createContext(null);

// Componente de Toast individual
const Toast = ({ id, type, title, message, duration, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  React.useEffect(() => {
    // Mostrar toast
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return <FiCheck className="toast-icon" />;
      case TOAST_TYPES.ERROR:
        return <FiX className="toast-icon" />;
      case TOAST_TYPES.WARNING:
        return <FiAlertTriangle className="toast-icon" />;
      default:
        return <FiInfo className="toast-icon" />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'toast-success';
      case TOAST_TYPES.ERROR:
        return 'toast-error';
      case TOAST_TYPES.WARNING:
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  };

  return (
    <div 
      className={`toast ${getTypeClass()} ${isVisible ? 'toast-visible' : ''} ${isRemoving ? 'toast-removing' : ''}`}
      onClick={handleRemove}
    >
      <div className="toast-content">
        <div className="toast-icon-container">
          {getIcon()}
        </div>
        <div className="toast-text">
          {title && <div className="toast-title">{title}</div>}
          <div className="toast-message">{message}</div>
        </div>
        <button 
          className="toast-close" 
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

// Container de toasts
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

// Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Gerar ID único para toast
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Adicionar toast
  const addToast = useCallback((options) => {
    const toast = {
      id: generateId(),
      type: options.type || TOAST_TYPES.INFO,
      title: options.title,
      message: options.message || '',
      duration: options.duration !== undefined ? options.duration : 5000,
    };

    setToasts(prev => [...prev, toast]);
    return toast.id;
  }, []);

  // Remover toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Limpar todos os toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Funções de conveniência
  const success = useCallback((message, title = null, duration = 5000) => {
    return addToast({
      type: TOAST_TYPES.SUCCESS,
      title,
      message,
      duration,
    });
  }, [addToast]);

  const error = useCallback((message, title = null, duration = 8000) => {
    return addToast({
      type: TOAST_TYPES.ERROR,
      title,
      message,
      duration,
    });
  }, [addToast]);

  const info = useCallback((message, title = null, duration = 5000) => {
    return addToast({
      type: TOAST_TYPES.INFO,
      title,
      message,
      duration,
    });
  }, [addToast]);

  const warning = useCallback((message, title = null, duration = 6000) => {
    return addToast({
      type: TOAST_TYPES.WARNING,
      title,
      message,
      duration,
    });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook para usar toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  
  return context;
};

export { TOAST_TYPES };
export default ToastContext;
import { createContext, useContext, useState, useCallback } from 'react';
import ErrorNotification from '../components/ErrorNotification';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [currentError, setCurrentError] = useState(null);

  const showError = useCallback((title, message) => {
    setCurrentError({ title, message });
  }, []);

  const clearError = useCallback(() => {
    setCurrentError(null);
  }, []);

  const value = {
    showError,
    clearError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ErrorNotification error={currentError} onClose={clearError} />
    </ErrorContext.Provider>
  );
};


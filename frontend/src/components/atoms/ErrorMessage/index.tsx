import React from 'react';

interface ErrorMessageProps {
  error: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClose }) => {
  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
      <div className="whitespace-pre-line text-sm">{error}</div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white hover:text-gray-300"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorMessage;

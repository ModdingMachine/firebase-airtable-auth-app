import { useState } from 'react';
import Button from './Button';
import { reportIssue } from '../services/api';

const ErrorNotification = ({ error, onClose }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!error) return null;

  const errorCode = `ERR-${Date.now().toString(36).toUpperCase()}`;
  const errorDetails = `Error Code: ${errorCode}\n\nIssue: ${error.title || 'Unknown Error'}\n\nDescription: ${error.message || 'No description available'}\n\nTimestamp: ${new Date().toLocaleString()}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSendToIT = async () => {
    try {
      setSending(true);
      await reportIssue({
        issue: error.title || 'Unknown Error',
        description: `${error.message || 'No description available'}\n\nError Code: ${errorCode}\nTimestamp: ${new Date().toISOString()}`,
      });
      setSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to send to IT:', err);
      alert('Failed to send error report. Please try again or contact IT directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg border-2 border-red-400 rounded-2xl shadow-xl p-6 animate-slide-up">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  {error.title || 'Error Occurred'}
                </h3>
                <p className="text-xs text-gray-600 font-mono">{errorCode}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-gray-700">{error.message || 'An unexpected error occurred.'}</p>
          </div>

          {/* Success Message */}
          {sent && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-xl">
              <p className="text-sm text-green-800 font-semibold">
                Report sent to IT department successfully!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant="secondary"
              className="flex-1"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Error
                </>
              )}
            </Button>

            <Button
              onClick={handleSendToIT}
              variant="primary"
              className="flex-1"
              disabled={sending || sent}
            >
              {sending ? (
                'Sending...'
              ) : sent ? (
                <>
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sent to IT
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send to IT
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;


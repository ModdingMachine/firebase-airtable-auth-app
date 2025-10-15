import { useState } from 'react';
import { reportIssue } from '../services/api';
import GlassCard from './GlassCard';
import Button from './Button';
import Input from './Input';

const SubmitTicket = () => {
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!issue.trim() || !description.trim()) {
      setError('Please fill in both fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      await reportIssue({ issue, description });
      
      setSuccess('IT ticket submitted successfully! Our team will review it shortly.');
      setIssue('');
      setDescription('');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to submit ticket: ' + err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit IT Ticket</h2>
      <p className="text-gray-600 mb-6">
        Having technical issues? Submit a ticket and our IT team will help you.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Issue Summary"
          type="text"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Brief description of the problem"
          required
          disabled={submitting}
        />

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more details about the issue, including any error messages or steps to reproduce..."
            required
            disabled={submitting}
            rows="5"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-pastel-blue focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          fullWidth
        >
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </Button>
      </form>
    </GlassCard>
  );
};

export default SubmitTicket;


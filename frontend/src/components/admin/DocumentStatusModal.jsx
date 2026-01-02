import React, { useState } from 'react';
import { updateDocumentStatus } from '../../services/adminDocumentService';

export default function DocumentStatusModal({ document: doc = null, onClose = () => {}, onStatusUpdated = () => {} }) {
  const [selectedStatus, setSelectedStatus] = useState(doc?.status || 'pending');
  const [statusNotes, setStatusNotes] = useState(doc?.statusNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!doc) return null;

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow', icon: '⏳' },
    { value: 'approved', label: 'Approved', color: 'green', icon: '✓' },
    { value: 'rejected', label: 'Rejected', color: 'red', icon: '✗' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate that notes are provided for rejected status
    if (selectedStatus === 'rejected' && !statusNotes.trim()) {
      setError('Please provide notes explaining why the document is being rejected.');
      return;
    }

    try {
      setIsSubmitting(true);
      const docId = doc._id || doc.id;
      const result = await updateDocumentStatus(docId, selectedStatus, statusNotes);
      
      if (result.success) {
        onStatusUpdated(result.data);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update document status:', error);
      setError('Failed to update document status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'gray';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/50 p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Document Status</h2>
            <p className="text-sm text-gray-500 mt-1">{doc.fileName || doc.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="text-gray-900 font-medium">
                  {doc.clientName || (doc.userId?.fullName) || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Uploaded</p>
                <p className="text-gray-900 font-medium">
                  {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(doc.status)}-100 text-${getStatusColor(doc.status)}-800`}>
                  {statusOptions.find(opt => opt.value === doc.status)?.label || doc.status}
                </span>
              </div>
              {doc.reviewedAt && (
                <div>
                  <p className="text-sm text-gray-500">Last Reviewed</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(doc.reviewedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select New Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStatus(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStatus === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{option.label}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="statusNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes {selectedStatus === 'rejected' && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <textarea
              id="statusNotes"
              rows={5}
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder={
                selectedStatus === 'rejected'
                  ? 'Explain why this document is being rejected...'
                  : 'Add any additional notes (optional)...'
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#31493d] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedStatus === 'rejected'
                ? 'The client will see these notes to understand what needs to be fixed.'
                : 'Optional notes for internal tracking or client communication.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {doc.statusNotes && doc.status !== 'pending' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Previous Notes:</p>
              <p className="text-sm text-blue-800">{doc.statusNotes}</p>
            </div>
          )}
        </form>

        <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-[#31493d] hover:bg-[#243629] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

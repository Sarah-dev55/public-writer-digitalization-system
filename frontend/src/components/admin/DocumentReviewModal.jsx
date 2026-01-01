import React, { useState } from 'react';
import { downloadDocument } from '../../services/adminDocumentService';
import DocumentStatusModal from './DocumentStatusModal';

export default function DocumentReviewModal({ document: doc = null, onClose = () => {}, onStatusUpdated = () => {} }) {
  if (!doc) return null;

  const [isDownloading, setIsDownloading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const docId = doc._id || doc.id;
      const fileName = doc.fileName || doc.title || 'document';
      await downloadDocument(docId, fileName);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStatusUpdated = (updatedDocument) => {
    onStatusUpdated(updatedDocument);
    setShowStatusModal(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
      needs_correction: { label: 'Needs Correction', color: 'bg-orange-100 text-orange-800' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/50 p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-gray-900">Document Review</h2>
              {getStatusBadge(doc.status || 'pending')}
            </div>
            <p className="text-sm text-gray-500 mt-1">{doc.fileName || doc.title} - {doc.clientName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="#374151"><path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
            {doc.fileUrl ? (
              <img src={doc.fileUrl} alt={doc.title} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
            ) : (
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5"/>
                </svg>
                <p>No preview available</p>
                <p className="text-sm mt-1">Download the file to view its contents</p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700"><span className="text-gray-900 font-medium">Submitted:</span> {doc.submittedDate || (doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A')}</p>
            <p className="text-sm text-gray-700 mt-1"><span className="text-gray-900 font-medium">Client:</span> {doc.clientName || (doc.userId?.fullName) || 'Unknown'}</p>
            <p className="text-sm text-gray-700 mt-1"><span className="text-gray-900 font-medium">Type:</span> {doc.title || doc.type || 'N/A'}</p>
            {doc.statusNotes && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm text-gray-900 font-medium">Status Notes:</p>
                <p className="text-sm text-gray-700 mt-1">{doc.statusNotes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#374151"><path d="M12 3v12" strokeWidth="1.5"/><path d="M8 11l4 4 4-4" strokeWidth="1.5"/><path d="M21 21H3" strokeWidth="1.5"/></svg>
            <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
          </button>
          <button 
            onClick={() => setShowStatusModal(true)} 
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#31493d] hover:bg-[#243629] text-white rounded-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#fff">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="1.5"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="1.5"/>
            </svg>
            <span>Update Status</span>
          </button>
        </div>
      </div>

      {showStatusModal && (
        <DocumentStatusModal
          document={doc}
          onClose={() => setShowStatusModal(false)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}

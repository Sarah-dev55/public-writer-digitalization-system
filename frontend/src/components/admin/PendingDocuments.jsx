import React, { useState } from 'react';
import { downloadDocument } from '../../services/adminDocumentService';
import DocumentStatusModal from './DocumentStatusModal';

export default function PendingDocuments({ documents = [], onReview = () => {}, onStatusUpdated = () => {} }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleDownload = async (document) => {
    try {
      setDownloadingId(document._id || document.id);
      const docId = document._id || document.id;
      const fileName = document.fileName || document.title || 'document';
      await downloadDocument(docId, fileName);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenStatusModal = (document) => {
    setSelectedDocument(document);
    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setSelectedDocument(null);
    setShowStatusModal(false);
  };

  const handleStatusUpdated = (updatedDocument) => {
    onStatusUpdated(updatedDocument);
    handleCloseStatusModal();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-app-accent text-app-primary' },
      accepted: { label: 'Accepted', color: 'bg-app-secondary/20 text-app-secondary' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
      needs_correction: { label: 'Needs Correction', color: 'bg-app-primary/20 text-app-primary' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-app-primary/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-app-primary font-semibold text-lg">Pending Documents</h2>
        <button className="text-sm text-app-secondary hover:text-app-primary transition-colors">View All</button>
      </div>

      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-app-primary/60">
            <div className="w-12 h-12 mx-auto mb-3 bg-app-accent rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-app-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5"/></svg>
            </div>
            <p>No pending documents</p>
          </div>
        ) : (
          documents.map((document) => (
            <div key={document._id || document.id} className="flex items-center gap-4 p-4 bg-app-accent/30 rounded-lg hover:bg-app-accent/50 transition-colors border border-app-primary/10">
              <div className="w-12 h-12 bg-app-secondary/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-app-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5"/></svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-app-primary font-medium">{document.fileName || document.title}</p>
                  {getStatusBadge(document.status || 'pending')}
                </div>
                <p className="text-sm text-app-primary/70">
                  Client: {document.clientName || (document.userId && (document.userId.fullName || document.userId))}
                </p>
                <p className="text-sm text-app-primary/70">
                  Submitted: {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : document.submittedDate || document.createdAt || ''}
                </p>
                {document.statusNotes && (
                  <p className="text-sm text-app-primary/80 mt-1 italic">Note: {document.statusNotes}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownload(document)} 
                  disabled={downloadingId === (document._id || document.id)}
                  className="px-3 py-2 bg-app-secondary hover:bg-app-secondary/80 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Download document"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M12 3v12" strokeWidth="1.5"/><path d="M8 11l4 4 4-4" strokeWidth="1.5"/><path d="M21 21H3" strokeWidth="1.5"/></svg>
                  {downloadingId === (document._id || document.id) ? 'Downloading...' : 'Download'}
                </button>
                <button 
                  onClick={() => handleOpenStatusModal(document)} 
                  className="px-3 py-2 bg-app-primary hover:bg-app-primary/80 text-white rounded-lg transition-colors flex items-center gap-2"
                  title="Update document status"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="#fff">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="1.5"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="1.5"/>
                  </svg>
                  Update Status
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showStatusModal && selectedDocument && (
        <DocumentStatusModal
          document={selectedDocument}
          onClose={handleCloseStatusModal}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}

import React from 'react';

export default function DocumentsList({ documents = [], onUpload, onView, onDelete, onUploadNew }) {
  // Default sample data if none provided
  const defaultDocuments = [
    {
      id: 1,
      name: 'Passport Copy',
      required: true,
      updatedAt: '2025-11-10',
      uploaded: true,
      reviewStatus: 'approved',
    },
    {
      id: 2,
      name: 'Academic Transcripts',
      required: true,
      updatedAt: '2025-11-12',
      uploaded: true,
      reviewStatus: 'approved',
    },
    {
      id: 3,
      name: 'Motivation Letter',
      required: true,
      updatedAt: '2025-11-18',
      uploaded: true,
      reviewStatus: 'pending',
    },
    {
      id: 4,
      name: 'Financial Proof',
      required: true,
      updatedAt: null,
      uploaded: false,
      reviewStatus: 'missing',
    },
    {
      id: 5,
      name: 'Language Certificate',
      required: false,
      updatedAt: '2025-11-15',
      uploaded: true,
      reviewStatus: 'rejected',
    },
  ];

  // Map backend data to component format or use default
  const displayDocuments = documents.length > 0 
    ? documents.map(doc => ({
        id: doc._id,
        name: doc.name || doc.fileName,
        required: doc.required || false,
        updatedAt: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : null,
        uploaded: true,
        reviewStatus: doc.reviewStatus || 'pending'
      }))
    : []; // Don't show static data if empty, show empty state (or keep default if you prefer fallback)
    // Actually, user wants "Replace all mocked or static document data." so I should defaults to empty.
    
  // Helper to normalize status for comparison
  const normalizeStatus = (status) => status?.toLowerCase();

  const getStatusBadge = (reviewStatus) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    const status = normalizeStatus(reviewStatus);
    switch (status) {
      case 'approved':
        return <span className={`${base} bg-[#A3B18A] text-[#3A4D42]`}>Approved</span>;
      case 'rejected':
        return <span className={`${base} bg-[#BC6C25] text-white`}>Rejected</span>;
      case 'pending':
        return <span className={`${base} bg-[#DDA15E] text-white`}>Pending</span>;
      case 'missing':
        return <span className={`${base} bg-[#8B5A2B] text-white`}>Missing</span>;
      default:
        return <span className={`${base} bg-gray-400 text-white`}>{reviewStatus}</span>;
    }
  };

  const getActionButtons = (document) => {
    const status = normalizeStatus(document.reviewStatus);
    switch (status) {
      case 'approved':
        return (
          <button
            onClick={() => onView && onView(document.id)}
            className="px-4 py-2 bg-[#588157] hover:bg-[#4a6a56] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            View
          </button>
        );
      case 'rejected':
        return (
          <button
            onClick={() => onUpload && onUpload(document.id)}
            className="px-4 py-2 bg-[#BC6C25] hover:bg-[#8B5A2B] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Re-upload
          </button>
        );
      case 'pending':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onView && onView(document.id)}
              className="px-4 py-2 bg-[#DDA15E] hover:bg-[#BC6C25] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              View
            </button>
            <button
              onClick={() => onDelete && onDelete(document.id)}
              className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#6B4423] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        );
      case 'missing':
        return (
          <button
            onClick={() => onUpload && onUpload(document.id)}
            className="px-4 py-2 bg-[#588157] hover:bg-[#4a6a56] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Upload
          </button>
        );
      default:
        return null;
    }
  };

  const getDocumentIcon = (reviewStatus) => {
    const status = normalizeStatus(reviewStatus);
    const iconColor = status === 'approved' ? 'text-[#588157]' : 
                      status === 'rejected' ? 'text-[#BC6C25]' :
                      status === 'pending' ? 'text-[#DDA15E]' :
                      'text-[#8B5A2B]';
    
    return (
      <div className={`flex-shrink-0 ${iconColor}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <path d="M14 2v6h6" />
        </svg>
      </div>
    );
  };

  return (
    <div className="px-20 py-10 w-full">
      <div className="mb-8 bg-[#1E4D3D] px-4 py-2">
        <h2 className="text-2xl  text-[#A3B18A]">My Documents</h2>
      </div>
      
      <div className="space-y-4 mb-8 px-2">
        {displayDocuments.map((document) => (
          <div
            key={document.id}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {getDocumentIcon(document.reviewStatus)}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-[#2d4a3e]">{document.name}</h3>
                    {document.required && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">
                      {document.uploaded ? (
                        <span>Uploaded on {document.updatedAt}</span>
                      ) : (
                        <span className="text-[#BC6C25]">Not uploaded</span>
                      )}
                    </p>
                    {getStatusBadge(document.reviewStatus)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                {getActionButtons(document)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onUploadNew}
          className="bg-[#588157] hover:bg-[#4a6a56] text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload New Document
        </button>
      </div>
    </div>
  );
}
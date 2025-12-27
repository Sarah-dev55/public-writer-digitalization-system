import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, Download, RefreshCw, Trash2, Upload, ArrowRight } from 'lucide-react';

export default function DocumentsList({ documents = [], onUpload, onView, onDownload, onDelete, onUploadNew }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Default sample data if none provided
  const defaultDocuments = [
    {
      id: 1,
      name: t('dashboard.passportCopy'),
      required: true,
      updatedAt: '2025-11-10',
      uploaded: true,
      reviewStatus: 'approved',
    },
    {
      id: 2,
      name: t('dashboard.academicTranscripts'),
      required: true,
      updatedAt: '2025-11-12',
      uploaded: true,
      reviewStatus: 'approved',
    },
    {
      id: 3,
      name: t('dashboard.motivationLetter'),
      required: true,
      updatedAt: '2025-11-18',
      uploaded: true,
      reviewStatus: 'pending',
    },
    {
      id: 4,
      name: t('dashboard.financialProof'),
      required: true,
      updatedAt: null,
      uploaded: false,
      reviewStatus: 'missing',
    },
    {
      id: 5,
      name: t('dashboard.languageCertificate'),
      required: false,
      updatedAt: '2025-11-15',
      uploaded: true,
      reviewStatus: 'rejected',
    },
  ];

  const displayDocuments = documents.length > 0 ? documents : defaultDocuments;

  const getStatusBadge = (reviewStatus) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    // Support both old and new status values
    const normalizedStatus = reviewStatus === 'approved' ? 'accepted' : 
                            reviewStatus === 'needs_correction' ? 'needs_correction' :
                            reviewStatus;
    
    switch (normalizedStatus) {
      case 'accepted':
        return <span className={`${base} bg-app-secondary text-app-primary`}>{t('dashboard.approved')}</span>;
      case 'rejected':
        return <span className={`${base} bg-[#BC6C25] text-white`}>{t('dashboard.rejected')}</span>;
      case 'pending':
        return <span className={`${base} bg-[#DDA15E] text-white`}>{t('dashboard.pending')}</span>;
      case 'needs_correction':
        return <span className={`${base} bg-orange-500 text-white`}>{t('dashboard.needsCorrection', 'Needs Correction')}</span>;
      case 'missing':
        return <span className={`${base} bg-[#8B5A2B] text-white`}>{t('dashboard.missing')}</span>;
      default:
        return <span className={`${base} bg-gray-400 text-white`}>{reviewStatus}</span>;
    }
  };

  const getActionIcons = (document) => {
    // Normalize status
    const status = document.reviewStatus === 'approved' ? 'accepted' : 
                  document.reviewStatus === 'needs_correction' ? 'needs_correction' :
                  document.reviewStatus;
                  
    switch (status) {
      case 'accepted':
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView && onView(document.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-5 h-5 text-app-primary" />
            </button>
            {onDownload && (
              <button
                onClick={() => onDownload && onDownload(document.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-app-primary" />
              </button>
            )}
          </div>
        );
      case 'rejected':
      case 'needs_correction':
        return (
          <button
            onClick={() => onUpload && onUpload(document.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Re-upload"
          >
            <RefreshCw className="w-5 h-5 text-[#BC6C25]" />
          </button>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView && onView(document.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-5 h-5 text-app-primary" />
            </button>
            {onDownload && (
              <button
                onClick={() => onDownload && onDownload(document.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-app-primary" />
              </button>
            )}
            <button
              onClick={() => onUpload && onUpload(document.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Re-upload"
            >
              <RefreshCw className="w-5 h-5 text-[#DDA15E]" />
            </button>
            <button
              onClick={() => onDelete && onDelete(document.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        );
      case 'missing':
        return (
          <button
            onClick={() => onUpload && onUpload(document.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Upload"
          >
            <Upload className="w-5 h-5 text-app-primary" />
          </button>
        );
      default:
        return null;
    }
  };

  const getDocumentIcon = (reviewStatus) => {
    // Normalize status
    const status = reviewStatus === 'approved' ? 'accepted' : 
                  reviewStatus === 'needs_correction' ? 'needs_correction' :
                  reviewStatus;
                  
    const iconColor = status === 'accepted' ? 'text-[#588157]' : 
                      status === 'rejected' ? 'text-[#BC6C25]' :
                      status === 'pending' ? 'text-[#DDA15E]' :
                      status === 'needs_correction' ? 'text-orange-500' :
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
      <div className="mb-8 bg-app-primary px-4 py-2 flex items-center justify-between">
        <h2 className="text-2xl text-app-accent">My Documents</h2>
        <button
          onClick={() => navigate('/client/documents')}
          className="flex items-center gap-2 text-app-accent hover:text-app-accent/80 transition-colors text-sm font-semibold"
        >
          View all documents
          <ArrowRight className="w-4 h-4" />
        </button>
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
                    <h3 className="text-lg font-bold text-app-primary">{document.name}</h3>
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
                  {/* Display status notes if they exist */}
                  {document.statusNotes && (document.reviewStatus === 'rejected' || document.reviewStatus === 'needs_correction') && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm font-semibold text-orange-900 mb-1">
                        {document.reviewStatus === 'rejected' ? '⚠ Reason for rejection:' : '⚠ Corrections needed:'}
                      </p>
                      <p className="text-sm text-orange-800">{document.statusNotes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end">
                {getActionIcons(document)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onUploadNew}
          className="bg-app-primary hover:bg-app-primary/90 text-app-text-light px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload New Document
        </button>
      </div>
    </div>
  );
}
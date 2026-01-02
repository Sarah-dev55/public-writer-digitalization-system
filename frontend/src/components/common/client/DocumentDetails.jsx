import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Upload, Trash2, RefreshCw } from 'lucide-react';
import { uploadDocument, updateDocument } from '../../services/documentService';
import api from '../../services/api';
import ConfirmationDialog from '../common/ConfirmationDialog';

// Status Badge Component (palette aligned with overview/header)
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'Approved': return 'bg-[#eaf4ea] text-app-primary border-[#cfe5cf]';
      case 'Required': return 'bg-[#fff1f0] text-[#9b2c2c] border-[#ffd6d9]';
      case 'Rejected': return 'bg-[#ffecec] text-[#7a1f1f] border-[#ffd6d6]';
      case 'Pending': return 'bg-[#fff9e6] text-[#7a5a1f] border-[#fff1b3]';
      case 'Missing': return 'bg-[#f5f5f0] text-[#6b6b6b] border-[#e9e3d6]';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getStatusColor()}`}>
      {status}
    </span>
  );
};

// Document Card Component
const DocumentCard = ({ document, onView, onDownload, onUpload, onDelete, onReupload, uploading = {} }) => {
  const { id, name, status, uploadDate, rejectionReason } = document;
  
  const getStatusIcon = () => {
    if (status === 'Approved') return '✓';
    if (status === 'Rejected') return '○';
    if (status === 'Required' || status === 'Missing') return '○';
    return '○';
  };

  const getCardStyles = () => {
    if (status === 'Approved') return 'border-2 border-[#1E4D3D] bg-[#DADCC8]';
    if (status === 'Rejected') return 'border-2 border-[#bf4b4b] bg-[#fff1f1]';
    if (status === 'Pending') return 'border-2 border-[#d4b94a] bg-[#fffbe6]';
    return 'border-2 border-gray-300 bg-transparent';
  };

  return (
    <div className={`p-4 rounded-lg ${getCardStyles()} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-lg font-medium text-app-primary">{getStatusIcon()}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium text-app-primary">{id}. {name}</span>
              <StatusBadge status={status} />
            </div>
            {uploadDate && (
              <div className="text-sm text-gray-500">
                {status === 'Approved' ? 'Approved' : 'Uploaded'} | {uploadDate}
              </div>
            )}
            {status === 'Missing' && (
              <div className="text-sm text-gray-500">Missing</div>
            )}
            {rejectionReason && status === 'Rejected' && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <strong>Rejection Reason:</strong> {rejectionReason}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {status === 'Approved' && (
            <>
              <button 
                onClick={() => onView(document)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4 text-app-primary" />
              </button>
              <button 
                onClick={() => onDownload(document)}
                disabled={uploading[document.id] === 'downloading'}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download"
              >
                <Download className={`w-4 h-4 ${uploading[document.id] === 'downloading' ? 'text-gray-400' : 'text-app-primary'}`} />
              </button>
            </>
          )}
          {status === 'Pending' && (
            <>
              <button 
                onClick={() => onView(document)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4 text-app-primary" />
              </button>
              <button 
                onClick={() => onDownload(document)}
                disabled={uploading[document.id] === 'downloading'}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download"
              >
                <Download className={`w-4 h-4 ${uploading[document.id] === 'downloading' ? 'text-gray-400' : 'text-app-primary'}`} />
              </button>
              <button 
                onClick={() => onReupload(document)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Replace"
              >
                <RefreshCw className="w-4 h-4 text-app-primary" />
              </button>
              <button 
                onClick={() => onDelete(document)}
                disabled={uploading[document.id] === 'deleting'}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <Trash2 className={`w-4 h-4 ${uploading[document.id] === 'deleting' ? 'text-gray-400' : 'text-red-600'}`} />
              </button>
            </>
          )}
          {status === 'Rejected' && (
            <button 
              onClick={() => onReupload(document)}
              disabled={uploading[document.id] === 'uploading'}
              className="px-4 py-2 bg-app-primary text-app-text-light text-sm rounded-lg hover:bg-app-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading[document.id] === 'uploading' ? 'Uploading...' : 'Re-Upload'}
            </button>
          )}
          {(status === 'Required' || status === 'Missing') && (
            <button 
              onClick={() => onUpload(document)}
              disabled={uploading[document.id] === 'uploading'}
              className="px-4 py-2 bg-app-primary text-app-text-light text-sm rounded-lg hover:bg-app-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading[document.id] === 'uploading' ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Status Card Component
const StatusCard = ({ title, count, color }) => {
  const getColorClasses = () => {
    switch(color) {
      case 'white': return 'bg-white border-gray-200';
      case 'green': return 'bg-[#eef7ee] border-[#cfe5cf]';
      case 'yellow': return 'bg-[#fffbe6] border-[#fff1b3]';
      case 'pink': return 'bg-[#fff1f1] border-[#ffd6dc]';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
      <div className={`p-4 rounded-lg border ${getColorClasses()} transition-all hover:shadow-md`}>
      <div className="text-sm text-app-primary mb-1">{title}</div>
      <div className="text-2xl font-semibold text-app-primary">{count}</div>
    </div>
  );
};

// Main Document Management Component
const DocumentManagement = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Passport Copy',
      status: 'Approved',
      uploadDate: 'Uploaded 2025-11-15'
    },
    {
      id: 2,
      name: 'Academic Transcripts',
      status: 'Approved',
      uploadDate: 'Uploaded 2025-12-15'
    },
    {
      id: 3,
      name: 'Motivation Letter',
      status: 'Pending',
      uploadDate: 'Uploaded 2023-11-20'
    },
    {
      id: 4,
      name: 'Financial Proof',
      status: 'Pending',
      uploadDate: 'Uploaded 2025-11-10'
    },
    {
      id: 5,
      name: 'Language Certificate',
      status: 'Rejected',
      uploadDate: 'Uploaded 2025-11-05',
      rejectionReason: 'Document is not clear. Please upload a higher quality scan.'
    },
    {
      id: 6,
      name: 'University Acceptance Letter',
      status: 'Required',
      uploadDate: null
    },
    {
      id: 7,
      name: 'Health Insurance',
      status: 'Required',
      uploadDate: null
    },
    {
      id: 8,
      name: 'Birth Certificate',
      status: 'Required',
      uploadDate: null
    }
  ]);

  const statusCounts = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'Approved').length,
    pendingReview: documents.filter(d => d.status === 'Pending').length,
    rejected: documents.filter(d => d.status === 'Rejected').length,
    missing: documents.filter(d => d.status === 'Required' || d.status === 'Missing').length
  };

  const fileInputRefs = useRef({});
  const [uploading, setUploading] = useState({});
  const [error, setError] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    isLoading: false,
  });

  const handleView = async (doc) => {
    try {
      const response = await api.get(`/api/documents/${doc.id}/view`);
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      } else {
        setConfirmationDialog({
          isOpen: true,
          title: 'Error',
          message: 'Document file not available',
          type: 'warning',
          onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
          confirmText: 'OK',
          cancelText: '',
        });
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      setConfirmationDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to view document. Please try again.',
        type: 'danger',
        onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
        confirmText: 'OK',
        cancelText: '',
      });
    }
  };

  const handleDownload = async (doc) => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Download Document',
      message: `Are you sure you want to download "${doc.name}"?`,
      type: 'info',
      onConfirm: async () => {
        try {
          setConfirmationDialog(prev => ({ ...prev, isLoading: true }));
          setUploading({ ...uploading, [doc.id]: 'downloading' });
          
          // Fetch document file from API
          const response = await api.get(`/api/documents/${doc.id}/download`, {
            responseType: 'blob',
          });
          
          // Create blob URL and trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${doc.name}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          
          setConfirmationDialog({
            isOpen: true,
            title: 'Success',
            message: `"${doc.name}" has been downloaded successfully!`,
            type: 'success',
            onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            cancelText: '',
            isLoading: false,
          });
        } catch (error) {
          console.error('Error downloading document:', error);
          setConfirmationDialog({
            isOpen: true,
            title: 'Error',
            message: 'Failed to download document. Please try again.',
            type: 'danger',
            onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            cancelText: '',
            isLoading: false,
          });
        } finally {
          setUploading({ ...uploading, [doc.id]: null });
        }
      },
      confirmText: 'Download',
      cancelText: 'Cancel',
      isLoading: false,
    });
  };

  const handleFileSelect = async (doc, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setConfirmationDialog({
        isOpen: true,
        title: 'Invalid File Type',
        message: 'Please upload PDF, JPG, or PNG files only.',
        type: 'warning',
        onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
        confirmText: 'OK',
        cancelText: '',
      });
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setConfirmationDialog({
        isOpen: true,
        title: 'File Too Large',
        message: 'File size exceeds 10MB limit. Please upload a smaller file.',
        type: 'warning',
        onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
        confirmText: 'OK',
        cancelText: '',
      });
      return;
    }

    // Show confirmation dialog before uploading
    setConfirmationDialog({
      isOpen: true,
      title: 'Upload Document',
      message: `Are you sure you want to upload "${file.name}" for "${doc.name}"?`,
      type: 'info',
      onConfirm: async () => {
        await performUpload(doc, file);
      },
      confirmText: 'Upload',
      cancelText: 'Cancel',
      isLoading: false,
    });
  };

  const performUpload = async (doc, file) => {
    try {
      setConfirmationDialog(prev => ({ ...prev, isLoading: true }));
      setUploading({ ...uploading, [doc.id]: 'uploading' });
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentId', doc.id);
      formData.append('documentName', doc.name);

      // Upload document
      const uploadResponse = await uploadDocument(formData);
      
      // Update document status
      await updateDocument(doc.id, {
        status: 'Pending',
        uploadDate: new Date().toISOString().split('T')[0],
      });

      // Update local state
      setDocuments(prevDocs =>
        prevDocs.map(d =>
          d.id === doc.id
            ? {
                ...d,
                status: 'Pending',
                uploadDate: `Uploaded ${new Date().toISOString().split('T')[0]}`,
              }
            : d
        )
      );

      setConfirmationDialog({
        isOpen: true,
        title: 'Success',
        message: `Document "${doc.name}" has been uploaded successfully! It is now pending review.`,
        type: 'success',
        onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
        confirmText: 'OK',
        cancelText: '',
        isLoading: false,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      setError(`Failed to upload ${doc.name}. Please try again.`);
      setConfirmationDialog({
        isOpen: true,
        title: 'Upload Failed',
        message: `Failed to upload "${doc.name}". ${error.response?.data?.message || error.message || 'Please try again.'}`,
        type: 'danger',
        onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
        confirmText: 'OK',
        cancelText: '',
        isLoading: false,
      });
    } finally {
      setUploading({ ...uploading, [doc.id]: null });
      // Reset file input
      if (fileInputRefs.current[doc.id]) {
        fileInputRefs.current[doc.id].value = '';
      }
    }

  };

  const handleUpload = (doc) => {
    // Trigger file input click
    if (!fileInputRefs.current[doc.id]) {
      fileInputRefs.current[doc.id] = document.createElement('input');
      fileInputRefs.current[doc.id].type = 'file';
      fileInputRefs.current[doc.id].accept = '.pdf,.jpg,.jpeg,.png';
      fileInputRefs.current[doc.id].style.display = 'none';
      fileInputRefs.current[doc.id].onchange = (e) => handleFileSelect(doc, e);
      document.body.appendChild(fileInputRefs.current[doc.id]);
    }
    fileInputRefs.current[doc.id].click();
  };

  const handleDelete = async (doc) => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Delete Document',
      message: `Are you sure you want to delete "${doc.name}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          setConfirmationDialog(prev => ({ ...prev, isLoading: true }));
          setUploading({ ...uploading, [doc.id]: 'deleting' });
          
          // Delete document from API
          await api.delete(`/api/documents/${doc.id}`);

          // Update local state
          setDocuments(prevDocs =>
            prevDocs.map(d =>
              d.id === doc.id
                ? {
                    ...d,
                    status: 'Required',
                    uploadDate: null,
                  }
                : d
            )
          );

          setConfirmationDialog({
            isOpen: true,
            title: 'Success',
            message: `"${doc.name}" has been deleted successfully!`,
            type: 'success',
            onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            cancelText: '',
            isLoading: false,
          });
        } catch (error) {
          console.error('Error deleting document:', error);
          setConfirmationDialog({
            isOpen: true,
            title: 'Error',
            message: `Failed to delete document. ${error.response?.data?.message || error.message || 'Please try again.'}`,
            type: 'danger',
            onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            cancelText: '',
            isLoading: false,
          });
        } finally {
          setUploading({ ...uploading, [doc.id]: null });
        }
      },
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isLoading: false,
    });
  };

  const handleReupload = (doc) => {
    handleUpload(doc);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app-accent p-6">
      <div className="w-full mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/client/overview')}
          className="mb-6 flex items-center gap-2 text-app-primary hover:text-app-secondary transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Progress Bar (full width) */}
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-app-primary">Document Completion</span>
            <span className="text-sm font-medium text-app-primary">25%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-app-secondary h-2 rounded-full transition-all" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-app-primary mb-6">Document Management</h1>

        {/* Status Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg border-2 border-app-secondary shadow-sm">
          <StatusCard title="Total Documents" count={statusCounts.total} color="white" />
          <StatusCard title="Approved" count={statusCounts.approved} color="green" />
          <StatusCard title="Pending Review" count={statusCounts.pendingReview} color="yellow" />
          <StatusCard title="Rejected" count={statusCounts.rejected} color="pink" />
          <StatusCard title="Missing" count={statusCounts.missing} color="white" />
        </div>

        {/* Document List Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              REQUIRED DOCUMENTS FOR STUDENT - STUDY VISA
            </h2>
          </div>

          {/* Documents */}
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleView}
                onDownload={handleDownload}
                onUpload={handleUpload}
                onDelete={handleDelete}
                onReupload={handleReupload}
                uploading={uploading}
              />
            ))}
          </div>

          {/* File Format Notice */}
          <div className="mt-6 p-4 bg-app-accent border border-gray-200 rounded-lg">
            <p className="text-sm text-app-primary">
              <strong>Accepted formats:</strong> PDF, JPG, PNG (Max 10MB per file)
            </p>
            <p className="text-sm text-[#6b6b6b] mt-1">
              All documents will be reviewed by the team. Please make sure all text is clearly visible.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm || (() => setConfirmationDialog(prev => ({ ...prev, isOpen: false })))}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        type={confirmationDialog.type}
        confirmText={confirmationDialog.confirmText || 'Confirm'}
        cancelText={confirmationDialog.cancelText || 'Cancel'}
        isLoading={confirmationDialog.isLoading}
      />
    </div>
  );
};

export default DocumentManagement;
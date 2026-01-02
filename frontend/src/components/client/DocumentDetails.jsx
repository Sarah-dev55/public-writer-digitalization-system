import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Upload, Trash2, RefreshCw, CheckCircle, Circle } from 'lucide-react';
import { uploadDocument, updateDocument, listDocumentsByUser, deleteDocument } from '../../services/documentService';
import { getChecklistByUser } from '../../services/clientChecklistService';
import api from '../../services/api';
import ConfirmationDialog from '../common/ConfirmationDialog';
import useAuth from '../../hooks/useAuth';

// Status Badge Component (palette aligned with overview/header)
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'Approved': return 'bg-[#eaf4ea] text-app-primary border-[#cfe5cf]';
      case 'Required': return 'bg-[#fff1f0] text-[#9b2c2c] border-[#ffd6d9]';
      case 'Rejected': return 'bg-[#ffecec] text-[#7a1f1f] border-[#ffd6d6]';
      case 'Pending': return 'bg-[#fff9e6] text-[#7a5a1f] border-[#fff1b3]';
      case 'Needs Correction': return 'bg-orange-50 text-orange-800 border-orange-200';
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
  // Map backend fields to component expectation
  const { _id, name, status: docStatus, uploadedAt, rejectionReason } = document;
  const id = _id;
  
  // Normalize status to Title Case for UI consistency if it comes lowercase from backend
  // Normalize status to Title Case for UI consistency
  const status = docStatus 
    ? docStatus.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
    : 'Pending';
    
  const displayDate = uploadedAt 
    ? new Date(uploadedAt).toLocaleDateString() 
    : null;
  
  const getStatusIcon = () => {
    if (status === 'Approved') return '✓';
    if (status === 'Rejected') return '○';
    if (status === 'Needs Correction') return '⚠';
    if (status === 'Required' || status === 'Missing') return '○';
    return '○';
  };

  const getCardStyles = () => {
    if (status === 'Approved') return 'border-2 border-[#1E4D3D] bg-[#DADCC8]';
    if (status === 'Rejected') return 'border-2 border-[#bf4b4b] bg-[#fff1f1]';
    if (status === 'Pending') return 'border-2 border-[#d4b94a] bg-[#fffbe6]';
    if (status === 'Needs Correction') return 'border-2 border-orange-400 bg-orange-50';
    return 'border-2 border-gray-300 bg-transparent';
  };

  return (
    <div className={`p-4 rounded-lg ${getCardStyles()} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-lg font-medium text-app-primary">{getStatusIcon()}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium text-app-primary">{name}</span>
              <StatusBadge status={status} />
            </div>
            {displayDate && (
              <div className="text-sm text-gray-500">
                {status === 'Approved' ? 'Approved' : 'Uploaded'} | {displayDate}
              </div>
            )}
            {status === 'Missing' && (
              <div className="text-sm text-gray-500">Missing</div>
            )}
            {status === 'Rejected' && rejectionReason && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <strong>Rejection Reason:</strong> {rejectionReason}
              </div>
            )}
            {status === 'Needs Correction' && statusNotes && (
              <div className="mt-2 text-sm text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                <strong>Corrections Needed:</strong> {statusNotes}
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
          {status === 'Needs Correction' && (
            <button 
              onClick={() => onReupload(document)}
              disabled={uploading[document.id] === 'uploading'}
              className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading[document.id] === 'uploading' ? 'Uploading...' : 'Fix & Upload'}
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

// Checklist Item Card Component - shows each checklist item with upload capability
const ChecklistItemCard = ({ item, document: doc, onUpload, onView, onDownload, onDelete, onReupload, uploading, userId }) => {
  const fileInputRef = useRef(null);
  const itemId = item._id || item.itemId;
  const hasDocument = !!doc;
  const status = doc?.status || null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
    e.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getCardStyles = () => {
    if (hasDocument && status === 'approved') return 'border-2 border-[#1E4D3D] bg-[#DADCC8]';
    if (hasDocument && status === 'rejected') return 'border-2 border-[#bf4b4b] bg-[#fff1f1]';
    if (hasDocument && status === 'pending') return 'border-2 border-[#d4b94a] bg-[#fffbe6]';
    if (hasDocument && status === 'needs_correction') return 'border-2 border-orange-400 bg-orange-50';
    return 'border-2 border-gray-300 bg-white';
  };

  return (
    <div className={`p-4 rounded-lg ${getCardStyles()} transition-all hover:shadow-md`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {hasDocument ? (
            <CheckCircle className="w-5 h-5 text-app-primary mt-0.5" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium text-app-primary">{item.label}</span>
              {item.required && (
                <span className="text-xs text-red-600 font-medium">Required</span>
              )}
              {hasDocument && (
                <StatusBadge status={status ? status.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : 'Pending'} />
              )}
            </div>
            {hasDocument && doc.uploadedAt && (
              <div className="text-sm text-gray-500">
                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
              </div>
            )}
            {hasDocument && (doc.statusNotes || doc.rejectionReason) && (status === 'rejected' || status === 'needs_correction') && (
              <div className={`mt-2 text-sm p-2 rounded border ${status === 'rejected' ? 'text-red-600 bg-red-50 border-red-200' : 'text-orange-700 bg-orange-50 border-orange-200'}`}>
                <strong>{status === 'rejected' ? 'Rejection Reason:' : 'Corrections Needed:'}</strong> {doc.statusNotes || doc.rejectionReason}
              </div>
            )}
            {!hasDocument && (
              <div className="text-sm text-gray-500">No document uploaded yet</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {hasDocument && (status === 'approved' || status === 'pending' || status === 'needs_correction') && (
            <>
              <button
                onClick={() => onView(doc)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4 text-app-primary" />
              </button>
              <button
                onClick={() => onDownload(doc)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-app-primary" />
              </button>
            </>
          )}
          {hasDocument && (status === 'pending' || status === 'needs_correction') && (
            <>
              <button
                onClick={() => onReupload(doc)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Replace"
              >
                <RefreshCw className="w-4 h-4 text-app-primary" />
              </button>
              <button
                onClick={() => onDelete(doc)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </>
          )}
          {hasDocument && status === 'rejected' && (
            <button
              onClick={triggerFileInput}
              disabled={uploading[itemId] === 'uploading'}
              className="px-4 py-2 bg-app-primary text-app-text-light text-sm rounded-lg hover:bg-app-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {uploading[itemId] === 'uploading' ? 'Uploading...' : 'Re-Upload'}
            </button>
          )}
          {!hasDocument && (
            <button
              onClick={triggerFileInput}
              disabled={uploading[itemId] === 'uploading'}
              className="px-4 py-2 bg-app-primary text-app-text-light text-sm rounded-lg hover:bg-app-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {uploading[itemId] === 'uploading' ? 'Uploading...' : 'Upload'}
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
      case 'orange': return 'bg-orange-50 border-orange-200';
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
  const { user } = useAuth();
  const userId = (user && (user._id || user.id)) || null;
  
  const [documents, setDocuments] = useState([]);
  const [checklist, setChecklist] = useState(null);
  const [checklistLoading, setChecklistLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch documents and checklist on mount (after auth)
  useEffect(() => {
    if (!userId) return;
    fetchDocuments();
    fetchChecklist();
  }, [userId]);

  const fetchChecklist = async () => {
    try {
      setChecklistLoading(true);
      const data = await getChecklistByUser(userId);
      setChecklist(data || null);
    } catch (error) {
      console.error('Error fetching checklist:', error);
      setChecklist(null);
    } finally {
      setChecklistLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await listDocumentsByUser(userId);
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setConfirmationDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to load documents. Please refresh the page.',
        type: 'danger',
        onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
        confirmText: 'OK',
        cancelText: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const checklistItems = checklist?.items || [];
  const totalChecklistItems = checklistItems.length;
  const missingChecklistItems = checklistItems.filter(item => {
    if (item.isCompleted) return false;
    
    const itemId = item._id || item.itemId;
    const hasMatchedDoc = documents.some(
      (d) => d.checklistItemId === itemId || d.name === item.label
    );
    
    return !hasMatchedDoc;
  }).length;
  const statusCounts = {
    total: totalChecklistItems,
    approved: documents.filter(d => d.status === 'approved').length,
    pendingReview: documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    needsCorrection: documents.filter(d => d.status === 'needs_correction').length,
    missing: documents.filter(d => d.status === 'missing').length + missingChecklistItems
  };

  
  const completionPercentage = totalChecklistItems > 0 
    ? Math.round((statusCounts.approved / totalChecklistItems) * 100) 
    : 0;

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

  // Handle upload for a checklist item
  const handleChecklistUpload = async (item, file) => {
    const itemId = item._id || item.itemId;

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
    const maxSize = 10 * 1024 * 1024;
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

    // Confirm upload
    setConfirmationDialog({
      isOpen: true,
      title: 'Upload Document',
      message: `Upload "${file.name}" for "${item.label}"?`,
      type: 'info',
      onConfirm: async () => {
        try {
          setConfirmationDialog(prev => ({ ...prev, isLoading: true }));
          setUploading(prev => ({ ...prev, [itemId]: 'uploading' }));

          const formData = new FormData();
          formData.append('file', file);
          formData.append('documentName', item.label);
          formData.append('userId', userId);
          formData.append('checklistItemId', itemId);

          await uploadDocument(formData);
          await fetchDocuments();

          setConfirmationDialog({
            isOpen: true,
            title: 'Success',
            message: `Document "${item.label}" has been uploaded successfully!`,
            type: 'success',
            onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            cancelText: '',
            isLoading: false,
          });
        } catch (err) {
          console.error('Error uploading document:', err);
          setConfirmationDialog({
            isOpen: true,
            title: 'Upload Failed',
            message: err.response?.data?.message || err.message || 'Please try again.',
            type: 'danger',
            onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            cancelText: '',
            isLoading: false,
          });
        } finally {
          setUploading(prev => ({ ...prev, [itemId]: null }));
        }
      },
      confirmText: 'Upload',
      cancelText: 'Cancel',
      isLoading: false,
    });
  };

  const handleView = async (doc) => {
    try {
      const response = await api.get(`/client/documents/${doc._id}/view`);
      if (response.data.url) {
        // Construct base URL by removing /api from the API base URL
        const baseUrl = api.defaults.baseURL.replace(/\/api$/, '');
        // Open document in new tab
        window.open(`${baseUrl}${response.data.url}`, '_blank');
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
          const response = await api.get(`/client/documents/${doc._id}/download`, {
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
      formData.append('documentId', doc._id || '');
      formData.append('documentName', doc.name);
      formData.append('userId', userId);

      // Upload document
      const uploadResponse = await uploadDocument(formData);
      
      // Refresh documents list
      await fetchDocuments();

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
          await deleteDocument(doc._id, userId);

          // Refresh documents list
          await fetchDocuments();

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
            <span className="text-sm font-medium text-app-primary">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-app-secondary h-2 rounded-full transition-all" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-app-primary mb-6">Document Management</h1>

        <div className="grid grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg border-2 border-app-secondary shadow-sm">
          <StatusCard title="Total" count={statusCounts.total} color="white" />
          <StatusCard title="Approved" count={statusCounts.approved} color="green" />
          <StatusCard title="Pending" count={statusCounts.pendingReview} color="yellow" />
          <StatusCard title="Action Needed" count={statusCounts.needsCorrection + statusCounts.rejected} color="pink" />
          <StatusCard title="Missing" count={statusCounts.missing} color="white" />
        </div>

        {/* Checklist-based Document Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {checklist?.title || 'REQUIRED DOCUMENTS'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload documents for each item in your checklist. The admin has set these requirements for you.
            </p>
          </div>

          {/* Checklist Items with Upload */}
          {checklistLoading && (
            <div className="text-gray-600 py-4">Loading your checklist...</div>
          )}

          {!checklistLoading && !checklist && (
            <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg bg-gray-50">
              <p>No checklist has been assigned to you yet.</p>
              <p className="text-sm mt-1">Please contact the admin to set up your document requirements.</p>
            </div>
          )}

          {!checklistLoading && checklist && checklist.items && checklist.items.length === 0 && (
            <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg bg-gray-50">
              <p>Your checklist is empty.</p>
              <p className="text-sm mt-1">Please contact the admin to add document requirements.</p>
            </div>
          )}

          {!checklistLoading && checklist && checklist.items && checklist.items.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {checklist.items.map((item) => {
                // Find if there's a document uploaded for this checklist item
                const itemId = item._id || item.itemId;
                const matchedDoc = documents.find(
                  (d) => d.checklistItemId === itemId || d.name === item.label
                );

                return (
                  <ChecklistItemCard
                    key={itemId}
                    item={item}
                    document={matchedDoc}
                    onUpload={(file) => handleChecklistUpload(item, file)}
                    onView={handleView}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onReupload={handleReupload}
                    uploading={uploading}
                    userId={userId}
                  />
                );
              })}
            </div>
          )}

          {/* Separator */}
          {documents.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">ALL UPLOADED DOCUMENTS</h3>
              <div className="grid grid-cols-1 gap-4">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc._id || doc.id}
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
            </>
          )}

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
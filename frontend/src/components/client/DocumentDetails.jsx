import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Upload, Trash2, RefreshCw } from 'lucide-react';

// Status Badge Component (palette aligned with overview/header)
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'Approved': return 'bg-[#eaf4ea] text-[#2d4a3e] border-[#cfe5cf]';
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
const DocumentCard = ({ document, onView, onDownload, onUpload, onDelete, onReupload }) => {
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
          <span className="text-lg font-medium text-[#2d4a3e]">{getStatusIcon()}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium text-[#2d4a3e]">{id}. {name}</span>
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
                <Eye className="w-4 h-4 text-[#2d4a3e]" />
              </button>
              <button 
                onClick={() => onDownload(document)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-[#2d4a3e]" />
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
                <Eye className="w-4 h-4 text-[#2d4a3e]" />
              </button>
              <button 
                onClick={() => onDownload(document)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-[#2d4a3e]" />
              </button>
              <button 
                onClick={() => onReupload(document)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Replace"
              >
                <RefreshCw className="w-4 h-4 text-[#2d4a3e]" />
              </button>
              <button 
                onClick={() => onDelete(document)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </>
          )}
          {status === 'Rejected' && (
            <button 
              onClick={() => onReupload(document)}
              className="px-4 py-2 bg-[#588157] text-white text-sm rounded-lg hover:bg-[#4a6a56] transition-colors font-medium"
            >
              Re-Upload
            </button>
          )}
          {(status === 'Required' || status === 'Missing') && (
            <button 
              onClick={() => onUpload(document)}
              className="px-4 py-2 bg-[#588157] text-white text-sm rounded-lg hover:bg-[#4a6a56] transition-colors font-medium"
            >
              Upload
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
      <div className="text-sm text-[#2d4a3e] mb-1">{title}</div>
      <div className="text-2xl font-semibold text-[#2d4a3e]">{count}</div>
    </div>
  );
};

// Main Document Management Component
const DocumentManagement = () => {
  const [documents] = useState([
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

  const handleView = (doc) => {
    console.log('View document:', doc);
    alert(`Viewing: ${doc.name}`);
  };

  const handleDownload = (doc) => {
    console.log('Download document:', doc);
    alert(`Downloading: ${doc.name}`);
  };

  const handleUpload = (doc) => {
    console.log('Upload document:', doc);
    alert(`Upload dialog for: ${doc.name}`);
  };

  const handleDelete = (doc) => {
    console.log('Delete document:', doc);
    if (confirm(`Are you sure you want to delete ${doc.name}?`)) {
      alert(`Deleted: ${doc.name}`);
    }
  };

  const handleReupload = (doc) => {
    console.log('Re-upload document:', doc);
    alert(`Re-upload dialog for: ${doc.name}`);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2ECDE] p-6">
      <div className="w-full mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/client/overview')}
          className="mb-6 flex items-center gap-2 text-[#2d4a3e] hover:text-[#5a7a66] transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Progress Bar (full width) */}
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#2d4a3e]">Document Completion</span>
            <span className="text-sm font-medium text-[#2d4a3e]">25%</span>
          </div>
          <div className="w-full bg-[#e9e3d6] rounded-full h-2">
            <div className="bg-[#588157] h-2 rounded-full transition-all" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-[#2d4a3e] mb-6">Document Management</h1>

        {/* Status Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg border-2 border-[#588157] shadow-sm">
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
              />
            ))}
          </div>

          {/* File Format Notice */}
          <div className="mt-6 p-4 bg-[#f5f5dc] border border-[#e9e3d6] rounded-lg">
            <p className="text-sm text-[#2d4a3e]">
              <strong>Accepted formats:</strong> PDF, JPG, PNG (Max 10MB per file)
            </p>
            <p className="text-sm text-[#6b6b6b] mt-1">
              All documents will be reviewed by the team. Please make sure all text is clearly visible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
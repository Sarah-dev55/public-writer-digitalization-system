import React from 'react';

export default function PendingDocuments({ documents = [], onReview = () => {}, onAccept = () => {}, onReject = () => {} }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Pending Documents</h2>
        <button className="text-sm text-[#31493d] hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5"/></svg>
            </div>
            <p>No pending documents</p>
          </div>
        ) : (
          documents.map((document) => (
            <div key={document._id || document.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="#ef4444"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{document.fileName || document.title} - {document.clientName || (document.userId && (document.userId.fullName || document.userId))}</p>
                <p className="text-sm text-gray-500">Submitted: {document.uploadedAt || document.submittedDate || document.createdAt || ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onReview(document)} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="#374151"><path d="M15 12H9" strokeWidth="1.5"/><path d="M12 15V9" strokeWidth="1.5"/></svg>
                  Review
                </button>
                <button onClick={() => onReject(document)} className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5"/></svg>
                  Reject
                </button>
                <button onClick={() => onAccept(document)} className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M20 6L9 17l-5-5" strokeWidth="1.5"/></svg>
                  Accept
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React from 'react';

export default function DocumentReviewModal({ document: doc = null, onClose = () => {}, onAccept = () => {}, onReject = () => {} }) {
  if (!doc) return null;

  const handleDownload = () => {
    try {
      const link = window.document.createElement('a');
      link.href = doc.fileUrl || '#';
      link.download = `${doc.title}-${doc.clientName}.png`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/50 p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">Document Review</h2>
            <p className="text-sm text-gray-500 mt-1">{doc.title} - {doc.clientName}</p>
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
              <div className="text-gray-500">No preview available</div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700"><span className="text-gray-900">Submitted:</span> {doc.submittedDate}</p>
            <p className="text-sm text-gray-700 mt-1"><span className="text-gray-900">Client:</span> {doc.clientName}</p>
            <p className="text-sm text-gray-700 mt-1"><span className="text-gray-900">Type:</span> {doc.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#374151"><path d="M12 3v12" strokeWidth="1.5"/><path d="M8 11l4 4 4-4" strokeWidth="1.5"/><path d="M21 21H3" strokeWidth="1.5"/></svg>
            <span>Download</span>
          </button>
          <button onClick={onReject} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5"/></svg>
            <span>Reject</span>
          </button>
          <button onClick={onAccept} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M20 6L9 17l-5-5" strokeWidth="1.5"/></svg>
            <span>Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
}

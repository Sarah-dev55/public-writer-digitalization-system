import React from 'react';

export default function DocumentsList({ documents = [], onUpload, onDownload, onView, onUploadNew }) {
  // Default sample data if none provided
  const defaultDocuments = [
    {
      id: 1,
      name: 'Passport Copy',
      status: 'required',
      updatedAt: '2025-11-17',
      uploaded: true,
      reviewStatus: 'approved',
    },
    {
      id: 2,
      name: 'Academic Transcripts',
      status: 'required',
      updatedAt: '2025-11-17',
      uploaded: true,
      reviewStatus: 'approved',
    },
    {
      id: 3,
      name: 'Motivation Letter',
      status: 'required',
      updatedAt: '2025-11-19',
      uploaded: true,
      reviewStatus: 'under-review',
    },
    {
      id: 4,
      name: 'Financial Proof',
      status: 'required',
      updatedAt: null,
      uploaded: false,
      reviewStatus: 'missing',
    },
    {
      id: 5,
      name: 'Language Certificate',
      status: 'required',
      updatedAt: null,
      uploaded: false,
      reviewStatus: 'missing',
    },
  ];

  const displayDocuments = documents.length > 0 ? documents : defaultDocuments;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#2d4a3e]">My Documents</h2>
      </div>
      
      <div className="space-y-4 mb-6">
        {displayDocuments.map((document) => (
          <div
            key={document.id}
            className="bg-[#f5f5dc] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[#2d4a3e]">{document.name}</h3>
                  <span className="px-3 py-1 bg-[#A65F00]/20 text-[#A65F00] rounded-full text-xs font-semibold">
                    {document.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  {document.uploaded ? (
                    <span>Uploaded on {document.updatedAt}</span>
                  ) : (
                    <span className="text-[#880F0F]">Not uploaded</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {document.uploaded ? (
                  <>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        document.reviewStatus === 'approved'
                          ? 'bg-[#5a7a66] text-white'
                          : document.reviewStatus === 'under-review'
                          ? 'bg-[#A65F00] text-white'
                          : 'bg-[#880F0F] text-white'
                      }`}
                    >
                      {document.reviewStatus === 'approved'
                        ? 'Approved'
                        : document.reviewStatus === 'under-review'
                        ? 'Under Review'
                        : 'Missing'}
                    </button>
                    <button
                      onClick={() => onView && onView(document.id)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      View
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-4 py-2 bg-[#880F0F] text-white rounded-lg text-sm font-semibold"
                    >
                      Missing
                    </button>
                    <button
                      onClick={() => onUpload && onUpload(document.id)}
                      className="px-4 py-2 bg-[#5a7a66] hover:bg-[#4a6a56] text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Upload
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onUploadNew}
          className="bg-[#5a7a66] hover:bg-[#4a6a56] text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Upload New Document
        </button>
      </div>
    </div>
  );
}


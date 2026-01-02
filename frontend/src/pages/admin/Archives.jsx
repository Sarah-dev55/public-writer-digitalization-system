import React, { useEffect, useMemo, useState } from 'react';
import { getAllDocuments } from '../../services/adminDocumentService';
import { getAllUsers } from '../../services/adminUserService';

// Date formatting helper
function fmtDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function safeLower(v) {
  return (v ?? '').toString().toLowerCase();
}

// Admin archives - searchable list of all uploaded documents
export default function AdminArchives() {
  const [docs, setDocs] = useState([]);
  const [usersById, setUsersById] = useState({}); // User lookup map
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [searchField, setSearchField] = useState('all'); // Search scope: all, docName, fileName, userName

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Load all documents and users on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [docRes, userRes] = await Promise.all([
          getAllDocuments(),
          getAllUsers(),
        ]);

        // The service functions return the response body directly (usually an array)
        const docData = Array.isArray(docRes) ? docRes : (Array.isArray(docRes?.data) ? docRes.data : []);
        const users = Array.isArray(userRes) ? userRes : (Array.isArray(userRes?.data) ? userRes.data : []);
        const map = users.reduce((acc, u) => {
          if (u?._id) acc[u._id] = u;
          return acc;
        }, {});

        if (!cancelled) {
          setDocs(docData);
          setUsersById(map);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e?.message || 'Failed to load archives');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter documents based on search query and selected field
  const rows = useMemo(() => {
    const enriched = docs.map((d) => {
      const uploader = usersById[d.userId];
      return {
        ...d,
        uploaderName: uploader?.fullName || 'Unknown user',
        uploaderEmail: uploader?.email || '',
      };
    });

    const q = safeLower(query).trim();
    if (!q) return enriched;

    return enriched.filter((d) => {
      const docName = safeLower(d.name);
      const fileName = safeLower(d.fileName);
      const userName = safeLower(d.uploaderName);

      if (searchField === 'docName') return docName.includes(q);
      if (searchField === 'fileName') return fileName.includes(q);
      if (searchField === 'userName') return userName.includes(q);
      // all
      return docName.includes(q) || fileName.includes(q) || userName.includes(q);
    });
  }, [docs, usersById, query, searchField]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Admin Archives</h2>
          <p className="text-gray-700">All documents uploaded by all users.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
            aria-label="Search field"
          >
            <option value="all">Search: All</option>
            <option value="docName">Search: Document name</option>
            <option value="fileName">Search: File name</option>
            <option value="userName">Search: User name</option>
          </select>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search…"
            className="border rounded px-3 py-2 text-sm w-full sm:w-72"
          />
        </div>
      </div>

      <div className="mt-4">
        {loading && (
          <div className="text-gray-700">Loading documents…</div>
        )}

        {!loading && error && (
          <div className="border border-red-200 bg-red-50 text-red-800 rounded p-3">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="text-sm text-gray-600 mb-2">
              Showing <span className="font-semibold">{rows.length}</span> of{' '}
              <span className="font-semibold">{docs.length}</span> documents
            </div>

            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold">Document</th>
                    <th className="text-left px-3 py-2 font-semibold">File</th>
                    <th className="text-left px-3 py-2 font-semibold">Uploaded by</th>
                    <th className="text-left px-3 py-2 font-semibold">Uploaded at</th>
                    <th className="text-left px-3 py-2 font-semibold">Status</th>
                    <th className="text-right px-3 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d) => {
                    const downloadUrl = `${API_BASE}/admin/documents/${d._id}/download`;
                    return (
                      <tr key={d._id} className="border-t">
                        <td className="px-3 py-2">
                          <div className="font-medium">{d.name || '—'}</div>
                          {d.type ? (
                            <div className="text-gray-500">{d.type}</div>
                          ) : null}
                        </td>
                        <td className="px-3 py-2">
                          <div className="break-all">{d.fileName || '—'}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-medium">{d.uploaderName}</div>
                          {d.uploaderEmail ? (
                            <div className="text-gray-500">{d.uploaderEmail}</div>
                          ) : null}
                        </td>
                        <td className="px-3 py-2">{fmtDate(d.uploadedAt || d.createdAt)}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center px-2 py-1 rounded border text-xs">
                            {d.status || '—'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          {d._id ? (
                            <a
                              href={downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center px-3 py-1.5 rounded bg-black text-white text-xs hover:opacity-90"
                            >
                              Download
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {rows.length === 0 && (
                    <tr>
                      <td className="px-3 py-6 text-center text-gray-600" colSpan={6}>
                        No documents match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

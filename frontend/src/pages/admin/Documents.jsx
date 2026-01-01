import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getAllDocuments } from '../../services/adminDocumentService';
import { getAllUsers } from '../../services/adminUserService';
import { searchArchives } from '../../services/adminArchiveService';

function fmtDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function safeLower(v) {
  return (v ?? '').toString().toLowerCase();
}

export default function AdminDocuments() {
  const [tab, setTab] = useState('documents'); // documents | archives

  const [docs, setDocs] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [searchField, setSearchField] = useState('all'); // all | docName | fileName | userName

  // Archives search state
  const [archLoading, setArchLoading] = useState(false);
  const [archError, setArchError] = useState('');
  const [archQuery, setArchQuery] = useState('');
  const [archCaseType, setArchCaseType] = useState('');
  const [archStatus, setArchStatus] = useState('');
  const [archStartDate, setArchStartDate] = useState('');
  const [archEndDate, setArchEndDate] = useState('');
  const [archResults, setArchResults] = useState([]);
  const archDebounce = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [docRes, userRes] = await Promise.all([getAllDocuments(), getAllUsers()]);

        const docData = Array.isArray(docRes)
          ? docRes
          : (Array.isArray(docRes?.data) ? docRes.data : []);

        const users = Array.isArray(userRes)
          ? userRes
          : (Array.isArray(userRes?.data) ? userRes.data : []);

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
          setError(e?.response?.data?.message || e?.message || 'Failed to load documents');
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

  // Debounced archive search
  useEffect(() => {
    if (tab !== 'archives') return;

    if (archDebounce.current) clearTimeout(archDebounce.current);
    archDebounce.current = setTimeout(async () => {
      setArchLoading(true);
      setArchError('');
      try {
        const params = {};
        if (archQuery.trim()) params.query = archQuery.trim();
        if (archCaseType.trim()) params.caseType = archCaseType.trim();
        if (archStatus.trim()) params.status = archStatus.trim();
        if (archStartDate) params.startDate = archStartDate;
        if (archEndDate) params.endDate = archEndDate;

        const res = await searchArchives(params);
        const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        setArchResults(data);
      } catch (e) {
        setArchError(e?.response?.data?.message || e?.message || 'Failed to search archives');
      } finally {
        setArchLoading(false);
      }
    }, 350);

    return () => {
      if (archDebounce.current) clearTimeout(archDebounce.current);
    };
  }, [tab, archQuery, archCaseType, archStatus, archStartDate, archEndDate]);

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
      return docName.includes(q) || fileName.includes(q) || userName.includes(q);
    });
  }, [docs, usersById, query, searchField]);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [query, searchField, docs.length]);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  function Chip({ children }) {
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-gray-700 bg-white">
        {children}
      </span>
    );
  }

  function Button({ children, onClick, variant = 'primary', disabled }) {
    const base =
      'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
    const styles =
      variant === 'ghost'
        ? 'border bg-white hover:bg-gray-50 text-gray-900'
        : variant === 'danger'
          ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
          : 'bg-black text-white hover:opacity-90 focus:ring-black';
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${styles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    );
  }

  function TabButton({ value, label }) {
    const active = tab === value;
    return (
      <button
        type="button"
        onClick={() => setTab(value)}
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
          active ? 'bg-black text-white' : 'bg-white text-gray-800 border hover:bg-gray-50'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Documents & Archives</h2>
              <p className="text-gray-600 mt-1">
                Review uploads, and search the client archives by document name, file name, user, or case type.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Chip>{docs.length} total documents</Chip>
                <Chip>{rows.length} match current search</Chip>
              </div>
            </div>

            <div className="flex gap-2">
              <TabButton value="documents" label="All Documents" />
              <TabButton value="archives" label="Archive Search" />
            </div>
          </div>
        </div>

        {tab === 'documents' ? (
          <div className="mt-6 rounded-2xl border bg-white shadow-sm">
            <div className="p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-semibold text-gray-900">All uploaded documents</div>
                <div className="text-sm text-gray-600">Search by document, file, or uploader.</div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                  aria-label="Search field"
                >
                  <option value="all">All fields</option>
                  <option value="docName">Document name</option>
                  <option value="fileName">File name</option>
                  <option value="userName">Uploader</option>
                </select>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="border rounded-lg px-3 py-2 text-sm w-full sm:w-80"
                />
              </div>
            </div>

            <div className="px-5 pb-5">
              {loading && <div className="text-gray-700">Loading documents…</div>}

              {!loading && error && (
                <div className="border border-red-200 bg-red-50 text-red-800 rounded-xl p-4">{error}</div>
              )}

              {!loading && !error && (
                <>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{pagedRows.length}</span> of{' '}
                      <span className="font-semibold">{rows.length}</span> matching documents
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                        Prev
                      </Button>
                      <Chip>
                        Page {page} / {totalPages}
                      </Chip>
                      <Button
                        variant="ghost"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-auto border rounded-xl">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold">Document</th>
                          <th className="text-left px-4 py-3 font-semibold">File</th>
                          <th className="text-left px-4 py-3 font-semibold">Uploader</th>
                          <th className="text-left px-4 py-3 font-semibold">Uploaded</th>
                          <th className="text-left px-4 py-3 font-semibold">Status</th>
                          <th className="text-right px-4 py-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedRows.map((d, idx) => {
                          const downloadUrl = `${API_BASE}/admin/documents/${d._id}/download`;
                          return (
                            <tr key={d._id} className={`border-t ${idx % 2 ? 'bg-white' : 'bg-gray-50/40'}`}>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-gray-900">{d.name || '—'}</div>
                                {d.type ? <div className="text-gray-500 text-xs mt-0.5">{d.type}</div> : null}
                              </td>
                              <td className="px-4 py-3">
                                <div className="break-all text-gray-800">{d.fileName || '—'}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-gray-900">{d.uploaderName}</div>
                                {d.uploaderEmail ? <div className="text-gray-500 text-xs">{d.uploaderEmail}</div> : null}
                              </td>
                              <td className="px-4 py-3 text-gray-700">{fmtDate(d.uploadedAt || d.createdAt)}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs bg-white">
                                  {d.status || d.reviewStatus || '—'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {d._id ? (
                                  <a
                                    href={downloadUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center rounded-lg bg-black text-white px-3 py-2 text-xs font-semibold hover:opacity-90"
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
                            <td className="px-4 py-10 text-center text-gray-600" colSpan={6}>
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
        ) : (
          <div className="mt-6 rounded-2xl border bg-white shadow-sm">
            <div className="p-5 border-b">
              <div className="font-semibold text-gray-900">Archive search</div>
              <div className="text-sm text-gray-600">
                Search archived files by document name, file name, uploader, or case type.
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                <input
                  value={archQuery}
                  onChange={(e) => setArchQuery(e.target.value)}
                  placeholder="Search (doc/file/user)…"
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={archCaseType}
                  onChange={(e) => setArchCaseType(e.target.value)}
                  placeholder="Case type (optional)"
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  value={archStatus}
                  onChange={(e) => setArchStatus(e.target.value)}
                  placeholder="Status (optional)"
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={archStartDate}
                  onChange={(e) => setArchStartDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={archEndDate}
                  onChange={(e) => setArchEndDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setArchQuery('');
                    setArchCaseType('');
                    setArchStatus('');
                    setArchStartDate('');
                    setArchEndDate('');
                  }}
                >
                  Clear filters
                </Button>
                <Chip>{archLoading ? 'Searching…' : `${archResults.length} result(s)`}</Chip>
              </div>
            </div>

            <div className="p-5">
              {archError ? (
                <div className="border border-red-200 bg-red-50 text-red-800 rounded-xl p-4">{archError}</div>
              ) : null}

              {!archError && archLoading ? (
                <div className="text-gray-700">Searching archives…</div>
              ) : null}

              {!archLoading && !archError && (
                <div className="grid grid-cols-1 gap-4">
                  {archResults.map((a) => (
                    <ArchiveCard key={a._id} archive={a} apiBase={API_BASE} />
                  ))}

                  {archResults.length === 0 && (
                    <div className="text-center text-gray-600 py-12">
                      No archive results. Try searching by a document name, file name, uploader name, or case type.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArchiveCard({ archive, apiBase }) {
  const [open, setOpen] = useState(false);

  const caseHistory = Array.isArray(archive.caseHistory) ? archive.caseHistory : [];
  const docs = caseHistory.flatMap((c) => (Array.isArray(c.documents) ? c.documents : [])).filter(Boolean);

  const clientLabel = archive.clientName || archive?.client?.fullName || 'Client';
  const clientEmail = archive.clientEmail || archive?.client?.email || '';

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="p-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-lg font-bold text-gray-900">{clientLabel}</div>
          {clientEmail ? <div className="text-sm text-gray-600">{clientEmail}</div> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs bg-white">
              {caseHistory.length} case(s)
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs bg-white">
              {docs.length} document(s)
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            {open ? 'Hide details' : 'View details'}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t px-5 py-4">
          <div className="space-y-4">
            {caseHistory.map((c, idx) => {
              const documents = Array.isArray(c.documents) ? c.documents : [];
              return (
                <div key={c._id || idx} className="rounded-xl border bg-gray-50/40 p-4">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="font-semibold text-gray-900">
                      {c.caseType || 'Case'}
                      {c.status ? <span className="ml-2 text-xs text-gray-600">• {c.status}</span> : null}
                    </div>
                    <div className="text-xs text-gray-600">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</div>
                  </div>
                  {c.description ? <div className="mt-2 text-sm text-gray-700">{c.description}</div> : null}

                  {documents.length ? (
                    <div className="mt-3 overflow-auto rounded-lg border bg-white">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-3 py-2 font-semibold">Document</th>
                            <th className="text-left px-3 py-2 font-semibold">File</th>
                            <th className="text-right px-3 py-2 font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.map((d) => {
                            const docId = d?._id || d?.id;
                            const downloadUrl = docId ? `${apiBase}/admin/documents/${docId}/download` : null;
                            return (
                              <tr key={docId || `${idx}-${d.fileName}`} className="border-t">
                                <td className="px-3 py-2">
                                  <div className="font-medium text-gray-900">{d.name || '—'}</div>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="break-all text-gray-700">{d.fileName || '—'}</div>
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {downloadUrl ? (
                                    <a
                                      className="inline-flex items-center justify-center rounded-lg bg-black text-white px-3 py-2 text-xs font-semibold hover:opacity-90"
                                      href={downloadUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Download
                                    </a>
                                  ) : (
                                    <span className="text-gray-500">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-gray-600">No documents attached to this case.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

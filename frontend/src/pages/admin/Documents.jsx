import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAllDocuments, downloadDocument } from '../../services/adminDocumentService';
import { getAllUsers } from '../../services/adminUserService';
import { searchArchives } from '../../services/adminArchiveService';
import DocumentStatusModal from '../../components/admin/DocumentStatusModal';

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

// Admin documents page - review uploads and search archives
export default function AdminDocuments() {
	const [tab, setTab] = useState('documents'); // Active tab: documents or archives

	const [docs, setDocs] = useState([]);
	const [usersById, setUsersById] = useState({}); // User lookup map
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const [query, setQuery] = useState('');
	const [searchField, setSearchField] = useState('all');
	const [downloadingId, setDownloadingId] = useState(null);
	const [selectedDoc, setSelectedDoc] = useState(null);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const pageSize = 10;
	const [page, setPage] = useState(1);

	// Archive search state
	const [archLoading, setArchLoading] = useState(false);
	const [archError, setArchError] = useState('');
	const [archQuery, setArchQuery] = useState('');
	const [archCaseType, setArchCaseType] = useState('');
	const [archStatus, setArchStatus] = useState('');
	const [archStartDate, setArchStartDate] = useState('');
	const [archEndDate, setArchEndDate] = useState('');
	const [archResults, setArchResults] = useState([]);

	const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError('');
			try {
				const [docRes, userRes] = await Promise.all([getAllDocuments(), getAllUsers()]);

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
			} catch (err) {
				console.error('Error loading documents', err);
				if (!cancelled) setError('Unable to load documents right now.');
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	const handleDownload = async (docId, fileName) => {
		try {
			setDownloadingId(docId);
			await downloadDocument(docId, fileName);
		} catch (error) {
			console.error('Download failed:', error);
			alert('Failed to download document. Please try again.');
		} finally {
			setDownloadingId(null);
		}
	};

	const handleOpenStatusModal = (docId) => {
		const doc = docs.find((d) => (d._id || d.id) === docId);
		if (doc) {
			setSelectedDoc(doc);
			setShowStatusModal(true);
		}
	};

	const handleStatusUpdated = (updatedDoc) => {
		setDocs((prev) =>
			prev.map((d) => ((d._id || d.id) === (updatedDoc._id || updatedDoc.id) ? updatedDoc : d))
		);
		setShowStatusModal(false);
		setSelectedDoc(null);
	};

	const rows = useMemo(() => {
		const q = safeLower(query);

		return docs
			.map((doc) => {
				const docNameRaw = doc.documentName || doc.documentType || doc.name || doc.title || 'Untitled';
				const fileNameRaw = doc.fileName || doc.filename || doc.originalname || doc.originalName || '—';
				const createdAt = doc.createdAt || doc.uploadedAt || doc.date;

				const user = usersById[doc.user] || usersById[doc.userId] || usersById[doc.ownerId];
				const userLabel = [user?.fullname || user?.fullName || '', user?.firstname || user?.firstName || '', user?.lastname || user?.lastName || '']
					.join(' ')
					.trim();

				const userName = userLabel || user?.email || 'Unknown';

				const downloadUrl = doc.fileUrl || doc.url || (doc._id ? `${API_BASE}/admin/documents/${doc._id}/download` : null);

				return {
					id: doc._id || doc.id || fileNameRaw,
					docId: doc._id || doc.id,
					displayName: docNameRaw,
					displayFile: fileNameRaw,
					userName,
					rawUserName: safeLower(userLabel),
					createdAt,
					createdAt,
					status: doc.status || 'pending',
					downloadUrl,
					rawDoc: doc,
				};
			})
			.filter((row) => {
				if (!q) return true;
				if (searchField === 'docName') return safeLower(row.displayName).includes(q);
				if (searchField === 'fileName') return safeLower(row.displayFile).includes(q);
				if (searchField === 'userName') return row.rawUserName.includes(q);
				return safeLower(row.displayName).includes(q) || safeLower(row.displayFile).includes(q) || row.rawUserName.includes(q);
			});
	}, [docs, usersById, query, searchField, API_BASE]);

	useEffect(() => setPage(1), [query, searchField, docs.length]);

	const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
	const pagedRows = useMemo(() => {
		const start = (page - 1) * pageSize;
		return rows.slice(start, start + pageSize);
	}, [rows, page]);

	async function handleArchiveSearch() {
		setArchLoading(true);
		setArchError('');
		try {
			const params = {};
			if (archQuery) params.query = archQuery;
			if (archCaseType) params.caseType = archCaseType;
			if (archStatus) params.status = archStatus;
			if (archStartDate) params.startDate = archStartDate;
			if (archEndDate) params.endDate = archEndDate;

			const res = await searchArchives(params);
			const results = Array.isArray(res?.results) ? res.results : Array.isArray(res) ? res : [];
			setArchResults(results);
		} catch (err) {
			console.error('Archive search failed', err);
			setArchError('Unable to search the archive.');
		} finally {
			setArchLoading(false);
		}
	}

	function Chip({ children }) {
		return (
			<span className="inline-flex items-center rounded-full border border-app-primary/20 px-2.5 py-1 text-xs text-app-primary bg-app-accent/50">
				{children}
			</span>
		);
	}

	function Button({ children, onClick, variant = 'primary', disabled }) {
		const base =
			'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
		const styles =
			variant === 'ghost'
				? 'border border-app-primary/20 bg-white hover:bg-app-accent/30 text-app-primary'
				: variant === 'danger'
					? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
					: 'bg-app-primary text-white hover:bg-app-secondary focus:ring-app-primary';
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
					active ? 'bg-app-primary text-white' : 'bg-white text-app-primary border border-app-primary/20 hover:bg-app-accent/30'
				}`}
			>
				{label}
			</button>
		);
	}

	return (
		<AdminLayout>
			<div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
				<div className="rounded-lg border border-app-primary/10 bg-white p-6 shadow-md space-y-4">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div>
							<h1 className="text-3xl font-extrabold tracking-tight text-app-primary">Documents</h1>
							<p className="text-app-primary/70">Review uploads or search the archive by client, case, or status.</p>
						</div>
						<div className="flex gap-2">
							<TabButton value="documents" label="All Documents" />
							<TabButton value="archives" label="Archive Search" />
						</div>
					</div>
					<div className="flex flex-wrap gap-2">
						<Chip>{docs.length} total documents</Chip>
						<Chip>{rows.length} match current search</Chip>
					</div>
				</div>

				{tab === 'documents' ? (
					<div className="rounded-2xl border bg-white shadow-sm">
						<div className="p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
							<div>
								<div className="font-semibold text-app-primary">All uploaded documents</div>
								<div className="text-sm text-app-primary/70">Search by document, file, or uploader.</div>
							</div>

							<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
								<select
									value={searchField}
									onChange={(e) => setSearchField(e.target.value)}
									className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-app-primary/50"
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
									className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-app-primary/50"
								/>
							</div>
						</div>

						<div className="px-5 pb-5 space-y-4">
							{loading && <div className="text-app-primary/70">Loading documents…</div>}

							{!loading && error && (
								<div className="border border-red-200 bg-red-50 text-red-800 rounded-xl p-4">{error}</div>
							)}

							{!loading && !error && rows.length === 0 && (
								<div className="border border-dashed border-app-primary/20 rounded-xl p-6 text-center text-app-primary/70 bg-app-accent/30">
									No documents match this search yet.
								</div>
							)}

							{!loading && !error && rows.length > 0 && (
								<div className="overflow-x-auto">
									<table className="min-w-full text-sm">
										<thead>
											<tr className="text-left text-app-primary border-b border-app-primary/10 bg-app-accent/40">
												<th className="py-3 pr-4 font-semibold">Document</th>
												<th className="py-3 pr-4 font-semibold">File</th>
												<th className="py-3 pr-4 font-semibold">Uploader</th>
												<th className="py-3 pr-4 font-semibold">Uploaded</th>
												<th className="py-3 pr-4 font-semibold text-center">Status</th>
												<th className="py-3 pr-4 font-semibold text-right">Actions</th>
											</tr>
										</thead>
										<tbody>
											{pagedRows.map((row) => (
											<tr key={row.id} className="border-b border-app-primary/10 last:border-0 hover:bg-app-accent/30 transition-colors">
												<td className="py-3 pr-4 font-semibold text-app-primary">{row.displayName}</td>
												<td className="py-3 pr-4 text-app-primary/80">{row.displayFile}</td>
												<td className="py-3 pr-4 text-app-primary/80">{row.userName}</td>
												<td className="py-3 pr-4 text-app-primary/70">{fmtDate(row.createdAt)}</td>
													<td className="py-3 pr-4 text-center">
														<span
															className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																row.status === 'approved'
																	? 'bg-green-100 text-green-800'
																	: row.status === 'rejected'
																		? 'bg-red-100 text-red-800'
																		: 'bg-yellow-100 text-yellow-800'
															}`}
														>
															{row.status.charAt(0).toUpperCase() + row.status.slice(1)}
														</span>
													</td>
													<td className="py-3 pr-4 text-right">
														<div className="flex items-center justify-end gap-3">
															{row.docId ? (
																<>
																	<button
																		onClick={() => handleDownload(row.docId, row.displayFile)}
																		disabled={downloadingId === row.docId}
																	className="text-xs font-semibold text-app-secondary hover:text-app-primary transition-colors disabled:opacity-50"
																>
																	{downloadingId === row.docId ? '...' : 'Download'}
																</button>
																<button
																	onClick={() => handleOpenStatusModal(row.docId)}
																	className="text-xs font-semibold text-app-secondary hover:text-app-primary transition-colors"
																	>
																		Update
																	</button>
																</>
															) : (
																<span className="text-app-primary/40">—</span>
															)}
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}

							{!loading && !error && rows.length > 0 && (
								<div className="flex items-center justify-between text-sm text-app-primary/70 pt-2">
									<div>
										Showing {pagedRows.length} of {rows.length} documents
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											onClick={() => setPage((p) => Math.max(1, p - 1))}
											disabled={page === 1}
										>
											Prev
										</Button>
										<span className="text-app-primary">
											Page {page} of {totalPages}
										</span>
										<Button
											variant="ghost"
											onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
											disabled={page === totalPages}
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="rounded-lg border border-app-primary/10 bg-white shadow-md">
						<div className="p-5 space-y-4">
							<div>
								<div className="font-semibold text-app-primary">Search client archives</div>
								<div className="text-sm text-app-primary/70">Filter by query, case type, status, or date range.</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<input
									value={archQuery}
									onChange={(e) => setArchQuery(e.target.value)}
									placeholder="Search text"
									className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/50"
								/>
								<input
									value={archCaseType}
									onChange={(e) => setArchCaseType(e.target.value)}
									placeholder="Case type"
									className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/50"
								/>
								<input
									value={archStatus}
									onChange={(e) => setArchStatus(e.target.value)}
									placeholder="Status"
									className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/50"
								/>
								<div className="grid grid-cols-2 gap-2">
									<input
										type="date"
										value={archStartDate}
										onChange={(e) => setArchStartDate(e.target.value)}
										className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/50"
									/>
									<input
										type="date"
										value={archEndDate}
										onChange={(e) => setArchEndDate(e.target.value)}
										className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/50"
									/>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Button onClick={handleArchiveSearch} disabled={archLoading}>
									{archLoading ? 'Searching…' : 'Search archives'}
								</Button>
								{archError && <span className="text-sm text-red-700">{archError}</span>}
							</div>

							{archLoading && <div className="text-app-primary/70">Searching…</div>}

							{!archLoading && archResults.length === 0 && !archError && (
								<div className="border border-dashed border-app-primary/20 rounded-xl p-6 text-center text-app-primary/70 bg-app-accent/30">
									No archive results yet. Try adjusting your filters.
								</div>
							)}

							{!archLoading && archResults.length > 0 && (
								<div className="space-y-3">
									{archResults.map((item) => (
									<div key={item._id || item.id} className="border border-app-primary/10 rounded-xl p-4 flex flex-col gap-1 bg-white hover:bg-app-accent/20 transition-colors">
										<div className="font-semibold text-app-primary">{item.title || item.caseTitle || 'Archive item'}</div>
										<div className="text-sm text-app-primary/70">
												{item.caseType && <span className="mr-2">Case: {item.caseType}</span>}
												{item.status && <span className="mr-2">Status: {item.status}</span>}
												{item.updatedAt && <span className="mr-2">Updated: {fmtDate(item.updatedAt)}</span>}
											</div>
										{item.summary && <div className="text-sm text-app-primary/80">{item.summary}</div>}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{showStatusModal && selectedDoc && (
				<DocumentStatusModal
					document={selectedDoc}
					onClose={() => setShowStatusModal(false)}
					onStatusUpdated={handleStatusUpdated}
				/>
			)}
		</AdminLayout>
	);
}

import React, { useEffect, useMemo, useState } from 'react';
import { deleteUser, getAllUsers, updateUser } from '../../services/adminUserService';

function fmtDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function safeLower(v) {
  return (v ?? '').toString().toLowerCase();
}

export default function AdminClients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const [editing, setEditing] = useState(null); // user object
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', role: '' });

  const pageSize = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getAllUsers();
        const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        if (!cancelled) setUsers(data);
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e?.message || 'Failed to load users');
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

  function openEdit(u) {
    setError('');
    setEditing(u);
    setForm({
      fullName: u.fullName || u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'public_writer',
    });
  }

  function closeEdit() {
    setEditing(null);
    setForm({ fullName: '', email: '', phone: '', role: '' });
  }

  async function onSave() {
    if (!editing?._id) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
      };
      const res = await updateUser(editing._id, payload);
      const updated = res?.data || res;
      setUsers((prev) => prev.map((u) => (u._id === editing._id ? { ...u, ...updated } : u)));
      closeEdit();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(u) {
    const id = u?._id;
    if (!id) return;
    const name = u.fullName || u.name || u.email || 'this user';
    const ok = window.confirm(`Delete ${name}? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete user');
    } finally {
      setDeletingId('');
    }
  }

  const rows = useMemo(() => {
    const q = safeLower(query).trim();
    if (!q) return users;
    return users.filter((u) => {
      const name = safeLower(u.fullName || u.name);
      const email = safeLower(u.email);
      const phone = safeLower(u.phone);
      const role = safeLower(u.role);
      return name.includes(q) || email.includes(q) || phone.includes(q) || role.includes(q);
    });
  }, [users, query]);

  useEffect(() => setPage(1), [query, users.length]);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Clients</h2>
              <p className="text-gray-600 mt-1">All accounts created in the database — edit details or remove accounts.</p>
              <div className="mt-4 inline-flex items-center rounded-full border px-2.5 py-1 text-xs bg-white text-gray-700">
                {users.length} total users
              </div>
            </div>

            <div className="w-full md:w-96">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, phone, role…"
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
              <div className="mt-2 text-xs text-gray-500">Tip: try “admin”, “public_writer”, or an email.</div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white shadow-sm">
          <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{pagedRows.length}</span> of{' '}
              <span className="font-semibold">{rows.length}</span> matching users
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs bg-white text-gray-700">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="px-5 pb-5">
            {loading && <div className="text-gray-700">Loading users…</div>}

            {!loading && error && (
              <div className="border border-red-200 bg-red-50 text-red-800 rounded-xl p-4">{error}</div>
            )}

            {!loading && !error && (
              <div className="overflow-auto rounded-xl border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Name</th>
                      <th className="text-left px-4 py-3 font-semibold">Email</th>
                      <th className="text-left px-4 py-3 font-semibold">Phone</th>
                      <th className="text-left px-4 py-3 font-semibold">Role</th>
                      <th className="text-left px-4 py-3 font-semibold">Created</th>
                      <th className="text-right px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((u, idx) => (
                      <tr
                        key={u._id || u.id || `${u.email}-${u.createdAt}`}
                        className={`border-t ${idx % 2 ? 'bg-white' : 'bg-gray-50/40'}`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">{u.fullName || u.name || '—'}</div>
                          {u._id ? <div className="text-gray-500 text-xs">{u._id}</div> : null}
                        </td>
                        <td className="px-4 py-3 text-gray-800">{u.email || '—'}</td>
                        <td className="px-4 py-3 text-gray-800">{u.phone || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs bg-white">
                            {u.role || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{fmtDate(u.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(u)}
                              className="rounded-lg border bg-white px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(u)}
                              disabled={deletingId === (u._id || '')}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === (u._id || '') ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td className="px-4 py-12 text-center text-gray-600" colSpan={6}>
                          No users match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
              <div className="p-5 border-b flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold">Edit client</div>
                  <div className="text-xs text-gray-500 break-all mt-1">{editing._id}</div>
                </div>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                  disabled={saving}
                >
                  ✕
                </button>
              </div>

              <div className="p-5 grid grid-cols-1 gap-3">
                <label className="text-sm">
                  <div className="text-gray-700 mb-1">Full name</div>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="border rounded-lg px-3 py-2 w-full"
                    placeholder="Full name"
                  />
                </label>

                <label className="text-sm">
                  <div className="text-gray-700 mb-1">Email</div>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="border rounded-lg px-3 py-2 w-full"
                    placeholder="Email"
                  />
                </label>

                <label className="text-sm">
                  <div className="text-gray-700 mb-1">Phone</div>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="border rounded-lg px-3 py-2 w-full"
                    placeholder="Phone"
                  />
                </label>

                <label className="text-sm">
                  <div className="text-gray-700 mb-1">Role</div>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="border rounded-lg px-3 py-2 w-full bg-white"
                  >
                    <option value="public_writer">public_writer</option>
                    <option value="admin">admin</option>
                    <option value="client">client</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-1">If you have other roles, you can still type them in later.</div>
                </label>
              </div>

              <div className="p-5 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  className="rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

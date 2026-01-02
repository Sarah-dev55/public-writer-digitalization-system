import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { deleteUser, getAllUsers, updateUser } from '../../services/adminUserService';
import { getChecklistByUser, createChecklist, updateChecklist, updateChecklistItem } from '../../services/adminChecklistService';

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

// Admin clients page - manage users, edit profiles, and handle checklists
export default function AdminClients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(''); // Search filter

  // Edit modal state
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', role: '', currentStats: 1 });

  // Checklist modal state
  const [checklistUser, setChecklistUser] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [checklistError, setChecklistError] = useState('');
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemRequired, setNewItemRequired] = useState(false);

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
      currentStats: u.currentStats || 1,
    });
  }

  function closeEdit() {
    setEditing(null);
    setForm({ fullName: '', email: '', phone: '', role: '', currentStats: 1 });
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
        currentStats: form.currentStats,
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

  async function openChecklist(u) {
    setChecklistUser(u);
    setChecklist(null);
    setChecklistError('');
    setChecklistLoading(true);
    setNewItemLabel('');
    setNewItemRequired(false);
    try {
      const res = await getChecklistByUser(u._id);
      const data = res?.data || res;
      setChecklist(data || null);
    } catch (e) {
      if (e?.response?.status === 404) {
        setChecklist(null);
      } else {
        setChecklistError(e?.response?.data?.message || e?.message || 'Failed to load checklist');
      }
    } finally {
      setChecklistLoading(false);
    }
  }

  function closeChecklist() {
    setChecklistUser(null);
    setChecklist(null);
    setChecklistError('');
    setNewItemLabel('');
    setNewItemRequired(false);
  }

  async function createNewChecklist() {
    if (!checklistUser?._id) return;
    setChecklistLoading(true);
    setChecklistError('');
    try {
      const res = await createChecklist({
        userId: checklistUser._id,
        title: `Checklist for ${checklistUser.fullName || checklistUser.email}`,
        items: [],
      });
      const data = res?.data || res;
      setChecklist(data);
    } catch (e) {
      setChecklistError(e?.response?.data?.message || e?.message || 'Failed to create checklist');
    } finally {
      setChecklistLoading(false);
    }
  }

  async function addChecklistItem() {
    if (!checklist?._id || !newItemLabel.trim()) return;
    setChecklistLoading(true);
    setChecklistError('');
    try {
      const newItem = {
        itemId: `item_${Date.now()}`,
        label: newItemLabel.trim(),
        required: newItemRequired,
        isCompleted: false,
      };
      const updatedItems = [...(checklist.items || []), newItem];
      const res = await updateChecklist(checklist._id, { items: updatedItems });
      const data = res?.data || res;
      setChecklist(data);
      setNewItemLabel('');
      setNewItemRequired(false);
    } catch (e) {
      setChecklistError(e?.response?.data?.message || e?.message || 'Failed to add item');
    } finally {
      setChecklistLoading(false);
    }
  }

  async function toggleItemComplete(item) {
    if (!checklist?._id) return;
    const itemId = item._id || item.itemId;
    try {
      const res = await updateChecklistItem(checklist._id, itemId, { isCompleted: !item.isCompleted });
      const data = res?.data || res;
      setChecklist(data);
    } catch (e) {
      setChecklistError(e?.response?.data?.message || e?.message || 'Failed to update item');
    }
  }

  async function removeChecklistItem(item) {
    if (!checklist?._id) return;
    const itemId = item._id || item.itemId;
    const updatedItems = (checklist.items || []).filter((i) => (i._id || i.itemId) !== itemId);
    try {
      const res = await updateChecklist(checklist._id, { items: updatedItems });
      const data = res?.data || res;
      setChecklist(data);
    } catch (e) {
      setChecklistError(e?.response?.data?.message || e?.message || 'Failed to remove item');
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

  function Chip({ children }) {
    return (
      <span className="inline-flex items-center rounded-full border border-app-primary/20 px-2.5 py-1 text-xs text-app-primary bg-app-accent/50">
        {children}
      </span>
    );
  }

  function Button({ children, onClick, variant = 'primary', disabled }) {
    const base =
      'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
    const styles =
      variant === 'ghost'
        ? 'border border-app-primary/20 bg-white hover:bg-app-accent/30 text-app-primary'
        : variant === 'danger'
          ? 'border border-red-200 bg-white text-red-700 hover:bg-red-50 focus:ring-red-600'
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

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-lg border border-app-primary/10 bg-white p-6 shadow-md space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-app-primary">Clients</h1>
              <p className="text-app-primary/70">All accounts in the system — search, edit, or remove.</p>
            </div>
            <div className="w-full md:w-96">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, phone, role…"
                className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-app-primary/50"
              />
              <div className="mt-2 text-xs text-app-primary/60">Try "admin", "public_writer", or an email.</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip>{users.length} total users</Chip>
            <Chip>{rows.length} match current search</Chip>
          </div>
        </div>

        <div className="rounded-lg border border-app-primary/10 bg-white shadow-md">
          <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-app-primary/70">
              Showing <span className="font-semibold text-app-primary">{pagedRows.length}</span> of{' '}
              <span className="font-semibold text-app-primary">{rows.length}</span> matching users
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Prev
              </Button>
              <span className="inline-flex items-center rounded-full border border-app-primary/20 px-2.5 py-1 text-xs bg-app-accent/50 text-app-primary">
                Page {page} / {totalPages}
              </span>
              <Button variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                Next
              </Button>
            </div>
          </div>

          <div className="px-5 pb-5">
            {loading && <div className="text-app-primary/70">Loading users…</div>}

            {!loading && error && (
              <div className="border border-red-200 bg-red-50 text-red-800 rounded-xl p-4">{error}</div>
            )}

            {!loading && !error && (
              <div className="overflow-auto rounded-xl border border-app-primary/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-app-accent/40 sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-app-primary">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-app-primary">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-app-primary">Phone</th>
                      <th className="text-left px-4 py-3 font-semibold text-app-primary">Role</th>
                      <th className="text-left px-4 py-3 font-semibold text-app-primary">Created</th>
                      <th className="text-right px-4 py-3 font-semibold text-app-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((u, idx) => (
                      <tr
                        key={u._id || u.id || `${u.email}-${u.createdAt}`}
                        className={`border-t border-app-primary/10 hover:bg-app-accent/30 transition-colors ${idx % 2 ? 'bg-white' : 'bg-app-accent/20'}`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-app-primary">{u.fullName || u.name || '—'}</div>
                          {u._id ? <div className="text-app-primary/50 text-xs">{u._id}</div> : null}
                        </td>
                        <td className="px-4 py-3 text-app-primary/80">{u.email || '—'}</td>
                        <td className="px-4 py-3 text-app-primary/80">{u.phone || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full border border-app-primary/20 px-2.5 py-1 text-xs bg-app-accent/50 text-app-primary">
                            {u.role || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-app-primary/70">{fmtDate(u.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <Button variant="ghost" onClick={() => openChecklist(u)}>Checklist</Button>
                            <Button variant="ghost" onClick={() => openEdit(u)}>Edit</Button>
                            <Button
                              variant="danger"
                              onClick={() => onDelete(u)}
                              disabled={deletingId === (u._id || '')}
                            >
                              {deletingId === (u._id || '') ? 'Deleting…' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td className="px-4 py-12 text-center text-app-primary/60" colSpan={6}>
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

        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
              <div className="p-5 border-b flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-app-primary">Edit client</div>
                  <div className="text-xs text-app-primary/60 break-all mt-1">{editing._id}</div>
                </div>
                <Button variant="ghost" onClick={closeEdit} disabled={saving}>
                  ✕
                </Button>
              </div>

              <div className="p-5 grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto">
                <label className="text-sm">
                  <div className="text-app-primary/80 mb-1">Full name</div>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="border border-app-primary/20 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-app-primary/50"
                    placeholder="Full name"
                  />
                </label>

                <label className="text-sm">
                  <div className="text-app-primary/80 mb-1">Email</div>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="border border-app-primary/20 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-app-primary/50"
                    placeholder="Email"
                  />
                </label>

                <label className="text-sm">
                  <div className="text-app-primary/80 mb-1">Phone</div>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="border border-app-primary/20 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-app-primary/50"
                    placeholder="Phone"
                  />
                </label>

                <label className="text-sm">
                  <div className="text-app-primary/80 mb-1">Role</div>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="border border-app-primary/20 rounded-lg px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-app-primary/50"
                  >
                    <option value="public_writer">public_writer</option>
                    <option value="admin">admin</option>
                    <option value="client">client</option>
                  </select>
                  <div className="text-xs text-app-primary/60 mt-1">If you have other roles, you can still type them in later.</div>
                </label>

                <label className="text-sm">
                  <div className="text-app-primary/80 mb-1">Status</div>
                  <select
                    value={form.currentStats}
                    onChange={(e) => setForm((f) => ({ ...f, currentStats: parseInt(e.target.value) }))}
                    className="border border-app-primary/20 rounded-lg px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-app-primary/50"
                  >
                    <option value={1}>Step 1 - Initial Consultation</option>
                    <option value={2}>Step 2 - Document Collection</option>
                    <option value={3}>Step 3 - Document Review</option>
                    <option value={4}>Step 4 - Document Preparation</option>
                    <option value={5}>Step 5 - Complete</option>
                  </select>
                  <div className="text-xs text-app-primary/60 mt-1">Current status in the digitalization process</div>
                </label>
              </div>

              <div className="p-5 border-t flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={closeEdit} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={onSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {checklistUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-app-primary">Checklist</div>
                  <div className="text-sm text-app-primary/70 mt-1">
                    {checklistUser.fullName || checklistUser.email}
                  </div>
                </div>
                <Button variant="ghost" onClick={closeChecklist}>
                  ✕
                </Button>
              </div>

              <div className="p-5 flex-1 overflow-auto space-y-4">
                {checklistLoading && <div className="text-app-primary/70">Loading…</div>}

                {checklistError && (
                  <div className="border border-red-200 bg-red-50 text-red-800 rounded-xl p-3 text-sm">
                    {checklistError}
                  </div>
                )}

                {!checklistLoading && !checklist && (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-app-primary/70">No checklist exists for this user yet.</p>
                    <Button onClick={createNewChecklist}>Create Checklist</Button>
                  </div>
                )}

                {!checklistLoading && checklist && (
                  <>
                    <div className="text-sm text-app-primary font-medium">
                      {checklist.title || 'Checklist'}
                    </div>

                    {(!checklist.items || checklist.items.length === 0) && (
                      <div className="text-app-primary/60 text-sm border border-dashed border-app-primary/20 rounded-lg p-4 text-center">
                        No items yet. Add one below.
                      </div>
                    )}

                    <div className="space-y-2">
                      {(checklist.items || []).map((item) => (
                        <div
                          key={item._id || item.itemId}
                          className="flex items-center gap-3 p-3 border border-app-primary/10 rounded-lg bg-app-accent/30"
                        >
                          <input
                            type="checkbox"
                            checked={item.isCompleted || false}
                            onChange={() => toggleItemComplete(item)}
                            className="w-4 h-4 accent-black"
                          />
                          <div className="flex-1">
                            <span className={item.isCompleted ? 'line-through text-app-primary/50' : 'text-app-primary'}>
                              {item.label}
                            </span>
                            {item.required && (
                              <span className="ml-2 text-xs text-red-600">Required</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeChecklistItem(item)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="text-sm font-medium text-app-primary">Add new item</div>
                      <div className="flex gap-2">
                        <input
                          value={newItemLabel}
                          onChange={(e) => setNewItemLabel(e.target.value)}
                          placeholder="Item label…"
                          className="border border-app-primary/20 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-app-primary/50"
                        />
                        <label className="flex items-center gap-1 text-sm text-app-primary/80">
                          <input
                            type="checkbox"
                            checked={newItemRequired}
                            onChange={(e) => setNewItemRequired(e.target.checked)}
                            className="w-4 h-4"
                          />
                          Required
                        </label>
                      </div>
                      <Button onClick={addChecklistItem} disabled={!newItemLabel.trim()}>
                        Add Item
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

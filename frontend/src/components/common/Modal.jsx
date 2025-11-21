import React from 'react';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-lg w-full">
        <button className="float-right text-gray-600" onClick={onClose}>✕</button>
        <div className="clear-both">{children}</div>
      </div>
    </div>
  );
}

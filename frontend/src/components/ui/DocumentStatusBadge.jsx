import React from 'react';

export default function DocumentStatusBadge({ status = 'pending', size = 'md' }) {
  const statusConfig = {
    pending: { 
      label: 'Pending Review', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⏳'
    },
    accepted: { 
      label: 'Accepted', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '✓'
    },
    rejected: { 
      label: 'Rejected', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '✗'
    },
    needs_correction: { 
      label: 'Needs Correction', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: '⚠'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium border ${config.color} ${sizeClasses[size]}`}>
      <span className="opacity-80">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

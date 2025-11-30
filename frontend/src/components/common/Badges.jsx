import React from 'react';

/**
 * cn utility - Combines classes
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Reusable Badge Component - Status Indicators
 * 
 * Props:
 * - children: Badge text
 * - variant: 'success' | 'warning' | 'danger' | 'info' | 'default'
 * - size: 'sm' | 'md' | 'lg'
 * - rounded: boolean - makes badge fully rounded (pill shape)
 * - className: Additional custom classes
 */

function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
  ...props
}) {
  
  // Base styles for all badges
  const baseStyles = 'inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-200';
  
  // Variant styles - different status types
  const variants = {
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-blue-100 text-blue-700 border border-blue-200',
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    confirmed: 'bg-green-100 text-green-700 border border-green-200',
    completed: 'bg-blue-100 text-blue-700 border border-blue-200',
    cancelled: 'bg-red-100 text-red-700 border border-red-200'
  };
  
  // Size styles
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2'
  };
  
  // Rounded style
  const roundedStyle = rounded ? 'rounded-full' : 'rounded-md';
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        roundedStyle,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Badge with Dot Indicator
 */
function BadgeWithDot({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  
  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    default: 'bg-gray-500',
    pending: 'bg-yellow-500',
    confirmed: 'bg-green-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500'
  };
  
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };
  
  return (
    <Badge variant={variant} size={size} className={className} {...props}>
      <span className={cn('rounded-full', dotColors[variant], dotSizes[size])} />
      {children}
    </Badge>
  );
}
export {Badge,BadgeWithDot};
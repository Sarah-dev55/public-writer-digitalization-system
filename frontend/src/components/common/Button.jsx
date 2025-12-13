import React from 'react';

/**
 * cn utility - Combines and merges Tailwind classes intelligently
 * This handles class conflicts and conditional classes
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Reusable Button Component (Updated with cn utility)
 * 
 * Props:
 * - children: Button text or content
 * - variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * - size: 'sm' | 'md' | 'lg'
 * - fullWidth: boolean - makes button full width
 * - icon: React element - icon to display
 * - iconPosition: 'left' | 'right' - icon position
 * - disabled: boolean
 * - onClick: function - click handler
 * - type: 'button' | 'submit'
 * - className: Additional custom classes
 */

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon = null,
  iconPosition = 'right',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props  // Capture any other props
}) {
  
  // Base styles - applied to all buttons
  const baseStyles = 'inline-flex items-center justify-center font-semibold uppercase tracking-wide rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles - different button types
  const variants = {
    primary: 'bg-app-primary text-app-text-light hover:bg-app-primary/90 focus:ring-app-primary',
    secondary: 'bg-app-secondary text-app-text-light hover:bg-app-secondary/90 focus:ring-app-secondary',
    outline: 'border-2 border-app-primary text-app-primary hover:bg-app-primary hover:text-app-text-light focus:ring-app-primary',
    ghost: 'text-app-primary hover:bg-app-accent/50 focus:ring-app-primary'
  };
  
  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-xs gap-2',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-3'
  };
  
  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}  // Spread any other props
    >
      {/* Icon on left */}
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      {/* Button text */}
      <span>{children}</span>
      
      {/* Icon on right */}
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
}

// Also export the Button component so you can use it in other files
export { Button };
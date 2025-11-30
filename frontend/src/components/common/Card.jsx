import React from 'react';

// Simple utility to combine class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Main Card Component
 */
function Card({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-white border border-gray-200',
    dark: 'bg-[#3d5a4a] text-white border-0',
    elevated: 'bg-white shadow-lg border-0',
    bordered: 'bg-white border-2 border-[#5a7a66]'
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Header - Top section of card
 */
function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn('px-6 pt-6', className)}
      {...props}
    />
  );
}

/**
 * Card Title - Main heading
 */
function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('text-xl font-bold leading-none', className)}
      {...props}
    />
  );
}

/**
 * Card Description - Subtitle text
 */
function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm text-gray-500 mt-2', className)}
      {...props}
    />
  );
}

/**
 * Card Content - Main body
 */
function CardContent({ className, ...props }) {
  return (
    <div
      className={cn('px-6 py-4', className)}
      {...props}
    />
  );
}

/**
 * Card Footer - Bottom section
 */
function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex items-center px-6 pb-6', className)}
      {...props}
    />
  );
}

/**
 * Card Action - Action buttons area (top-right)
 */
function CardAction({ className, ...props }) {
  return (
    <div
      className={cn('absolute top-4 right-4', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction
};
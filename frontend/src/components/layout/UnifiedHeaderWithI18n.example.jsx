/**
 * Example: How to integrate LanguageSwitcher into UnifiedHeader
 * 
 * This shows how to modify the UnifiedHeader component to include
 * the language switcher on the right side of the header.
 */

import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Enhanced version of UnifiedHeader with language switcher
 * Pass rightComponent={<LanguageSwitcher />} to enable it
 */
export default function UnifiedHeaderWithI18n({
  navItems = [],
  logoImage = '',
  logoOnClick = () => {},
  ctaButtonText = 'Sign In',
  ctaButtonOnClick = () => {},
  navClassName = '',
  showCtaButton = true,
  rightComponent = null,
}) {
  return (
    <header className={`flex items-center justify-between px-4 py-4 ${navClassName}`}>
      {/* Logo */}
      <div onClick={logoOnClick} className="cursor-pointer">
        {logoImage && <img src={logoImage} alt="Logo" className="h-10" />}
      </div>

      {/* Navigation Items */}
      <nav className="flex gap-6 items-center">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`font-medium text-sm ${
              item.active ? 'text-app-accent' : 'text-app-text'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Right Section: Language Switcher + CTA Button */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        {rightComponent && (
          <div className="flex items-center">
            {rightComponent}
          </div>
        )}

        {/* CTA Button */}
        {showCtaButton && (
          <button
            onClick={ctaButtonOnClick}
            className="px-4 py-2 bg-app-primary text-white rounded hover:bg-app-primary/90"
          >
            {ctaButtonText}
          </button>
        )}
      </div>
    </header>
  );
}

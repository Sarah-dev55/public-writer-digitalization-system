import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t py-6 mt-8">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">© {new Date().getFullYear()} Public Writer Management</div>
    </footer>
  );
}

import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white shadow py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">Public Writer Management</h1>
        <nav>
          <a className="mr-4 text-sm text-gray-700" href="/">Home</a>
          <a className="mr-4 text-sm text-gray-700" href="/login">Login</a>
        </nav>
      </div>
    </header>
  );
}

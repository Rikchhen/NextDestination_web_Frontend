// app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 text-white text-2xl font-bold border-b border-slate-700">
          AppAdmin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-slate-800 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-slate-800 hover:text-white transition">
            User Management
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700 text-sm">
          Logged in as: <span className="text-white">Admin</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-medium text-gray-700">Control Panel</h2>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-500 hover:text-red-500">Sign Out</button>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
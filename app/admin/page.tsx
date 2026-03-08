"use client";

import React, { useEffect, useState } from 'react';
import { AdminUser, deleteUser, editUser, getAllUsers } from '@/lib/api/admin';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // States for Editing
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editFormData, setEditFormData] = useState({ fullName: '', phoneNumber: '', email: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers || []);
      setError("");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // DELETE Logic
  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      const response = await deleteUser(userId);
      if (!response.success) throw new Error(response.message || "Delete failed");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Delete failed"));
    }
  };

  // EDIT Logic - Open Modal
  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName || user.name || '',
      phoneNumber: user.phoneNumber || '',
      email: user.email || '',
    });
  };

  // EDIT Logic - Submit Changes
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const payload = Object.fromEntries(
        Object.entries(editFormData).filter(([, value]) => String(value).trim() !== ''),
      );
      await editUser(editingUser._id, payload);
      alert("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Update failed"));
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Admin Data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 relative">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-slate-800 text-white">
          <h1 className="text-xl font-bold">User Management (Admin)</h1>
          <button onClick={fetchUsers} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded">Refresh</button>
        </div>

        {error && <div className="p-4 bg-red-100 text-red-600 text-sm">{error}</div>}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-6 py-4">{user.fullName || user.name || 'N/A'}</td>
                <td className="px-6 py-4">{user.phoneNumber}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 uppercase text-xs font-bold">
                  <span className={user.role === 'admin' ? 'text-purple-600' : 'text-blue-500'}>{user.role}</span>
                </td>
                <td className="px-6 py-4 flex justify-center gap-4">
                  <button onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-700 text-sm font-bold">Edit</button>
                  <button 
                    onClick={() => handleDelete(user._id)} 
                    className="text-red-500 hover:text-red-700 font-bold text-sm disabled:opacity-30"
                    disabled={user.role === 'admin'}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Edit User: {editingUser.email}</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border-b-2 border-gray-100 focus:border-slate-800 outline-none py-2 transition-all"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <input 
                  type="text" 
                  className="w-full border-b-2 border-gray-100 focus:border-slate-800 outline-none py-2 transition-all"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Email</label>
                <input 
                  type="email" 
                  className="w-full border-b-2 border-gray-100 focus:border-slate-800 outline-none py-2 transition-all"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                    type="button" 
                    onClick={() => setEditingUser(null)} 
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 font-bold"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900"
                >
                    Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

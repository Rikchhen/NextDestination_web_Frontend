// app/admin/page.tsx
"use client";

import axiosInstance from '@/lib/api/axios';
import { API } from '@/lib/api/endpoints';
import React, { useEffect, useState } from 'react';


export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch Users
const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.get(API.ADMIN.USERS)as any;
    
    // Check your console. If your backend sends { users: [...] }, use response.data.users
    console.log("Data Received:", response.data);
    
    const fetchedUsers = response.data.data || response.data.users || [];
    setUsers(fetchedUsers);
  } catch (err: any) {
    console.error("Fetch error details:", err.response?.data || err.message);
    setError(err.response?.data?.message || "Failed to load users");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Delete User
  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user permanently?")) return;

    try {
      const response = await axiosInstance.delete(API.ADMIN.USER_BY_ID(userId))as any;
      if (response.data.success) {
        // Remove from UI immediately using MongoDB _id
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Admin Data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-slate-800 text-white">
          <h1 className="text-xl font-bold">User Management (Admin)</h1>
          <button 
            onClick={fetchUsers}
            className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
          >
            Refresh
          </button>
        </div>

        {error && <div className="p-4 bg-red-100 text-red-600 text-sm">{error}</div>}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{user.fullName}</td>
                  <td className="px-6 py-4">{user.phoneNumber}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 text-sm font-semibold uppercase tracking-tight">
                    <span className={user.role === 'admin' ? 'text-purple-600' : 'text-blue-500'}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700 font-bold text-sm"
                      disabled={user.role === 'admin'} // Prevents deleting yourself
                    >
                      {user.role === 'admin' ? "" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">No users found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
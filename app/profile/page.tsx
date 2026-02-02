// app/profile/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '@/lib/api/axios';
import { API } from '@/lib/api/endpoints';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(API.USER.ME) as any;
      setUser(response.data.data || response.data.user);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Create FormData
    const formData = new FormData();
    // CRITICAL: This must match your uploads.single("profile-pictures")
    formData.append("profile-pictures", file); 

    try {
      setUploading(true);
      
      // 2. Use PATCH as defined in your userRouter
      const response = await axiosInstance.patch(API.USER.EDIT_ME, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })as any;

      if (response.data.success) {
        await fetchProfile(); // Reload data to get the new image filename
        alert("Profile picture updated!");
      }
    } catch (err: any) {
      console.error("Upload Error:", err.response?.data);
      alert(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  // Construction of the image URL based on your backend static folder logic
  const imageUrl = user.profilePicture
    ? `${SERVER_URL}/uploads/${user.profilePicture}` 
    : `https://ui-avatars.com/api/?name=${user.name}&background=D32F2F&color=fff`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Top Banner & Photo */}
        <div className="bg-[#D32F2F] pt-12 pb-20 px-6 text-center relative">
          <div className="relative inline-block group">
            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`w-32 h-32 rounded-full border-4 border-white overflow-hidden mx-auto shadow-lg cursor-pointer bg-gray-200 transition-all ${uploading ? 'opacity-50 animate-pulse' : 'hover:brightness-90'}`}
            >
              <img 
                src={imageUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold uppercase tracking-tighter">Change</span>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          
          <h1 className="text-white text-2xl font-bold mt-4">{user.name}</h1>
          <p className="text-white/70 text-sm">Account Settings</p>
        </div>

        {/* User Details */}
        <div className="px-8 pb-10 -mt-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <DetailItem label="Email" value={user.email} />
            <DetailItem label="Phone" value={user.phoneNumber || "Not Set"} />
            <DetailItem label="Role" value={user.role} isBadge />
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Helper Component
function DetailItem({ label, value, isBadge }: { label: string, value: string, isBadge?: boolean }) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      {isBadge ? (
        <span className="inline-block mt-1 px-3 py-1 bg-red-50 text-[#D32F2F] text-xs font-bold rounded-full uppercase">
          {value}
        </span>
      ) : (
        <p className="text-gray-800 font-medium mt-1">{value}</p>
      )}
    </div>
  );
}
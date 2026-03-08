"use client";

import React, { useEffect, useRef, useState } from "react";
import { deleteMyAccount, editMyProfile, getMyProfile, UserProfile } from "@/lib/api/user";
import { handleLogout } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SERVER_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchProfile = async () => {
    try {
      const profile = await getMyProfile();
      setUser(profile);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    }
  };

  useEffect(() => {
    void fetchProfile();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profile-pictures", file);

    try {
      setUploading(true);
      const updated = await editMyProfile(formData);
      setUser(updated);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete your account permanently?")) return;
    try {
      setDeleting(true);
      await deleteMyAccount();
      await handleLogout();
      router.push("/login");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  const imageUrl = user.profilePicture
    ? `${SERVER_URL}/uploads/${user.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=D32F2F&color=fff`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#D32F2F] pt-12 pb-20 px-6 text-center relative">
          <div className="relative inline-block group">
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`w-32 h-32 rounded-full border-4 border-white overflow-hidden mx-auto shadow-lg cursor-pointer bg-gray-200 ${uploading ? "opacity-50 animate-pulse" : "hover:brightness-90"}`}
            >
              <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <h1 className="text-white text-2xl font-bold mt-4">{user.fullName}</h1>
          <p className="text-white/70 text-sm">Account Settings</p>
        </div>

        <div className="px-8 pb-10 -mt-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <DetailItem label="Email" value={user.email} />
            <DetailItem label="Phone" value={user.phoneNumber || "Not Set"} />
            <DetailItem label="Role" value={user.role} isBadge />
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-5 w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  isBadge,
}: {
  label: string;
  value: string;
  isBadge?: boolean;
}) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </p>
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

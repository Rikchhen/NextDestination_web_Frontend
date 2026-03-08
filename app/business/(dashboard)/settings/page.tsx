"use client";

import React, { useEffect, useState } from "react";
import {
  editBusinessProfile,
  getBusinessProfile,
  uploadBusinessDocument,
  type BusinessProfile,
} from "@/lib/api/business";

export default function BusinessSettingsPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [form, setForm] = useState({
    businessName: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBusinessProfile();
      setProfile(data);
      setForm({
        businessName: data.businessName || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch business profile",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const onSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const result = await editBusinessProfile({
        businessName: form.businessName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
      });
      setProfile(result.business);
      setMessage(result.message || "Profile updated successfully");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const onUploadDocument = async (file?: File) => {
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      setMessage("");
      const result = await uploadBusinessDocument(file);
      if (!result.success) {
        throw new Error(result.message || "Document upload failed");
      }
      setMessage(result.message || "Document uploaded");
      await loadProfile();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Document upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="ml-72 min-h-screen bg-pink-50/30 p-8 text-gray-700">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage business profile and verification documents.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <section className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-900">Profile</p>

          <Field
            label="Business Name"
            value={form.businessName}
            onChange={(v) => setForm((prev) => ({ ...prev, businessName: v }))}
          />
          <Field
            label="Email"
            value={profile?.email || ""}
            disabled
            onChange={() => {}}
          />
          <Field
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(v) => setForm((prev) => ({ ...prev, phoneNumber: v }))}
          />
          <Field
            label="Address"
            value={form.address}
            onChange={(v) => setForm((prev) => ({ ...prev, address: v }))}
          />

          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-2xl bg-[#E13434] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </section>

        <section className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-900">Verification Status</p>
          <p className="text-sm text-gray-700">
            Status: <b>{profile?.businessStatus || "Pending"}</b>
          </p>
          {profile?.rejectionReason && (
            <p className="text-sm text-red-600">
              Rejection reason: {profile.rejectionReason}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Upload Business Document
            </label>
            <input
              type="file"
              onChange={(e) => void onUploadDocument(e.target.files?.[0])}
              className="text-sm"
            />
            {uploading && <p className="mt-2 text-xs text-gray-500">Uploading...</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none disabled:bg-gray-100"
      />
    </div>
  );
}

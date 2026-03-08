import React from "react";
import BusinessSidebar from "../_components/BusinessSidebar";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <BusinessSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

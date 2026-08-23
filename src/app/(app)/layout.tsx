"use client";

import Sidebar from "@/components/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import "../globals.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { checked } = useRequireAuth();

  // Avoids a flash of protected content before the redirect to /login
  // kicks in for someone who isn't authenticated.
  if (!checked) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="h-screen flex-1 overflow-y-auto px-8 py-6">
        {children}
      </main>
    </div>
  );
}
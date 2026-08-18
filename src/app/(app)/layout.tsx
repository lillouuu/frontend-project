import Sidebar from "@/components/Sidebar";
import "../globals.css";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="h-screen flex-1 overflow-y-auto px-8 py-6">
        {children}
      </main>
    </div>
  );
}
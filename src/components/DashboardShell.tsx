import { Sidebar } from "./Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      <Sidebar />
      <main className="ml-64 px-8 py-8">{children}</main>
    </div>
  );
}

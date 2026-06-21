import { Sidebar } from "./Sidebar";
import { MobileNavProvider, MobileTopBar } from "./MobileNav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileNavProvider>
      <div className="min-h-screen bg-[#EEEEEE]">
        <Sidebar />
        <div className="lg:ml-64">
          <MobileTopBar />
          <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  );
}

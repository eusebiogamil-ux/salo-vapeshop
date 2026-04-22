import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080d16" }}>
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      {/* Main content — extra bottom padding on mobile for bottom nav */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        <Outlet />
      </main>
      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  );
}

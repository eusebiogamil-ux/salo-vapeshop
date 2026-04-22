import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%)" }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

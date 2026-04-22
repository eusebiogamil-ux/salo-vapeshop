import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

function DashboardIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function ProductsIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V21H3V8"/><path d="M23 3H1L3 8H21L23 3Z"/><path d="M10 12H14"/></svg>;
}
function SalesIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1H5L7.68 14.39A2 2 0 0 0 9.64 16H19.4A2 2 0 0 0 21.36 14.39L23 6H6"/></svg>;
}
function ReportsIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
}

const links = [
  { to: "/", label: "Dashboard", Icon: DashboardIcon },
  { to: "/products", label: "Products", Icon: ProductsIcon },
  { to: "/sales", label: "Sales", Icon: SalesIcon },
  { to: "/reports", label: "Reports", Icon: ReportsIcon },
];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 flex flex-col border-r" style={{ background: "#0a0e1a", borderColor: "#1e293b" }}>
      <div className="px-5 py-5 border-b" style={{ borderColor: "#1e293b" }}>
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                isActive
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`
            }
            style={({ isActive }) => isActive ? { background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)" } : {}}
          >
            <l.Icon />
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t" style={{ borderColor: "#1e293b" }}>
        <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "#334155" }}>Salo Vapeshop · v1.0</p>
      </div>
    </aside>
  );
}

import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ProductsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8V21H3V8" /><path d="M23 3H1L3 8H21L23 3Z" /><path d="M10 12H14" />
    </svg>
  );
}
function SalesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1H5L7.68 14.39A2 2 0 0 0 9.64 16H19.4A2 2 0 0 0 21.36 14.39L23 6H6" />
    </svg>
  );
}
function ReportsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

const links = [
  { to: "/", label: "Dashboard", Icon: DashboardIcon },
  { to: "/products", label: "Products", Icon: ProductsIcon },
  { to: "/sales", label: "Sales", Icon: SalesIcon },
  { to: "/reports", label: "Reports", Icon: ReportsIcon },
];

export function Sidebar() {
  return (
    <aside className="w-58 shrink-0 bg-gray-950 border-r border-gray-800/60 flex flex-col" style={{ width: "220px" }}>
      <div className="px-5 py-5 border-b border-gray-800/60">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              }`
            }
          >
            <l.Icon />
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800/60">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Inventory System</p>
      </div>
    </aside>
  );
}

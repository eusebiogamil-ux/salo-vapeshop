import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/sales", label: "Sales", icon: "🛒" },
  { to: "/reports", label: "Reports", icon: "📈" },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-4 py-4 border-b border-gray-800">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

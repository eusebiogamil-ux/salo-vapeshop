import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/products", label: "Products", end: false },
  { to: "/sales", label: "Sales", end: false },
  { to: "/reports", label: "Reports", end: false },
];

export function Sidebar() {
  return (
    <aside className="w-48 shrink-0 flex flex-col bg-white border-r border-gray-200">
      <div className="px-4 py-4 border-b border-gray-100">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm transition-colors ${
                isActive ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products", end: false },
  { to: "/sales", label: "Sales", end: false },
  { to: "/reports", label: "Reports", end: false },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 flex bg-white border-t border-gray-200 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end}
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-[10px] font-semibold transition-colors ${isActive ? "text-gray-900" : "text-gray-400"}`
          }>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}

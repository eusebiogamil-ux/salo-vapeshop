import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/sales", label: "Sales", end: false },
  { to: "/purchases", label: "Purchases", end: false },
  { to: "/products", label: "Products", end: false },
  { to: "/reports", label: "Reports", end: false },
];

export function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 flex z-50"
      style={{ background: "#0a2540", borderTop: "1px solid rgba(255,255,255,0.07)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end}
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-[10px] font-semibold transition-colors ${isActive ? "text-white" : "text-[#4a7fa5]"}`
          }>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}

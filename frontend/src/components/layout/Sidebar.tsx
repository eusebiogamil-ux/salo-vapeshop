import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { clearToken } from "../../api/auth";

const links = [
  { to: "/",          label: "Dashboard", end: true  },
  { to: "/sales",     label: "Sales",     end: false },
  { to: "/purchases", label: "Purchases", end: false },
  { to: "/products",  label: "Products",  end: false },
  { to: "/reports",   label: "Reports",   end: false },
];

export function Sidebar() {
  const handleLogout = () => {
    clearToken();
    window.location.href = "/login";
  };

  return (
    <aside className="w-56 shrink-0 flex flex-col" style={{ background: "#0a2540" }}>
      <div className="px-5 py-5">
        <Logo />
      </div>

      <nav className="flex-1 px-3 space-y-0.5 mt-1">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-semibold"
                  : "text-[#7b9eb5] hover:text-white hover:bg-white/[0.06]"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-xl text-sm transition-colors text-left"
          style={{ color: "#4a7fa5" }}
          onMouseOver={e => (e.currentTarget.style.color = "#7b9eb5")}
          onMouseOut={e => (e.currentTarget.style.color = "#4a7fa5")}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

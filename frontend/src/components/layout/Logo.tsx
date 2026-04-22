export function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Device body */}
        <rect x="13" y="8" width="10" height="20" rx="3" fill="#1a1a1a" />
        <rect x="14.5" y="9.5" width="7" height="13" rx="1.5" fill="#2e2e2e" />
        {/* Button */}
        <rect x="15.5" y="24" width="5" height="2" rx="1" fill="#444" />
        {/* LED dot */}
        <circle cx="18" cy="11.5" r="1" fill="#6b6b6b" />
        {/* Smoke puffs */}
        <circle cx="18" cy="5" r="1.8" fill="#d1d5db" opacity="0.9" />
        <circle cx="15.5" cy="3" r="1.3" fill="#9ca3af" opacity="0.6" />
        <circle cx="20.5" cy="2.5" r="1" fill="#9ca3af" opacity="0.4" />
      </svg>

      <div className="flex flex-col leading-tight">
        <span
          style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" }}
          className="text-sm font-black uppercase text-white tracking-widest"
        >
          Salo
        </span>
        <span
          style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}
          className="text-[9px] font-semibold uppercase text-gray-300 tracking-widest"
        >
          Vapeshop
        </span>
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Pod device icon */}
      <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Smoke */}
        <path d="M14 3 Q12 1.5 14 0 Q16 1.5 14 3" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6"/>
        <path d="M10 3.5 Q8.5 2 10 0.5" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35"/>
        <path d="M18 3.5 Q19.5 2 18 0.5" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35"/>
        {/* Device body */}
        <rect x="8" y="5" width="12" height="26" rx="4" fill="#111827"/>
        {/* Screen area */}
        <rect x="10" y="7.5" width="8" height="10" rx="1.5" fill="#1f2937"/>
        {/* Screen lines */}
        <rect x="11" y="9.5" width="6" height="1" rx="0.5" fill="#6366f1" opacity="0.9"/>
        <rect x="11" y="12" width="4" height="0.8" rx="0.4" fill="#9ca3af" opacity="0.5"/>
        <rect x="11" y="14" width="5" height="0.8" rx="0.4" fill="#9ca3af" opacity="0.4"/>
        {/* Fire button */}
        <rect x="10.5" y="21" width="7" height="7" rx="2" fill="#1f2937"/>
        <rect x="12" y="22.5" width="4" height="4" rx="1" fill="#6366f1" opacity="0.8"/>
        {/* LED dot */}
        <circle cx="14" cy="29.5" r="0.8" fill="#6366f1" opacity="0.7"/>
      </svg>

      {/* Wordmark */}
      <div className="leading-none">
        <p className="text-[16px] font-black text-gray-900 tracking-tight">SALO</p>
        <p className="text-[9px] font-semibold text-indigo-500 tracking-[0.2em] uppercase mt-0.5">Vapeshop</p>
      </div>
    </div>
  );
}

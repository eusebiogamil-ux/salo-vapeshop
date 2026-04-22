export function Logo() {
  return (
    <div className="flex items-center gap-3 px-1">
      {/* Vape device SVG */}
      <div className="relative">
        <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Smoke puffs */}
          <circle cx="16" cy="4" r="2.5" fill="#6366f1" opacity="0.7" />
          <circle cx="12.5" cy="2" r="1.8" fill="#818cf8" opacity="0.45" />
          <circle cx="19.5" cy="1.5" r="1.3" fill="#a5b4fc" opacity="0.3" />
          {/* Device body */}
          <rect x="11" y="8" width="10" height="24" rx="3.5" fill="url(#deviceGrad)" />
          {/* Screen */}
          <rect x="12.5" y="10" width="7" height="11" rx="1.5" fill="#1e1b4b" opacity="0.8" />
          {/* Screen glow lines */}
          <rect x="13.5" y="12" width="5" height="1" rx="0.5" fill="#6366f1" opacity="0.9" />
          <rect x="13.5" y="14.5" width="3.5" height="0.8" rx="0.4" fill="#818cf8" opacity="0.6" />
          <rect x="13.5" y="17" width="4.5" height="0.8" rx="0.4" fill="#818cf8" opacity="0.4" />
          {/* Button */}
          <rect x="14" y="27" width="4" height="3" rx="1.2" fill="#312e81" />
          <rect x="14.5" y="27.5" width="3" height="2" rx="0.8" fill="#4338ca" />
          {/* LED */}
          <circle cx="16" cy="11" r="1" fill="#a5b4fc" />
          <defs>
            <linearGradient id="deviceGrad" x1="11" y1="8" x2="21" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3730a3" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-black uppercase text-white tracking-[0.12em]">
          Salo
        </span>
        <span className="text-[9px] font-semibold uppercase text-indigo-400 tracking-[0.25em] mt-0.5">
          Vapeshop
        </span>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";

interface Props { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean; }

export function Modal({ open, onClose, title, children, wide }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) { window.addEventListener("keydown", h); document.body.style.overflow = "hidden"; }
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-[#0a2540]/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl`}
        style={{ boxShadow: "0 20px 60px rgba(10,37,64,0.18), 0 2px 8px rgba(10,37,64,0.06)" }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #e3e8ef" }}>
          <h2 className="text-sm font-semibold text-[#1a1f36]">{title}</h2>
          <button onClick={onClose} className="text-[#a3acb9] hover:text-[#697386] text-xl leading-none w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f6f9fc] transition-colors">&times;</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

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
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} max-h-[92vh] overflow-y-auto bg-white border border-gray-200 rounded-t-xl sm:rounded-xl shadow-lg`}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none px-1">&times;</button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

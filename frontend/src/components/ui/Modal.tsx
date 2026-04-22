import React, { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}

export function Modal({ open, onClose, title, children, wide }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) {
      window.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} max-h-[92vh] overflow-y-auto shadow-2xl border rounded-t-3xl sm:rounded-2xl`}
        style={{ background: "#0f172a", borderColor: "#1e293b" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#1e293b" }}>
          <h2 className="text-base font-bold text-slate-100">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors text-lg leading-none">&times;</button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

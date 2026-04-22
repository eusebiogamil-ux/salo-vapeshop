import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(({ label, error, className = "", ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-semibold text-slate-300">{label}</label>}
    <input
      ref={ref}
      {...props}
      className={`block w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
        error
          ? "border-red-700 bg-red-950/30"
          : "border-slate-700 bg-slate-800/80 hover:border-slate-600"
      } ${className}`}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Input.displayName = "Input";

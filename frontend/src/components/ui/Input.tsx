import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(({ label, error, className = "", ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold" style={{ color: "#697386" }}>{label}</label>}
    <input
      ref={ref}
      {...props}
      className={`block w-full rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] ${
        error
          ? "border-red-400 bg-red-50"
          : "bg-white hover:border-[#c5cdd6]"
      } ${className}`}
      style={{ border: `1px solid ${error ? "" : "#e3e8ef"}`, color: "#1a1f36", ...props.style }}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
));
Input.displayName = "Input";

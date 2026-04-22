import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(({ label, error, className = "", ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-semibold text-gray-600">{label}</label>}
    <input
      ref={ref}
      {...props}
      className={`block w-full rounded border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
        error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-gray-400"
      } ${className}`}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
));
Input.displayName = "Input";

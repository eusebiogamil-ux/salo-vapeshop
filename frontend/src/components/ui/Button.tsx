import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 shadow-lg shadow-indigo-900/40",
  secondary: "text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white disabled:opacity-40",
  danger: "bg-red-600/20 text-red-400 border border-red-800/50 hover:bg-red-600/30 disabled:opacity-40",
  ghost: "text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-40",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({ variant = "primary", size = "md", loading, children, className = "", ...props }: Props) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center gap-1.5 font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />}
      {children}
    </button>
  );
}

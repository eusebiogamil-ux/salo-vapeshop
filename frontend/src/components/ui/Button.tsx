import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-gray-900 text-white hover:bg-gray-700",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  danger: "text-red-600 border border-red-200 bg-red-50 hover:bg-red-100",
  ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1 text-xs rounded",
  md: "px-3.5 py-1.5 text-sm rounded",
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
      className={`inline-flex items-center gap-1.5 font-medium transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />}
      {children}
    </button>
  );
}

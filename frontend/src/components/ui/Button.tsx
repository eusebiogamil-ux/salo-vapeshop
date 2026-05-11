import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-[#635bff] text-white hover:bg-[#5851db] shadow-sm",
  secondary: "bg-white text-[#1a1f36] border border-[#e3e8ef] hover:bg-[#f6f9fc] shadow-sm",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
  ghost: "text-[#697386] hover:bg-[#f6f9fc] hover:text-[#1a1f36]",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1 text-xs rounded-md",
  md: "px-3.5 py-1.5 text-sm rounded-lg",
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
      className={`inline-flex items-center gap-1.5 font-medium transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:ring-offset-1 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />}
      {children}
    </button>
  );
}

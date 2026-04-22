type Variant = "red" | "yellow" | "green" | "gray";

const styles: Record<Variant, string> = {
  red: "bg-red-50 text-red-600 border border-red-200",
  yellow: "bg-amber-50 text-amber-600 border border-amber-200",
  green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  gray: "bg-slate-100 text-slate-600 border border-slate-200",
};

export function Badge({ children, variant = "gray", className = "" }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

type Variant = "red" | "yellow" | "green" | "gray";

const styles: Record<Variant, string> = {
  red: "bg-red-950/60 text-red-400 border border-red-800/50",
  yellow: "bg-amber-950/60 text-amber-400 border border-amber-800/50",
  green: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50",
  gray: "bg-slate-800 text-slate-400 border border-slate-700",
};

export function Badge({ children, variant = "gray", className = "" }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

type Variant = "red" | "yellow" | "green" | "gray";

const styles: Record<Variant, string> = {
  red: "bg-red-50 text-red-700",
  yellow: "bg-amber-50 text-amber-700",
  green: "bg-emerald-50 text-emerald-700",
  gray: "bg-[#f6f9fc] text-[#697386]",
};

export function Badge({ children, variant = "gray", className = "" }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

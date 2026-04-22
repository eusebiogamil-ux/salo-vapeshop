type Variant = "red" | "yellow" | "green" | "gray";

const styles: Record<Variant, string> = {
  red: "bg-red-50 text-red-700 border border-red-200",
  yellow: "bg-amber-50 text-amber-700 border border-amber-200",
  green: "bg-green-50 text-green-700 border border-green-200",
  gray: "bg-gray-100 text-gray-600 border border-gray-200",
};

export function Badge({ children, variant = "gray", className = "" }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

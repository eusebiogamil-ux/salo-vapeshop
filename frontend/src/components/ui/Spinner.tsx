export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${className}`} />
  );
}

"use client";

const STYLES: Record<string, string> = {
  completed: "bg-green-50 text-green-700 border border-green-200",
  settled: "bg-green-50 text-green-700 border border-green-200",
  pending: "bg-orange-50 text-orange-700 border border-orange-200",
  failed: "bg-red-50 text-red-700 border border-red-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  active: "bg-green-50 text-green-700 border border-green-200",
  inactive: "bg-gray-50 text-gray-500 border border-gray-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STYLES[status] || STYLES.pending}`}
    >
      {status}
    </span>
  );
}

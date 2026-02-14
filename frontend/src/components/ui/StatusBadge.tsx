"use client";

const STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  settled: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  processing: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  inactive: { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400" },
};

const DEFAULT_STYLE = { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };

export function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] || DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

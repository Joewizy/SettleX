"use client";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  subtitleColor?: string;
  iconColor: string;
  iconBg: string;
  highlight?: boolean;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  subtitleColor = "text-slate-400",
  iconColor,
  iconBg,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl p-5 transition-all duration-200 ${
        highlight
          ? "bg-emerald-50 border-2 border-emerald-200 shadow-sm"
          : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <div className={`text-2xl font-bold ${highlight ? "text-emerald-700" : "text-slate-900"}`}>
        {value}
      </div>
      {subtitle && (
        <div className={`text-xs font-medium mt-1 ${subtitleColor}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

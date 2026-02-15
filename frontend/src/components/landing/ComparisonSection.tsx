const rows = [
  { label: "Cost", traditional: "$500-1000/payroll", settlex: "~$0.001 total" },
  { label: "Settlement", traditional: "3-5 business days", settlex: "<1 second finality" },
  { label: "Atomicity", traditional: "Partial failures", settlex: "All-or-nothing" },
  { label: "Transparency", traditional: "Opaque, no tracking", settlex: "On-chain tx hash" },
];

export function ComparisonSection() {
  return (
    <section className="relative py-16 sm:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-16">
          Traditional Banking vs SettleX
        </h2>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-6 bg-white/5">
              <div className="font-semibold text-white/40 text-sm mb-4">DIMENSION</div>
              <div className="space-y-4 text-white/80">
                {rows.map((r) => (
                  <div key={r.label} className="py-3">{r.label}</div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="font-semibold text-white/40 text-sm mb-4">TRADITIONAL BANKING</div>
              <div className="space-y-4 text-white/60">
                {rows.map((r) => (
                  <div key={r.label} className="py-3">{r.traditional}</div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-emerald-600/10 to-blue-600/10">
              <div className="font-semibold text-emerald-400 text-sm mb-4">SETTLEX ON TEMPO</div>
              <div className="space-y-4 text-white font-medium">
                {rows.map((r) => (
                  <div key={r.label} className="py-3 text-emerald-400">{r.settlex}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg sm:text-2xl font-bold text-emerald-400">
            Annual Savings: $6K-12K + 60 hours of employee waiting time
          </p>
        </div>
      </div>
    </section>
  );
}

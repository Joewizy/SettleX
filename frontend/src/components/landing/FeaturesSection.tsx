import { Zap, Shield, DollarSign } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      'Sub-second finality on Tempo blockchain. Your employees get paid immediately \u2014 no more "3-5 business days" excuses.',
    gradient: "from-emerald-500 to-emerald-600",
    glow: "from-emerald-600/20",
  },
  {
    icon: Shield,
    title: "Atomic Batches",
    description:
      "Pay your entire team in one transaction. All payments succeed or all fail \u2014 no partial payroll disasters.",
    gradient: "from-blue-500 to-blue-600",
    glow: "from-blue-600/20",
  },
  {
    icon: DollarSign,
    title: "Massive Savings",
    description:
      "$0.001 per payroll run vs $500-1000 in wire fees. Save $6K-12K annually with blockchain-powered payments.",
    gradient: "from-purple-500 to-purple-600",
    glow: "from-purple-600/20",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="group relative">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${f.glow} to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}
              />
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center mb-6`}
                >
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-white/60 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

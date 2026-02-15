import { ArrowRight } from "lucide-react";

export function FooterCTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to transform your payroll?
        </h2>
        <p className="text-xl text-white/70 mb-12">
          Join the future of cross-border payments. Built for distributed teams everywhere.
        </p>
        <button
          onClick={onGetStarted}
          className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-lg font-semibold text-xl transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
        >
          <span className="flex items-center gap-2">
            Get Started Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </section>
  );
}

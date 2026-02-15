"use client";

import { ArrowRight, Zap } from "lucide-react";
import { TransferNotification, TRANSFERS } from "./TransferNotification";

export function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 opacity-30 blur-3xl" />

      {/* Transfer Notifications */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none">
        {TRANSFERS.map((transfer, i) => (
          <TransferNotification key={i} transfer={transfer} index={i} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center mt-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white/80 mb-8">
          <Zap className="w-4 h-4 text-emerald-400" />
          Built on Tempo Blockchain
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent leading-tight">
          Pay Your Global Team
          <br />
          in Seconds, Not Days
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/70 mb-4 max-w-3xl mx-auto font-light">
          Cross-border payroll for startups and distributed teams.
        </p>
        <p className="text-lg md:text-xl text-emerald-400 mb-12 font-medium">
          20 employees. 8 countries. 1 transaction. Under a second. Less than a penny.
        </p>

        {/* Value Props */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span>$25-50 → $0.001 per payment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span>3-5 days → &lt;1 second</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span>All succeed or all fail</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-lg font-semibold text-lg transition-all duration-300"
          >
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}

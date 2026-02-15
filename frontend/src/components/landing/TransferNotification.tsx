"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export interface Transfer {
  from: string;
  country: string;
  to: string;
  toCountry: string;
  amount: string;
  time: string;
  fee: string;
}

export const TRANSFERS: Transfer[] = [
  { from: "🇳🇬", country: "Nigeria", to: "🇺🇸", toCountry: "USA", amount: "$1,200", time: "0.8s", fee: "$0.001" },
  { from: "🇵🇹", country: "Portugal", to: "🇸🇬", toCountry: "Singapore", amount: "$3,500", time: "0.6s", fee: "$0.001" },
  { from: "🇧🇷", country: "Brazil", to: "🇩🇪", toCountry: "Germany", amount: "$2,100", time: "0.7s", fee: "$0.001" },
  { from: "🇮🇳", country: "India", to: "🇬🇧", toCountry: "UK", amount: "$1,850", time: "0.5s", fee: "$0.001" },
  { from: "🇲🇽", country: "Mexico", to: "🇨🇦", toCountry: "Canada", amount: "$2,900", time: "0.9s", fee: "$0.001" },
  { from: "🇵🇭", country: "Philippines", to: "🇦🇺", toCountry: "Australia", amount: "$1,600", time: "0.6s", fee: "$0.001" },
];

export function TransferNotification({ transfer, index }: { transfer: Transfer; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cycle = TRANSFERS.length * 2000;
    const showDelay = index * 2000;
    const hideDelay = showDelay + 1500;

    const showTimer = setTimeout(() => setIsVisible(true), showDelay);
    const hideTimer = setTimeout(() => setIsVisible(false), hideDelay);

    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 1500);
    }, cycle);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [index]);

  return (
    <div
      className={`absolute transform transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
      style={{ top: `${10 + (index % 2) * 15}%`, left: `${5 + (index % 5) * 18}%` }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">{transfer.from}</span>
          <span className="text-white/60">{transfer.country}</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
          <span className="text-2xl">{transfer.to}</span>
          <span className="text-white/60">{transfer.toCountry}</span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-white/80">
          <span className="font-semibold text-white">{transfer.amount}</span>
          <span className="text-emerald-400">• {transfer.time}</span>
          <span className="text-blue-400">• {transfer.fee}</span>
        </div>
      </div>
    </div>
  );
}

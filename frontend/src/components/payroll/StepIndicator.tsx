"use client";

import { Check, ChevronRight } from "lucide-react";
import type { PayrollStep } from "@/lib/types";

const STEPS = [
  { num: 1, label: "Review" },
  { num: 2, label: "Confirm" },
  { num: 3, label: "Settlement" },
] as const;

export function StepIndicator({ currentStep }: { currentStep: PayrollStep }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, idx) => (
        <div key={step.num} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              currentStep >= step.num
                ? "bg-[#059669] text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                currentStep > step.num ? "bg-white/20" : ""
              }`}
            >
              {currentStep > step.num ? <Check className="w-3 h-3" /> : step.num}
            </span>
            {step.label}
          </div>
          {idx < 2 && <ChevronRight className="w-4 h-4 text-gray-300" />}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, ChevronDown } from "lucide-react";
import { useToken } from "@/hooks/useToken";
import { TOKEN_LIST, DEFAULT_TOKEN } from "@/lib/constants";
import type { TokenInfo } from "@/lib/types";

export function WalletBalance() {
  const { isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(DEFAULT_TOKEN);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { balance } = useToken(selectedToken.address);

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <button
            onClick={openConnectModal}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm hover:bg-slate-50 transition-all duration-150"
          >
            <Wallet className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-emerald-600">
              Connect Wallet
            </span>
          </button>
        )}
      </ConnectButton.Custom>
    );
  }

  const formattedBalance = Number(balance).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm hover:bg-slate-50 transition-all duration-150"
      >
        <Wallet className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-500">Balance:</span>
        <span className="text-sm font-bold text-slate-900">
          ${formattedBalance}
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {selectedToken.symbol}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 min-w-[180px] animate-fade-in">
            {TOKEN_LIST.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  setSelectedToken(token);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm hover:bg-slate-50 transition-all duration-150 ${
                  selectedToken.symbol === token.symbol
                    ? "text-emerald-600 font-medium"
                    : "text-slate-700"
                }`}
              >
                <span>{token.symbol}</span>
                {selectedToken.symbol === token.symbol && (
                  <span className="text-emerald-600 text-xs">&#10003;</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

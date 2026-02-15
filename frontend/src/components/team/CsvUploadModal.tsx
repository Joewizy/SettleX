"use client";

import { useState, useRef, useCallback } from "react";
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Download,
  Trash2,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { TOKEN_LIST } from "@/lib/constants";
import type { Employee } from "@/lib/types";

interface CsvUploadModalProps {
  onImport: (employees: Employee[]) => void;
  onClose: () => void;
}

interface ParsedRow {
  name: string;
  email: string;
  country: string;
  wallet: string;
  currency: string;
  amount: number;
}

interface ParseResult {
  rows: ParsedRow[];
  errors: string[];
}

const VALID_CURRENCIES = new Set(TOKEN_LIST.map((t) => t.symbol));

const EXPECTED_HEADERS = ["name", "email", "country", "wallet", "currency", "amount"];

function parseCsv(text: string): ParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows: [], errors: ["File is empty"] };
  }

  // Parse header row
  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));

  // Map headers to indices
  const headerMap: Record<string, number> = {};
  for (const expected of EXPECTED_HEADERS) {
    const idx = headers.findIndex(
      (h) => h === expected || h.replace(/[_\s-]/g, "") === expected,
    );
    if (idx !== -1) {
      headerMap[expected] = idx;
    }
  }

  // Check required headers
  const missing = ["name", "email", "wallet"].filter((h) => !(h in headerMap));
  if (missing.length > 0) {
    return {
      rows: [],
      errors: [`Missing required columns: ${missing.join(", ")}. Expected: ${EXPECTED_HEADERS.join(", ")}`],
    };
  }

  const rows: ParsedRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parse (handles quoted fields with commas)
    const cols = parseCsvLine(line);

    const name = cols[headerMap["name"]]?.trim() || "";
    const email = cols[headerMap["email"]]?.trim() || "";
    const country = headerMap["country"] != null ? cols[headerMap["country"]]?.trim() || "" : "";
    const wallet = cols[headerMap["wallet"]]?.trim() || "";
    const currency = headerMap["currency"] != null ? cols[headerMap["currency"]]?.trim() || "pathUSD" : "pathUSD";
    const amountStr = headerMap["amount"] != null ? cols[headerMap["amount"]]?.trim() || "0" : "0";

    // Validate
    if (!name) {
      errors.push(`Row ${i + 1}: Missing name`);
      continue;
    }
    if (!email || !email.includes("@")) {
      errors.push(`Row ${i + 1}: Invalid email "${email}"`);
      continue;
    }
    if (wallet && !wallet.startsWith("0x")) {
      errors.push(`Row ${i + 1}: Invalid wallet "${wallet}" (must start with 0x)`);
      continue;
    }

    const amount = parseFloat(amountStr.replace(/[,$]/g, ""));
    if (isNaN(amount) || amount < 0) {
      errors.push(`Row ${i + 1}: Invalid amount "${amountStr}"`);
      continue;
    }

    // Normalize currency
    const normalizedCurrency = VALID_CURRENCIES.has(currency) ? currency : "pathUSD";

    rows.push({ name, email, country, wallet, currency: normalizedCurrency, amount });
  }

  return { rows, errors };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function rowsToEmployees(rows: ParsedRow[]): Employee[] {
  return rows.map((row, i) => ({
    id: Date.now() + i,
    name: row.name,
    email: row.email,
    country: row.country || "Unknown",
    flag: "🌍",
    currency: row.currency,
    amount: row.amount,
    wallet: row.wallet || "Auto-created via Privy",
    avatar: getInitials(row.name),
    status: "active" as const,
  }));
}

function generateSampleCsv(): string {
  return `name,email,country,wallet,currency,amount
John Smith,john@company.io,United States,0x1234567890abcdef1234567890abcdef12345678,pathUSD,3500
Maria Garcia,maria@company.io,Mexico,,AlphaUSD,2200
Yuki Tanaka,yuki@company.io,Japan,0xabcdef1234567890abcdef1234567890abcdef12,BetaUSD,4000`;
}

export function CsvUploadModal({ onImport, onClose }: CsvUploadModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv") && !file.type.includes("csv") && !file.type.includes("text")) {
      setParseResult({ rows: [], errors: ["Please upload a .csv file"] });
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseCsv(text);
      setParseResult(result);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDownloadSample = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const csv = generateSampleCsv();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "settlex-employees-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    if (!parseResult || parseResult.rows.length === 0) return;
    const employees = rowsToEmployees(parseResult.rows);
    onImport(employees);
    onClose();
  }, [parseResult, onImport, onClose]);

  const handleReset = useCallback(() => {
    setFileName(null);
    setParseResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] mx-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Import Employees</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Upload a CSV file to bulk add employees
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-all duration-150 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {/* Drop zone */}
          {!parseResult ? (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50"
                }`}
              >
                <Upload
                  className={`w-10 h-10 mx-auto mb-3 ${
                    dragOver ? "text-emerald-500" : "text-slate-300"
                  }`}
                />
                <p className="text-sm font-medium text-slate-700">
                  Drop your CSV file here or{" "}
                  <span className="text-emerald-600">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports .csv files</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>

              {/* Expected format */}
              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Expected Columns
                  </span>
                  <button
                    onClick={handleDownloadSample}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download Sample
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EXPECTED_HEADERS.map((h) => (
                    <span
                      key={h}
                      className={`text-xs px-2 py-1 rounded-md font-mono ${
                        ["name", "email", "wallet"].includes(h)
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {h}
                      {["name", "email", "wallet"].includes(h) && "*"}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  * Required fields. Currency defaults to pathUSD if omitted.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* File info */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{fileName}</p>
                    <p className="text-xs text-slate-400">
                      {parseResult.rows.length} employee{parseResult.rows.length !== 1 ? "s" : ""} parsed
                      {parseResult.errors.length > 0 &&
                        `, ${parseResult.errors.length} error${parseResult.errors.length !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-150"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Errors */}
              {parseResult.errors.length > 0 && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-800">
                      {parseResult.errors.length} issue{parseResult.errors.length !== 1 ? "s" : ""} found
                    </span>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {parseResult.errors.map((err, i) => (
                      <p key={i} className="text-xs text-red-600">
                        {err}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview table */}
              {parseResult.rows.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Preview ({parseResult.rows.length} employees)
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-slate-500 uppercase tracking-wider bg-slate-50/50">
                          <th className="text-left px-4 py-2 font-medium">Name</th>
                          <th className="text-left px-4 py-2 font-medium">Email</th>
                          <th className="text-left px-4 py-2 font-medium">Wallet</th>
                          <th className="text-left px-4 py-2 font-medium">Currency</th>
                          <th className="text-right px-4 py-2 font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseResult.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-50 text-sm"
                          >
                            <td className="px-4 py-2 font-medium text-slate-900">
                              {row.name}
                            </td>
                            <td className="px-4 py-2 text-slate-600 text-xs">
                              {row.email}
                            </td>
                            <td className="px-4 py-2 font-mono text-xs text-slate-500">
                              {row.wallet
                                ? `${row.wallet.slice(0, 6)}...${row.wallet.slice(-4)}`
                                : "Auto-create"}
                            </td>
                            <td className="px-4 py-2">
                              <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded">
                                {row.currency}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-slate-900">
                              ${row.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {parseResult && (
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition-all duration-150 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={parseResult.rows.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 rounded-xl transition-all duration-150 text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import {parseResult.rows.length} Employee{parseResult.rows.length !== 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

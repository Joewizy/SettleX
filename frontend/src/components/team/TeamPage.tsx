"use client";

import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Avatar, StatusBadge } from "@/components/ui";
import { AddEmployeeModal } from "./AddEmployeeModal";
import type { Employee, NewEmployeeForm } from "@/lib/types";

interface TeamPageProps {
  filteredEmployees: Employee[];
  teamSearch: string;
  showAddEmployee: boolean;
  newEmployee: NewEmployeeForm;
  onSetTeamSearch: (s: string) => void;
  onSetShowAddEmployee: (v: boolean) => void;
  onSetNewEmployee: (form: NewEmployeeForm) => void;
  onAddEmployee: () => void;
  onDeleteEmployee: (id: number) => void;
}

export function TeamPage({
  filteredEmployees,
  teamSearch,
  showAddEmployee,
  newEmployee,
  onSetTeamSearch,
  onSetShowAddEmployee,
  onSetNewEmployee,
  onAddEmployee,
  onDeleteEmployee,
}: TeamPageProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your employees and their payment preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search employees..."
              value={teamSearch}
              onChange={(e) => onSetTeamSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64 bg-white"
            />
          </div>
          <button
            onClick={() => {
              onSetNewEmployee({ name: "", email: "", country: "", wallet: "", currency: "pathUSD" });
              onSetShowAddEmployee(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-150 flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Employee</th>
              <th className="text-left px-6 py-3 font-medium">Email</th>
              <th className="text-left px-6 py-3 font-medium">Country</th>
              <th className="text-left px-6 py-3 font-medium">Wallet</th>
              <th className="text-left px-6 py-3 font-medium">Currency</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-t border-slate-50 table-row-hover group">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={emp.avatar} />
                    <span className="text-sm font-medium text-slate-900">{emp.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-sm text-slate-600">{emp.email}</td>
                <td className="px-6 py-3.5 text-sm text-slate-600">
                  <span className="mr-1.5">{emp.flag}</span>{emp.country}
                </td>
                <td className="px-6 py-3.5 font-mono text-xs text-slate-500">{emp.wallet}</td>
                <td className="px-6 py-3.5">
                  <span className="text-sm font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md">
                    {emp.currency}
                  </span>
                </td>
                <td className="px-6 py-3.5"><StatusBadge status={emp.status} /></td>
                <td className="px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-all duration-150">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(emp.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEmployees.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-400">No employees found</p>
          </div>
        )}
      </div>

      {showAddEmployee && (
        <AddEmployeeModal
          form={newEmployee}
          onChange={onSetNewEmployee}
          onSave={onAddEmployee}
          onClose={() => onSetShowAddEmployee(false)}
        />
      )}
    </div>
  );
}

'use client';

import React from 'react';
import {
  Wallet,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Building2,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { PayoutRecord } from './mockData';

interface PayoutsViewProps {
  payouts: PayoutRecord[];
}

export const PayoutsView: React.FC<PayoutsViewProps> = ({ payouts }) => {
  // Calculations
  const pendingAmount = payouts
    .filter((p) => p.status === 'Pending Approval' || p.status === 'Processing')
    .reduce((sum, item) => sum + item.totalAmount, 0);

  const paidTotal = payouts
    .filter((p) => p.status === 'Paid' || p.status === 'Completed')
    .reduce((sum, item) => sum + item.totalAmount, 0);


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Wallet className="w-6 h-6 text-cyan-400" />
          <span>Compensation & Payouts Ledger</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Review approved project milestones, unbilled bonus earnings, and direct bank disbursement status in ₹ (INR)
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Unbilled Pending Payout */}
        <div className="rounded-2xl bg-gradient-to-br from-cyan-950/80 via-gray-900 to-gray-950 border border-cyan-500/40 p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Unbilled / Pending Release
            </span>
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              <Clock className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-white font-mono">
              ₹ {pendingAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>Scheduled Disbursement Date: <strong>05 Aug 2026</strong></span>
          </p>
        </div>

        {/* Card 2: Year-to-Date Paid Total */}
        <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Total Disbursed (Paid)
            </span>
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-white font-mono">
              ₹ {paidTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>100% On-time agency transfer record</span>
          </p>
        </div>

        {/* Card 3: Bank Direct Account Status */}
        <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Payout Account
              </span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-white">HDFC Bank Ltd (INR)</h4>
            <p className="text-xs text-gray-400 font-mono mt-0.5">A/C: ••••••••• 4892</p>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KYC Verified & Encrypted Direct Deposit</span>
          </div>
        </div>
      </div>

      {/* Invoice & Payout History Table */}
      <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Payout Invoices & Disbursement History
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">Currency: INR (₹)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Invoice No</th>
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3">Milestone Project</th>
                <th className="py-3 px-3">Base</th>
                <th className="py-3 px-3">Bonus</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Wallet className="w-6 h-6 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-400">No payout records assigned by the core team yet.</span>
                      <span className="text-xs text-gray-500">Payout records will appear here once generated in Django Admin.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                payouts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-950/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">
                      {item.invoiceNo}
                    </td>
                    <td className="py-3.5 px-3 text-white font-medium">{item.month}</td>
                    <td className="py-3.5 px-3 text-gray-300 max-w-xs truncate">
                      {item.projectTitle}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-300">
                      ₹{item.baseAmount ? item.baseAmount.toLocaleString('en-IN') : 0}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400">
                      +₹{item.bonusAmount ? item.bonusAmount.toLocaleString('en-IN') : 0}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                      ₹{item.totalAmount ? item.totalAmount.toLocaleString('en-IN') : 0}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                          item.status === 'Paid' || item.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => alert(`Downloading PDF invoice ${item.invoiceNo}...`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] transition-colors"
                      >
                        <Download className="w-3 h-3 text-cyan-400" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

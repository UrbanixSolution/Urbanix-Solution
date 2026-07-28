'use client';

import React, { useState } from 'react';
import { X, LifeBuoy, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { UserProfile } from './mockData';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, user }) => {
  const [category, setCategory] = useState('Technical / IT Infrastructure');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);

      setTimeout(() => {
        setIsSent(false);
        setSubject('');
        setMessage('');
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-2xl bg-gray-900/95 backdrop-blur-2xl border border-gray-800 shadow-2xl p-6 text-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Request Internal Support
              </h3>
              <p className="text-xs text-gray-400">Urbanix IT & Admin Operations Ticket</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white bg-gray-950 border border-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSent ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Ticket Created!</h4>
            <p className="text-xs text-gray-400">
              Admin Ops team has received your ticket (Ref: #URB-SUP-{Math.floor(1000 + Math.random() * 9000)}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 text-[11px] text-gray-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Requester: <strong className="text-white">{user.name}</strong> ({user.employeeId})</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Support Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Technical / IT Infrastructure">Technical / IT Infrastructure</option>
                <option value="Payroll & Payout Disbursement">Payroll & Payout Disbursement</option>
                <option value="Client Project Milestone Revision">Client Project Milestone Revision</option>
                <option value="General Admin Request">General Admin Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of issue"
                required
                className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Detailed Message / Error Description
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Provide complete details..."
                required
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-xs text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-gray-950 font-bold text-xs hover:from-teal-300 shadow-md shadow-teal-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Ticket...' : 'Dispatch Ticket'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

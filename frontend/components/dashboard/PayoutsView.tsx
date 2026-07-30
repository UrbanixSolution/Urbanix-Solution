'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  QrCode,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Edit2,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Eye
} from 'lucide-react';
import { PayoutRecord, UserProfile } from './mockData';
import { getApiBase } from '@/lib/api';

interface PayoutsViewProps {
  payouts: PayoutRecord[];
  user?: UserProfile;
  onRefreshProfile?: () => void;
}

export const PayoutsView: React.FC<PayoutsViewProps> = ({
  payouts,
  user,
  onRefreshProfile
}) => {
  // Local profile state to reflect instant UI updates
  const [localUpiId, setLocalUpiId] = useState<string>(user?.upi_id || user?.upiId || '');
  const [localQrCodeUrl, setLocalQrCodeUrl] = useState<string>(user?.payment_qr_code || user?.paymentQrCode || '');

  // Keep in sync with prop updates
  React.useEffect(() => {
    if (user) {
      if (user.upi_id || user.upiId) setLocalUpiId(user.upi_id || user.upiId || '');
      if (user.payment_qr_code || user.paymentQrCode) setLocalQrCodeUrl(user.payment_qr_code || user.paymentQrCode || '');
    }
  }, [user]);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewQrOpen, setIsPreviewQrOpen] = useState(false);

  // Form states
  const [inputUpiId, setInputUpiId] = useState(localUpiId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculations
  const pendingAmount = payouts
    .filter((p) => p.status === 'Pending Approval' || p.status === 'Processing')
    .reduce((sum, item) => sum + item.totalAmount, 0);

  const paidTotal = payouts
    .filter((p) => p.status === 'Paid' || p.status === 'Completed')
    .reduce((sum, item) => sum + item.totalAmount, 0);

  const handleOpenEditModal = () => {
    setInputUpiId(localUpiId);
    setSelectedFile(null);
    setFilePreview(null);
    setToastMessage(null);
    setIsEditModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setToastMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, WEBP).' });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMessage(null);

    try {
      const base = getApiBase();
      const token = localStorage.getItem('auth_token');
      
      const formData = new FormData();
      formData.append('upi_id', inputUpiId.trim());
      if (selectedFile) {
        formData.append('payment_qr_code', selectedFile);
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }

      const res = await fetch(`${base}/user/profile/`, {
        method: 'PATCH',
        headers,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = data.user || {};
        const newUpi = updatedUser.upi_id || inputUpiId;
        const newQr = updatedUser.payment_qr_code || filePreview || localQrCodeUrl;
        
        setLocalUpiId(newUpi);
        if (newQr) setLocalQrCodeUrl(newQr);

        setToastMessage({ type: 'success', text: 'UPI & QR Payment details updated successfully!' });
        
        setTimeout(() => {
          setIsEditModalOpen(false);
          if (onRefreshProfile) onRefreshProfile();
        }, 1200);
      } else {
        setToastMessage({
          type: 'error',
          text: data.detail || data.message || 'Failed to update payment details. Please try again.'
        });
      }
    } catch (err: any) {
      console.error('[Update Profile Payment Error]:', err);
      setToastMessage({
        type: 'error',
        text: err.message || 'Cannot connect to server. Please check your network connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Wallet className="w-6 h-6 text-cyan-400" />
          <span>Compensation & Payouts Ledger</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Review approved project milestones, unbilled bonus earnings, and direct UPI disbursement status in ₹ (INR)
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && !isEditModalOpen && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

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

        {/* Card 3: UPI & QR Code Payment Method Card */}
        <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-6 shadow-xl flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                Payment Method (UPI)
              </span>
              <button
                onClick={handleOpenEditModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 hover:text-white text-[11px] font-semibold transition-all shadow-sm"
                title="Edit UPI ID & QR Code"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            {/* UPI ID Display */}
            <div className="space-y-1.5">
              <div className="text-xs text-gray-400 font-medium">Primary UPI ID</div>
              <div className="text-sm font-bold text-white font-mono tracking-wide bg-gray-950/60 px-3 py-1.5 rounded-lg border border-gray-800/80 flex items-center justify-between">
                <span>{localUpiId || 'No UPI ID set'}</span>
                {localUpiId && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-sans">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Payment QR Code Preview/Button */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-400">Payment QR Code:</span>
              {localQrCodeUrl ? (
                <div className="flex items-center gap-2">
                  <img
                    src={localQrCodeUrl}
                    alt="Payment QR"
                    className="w-7 h-7 rounded border border-cyan-500/40 object-cover cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setIsPreviewQrOpen(true)}
                  />
                  <button
                    onClick={() => setIsPreviewQrOpen(true)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View QR
                  </button>
                </div>
              ) : (
                <span className="text-gray-500 italic text-[11px]">Not uploaded</span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Encrypted Instant UPI & QR Transfer</span>
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

      {/* Edit Payment Method Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-gray-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Payment Method</h3>
                  <p className="text-xs text-gray-400">Update your UPI ID & QR Code for payouts</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Toast */}
            {toastMessage && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
                  toastMessage.type === 'success'
                    ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/90 border-rose-500/40 text-rose-300'
                }`}
              >
                {toastMessage.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{toastMessage.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSavePaymentMethod} className="space-y-4">
              {/* UPI ID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  UPI ID (VPA) <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={inputUpiId}
                  onChange={(e) => setInputUpiId(e.target.value)}
                  placeholder="e.g. rahul@okicici or 9876543210@paytm"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-cyan-500 text-white text-xs font-mono placeholder:text-gray-600 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* QR Code Upload File Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  Upload Payment QR Code Image
                </label>
                <div className="relative border-2 border-dashed border-gray-800 hover:border-cyan-500/60 rounded-xl p-4 text-center bg-gray-950/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    {filePreview || localQrCodeUrl ? (
                      <div className="relative group">
                        <img
                          src={filePreview || localQrCodeUrl}
                          alt="QR Preview"
                          className="w-20 h-20 rounded-lg border border-cyan-500/40 object-cover shadow-md"
                        />
                        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-white font-medium">Change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}

                    <div className="text-xs text-gray-300 font-medium">
                      {selectedFile ? selectedFile.name : 'Click or drop QR code image here'}
                    </div>
                    <p className="text-[10px] text-gray-500">Supports PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-gray-950 text-xs font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Payment Method</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Full Image Modal */}
      {isPreviewQrOpen && localQrCodeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-gray-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                Payment QR Code
              </span>
              <button
                onClick={() => setIsPreviewQrOpen(false)}
                className="p-1 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl inline-block shadow-inner">
              <img
                src={localQrCodeUrl}
                alt="Payment QR Full"
                className="max-h-64 max-w-full rounded border border-gray-200 object-contain mx-auto"
              />
            </div>

            <div className="text-xs font-mono text-gray-300">
              UPI: <span className="text-cyan-400 font-bold">{localUpiId || 'N/A'}</span>
            </div>

            <button
              onClick={() => setIsPreviewQrOpen(false)}
              className="w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

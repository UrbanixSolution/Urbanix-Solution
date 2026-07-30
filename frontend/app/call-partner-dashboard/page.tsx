'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  PhoneCall,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  UserCheck,
  KeyRound,
  Lock,
  ArrowRight,
  Sparkles,
  LogOut,
  RefreshCw
} from 'lucide-react'
import { getApiBase } from '@/lib/api'

interface ClientLeadItem {
  id: number
  partner: number
  partner_name: string
  client_name: string
  client_phone: string
  project_type: string
  discussed_price: string
  status: 'Under Review' | 'Approved' | 'Payment Processed - 48 Hours' | 'Rejected'
  created_at: string
}

export default function CallPartnerDashboardPage() {
  const [authToken, setAuthToken] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<string>('')

  // Dashboard Data State
  const [leads, setLeads] = useState<ClientLeadItem[]>([])
  const [isLoadingLeads, setIsLoadingLeads] = useState<boolean>(false)
  const [partnerUser, setPartnerUser] = useState<any>(null)

  // New Lead Form State
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false)
  const [clientName, setClientName] = useState<string>('')
  const [clientPhone, setClientPhone] = useState<string>('')
  const [projectType, setProjectType] = useState<string>('Business Website')
  const [discussedPrice, setDiscussedPrice] = useState<string>('')
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false)
  const [formError, setFormError] = useState<string>('')
  const [formSuccess, setFormSuccess] = useState<string>('')

  // Load Auth Token from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('auth_token') || ''
    if (token) {
      setAuthToken(token)
      fetchLeads(token)
    }
  }, [])

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const base = getApiBase()
      const res = await fetch(`${base}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('auth_token', data.token)
        setAuthToken(data.token)
        if (data.user) setPartnerUser(data.user)
        fetchLeads(data.token)
      } else {
        setLoginError(data.detail || data.error || 'Invalid credentials. Access Denied.')
      }
    } catch (err: any) {
      setLoginError('Failed to connect to authentication server.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setAuthToken('')
    setLeads([])
    setPartnerUser(null)
  }

  // Fetch Submitted Client Leads
  const fetchLeads = async (token: string) => {
    setIsLoadingLeads(true)
    try {
      const base = getApiBase()
      const res = await fetch(`${base}/leads/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data) ? data : data.results || []
        setLeads(items)
      }
    } catch (err) {
      console.error('Error fetching partner leads:', err)
    } finally {
      setIsLoadingLeads(false)
    }
  }

  // Submit New Client Lead
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!clientName.trim() || !clientPhone.trim() || !projectType.trim()) {
      setFormError('Please enter Client Name, Phone, and Project Type.')
      return
    }

    setIsSubmittingLead(true)
    try {
      const base = getApiBase()
      const res = await fetch(`${base}/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify({
          client_name: clientName.trim(),
          client_phone: clientPhone.trim(),
          project_type: projectType.trim(),
          discussed_price: discussedPrice.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setFormSuccess('Client lead submitted successfully! Status set to "Under Review".')
        setClientName('')
        setClientPhone('')
        setDiscussedPrice('')
        fetchLeads(authToken)
        setTimeout(() => {
          setShowSubmitModal(false)
          setFormSuccess('')
        }, 2000)
      } else {
        setFormError(data.detail || data.client_name?.[0] || 'Failed to submit lead.')
      }
    } catch (err) {
      setFormError('Network exception. Please check your connection.')
    } finally {
      setIsSubmittingLead(false)
    }
  }

  // Statistics Calculations
  const totalLeads = leads.length
  const approvedLeads = leads.filter(l => l.status === 'Approved' || l.status === 'Payment Processed - 48 Hours').length
  const pendingLeads = leads.filter(l => l.status === 'Under Review').length

  // Helper for Status Badge
  const getStatusBadge = (status: ClientLeadItem['status']) => {
    switch (status) {
      case 'Under Review':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40'
      case 'Approved':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
      case 'Payment Processed - 48 Hours':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
      case 'Rejected':
        return 'bg-red-950/80 text-red-300 border-red-500/40'
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 1. UNAUTHENTICATED LOGIN VIEW
  // ─────────────────────────────────────────────────────────────
  if (!authToken) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <PhoneCall size={14} />
              <span>Call Partner Portal</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Partner Sign In
            </h1>
            <p className="text-xs text-slate-400">
              Enter the partner credentials emailed to you upon application approval.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Username / Email
              </label>
              <div className="relative">
                <UserCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>ACCESS DASHBOARD</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/career" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              Don&apos;t have a Call Partner account? Apply on Career Page →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // 2. AUTHENTICATED DASHBOARD VIEW
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navigation / Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <PhoneCall size={13} />
              <span>Call Partner Referral Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Client Lead Tracker & Payout Ledger
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Submit client leads, monitor real-time approval status, and track your flat 48-hour commissions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => fetchLeads(authToken)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh Leads"
            >
              <RefreshCw size={16} className={isLoadingLeads ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus size={16} />
              <span>Submit New Client Lead</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-950 text-red-300 border border-red-800/50 text-xs font-semibold transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Referred Leads
            </span>
            <h3 className="text-3xl font-extrabold text-white font-mono">
              {totalLeads}
            </h3>
            <p className="text-[11px] text-slate-500">Submitted client inquiries</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Under Review
            </span>
            <h3 className="text-3xl font-extrabold text-amber-300 font-mono">
              {pendingLeads}
            </h3>
            <p className="text-[11px] text-slate-500">Core team closing deal</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 shadow-xl space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Approved / Paid Leads
            </span>
            <h3 className="text-3xl font-extrabold text-emerald-300 font-mono">
              {approvedLeads}
            </h3>
            <p className="text-[11px] text-emerald-400/80">Flat commission released within 48h</p>
          </div>
        </div>

        {/* Client Leads Table */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              <span>My Referred Client Leads</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">Total: {leads.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Client Name</th>
                  <th className="py-3 px-3">Client Phone</th>
                  <th className="py-3 px-3">Project Type</th>
                  <th className="py-3 px-3">Discussed Deal</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <PhoneCall size={24} className="text-slate-600" />
                        <span className="text-sm font-semibold text-slate-400">No client leads submitted yet.</span>
                        <span className="text-xs text-slate-500">Click &quot;Submit New Client Lead&quot; above to add your first referral.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-950/50 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white">{lead.client_name}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{lead.client_phone}</td>
                      <td className="py-3.5 px-3 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                          {lead.project_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">
                        {lead.discussed_price || '—'}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold border ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-400 text-[11px]">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Submit Client Lead Modal ──────────────────────────────────── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus size={18} className="text-emerald-400" />
                <span>Submit New Client Lead</span>
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Client / Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Apex Hospital / Sharma Store"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Client Phone / WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Project Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Business Website">Business Website</option>
                  <option value="E-Commerce Setup">E-Commerce Setup</option>
                  <option value="Reels & Video Editing">Reels & Video Editing</option>
                  <option value="Performance Ads">Performance Ads</option>
                  <option value="Custom App / Software">Custom App / Software</option>
                  <option value="Other">Other Service</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Discussed / Estimated Deal Amount
                </label>
                <input
                  type="text"
                  value={discussedPrice}
                  onChange={(e) => setDiscussedPrice(e.target.value)}
                  placeholder="e.g. ₹15,000"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  {isSubmittingLead ? 'Submitting...' : 'Submit Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

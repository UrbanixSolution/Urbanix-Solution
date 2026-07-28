'use client';

import React, { useState, useEffect } from 'react';
import { Lock, UserCheck, ShieldCheck, ArrowRight, Sparkles, KeyRound, AlertCircle } from 'lucide-react';

interface LoginCardProps {
  onLoginSuccess: (employeeId: string, loginData?: any) => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onLoginSuccess }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-login via Magic Link URL Token if present
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('magic_token') || params.get('token');

    if (magicToken) {
      setIsLoading(true);
      fetch(`http://127.0.0.1:8000/api/auth/magic-login/?token=${encodeURIComponent(magicToken)}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Invalid or expired magic link token.');
        })
        .then((data) => {
          const empId = data.user?.employee_id || data.user?.username || 'URB-DEV';
          localStorage.setItem('auth_token', magicToken);
          localStorage.setItem('employee_id', empId);
          setIsLoading(false);
          onLoginSuccess(empId, data);
        })
        .catch((err) => {
          setIsLoading(false);
          setErrorMessage('Magic link token is invalid or expired. Please sign in manually.');
        });
    }
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!employeeId.trim()) {
      setErrorMessage('Please enter your assigned Employee ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      // Call Django REST API Auth Endpoint
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employeeId.trim(),
          password: password.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        onLoginSuccess(employeeId.trim(), data);
      } else {
        const errData = await response.json().catch(() => ({}));
        setIsLoading(false);
        setErrorMessage(errData.detail || 'Invalid Employee ID or Password. Access Denied.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Unable to connect to Authentication Server. Please verify backend service.');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-10 px-4">
      {/* Outer subtle glow highlight */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-teal-400/20 blur-xl opacity-70 animate-pulse pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 shadow-2xl p-8 sm:p-10 text-gray-100 overflow-hidden">
        {/* Top Tech Accent Grid Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600" />
        
        {/* Subtle background glow inside card */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Urbanix Internal Workspace</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/urbanix-logo.png"
              alt="Urbanix Solution Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-cyan-500/25 border border-cyan-500/30"
            />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              URBANIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">CRM</span>
            </h1>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-400 font-medium">
            Private Enterprise Agency Portal
          </p>
        </div>

        {/* Security Alert Banner */}
        <div className="mb-6 p-3 rounded-lg bg-gray-950/70 border border-gray-800/80 text-[11px] sm:text-xs text-gray-400 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Restricted Portal. Authorized personnel only via admin credentials.</span>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-xs text-red-300 flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee ID Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Employee ID
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. Rahu/2807/01"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-950/90 border border-gray-800 rounded-xl text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-950/90 border border-gray-800 rounded-xl text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Glowing Secure Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-gray-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300 transform active:scale-[0.99] disabled:opacity-75 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : (
                <>
                  <span>SECURE LOGIN</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-gray-800/80 text-center text-[10px] text-gray-400">
          Urbanix Solutions Internal Portal v3.4.0 • 256-bit Encrypted Session
        </div>
      </div>
    </div>
  );
};

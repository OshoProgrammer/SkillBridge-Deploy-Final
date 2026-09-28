import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, KeyRound, ShieldAlert, ShieldCheck, ArrowRight, LogOut, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TerminalLockScreen: React.FC = () => {
  const { isSessionLocked, unlockSession, currentUser, logout, sessionSecurity } = useApp();
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isSessionLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) {
      setErrorMsg('Please enter your security passkey (demo: demo1234)');
      return;
    }
    const success = unlockSession(passkey);
    if (!success) {
      setErrorMsg('Invalid passkey. Use demo passkey: demo1234');
    } else {
      setErrorMsg('');
      setPasskey('');
    }
  };

  const handleQuickUnlock = () => {
    setPasskey('demo1234');
    unlockSession('demo1234');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090c]/95 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/90 border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 inline-block mb-1">
              GovNet Terminal Locked
            </span>
            <h2 className="text-xl font-bold text-white">Workstation Security Guard</h2>
            <p className="text-xs text-slate-400 mt-1">
              Encrypted session active. Enter authorized passkey to restore dashboard.
            </p>
          </div>
        </div>

        {/* Locked Officer Identity Dossier */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/50 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white truncate">{currentUser.name}</span>
              <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">{currentUser.designation}</p>
            <p className="text-[10px] font-mono text-orange-400 mt-0.5">
              ID: {currentUser.civilServiceId || currentUser.employeeId || 'SDGD-CADRE-101'} • {currentUser.securityClearance || 'Level 3'}
            </p>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Officer Passkey</span>
              <button
                type="button"
                onClick={handleQuickUnlock}
                className="text-orange-400 hover:text-orange-300 text-[11px] underline font-mono"
              >
                Auto-Unlock (demo1234)
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter passkey..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-orange-500 outline-none text-sm font-mono"
                autoFocus
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-1 text-left">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Resume Officer Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[10px] font-mono text-slate-500">
            TLS 1.3 • AES-256-GCM
          </span>
          <button
            type="button"
            onClick={logout}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

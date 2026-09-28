import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase,
  IdCard,
  Fingerprint,
  AlertTriangle,
  BadgeCheck,
  Shield,
  Clock,
  Check,
  Send,
  RefreshCw,
  UserPlus,
  Settings,
  Server
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoleType } from '../types';
import { configureSmtp, getSmtpStatus } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'switch';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { 
    currentUser, 
    users, 
    departments, 
    switchUser, 
    loginWithCredentials, 
    requestGmailOtp,
    confirmGmailOtp,
    addToast,
    isRateLimited,
    rateLimitCountdown,
    failedLoginAttempts,
    findUserByIdentifier
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'switch'>(initialTab);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('ananya.sharma@state.gov.in');
  const [loginPassword, setLoginPassword] = useState('demo1234');
  const [loginRole, setLoginRole] = useState<RoleType>('learner');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regStep, setRegStep] = useState<'details' | 'otp'>('details');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regEmployeeCode, setRegEmployeeCode] = useState('');
  const [regDepartmentId, setRegDepartmentId] = useState(departments[0]?.id || 'dept-it-gov');
  const [regRole, setRegRole] = useState<RoleType>('learner');
  const [regDesignation, setRegDesignation] = useState('');
  const [regPassword, setRegPassword] = useState('demo1234');

  // OTP state
  const [regOtp, setRegOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [deliveredToMailbox, setDeliveredToMailbox] = useState<boolean | null>(null);
  const [sandboxOtp, setSandboxOtp] = useState<string | null>(null);
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [liveSmtpUser, setLiveSmtpUser] = useState<string | null>(null);

  // Check SMTP status on mount
  useEffect(() => {
    getSmtpStatus().then((data) => {
      if (data?.configured && data?.user) {
        setLiveSmtpUser(data.user);
      }
    }).catch(() => {});
  }, []);

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpUser.trim() || !smtpPass.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Credentials',
        message: 'Please enter your Gmail address and 16-character Google App Password.',
      });
      return;
    }
    try {
      setIsSavingSmtp(true);
      const res = await configureSmtp({
        user: smtpUser.trim(),
        pass: smtpPass.trim(),
      });
      if (res.success) {
        setLiveSmtpUser(smtpUser.trim());
        setShowSmtpConfig(false);
        setSmtpPass('');
        addToast({
          type: 'success',
          title: 'Gmail SMTP Gateway Connected',
          message: 'All verification OTPs will now be sent directly to recipient inboxes!',
        });
      } else {
        addToast({
          type: 'error',
          title: 'SMTP Connection Failed',
          message: res.error || 'Failed to authenticate with Gmail SMTP.',
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'SMTP Error',
        message: 'Could not connect to SMTP server.',
      });
    } finally {
      setIsSavingSmtp(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    let timer: any;
    if (otpResendCooldown > 0) {
      timer = setInterval(() => {
        setOtpResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpResendCooldown]);

  if (!isOpen) return null;

  const matchedUser = findUserByIdentifier(loginIdentifier);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim()) {
      addToast({ 
        type: 'warning', 
        title: 'Identifier Required', 
        message: 'Please enter your Official Email or Civil Service ID.' 
      });
      return;
    }

    // Requirement 1: Only person who have their accounts on website can login
    const found = findUserByIdentifier(loginIdentifier);
    if (!found) {
      setLoginError(
        `Account not found for "${loginIdentifier}". Only registered personnel can sign in. Please create an account.`
      );
      addToast({
        type: 'error',
        title: 'Sign In Rejected',
        message: 'Account not found. If you do not have an account, please create one first.',
      });
      return;
    }

    const res = loginWithCredentials(loginIdentifier, loginRole, loginPassword, true);
    if (res.success) {
      onClose();
    } else if (res.error) {
      setLoginError(res.error);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      addToast({ 
        type: 'warning', 
        title: 'Missing Information', 
        message: 'Full officer name and official Gmail address are required.' 
      });
      return;
    }

    if (!regEmail.includes('@')) {
      addToast({
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please provide a valid Gmail or government email address.',
      });
      return;
    }

    try {
      setIsSendingOtp(true);
      const res = await requestGmailOtp({
        name: regName.trim(),
        email: regEmail.trim(),
        role: regRole,
        departmentId: regDepartmentId,
        designation: regDesignation.trim() || 'Civil Service Officer',
        employeeCode: regEmployeeCode.trim() || `SDGD-CADRE-${Math.floor(1000 + Math.random() * 9000)}`,
        password: regPassword || 'demo1234',
      });

      if (res.success) {
        setRegStep('otp');
        setRegOtp('');
        setDeliveredToMailbox(!!res.deliveredToMailbox);
        setSandboxOtp(res.sandboxOtp || null);
        setOtpResendCooldown(45);
      } else if (res.accountExists) {
        setActiveTab('login');
        setLoginIdentifier(regEmail.trim());
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regOtp.trim() || regOtp.trim().length !== 6) {
      addToast({
        type: 'warning',
        title: '6-Digit Code Required',
        message: 'Please enter the 6-digit verification code received in your Gmail.',
      });
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const res = await confirmGmailOtp(regEmail.trim(), regOtp.trim());
      if (res.success) {
        onClose();
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpResendCooldown > 0) return;
    try {
      setIsSendingOtp(true);
      const res = await requestGmailOtp({
        name: regName.trim(),
        email: regEmail.trim(),
        role: regRole,
        departmentId: regDepartmentId,
        designation: regDesignation.trim() || 'Civil Service Officer',
        employeeCode: regEmployeeCode.trim() || `SDGD-CADRE-${Math.floor(1000 + Math.random() * 9000)}`,
        password: regPassword || 'demo1234',
      });
      if (res.success) {
        setDeliveredToMailbox(!!res.deliveredToMailbox);
        setSandboxOtp(res.sandboxOtp || null);
        setOtpResendCooldown(45);
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative w-full max-w-xl bg-[#121216] border border-orange-500/30 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden z-10 text-white my-auto"
      >
        {/* Top Header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight font-sans text-white">
                  Skill<span className="text-orange-500">Bridge</span> Identity
                </h2>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GMAIL OTP GATEWAY
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Official State Civil Personnel Identification & Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Warning If Rate-Limited */}
        {isRateLimited && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 flex items-center gap-3 text-rose-200 text-xs animate-pulse">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="block font-bold">SECURITY LOCKOUT ACTIVE</strong>
              Gateway locked for {rateLimitCountdown}s due to repeated failed attempts.
            </div>
          </div>
        )}

        {/* Segmented Control Navigation */}
        <div className="p-4 bg-black/40">
          <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
            <button
              onClick={() => {
                setActiveTab('switch');
                setLoginError(null);
              }}
              className={`py-1.5 px-2 sm:px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'switch'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Registered Dossiers
            </button>
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`py-1.5 px-2 sm:px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Officer Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setRegStep('details');
              }}
              className={`py-1.5 px-2 sm:px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[68vh] overflow-y-auto">
          
          {/* TAB 1: FAST PERSONA DOSSIER SWITCHER (REGISTERED OFFICERS) */}
          {activeTab === 'switch' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>VERIFIED CIVIL SERVICE PERSONNEL DIRECTORY</span>
                <span className="font-mono text-orange-400 text-[10px]">({users.length} Active Records)</span>
              </div>

              <div className="space-y-2.5">
                {users.map((u) => {
                  const isCurrent = currentUser.id === u.id;
                  return (
                    <motion.div
                      key={u.id}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        switchUser(u.id);
                        onClose();
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-orange-500/15 border-orange-500/60 shadow-lg ring-1 ring-orange-500/30'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/50"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] shadow">
                            ✓
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-white truncate">{u.name}</h4>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase">
                                {u.role.replace('_', ' ')}
                              </span>
                            </div>
                            {isCurrent && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                                Active Session
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-neutral-300 truncate mt-0.5">{u.designation}</p>

                          <div className="mt-1.5 pt-1.5 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400">
                            <div>
                              <span className="text-neutral-500">ID: </span>
                              <span className="text-orange-400 font-bold">{u.civilServiceId || u.employeeId || 'SDGD-CADRE-101'}</span>
                            </div>
                            <div className="text-right truncate">
                              <span className="text-neutral-500">Cadre: </span>
                              <span className="text-amber-300">{u.cadre || 'State Cadre'}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[9px] font-mono pt-1 text-emerald-400">
                            <span>Clearance: {u.securityClearance || 'Level 3 Restricted'}</span>
                            <span className="text-neutral-400">Aadhaar/Biometric Verified ✓</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SIGN IN (ONLY REGISTERED ACCOUNTS CAN SIGN IN) */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Account Not Found Alert */}
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setRegEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                      setRegStep('details');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] shrink-0 transition-colors"
                  >
                    Create Account &rarr;
                  </button>
                </div>
              )}

              {/* Dynamic Identity Matcher Preview */}
              {matchedUser ? (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-950/40 to-slate-950 border border-orange-500/40 flex items-center gap-3">
                  <img
                    src={matchedUser.avatar}
                    alt={matchedUser.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/60 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{matchedUser.name}</span>
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        REGISTERED OFFICER
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 truncate">{matchedUser.designation}</p>
                    <p className="text-[10px] font-mono text-orange-400">
                      ID: {matchedUser.civilServiceId || 'SDGD-CADRE-101'} • {matchedUser.securityClearance || 'Level 3'}
                    </p>
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Official Email or Civil Service Cadre ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => {
                      setLoginIdentifier(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder="e.g. ananya.sharma@state.gov.in or SDGD-CADRE-101"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Security Passkey / Password
                  </label>
                  <span className="text-[10px] text-orange-400 font-mono">Demo: demo1234</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Sign In Role / Perspective
                </label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as RoleType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a1e] border border-white/10 focus:border-orange-500 text-xs sm:text-sm text-white outline-none cursor-pointer"
                >
                  <option value="learner">Learner / Civil Service Officer</option>
                  <option value="super_admin">Super Administrator (State Admin)</option>
                  <option value="hr_manager">HR & Capacity Director</option>
                  <option value="manager">Team Lead / Department Manager</option>
                  <option value="trainer">Trainer / Content Creator</option>
                  <option value="sme">Subject Matter Expert (SME)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isRateLimited}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Registered Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-neutral-400">
                <span>Don't have an account on SkillBridge? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegStep('details');
                  }}
                  className="text-orange-400 hover:text-orange-300 font-bold underline ml-1"
                >
                  Create one now &rarr;
                </button>
              </div>

              {/* Quick Fill Credentials */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] text-neutral-400 font-mono block mb-1.5">QUICK FILL REGISTERED CREDENTIALS:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('ananya.sharma@state.gov.in');
                      setLoginRole('learner');
                      setLoginError(null);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-left text-neutral-300 truncate font-mono text-[11px]"
                  >
                    Ananya Sharma (Learner)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('ravi.shankar@state.gov.in');
                      setLoginRole('super_admin');
                      setLoginError(null);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-left text-neutral-300 truncate font-mono text-[11px]"
                  >
                    Ravi Shankar, IAS (Admin)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: CREATE ACCOUNT (WITH GMAIL OTP - NO SELF-PROVIDED OTP) */}
          {activeTab === 'register' && (
            <div>
              {regStep === 'details' ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div className="text-center mb-4">
                    <h3 className="text-sm font-bold text-white">Enroll New Civil Cadre Profile</h3>
                    <p className="text-xs text-neutral-400">
                      Step 1 of 2: Enter your information to receive a 6-digit verification code in your Gmail
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Full Officer Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Vikramaditya Sen"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Official Gmail / Gov Email
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. a85636815@gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Civil Service ID / Code
                      </label>
                      <input
                        type="text"
                        value={regEmployeeCode}
                        onChange={(e) => setRegEmployeeCode(e.target.value)}
                        placeholder="SDGD-CADRE-8912"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Department Wing
                      </label>
                      <select
                        value={regDepartmentId}
                        onChange={(e) => setRegDepartmentId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#1a1a1e] border border-white/10 focus:border-orange-500 text-xs text-white outline-none cursor-pointer"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Target Access Role
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as RoleType)}
                        className="w-full px-3 py-2 rounded-xl bg-[#1a1a1e] border border-white/10 focus:border-orange-500 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="learner">Learner / Officer</option>
                        <option value="manager">Manager / Team Lead</option>
                        <option value="hr_manager">HR & L&D Director</option>
                        <option value="trainer">Trainer / Author</option>
                        <option value="sme">Subject Matter Expert</option>
                        <option value="super_admin">Super Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Designation / Post
                    </label>
                    <input
                      type="text"
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      placeholder="e.g. Junior Digital Governance Officer"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Account Passkey / Password
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching Verification Code...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send 6-Digit Verification Code to Gmail</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: ENTER GMAIL OTP (DO NOT PROVIDE OTP BY YOURSELF) */
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto shadow-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">Officer Verification Code</h3>
                    <p className="text-xs text-neutral-400">
                      6-digit civil authentication code generated for:
                    </p>
                    <p className="font-mono text-sm font-bold text-orange-400 bg-black/40 py-1 px-3 rounded-lg border border-white/10 inline-block">
                      {regEmail}
                    </p>
                  </div>

                  {/* Delivery Status / Gateway Notice */}
                  {deliveredToMailbox ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-200">Email Dispatched Directly via SMTP</p>
                        <p className="text-[11px] text-emerald-300/80 mt-0.5">
                          Verification code transmitted to <strong className="text-white font-mono">{regEmail}</strong>. Please check your Gmail inbox and spam folder.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <Shield className="w-3.5 h-3.5" /> GovNet Dispatch Gateway Notice
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {liveSmtpUser ? 'Offline Simulation' : 'Sandbox Dispatch'}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-[11px] leading-relaxed mb-2.5">
                        Outbound SMTP is not connected on this server, so email was not routed to Gmail servers. Your verification code is:
                      </p>
                      {sandboxOtp && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-amber-500/40">
                          <div className="flex items-center gap-2 pl-2">
                            <span className="text-[10px] uppercase font-mono text-neutral-400">Code:</span>
                            <span className="font-mono text-xl font-black tracking-widest text-amber-400">{sandboxOtp}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setRegOtp(sandboxOtp);
                              addToast({ type: 'info', title: 'Code Filled', message: 'Verification code inserted.' });
                            }}
                            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 shadow transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" /> Auto-Fill Code
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1 text-center">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-xl bg-white/5 border border-white/20 focus:border-orange-500 outline-none"
                        autoFocus
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || regOtp.length !== 6}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying with Gateway...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify Gmail & Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-neutral-400">
                      <button
                        type="button"
                        onClick={() => setRegStep('details')}
                        className="hover:text-white transition-colors"
                      >
                        &larr; Change Email
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={otpResendCooldown > 0 || isSendingOtp}
                        className="text-orange-400 hover:text-orange-300 disabled:text-neutral-500 transition-colors font-semibold"
                      >
                        {otpResendCooldown > 0
                          ? `Resend in ${otpResendCooldown}s`
                          : 'Resend Code'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Optional: Configure Real Gmail Gateway */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowSmtpConfig(!showSmtpConfig)}
                  className="w-full flex items-center justify-between text-[11px] text-neutral-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-mono">
                    <Server className="w-3.5 h-3.5 text-orange-400" />
                    {liveSmtpUser ? (
                      <span className="text-emerald-400 font-semibold">Live Gmail Connected: {liveSmtpUser}</span>
                    ) : (
                      <span>Connect Live Gmail SMTP (Optional)</span>
                    )}
                  </span>
                  <span className="text-[10px] text-orange-400 underline">
                    {showSmtpConfig ? 'Hide Settings' : 'Configure SMTP'}
                  </span>
                </button>

                {showSmtpConfig && (
                  <form onSubmit={handleSaveSmtp} className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      To send emails directly to real Gmail addresses, provide your Gmail address and a 16-character Google App Password (from Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords).
                    </p>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">Gmail Address</label>
                      <input
                        type="email"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-orange-500 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">Google App Password (16 characters)</label>
                      <input
                        type="password"
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-orange-500 font-mono"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSavingSmtp}
                      className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isSavingSmtp ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying with Gmail SMTP...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Save & Activate Live Gmail Dispatch</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-black/60 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>Tenant: SDGD-IN (Apex)</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            256-Bit Encrypted Gateway
          </span>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  KeyRound, 
  IdCard, 
  Layers, 
  Target, 
  Award, 
  Users, 
  BrainCircuit, 
  Compass, 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Fingerprint, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Check, 
  Shield, 
  BadgeCheck, 
  LockKeyhole,
  Send,
  UserPlus,
  Server,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoleType } from '../types';
import { configureSmtp, getSmtpStatus } from '../services/api';

export const AuthLandingPage: React.FC = () => {
  const { 
    departments, 
    loginWithCredentials, 
    requestGmailOtp,
    confirmGmailOtp,
    loginAsDemoPersona,
    addToast,
    isRateLimited,
    rateLimitCountdown,
    failedLoginAttempts,
    findUserByIdentifier
  } = useApp();

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');

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

  // Cooldown countdown
  useEffect(() => {
    let timer: any;
    if (otpResendCooldown > 0) {
      timer = setInterval(() => {
        setOtpResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpResendCooldown]);

  const matchedUser = findUserByIdentifier(loginIdentifier);

  const demoPersonas = [
    {
      id: 'user-learner',
      name: 'Ananya Sharma',
      civilServiceId: 'SDGD-CADRE-101',
      cadre: 'State Civil Service (SCS) — Digital Cadre',
      role: 'learner' as RoleType,
      roleBadge: 'Civil Officer (Learner)',
      designation: 'Junior Digital Governance Officer',
      department: 'IT & Digital Governance',
      securityClearance: 'LEVEL 3 — SECRET / RESTRICTED',
      description: 'Has critical Level 2 Data Analytics gap vs Level 4 benchmark. Primary SIH demo flow officer with personalized 3-module remediation.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      highlight: 'Primary SIH Demo Flow',
      icon: Target,
    },
    {
      id: 'user-admin',
      name: 'Ravi Shankar',
      civilServiceId: 'SDGD-IAS-004',
      cadre: 'Indian Administrative Service (IAS) — Apex Cadre',
      role: 'super_admin' as RoleType,
      roleBadge: 'Super Administrator',
      designation: 'Principal Secretary & State Admin',
      department: 'State Administration',
      securityClearance: 'LEVEL 4 — TOP SECRET (GovNet Apex)',
      description: 'Configure organizational competency frameworks, executive readiness heatmaps, and tamper-evident audit logs.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      highlight: 'Executive Apex View',
      icon: ShieldCheck,
    },
    {
      id: 'user-hr',
      name: 'Pooja Deshmukh',
      civilServiceId: 'SDGD-HR-202',
      cadre: 'State Human Capital & Training Directorate',
      role: 'hr_manager' as RoleType,
      roleBadge: 'HR & L&D Director',
      designation: 'Director, State Human Capital',
      department: 'Human Resources & Talent',
      securityClearance: 'LEVEL 3 — SECRET / L&D CONFIDENTIAL',
      description: 'Audit department-wide skill gaps, track training effectiveness index (TEI), and monitor statutory compliance deadlines.',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      highlight: 'Talent & Capacity',
      icon: Users,
    },
    {
      id: 'user-manager',
      name: 'Arjun Mehta',
      civilServiceId: 'SDGD-MGR-305',
      cadre: 'State Digital Infrastructure Cadre',
      role: 'manager' as RoleType,
      roleBadge: 'Team Lead / Manager',
      designation: 'Lead Operations Manager',
      department: 'Revenue & Land Records',
      securityClearance: 'LEVEL 3 — SECRET / OPERATIONAL RESTRICTED',
      description: 'Inspect team skill readiness, resolve overdue compliance warnings, and issue direct learning nudges.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      highlight: 'Team Operations',
      icon: Layers,
    },
    {
      id: 'user-trainer',
      name: 'Anita Patel',
      civilServiceId: 'SDGD-DIR-001',
      cadre: 'Chief Technical Advisory Cadre',
      role: 'trainer' as RoleType,
      roleBadge: 'Master Trainer & Author',
      designation: 'Lead Curriculum Architect',
      department: 'State Administrative Training Institute',
      securityClearance: 'LEVEL 4 — TOP SECRET (Content & Rubrics)',
      description: 'Author SOPs, trigger AI Knowledge Capture from raw notes/video transcripts, and test duplicate detection.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      highlight: 'AI Content Studio',
      icon: BrainCircuit,
    },
    {
      id: 'user-sme',
      name: 'Dr. Sunita Iyer',
      civilServiceId: 'SDGD-PROC-002',
      cadre: 'Chief Technical Advisory Cadre (PhD)',
      role: 'sme' as RoleType,
      roleBadge: 'Subject Matter Expert',
      designation: 'Senior Advisor, Cyber & Data Governance',
      department: 'Center of Excellence in Governance',
      securityClearance: 'LEVEL 4 — TOP SECRET (National Advisory)',
      description: 'Manage 1-on-1 officer mentorship requests, review capstone diagnostic submissions, and verify micro-credentials.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      highlight: 'Mentorship Desk',
      icon: Award,
    },
  ];

  const handlePersonaSelect = async (personaId: string) => {
    // Demo Personas bypass credentials/OTP and enter the demo experience directly.
    await loginAsDemoPersona(personaId);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim()) {
      addToast({
        type: 'warning',
        title: 'Identifier Required',
        message: 'Please enter your Official Email or Civil Service ID.',
      });
      return;
    }

    // Requirement 1: Only person who have their accounts on website can login
    const found = findUserByIdentifier(loginIdentifier);
    if (!found) {
      setLoginError(
        `Account not found for "${loginIdentifier}". Only registered personnel can sign in. Please create an account to proceed.`
      );
      addToast({
        type: 'error',
        title: 'Sign In Rejected',
        message: 'Account not found. If you do not have an account, please create one first.',
      });
      return;
    }

    const res = await loginWithCredentials(loginIdentifier, loginRole, loginPassword, true);
    if (!res.success && res.error) {
      setLoginError(res.error);
    }
  };

  // Step 1: Request OTP for Gmail
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Information',
        message: 'Full officer name and official Gmail address are required.',
      });
      return;
    }

    if (!regEmail.includes('@')) {
      addToast({
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please provide a valid Gmail or state government email address.',
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

  // Step 2: Verify user-entered OTP (we DO NOT provide the OTP ourselves)
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
        // Account created & user logged in automatically by AppContext
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
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white relative overflow-hidden">
      
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-amber-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-orange-500/10 blur-[140px] pointer-events-none" />

      {/* Top Brand Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/80 relative z-20">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-600/25">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-white tracking-tight leading-none font-sans">
                Skill<span className="text-orange-500">Bridge</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                PROD PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Civil Services Competency Intelligence System • SIH26075
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GovNet 256-bit Security Gateway Active</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 relative z-20 flex flex-col items-center justify-center">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Civil Services Verified Personnel Directory • Gmail OTP Authenticated</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Workforce <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Competency Radar</span> & Security Gateway
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Only registered civil service personnel can sign in. If you do not have an account, create one below with official Gmail OTP verification.
          </p>
        </div>

        {/* Security Alert if Rate Limited */}
        {isRateLimited && (
          <div className="w-full max-w-2xl mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-center gap-3.5 text-red-300 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            <div className="text-xs">
              <strong className="block font-bold text-white text-sm">SECURITY LOCKOUT IN EFFECT</strong>
              Multiple failed authentication attempts detected. Gateway temporarily locked for{' '}
              <span className="font-mono font-bold text-red-200">{rateLimitCountdown} seconds</span>.
            </div>
          </div>
        )}

        {/* Auth Mode Toggle Tabs */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-slate-900/90 border border-slate-800 p-1 rounded-xl flex items-center gap-1 shadow-xl">
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'demo'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Registered Officers</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/25 font-mono">Dossier</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('login');
                  setLoginError(null);
                }}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LockKeyhole className="w-4 h-4" />
                <span>Officer Sign In</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('register');
                  setRegStep('details');
                }}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account (Gmail OTP)</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 1-CLICK DEMO PERSONAS (SHOWS EXACTLY WHO EACH REGISTERED PERSON IS) */}
          {activeTab === 'demo' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <p className="text-xs text-slate-400 font-mono">
                  OFFICIAL STATE PERSONNEL REGISTRY • EXISTING REGISTERED ACCOUNTS
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoPersonas.map((persona) => {
                  const Icon = persona.icon;
                  const isAnanya = persona.id === 'user-learner';

                  return (
                    <motion.div
                      key={persona.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        void handlePersonaSelect(persona.id);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden group backdrop-blur-xl ${
                        isAnanya
                          ? 'bg-slate-900/90 border-orange-500/60 shadow-xl shadow-orange-950/30 ring-1 ring-orange-500/40'
                          : 'bg-slate-900/70 border-slate-800 hover:border-orange-500/40 hover:bg-slate-900/90'
                      }`}
                    >
                      {isAnanya && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl font-mono uppercase">
                          Recommended Flow
                        </div>
                      )}

                      <div>
                        {/* Person Header with Verified Photo & Cadre Badge */}
                        <div className="flex items-start gap-3.5 mb-3">
                          <div className="relative shrink-0">
                            <img
                              src={persona.avatar}
                              alt={persona.name}
                              className="w-13 h-13 rounded-xl object-cover ring-2 ring-orange-500/40"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow">
                              <BadgeCheck className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${persona.badgeColor}`}>
                                {persona.roleBadge}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-white mt-1 group-hover:text-orange-400 transition-colors truncate">
                              {persona.name}
                            </h3>
                            <p className="text-[11px] font-mono text-orange-400/90 truncate">
                              ID: {persona.civilServiceId}
                            </p>
                          </div>
                        </div>

                        {/* Complete Identification Card */}
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400">Designation:</span>
                            <span className="font-semibold truncate max-w-[170px] text-right">{persona.designation}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400">Cadre:</span>
                            <span className="font-mono text-[10px] text-amber-300 truncate max-w-[170px] text-right">{persona.cadre}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                            <span className="text-slate-400">Security Clearance:</span>
                            <span className="font-mono font-bold text-emerald-400">{persona.securityClearance}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {persona.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">
                          {persona.department}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-orange-400 group-hover:translate-x-1 transition-transform">
                          <span>Enter Demo Session</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 2: SIGN IN FORM (ONLY PEOPLE WITH REGISTERED ACCOUNTS CAN SIGN IN) */}
          {activeTab === 'login' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Registered Officer Sign In</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Access is strictly limited to verified civil personnel. If you don't have an account, please create one.
                </p>
              </div>

              {/* Account Not Found Alert */}
              {loginError && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-200">
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
                    className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    Create Account &rarr;
                  </button>
                </div>
              )}

              {/* Dynamic Identity Matcher Card (Shows who is found) */}
              {matchedUser ? (
                <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-orange-950/30 via-slate-950 to-slate-950 border border-orange-500/40 flex items-center gap-3.5">
                  <img
                    src={matchedUser.avatar}
                    alt={matchedUser.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/60 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{matchedUser.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        REGISTERED OFFICER
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">{matchedUser.designation}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-orange-400">
                      <span>ID: {matchedUser.civilServiceId || matchedUser.employeeId || 'SDGD-CADRE-101'}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{matchedUser.securityClearance || 'Level 3 Clearance'}</span>
                    </div>
                  </div>
                </div>
              ) : loginIdentifier.length > 3 ? (
                <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Searching personnel registry for "{loginIdentifier}"...</span>
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Official Email / Civil Service Cadre ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        setLoginError(null);
                      }}
                      placeholder="e.g. ananya.sharma@state.gov.in or SDGD-CADRE-101"
                      className="w-full pl-9.5 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Sign In Role Perspective
                  </label>
                  <select
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value as RoleType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="learner" className="bg-slate-900 text-white">Civil Service Officer (Learner)</option>
                    <option value="super_admin" className="bg-slate-900 text-white">Super Administrator (State Admin)</option>
                    <option value="hr_manager" className="bg-slate-900 text-white">HR / L&D Director</option>
                    <option value="manager" className="bg-slate-900 text-white">Team Lead / Department Manager</option>
                    <option value="trainer" className="bg-slate-900 text-white">Master Trainer & Content Creator</option>
                    <option value="sme" className="bg-slate-900 text-white">Subject Matter Expert (SME)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Security Passkey / Password
                    </label>
                    <span className="text-[10px] text-orange-400 font-mono">Demo default: demo1234</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9.5 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRateLimited}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Registered Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Don't have an account prompt */}
              <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400">Don't have an account on the portal? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegStep('details');
                  }}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 underline ml-1"
                >
                  Create one with Gmail OTP &rarr;
                </button>
              </div>

              {/* Quick Persona Fill Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-center">
                  Quick-Fill Existing Registered Accounts
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setLoginIdentifier('ananya.sharma@state.gov.in');
                      setLoginRole('learner');
                      setLoginError(null);
                    }}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-white text-left transition-colors truncate"
                  >
                    <strong className="block text-white">Ananya Sharma</strong>
                    <span className="text-[10px] text-slate-400 font-mono">Learner • SDGD-CADRE-101</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoginIdentifier('ravi.shankar@state.gov.in');
                      setLoginRole('super_admin');
                      setLoginError(null);
                    }}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-white text-left transition-colors truncate"
                  >
                    <strong className="block text-white">Ravi Shankar, IAS</strong>
                    <span className="text-[10px] text-slate-400 font-mono">Super Admin • Level 4</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoginIdentifier('arjun.mehta@state.gov.in');
                      setLoginRole('manager');
                      setLoginError(null);
                    }}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-white text-left transition-colors truncate"
                  >
                    <strong className="block text-white">Arjun Mehta</strong>
                    <span className="text-[10px] text-slate-400 font-mono">Manager • Team Lead</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoginIdentifier('pooja.deshmukh@state.gov.in');
                      setLoginRole('hr_manager');
                      setLoginError(null);
                    }}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-white text-left transition-colors truncate"
                  >
                    <strong className="block text-white">Pooja Deshmukh</strong>
                    <span className="text-[10px] text-slate-400 font-mono">HR Director • TEI Lead</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CREATE ACCOUNT WITH GMAIL OTP (DO NOT PROVIDE OTP BY YOURSELF) */}
          {activeTab === 'register' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl"
            >
              {regStep === 'details' ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Create Account • Gmail Verification</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Step 1 of 2: Enter your official details to receive a 6-digit Gmail authentication code
                    </p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Full Officer Name
                        </label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Vikramaditya Rao"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Official Gmail / Government Email
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="e.g. a85636815@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Department / Wing
                        </label>
                        <select
                          value={regDepartmentId}
                          onChange={(e) => setRegDepartmentId(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          {departments.map((d) => (
                            <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Cadre / Role Type
                        </label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as RoleType)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="learner" className="bg-slate-900 text-white">Civil Officer (Learner)</option>
                          <option value="manager" className="bg-slate-900 text-white">Team Lead / Manager</option>
                          <option value="hr_manager" className="bg-slate-900 text-white">HR / L&D Lead</option>
                          <option value="trainer" className="bg-slate-900 text-white">Content Creator / Trainer</option>
                          <option value="sme" className="bg-slate-900 text-white">Subject Matter Expert</option>
                          <option value="super_admin" className="bg-slate-900 text-white">Super Administrator</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Designation / Title
                        </label>
                        <input
                          type="text"
                          value={regDesignation}
                          onChange={(e) => setRegDesignation(e.target.value)}
                          placeholder="e.g. Sub-Divisional Officer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Civil Service ID / Employee Code
                        </label>
                        <input
                          type="text"
                          value={regEmployeeCode}
                          onChange={(e) => setRegEmployeeCode(e.target.value)}
                          placeholder="e.g. SDGD-CADRE-9481"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Create Account Passkey / Password
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
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
                  </form>
                </>
              ) : (
                /* STEP 2: USER ENTERS GMAIL OTP (DO NOT PROVIDE OTP BY YOURSELF) */
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
                      <Mail className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Officer Verification Code</h3>
                    <p className="text-xs text-slate-300">
                      6-digit civil verification code generated for:
                    </p>
                    <p className="font-mono text-sm font-bold text-orange-400 bg-orange-500/10 py-1 px-3 rounded-lg border border-orange-500/20 inline-block">
                      {regEmail}
                    </p>
                  </div>

                  {/* Delivery Status / Gateway Notice */}
                  {deliveredToMailbox ? (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
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
                      <p className="text-slate-300 text-[11px] leading-relaxed mb-2.5">
                        Outbound SMTP is not connected on this server, so email was not routed to Gmail servers. Your verification code is:
                      </p>
                      {sandboxOtp && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-amber-500/40">
                          <div className="flex items-center gap-2 pl-2">
                            <span className="text-[10px] uppercase font-mono text-slate-400">Code:</span>
                            <span className="font-mono text-xl font-black tracking-widest text-amber-400">{sandboxOtp}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setRegOtp(sandboxOtp);
                              addToast({ type: 'info', title: 'Code Filled', message: 'Verification code inserted.' });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 shadow transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" /> Auto-Fill Code
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5 text-center">
                        Enter 6-Digit Gmail Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full py-3.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-center text-2xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                        autoFocus
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || regOtp.length !== 6}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Code with Gateway...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify Gmail & Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
                      <button
                        type="button"
                        onClick={() => setRegStep('details')}
                        className="hover:text-white transition-colors"
                      >
                        &larr; Change Email Address
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={otpResendCooldown > 0 || isSendingOtp}
                        className="text-orange-400 hover:text-orange-300 disabled:text-slate-500 transition-colors font-semibold"
                      >
                        {otpResendCooldown > 0
                          ? `Resend Code in ${otpResendCooldown}s`
                          : 'Resend Verification Code'}
                      </button>
                    </div>
                  </form>

                  {/* Optional: Configure Real Gmail Gateway */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowSmtpConfig(!showSmtpConfig)}
                      className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-white transition-colors"
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
                      <form onSubmit={handleSaveSmtp} className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          To send real emails to your Gmail address, provide your Gmail address and a 16-character Google App Password (from Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords).
                        </p>
                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Gmail Address</label>
                          <input
                            type="email"
                            value={smtpUser}
                            onChange={(e) => setSmtpUser(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-orange-500 font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Google App Password (16 characters)</label>
                          <input
                            type="password"
                            value={smtpPass}
                            onChange={(e) => setSmtpPass(e.target.value)}
                            placeholder="•••• •••• •••• ••••"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-orange-500 font-mono"
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
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 relative z-20">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>SkillBridge Competency Engine • State Digital Governance</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          GovNet 256-bit Security Gateway • Official Gmail OTP Verification
        </div>
      </footer>
    </div>
  );
};

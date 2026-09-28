import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame,
  Users, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Globe, 
  Bell, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  Award, 
  AlertTriangle, 
  LogIn,
  UserPlus,
  Compass,
  ArrowUpRight,
  LogOut,
  Zap,
  Lock,
  BadgeCheck,
  RotateCcw,
  Fingerprint,
  ShieldAlert,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoleType } from '../types';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    logout,
    networkStatus, 
    isSimulatedOffline, 
    toggleSimulatedOffline, 
    syncNow, 
    pendingOfflineCount,
    language,
    setLanguage,
    heroStep,
    setHeroModalOpen,
    resetHeroWalkthrough,
    lockSession,
    sessionSecurity,
    alerts,
    setCurrentTab,
    isSidebarOpen,
    toggleSidebar
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'switch'>('login');

  const pendingAlerts = alerts.filter((a) => a.status === 'pending');

  const roleDisplayNames: Record<RoleType, { label: string; tag: string; color: string }> = {
    super_admin: { label: 'Super Admin', tag: 'ADMIN', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    hr_manager: { label: 'HR / L&D Lead', tag: 'TALENT', color: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
    manager: { label: 'Team Lead', tag: 'OPS', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    learner: { label: 'Civil Officer', tag: 'CADRE', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
    trainer: { label: 'Content Creator', tag: 'AUTHOR', color: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
    sme: { label: 'Subject Expert', tag: 'SME', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 py-3 backdrop-blur-xl bg-[#0b0c10]/95 border-b border-slate-800 transition-all">
        <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
          
          {/* Left Brand Identity & Sidebar Removal / Restore Option */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                isSidebarOpen 
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700' 
                  : 'bg-orange-500/15 border-orange-500/40 text-orange-400 hover:bg-orange-500/25 ring-1 ring-orange-500/30'
              }`}
              title={isSidebarOpen ? "Remove Sidebar (Focus Mode for all roles)" : "Show Navigation Sidebar"}
              aria-label={isSidebarOpen ? "Remove Sidebar" : "Show Sidebar"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4 text-slate-300 hover:text-orange-400 transition-colors" />
              ) : (
                <PanelLeft className="w-4 h-4 text-orange-400" />
              )}
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-600/30 shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight leading-none font-sans">
                  Skill<span className="text-orange-500">Bridge</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  SIH26075
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                Civil Services Competency Radar & Intelligence
              </p>
            </div>
          </div>

          {/* Center Interactive Walkthrough Guide Pill - Fully Responsive for Mobile, Tablet & Desktop */}
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setHeroModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-orange-500 text-white text-xs font-semibold shadow-md transition-all group"
              title="Open Step-by-Step Guided Walkthrough"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
              <span className="text-slate-300 hidden md:inline">Guided Walkthrough:</span>
              <span className="text-orange-400 font-mono font-bold">Step {heroStep}/6</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Explore
              </span>
            </motion.button>

            <button
              onClick={() => resetHeroWalkthrough(true)}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-400 hover:text-white transition-colors"
              title="Reset Guided Walkthrough to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
            </button>
          </div>

          {/* Right Controls & Quick Persona Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
              title="Toggle Language (English / हिन्दी)"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Offline Simulation Toggle */}
            <button
              onClick={toggleSimulatedOffline}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSimulatedOffline 
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
              title={isSimulatedOffline ? 'Simulated Offline (PWA Cache active)' : 'Online Mode'}
            >
              {isSimulatedOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline {pendingOfflineCount > 0 && `(${pendingOfflineCount})`}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Live</span>
                </>
              )}
            </button>

            {/* Alerts Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAlertsDropdownOpen(!alertsDropdownOpen)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center relative transition-all"
                aria-label="Escalations and alerts"
              >
                <Bell className="w-4 h-4" />
                {pendingAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {pendingAlerts.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {alertsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Compliance & Gap Nudges
                      </span>
                      <span className="text-xs font-mono font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        {pendingAlerts.length} Active
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {pendingAlerts.map((alt) => (
                        <div
                          key={alt.id}
                          onClick={() => {
                            setAlertsDropdownOpen(false);
                            setCurrentTab('alerts');
                          }}
                          className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-orange-500/30 cursor-pointer transition-all space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                              {alt.employeeName}
                            </span>
                            <span className="text-[10px] font-mono text-orange-400 font-bold">
                              {alt.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {alt.title}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setAlertsDropdownOpen(false);
                        setCurrentTab('alerts');
                      }}
                      className="w-full py-2 text-center text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-lg transition-all"
                    >
                      View All Escalations & Nudges
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Officer Identification & Security Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all text-left group"
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-orange-500/40"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow text-[8px]">
                    ✓
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <span className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded border ${roleDisplayNames[currentUser.role]?.color || ''}`}>
                      {roleDisplayNames[currentUser.role]?.tag || 'USER'}
                    </span>
                  </div>
                  <p className="text-[10px] text-orange-400/90 font-mono truncate max-w-[120px]">
                    {currentUser.civilServiceId || currentUser.employeeId || 'SDGD-CADRE-101'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 sm:p-4 z-50 space-y-3"
                  >
                    {/* Active Officer Identity Dossier (Fully clarifies WHO this person is) */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-orange-950/40 via-slate-950 to-slate-950 border border-orange-500/40 space-y-2">
                      <div className="flex items-start gap-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/60 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white truncate">{currentUser.name}</h4>
                            <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          </div>
                          <p className="text-xs text-slate-300 truncate">{currentUser.designation}</p>
                          <p className="text-[10px] font-mono text-orange-400 truncate">
                            ID: {currentUser.civilServiceId || currentUser.employeeId || 'SDGD-CADRE-101'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px]">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Cadre:</span>
                          <span className="font-mono text-amber-300 truncate max-w-[190px]">
                            {currentUser.cadre || 'State Civil Service (SCS)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Clearance:</span>
                          <span className="font-mono font-bold text-emerald-400 truncate max-w-[190px]">
                            {currentUser.securityClearance || 'LEVEL 3 — SECRET / RESTRICTED'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Identity Status:</span>
                          <span className="text-emerald-300 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Aadhaar & Biometric Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Persona Switcher List (with full identity badges) */}
                    <div className="space-y-1">
                      <div className="px-1 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Switch Verified Civil Officer</span>
                        <span className="font-mono text-[10px] text-orange-400">({users.length} Enrolled)</span>
                      </div>

                      <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                        {users.map((u) => {
                          const isCurrent = u.id === currentUser.id;
                          const roleMeta = roleDisplayNames[u.role];

                          return (
                            <button
                              key={u.id}
                              onClick={() => {
                                switchUser(u.id);
                                setUserDropdownOpen(false);
                              }}
                              className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-all ${
                                isCurrent
                                  ? 'bg-orange-500/20 border border-orange-500/40 text-white shadow-sm'
                                  : 'hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent'
                              }`}
                            >
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold truncate">{u.name}</p>
                                  <span className={`text-[8px] font-mono px-1 py-0.2 rounded border ${roleMeta?.color || ''}`}>
                                    {roleMeta?.tag}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                  <span className="truncate max-w-[130px]">{u.civilServiceId || u.designation}</span>
                                  <span className="text-emerald-400 text-[9px]">L{u.securityClearanceLevel || 3}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Security & Session Actions */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAuthModalTab('login');
                            setAuthModalOpen(true);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Sign In / 2FA</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAuthModalTab('switch');
                            setAuthModalOpen(true);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Dossiers</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          lockSession();
                        }}
                        className="w-full py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                        title="Lock terminal screen for officer security"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock Workstation (Security Guard)</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Cadre Gateway</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </header>

      {/* Auth / Account Management Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
};

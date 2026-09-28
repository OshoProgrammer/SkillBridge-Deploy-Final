import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Sparkles, 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  Sliders, 
  PlusCircle, 
  MessageSquare, 
  LogIn, 
  User, 
  ArrowUpRight, 
  Zap, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthModal } from '../AuthModal';
import { AddExternalLectureModal } from '../AddExternalLectureModal';
import { EmployeeCompetencyRecord } from '../../types';

export const LearnerDashboard: React.FC = () => {
  const { 
    currentEmployee, 
    currentUser, 
    competencies, 
    badges, 
    courses, 
    setCurrentTab, 
    setHeroStep 
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [addLectureOpen, setAddLectureOpen] = useState(false);

  if (!currentEmployee) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider">No active civil officer profile detected</p>
        <button
          onClick={() => {
            setAuthTab('login');
            setAuthModalOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          Authenticate Officer
        </button>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authTab}
        />
      </div>
    );
  }

  const employeeComps: EmployeeCompetencyRecord[] = Object.values(currentEmployee.competencies || {});
  const earnedBadges = badges.filter((b) => b.employeeId === currentEmployee.id);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Officer Cockpit Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={currentEmployee.avatar}
              alt={currentEmployee.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-lg shrink-0"
            />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Cadre Officer
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentEmployee.employeeCode}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {currentEmployee.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {currentEmployee.designation} • State Digital Governance
              </p>
            </div>
          </div>

          {/* Quick Readiness Score Tile */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-xl shadow-lg shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-medium tracking-wider block">Audited Readiness</span>
              <p className={`text-3xl font-bold font-mono ${
                currentEmployee.overallReadiness >= 75 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {currentEmployee.overallReadiness}%
              </p>
              <span className="text-[11px] text-slate-400 font-medium">5-Pillar Evidence Index</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base ${
              currentEmployee.overallReadiness >= 75 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Critical Deficit Alert Banner (if any) */}
      {currentEmployee.criticalGapsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Critical Competency Deficit Detected: Data Analytics (L2 vs Required L4)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your diagnostic scored 42% against the required 80% benchmark. A personalized 3-module pathway is queued for you.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setHeroStep(2);
              setCurrentTab('competency_radar');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-rose-600/20"
          >
            <span>Inspect Gap Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Competencies</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3 font-mono">{employeeComps.length}</p>
          <p className="text-xs text-slate-400 mt-1">Framework benchmarks</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Gaps</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-bold text-rose-400 mt-3 font-mono">{currentEmployee.criticalGapsCount}</p>
          <p className="text-xs text-slate-400 mt-1">Targeted for remediation</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verifiable Badges</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-cyan-400 mt-3 font-mono">{earnedBadges.length}</p>
          <p className="text-xs text-slate-400 mt-1">Cryptographic credentials</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mandatory Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className={`text-xl font-bold mt-4 ${
            currentEmployee.mandatoryTrainingOverdue ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {currentEmployee.mandatoryTrainingOverdue ? 'Overdue' : 'Compliant'}
          </p>
          <p className="text-xs text-slate-400 mt-1">CERT-In & Governance</p>
        </div>

      </div>

      {/* Deep-Dive Competency Breakdown & Targeted Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Competency Proficiency Matrix (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Officer Competency Breakdown (5-Pillar Score)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-metric evidence weighting: Assessment (30%), Practical (30%), Course (20%), Trainer (10%), Self (10%)
              </p>
            </div>

            <button
              onClick={() => setCurrentTab('competency_radar')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Spider Radar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {employeeComps.map((rec) => {
              const compMeta = competencies.find((c) => c.id === rec.competencyId);
              const score = rec.latestScore || rec.currentScore || 0;
              const isDeficit = score < 70;

              return (
                <div
                  key={rec.competencyId}
                  className={`p-4 rounded-xl border transition-all ${
                    isDeficit
                      ? 'bg-rose-950/10 border-rose-500/30'
                      : 'bg-slate-950/50 border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">
                          {compMeta?.name || rec.competencyId}
                        </h3>
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          isDeficit 
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        }`}>
                          Level {rec.currentLevel} / 5
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {compMeta?.category || 'Core Skill'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">Weighted Score</span>
                        <span className={`font-mono font-bold text-sm ${
                          isDeficit ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {score}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Pillar Score Bar Breakdown */}
                  <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-800/60 text-center text-[10px] font-mono">
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">Theory</span>
                      <span className="text-slate-200 font-bold">{rec.evidence?.knowledgeAssessment ?? 0}%</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">Practical</span>
                      <span className="text-slate-200 font-bold">{rec.evidence?.practicalTask ?? 0}%</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">LMS</span>
                      <span className="text-slate-200 font-bold">{rec.evidence?.courseCompletion ?? 0}%</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">Trainer</span>
                      <span className="text-slate-200 font-bold">{rec.evidence?.trainerEvaluation ?? 0}%</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block">Self</span>
                      <span className="text-slate-200 font-bold">{rec.evidence?.selfAssessment ?? 0}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Targeted Actions & Mentorship (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Personalized Pathway Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Targeted Remediator
              </span>
              <span className="text-xs font-mono text-indigo-400 font-semibold">3 Modules</span>
            </div>

            <h3 className="text-base font-bold text-white">
              Data Analytics Targeted Pathway
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tailored specifically to bridge your diagnostic gap from Level 2 to Level 4 without repeating material you already mastered.
            </p>

            <button
              onClick={() => {
                setHeroStep(3);
                setCurrentTab('learning_path');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <span>Launch Targeted Pathway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Connect with SME Card */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Assigned Subject Expert (SME)
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                alt="Dr. Sunita Iyer"
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Dr. Sunita Iyer</p>
                <p className="text-[10px] text-slate-400 truncate">Head of IT & Digital Governance</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab('experts')}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Schedule 1-on-1 Mentorship</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

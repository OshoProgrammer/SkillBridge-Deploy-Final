import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Calendar, 
  ArrowUpRight, 
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  Layers,
  ChevronRight,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FutureSkillGoal } from '../../types';

export const FutureSkillRadarView: React.FC = () => {
  const { futureSkills, employees, departments, setCurrentTab } = useApp();
  const [selectedSkillId, setSelectedSkillId] = useState<string>(futureSkills[0]?.id || 'future-ai-gov-2027');

  const activeSkill = futureSkills.find((s) => s.id === selectedSkillId) || futureSkills[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Strategic Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#161822] to-orange-950/30 border border-orange-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Strategic Skill Horizon
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Vision 2027 Mandate
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Future Skill Radar & Workforce Horizon
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Forecasting emerging digital governance requirements against 2027 statutory mandates. Proactively closing strategic competency gaps before operational bottlenecks occur.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-medium tracking-wider block">Target Horizon</span>
              <p className="text-2xl font-bold text-orange-400 font-mono">Q4 2027</p>
              <span className="text-xs text-slate-400">{futureSkills.length} Strategic Thrusts</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Strategic Thrust Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {futureSkills.map((skill, idx) => {
          const isSelected = skill.id === activeSkill?.id;
          const currentPct = Math.round((skill.currentWorkforceAverageLevel / 5) * 100);
          const targetPct = Math.round((skill.strategicTargetLevel / 5) * 100);
          const gapLvl = Math.max(0, Number((skill.strategicTargetLevel - skill.currentWorkforceAverageLevel).toFixed(1)));

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedSkillId(skill.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900/90 border-orange-500/60 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/30'
                  : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                    skill.priority === 'Critical'
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      : skill.priority === 'High'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      : 'bg-orange-500/10 text-orange-300 border-orange-500/20'
                  }`}>
                    {skill.priority} Priority • {skill.targetYear}
                  </span>
                  
                  <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                    -{gapLvl} Lvl Deficit
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                  {skill.competencyName}
                </h3>
                
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {skill.strategicRationale}
                </p>

                {/* Progress Indicators */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Current Workforce:</span>
                    <span className="text-slate-200 font-bold">L{skill.currentWorkforceAverageLevel} ({currentPct}%)</span>
                  </div>
                  
                  {/* Dual Bar: Current vs Required Benchmark */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentPct}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-0.5">
                    <span>Baseline (2025)</span>
                    <span className="text-orange-400 font-semibold">2027 Goal: L{skill.strategicTargetLevel} ({targetPct}%)</span>
                  </div>
                </div>
              </div>

              {/* Affected Roles Pills */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Impacted Officer Cadres:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(skill.affectedRoles || []).slice(0, 2).map((roleName, rIdx) => (
                    <span
                      key={rIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      {roleName}
                    </span>
                  ))}
                  {(skill.affectedRoles?.length || 0) > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                      +{(skill.affectedRoles?.length || 0) - 2} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Skill Deep Dive & Transition Roadmap */}
      {activeSkill && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Detailed Horizon Assessment
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Horizon Target: {activeSkill.targetYear}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {activeSkill.competencyName}
              </h2>
            </div>

            <button
              onClick={() => setCurrentTab('courses')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all self-start md:self-auto"
            >
              <span>Build Horizon Curriculum</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Rationale & Policy Context */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Strategic Statutory Rationale
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  {activeSkill.strategicRationale}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Impacted Civil Service Roles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(activeSkill.affectedRoles || []).map((role, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-200">{role}</span>
                      <span className="text-[10px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Target L{activeSkill.strategicTargetLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Roadmap Milestones */}
            <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Transition Milestones
              </h3>

              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 pl-6">
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-slate-950" />
                  <p className="text-xs font-semibold text-white">Phase 1: Baseline Diagnostics (2025)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Audit 100% of officer cadres on core prerequisites.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-slate-950" />
                  <p className="text-xs font-semibold text-white">Phase 2: Targeted Pathways (2026)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Deploy micro-credentials and AI-guided learning modules.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-purple-400 ring-4 ring-slate-950" />
                  <p className="text-xs font-semibold text-white">Phase 3: Full Readiness (2027)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Achieve state-mandated Level {activeSkill.strategicTargetLevel} certification for all impacted units.</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
};

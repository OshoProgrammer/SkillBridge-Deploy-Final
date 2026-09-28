import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Target, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  BellRing, 
  Search, 
  Filter, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TeamSkillGapsView: React.FC = () => {
  const { employees, competencies, courses, addToast, setCurrentTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompFilter, setSelectedCompFilter] = useState<string>('ALL');

  // Filter direct reports
  const teamMembers = employees.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendNudge = (empName: string, compName: string) => {
    addToast({
      type: 'success',
      title: 'Targeted Nudge Sent',
      message: `Statutory training reminder for "${compName}" dispatched to ${empName}.`,
    });
  };

  const handleAssignCourse = (empName: string) => {
    addToast({
      type: 'info',
      title: 'Course Assigned',
      message: `Recommended curriculum module linked to ${empName}'s active queue.`,
    });
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Apple-style Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                Manager & Team Lead Console
              </span>
              <span className="text-xs text-neutral-400">
                Direct Reports Competency Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              Team Skill Gaps & Deficits
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 max-w-2xl leading-relaxed">
              Monitor direct reports' practical skill gaps, track overdue mandatory competencies, and dispatch 1-click targeted micro-interventions.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-white/10 p-3 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Direct Team Members</span>
              <p className="text-2xl font-bold text-amber-400 font-mono">{teamMembers.length} Officers</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter direct report officers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => {
            teamMembers.forEach((e) => {
              if (e.criticalGapsCount > 0) handleSendNudge(e.name, 'Statutory Compliance Gaps');
            });
          }}
          className="py-2.5 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>Broadcast Nudges to All Deficient Officers</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((emp, idx) => {
          const compMap = emp.competencies || {};
          const compKeys = Object.keys(compMap);

          return (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-3xl bg-[#121214]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Officer Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                        {emp.name}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {emp.designation} • <span className="font-mono text-neutral-300">{emp.employeeCode}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Role Readiness</span>
                    <strong className={`text-lg font-bold font-mono ${
                      emp.overallReadiness >= 75
                        ? 'text-emerald-400'
                        : emp.overallReadiness >= 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}>
                      {emp.overallReadiness}%
                    </strong>
                  </div>
                </div>

                {/* Critical Gaps & Overdue Alert */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {emp.criticalGapsCount > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{emp.criticalGapsCount} Critical Skill Deficit</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>All Statutory Benchmarks Met</span>
                    </span>
                  )}

                  {emp.mandatoryTrainingOverdue && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      Overdue Mandatory Nudge
                    </span>
                  )}
                </div>

                {/* Competency Snapshot Bars */}
                <div className="mt-4 space-y-2 p-3.5 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block tracking-wider">
                    Competency Evidence Snapshot
                  </span>

                  {compKeys.slice(0, 3).map((cId) => {
                    const cRecord = compMap[cId];
                    const compDef = competencies.find((c) => c.id === cId);
                    return (
                      <div key={cId} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-neutral-300">
                          <span className="truncate max-w-[200px]">{compDef?.name || cId}</span>
                          <span className="font-mono text-neutral-400">
                            L{cRecord.currentLevel} (Score: {cRecord.currentScore}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              cRecord.currentLevel >= 3
                                ? 'bg-emerald-400'
                                : cRecord.currentLevel === 2
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                            style={{ width: `${cRecord.currentScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSendNudge(emp.name, 'Data Governance')}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3 h-3 text-amber-400" />
                  <span>Send Nudge</span>
                </button>

                <button
                  onClick={() => handleAssignCourse(emp.name)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Assign Module</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

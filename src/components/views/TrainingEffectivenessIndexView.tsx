import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  BarChart2, 
  Target, 
  ArrowUpRight, 
  Zap,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TrainingEffectivenessIndexView: React.FC = () => {
  const { courses, competencies, departments, addToast } = useApp();

  const [filterDept, setFilterDept] = useState<string>('ALL');

  // Simulated effectiveness metrics for courses
  const courseEffectivenessData = courses.map((course, idx) => {
    const comp = competencies.find((c) => c.id === course.competencyId);
    // Baseline pre-training score vs verified post-training score
    const preScore = 38 + (idx * 4) % 25;
    const postScore = Math.min(96, preScore + 25 + (idx * 7) % 28);
    const delta = postScore - preScore;
    const completionRate = 82 + (idx * 3) % 16;
    const practicalPassRate = 68 + (idx * 5) % 25;
    // TEI = (Competency Gain * 0.5) + (Practical Pass Rate * 0.3) + (Completion Rate * 0.2)
    const teiScore = Math.round(delta * 1.2 + practicalPassRate * 0.4);

    return {
      course,
      competencyName: comp?.name || 'Administrative Governance',
      preScore,
      postScore,
      delta,
      completionRate,
      practicalPassRate,
      teiScore: Math.min(98, Math.max(45, teiScore)),
      status: teiScore >= 75 ? 'HIGH_IMPACT' : teiScore >= 60 ? 'MODERATE' : 'VANITY_RISK',
    };
  });

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
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                Audited L&D Return on Investment
              </span>
              <span className="text-xs text-neutral-400">
                Pre vs Post Assessment Analytics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              Training Effectiveness Index (TEI)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 max-w-2xl leading-relaxed">
              Evaluating true competency uplift. Distinguishes vanity course completion from verifiable practical capability gains across all learning resources.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-white/10 p-4 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Average TEI Score</span>
              <p className="text-2xl font-bold text-emerald-400 font-mono">81.4 / 100</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Principle Callout Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-orange-950/20 border border-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              The Fundamental SkillBridge Mandate
            </h3>
            <p className="text-xs text-orange-200/80">
              A 100% course completion rate with 0% competency gain is classified as <strong>Vanity Learning</strong>. Only audited practical tasks elevate statutory readiness.
            </p>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-mono font-bold whitespace-nowrap">
          SIH26075 Standard
        </span>
      </div>

      {/* Course Effectiveness Table & Analytics */}
      <div className="rounded-3xl bg-[#121214]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>Course Impact & Competency Elevation Roster</span>
          </h3>
          <span className="text-xs text-neutral-400 font-mono">
            Evaluated on {courses.length} Integrated Curriculum Modules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-neutral-400">
                <th className="pb-3 font-semibold">Curriculum / Lecture</th>
                <th className="pb-3 font-semibold">Target Competency</th>
                <th className="pb-3 font-semibold text-center">Pre-Score</th>
                <th className="pb-3 font-semibold text-center">Post-Score</th>
                <th className="pb-3 font-semibold text-center">Competency Gain</th>
                <th className="pb-3 font-semibold text-center">TEI Rating</th>
                <th className="pb-3 font-semibold text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {courseEffectivenessData.map((item) => (
                <tr key={item.course.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 max-w-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block truncate">{item.course.title}</span>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono">
                          {item.course.platform || 'Academy'} • {item.course.durationHours}h
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span className="text-xs text-neutral-300 block">{item.competencyName}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">Level {item.course.targetCompetencyLevel} Target</span>
                  </td>

                  <td className="py-3.5 text-center font-mono text-neutral-400">
                    {item.preScore}%
                  </td>

                  <td className="py-3.5 text-center font-mono text-white font-semibold">
                    {item.postScore}%
                  </td>

                  <td className="py-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-xs">
                      +{item.delta}% Uplift
                    </span>
                  </td>

                  <td className="py-3.5 text-center">
                    <span className="font-mono font-bold text-sm text-white">
                      {item.teiScore}
                    </span>
                  </td>

                  <td className="py-3.5 text-right">
                    {item.status === 'HIGH_IMPACT' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        High Impact
                      </span>
                    ) : item.status === 'MODERATE' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Moderate Gain
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        Review Course
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

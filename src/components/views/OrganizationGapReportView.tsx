import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  AlertTriangle, 
  Target, 
  Download, 
  Filter, 
  CheckCircle2, 
  TrendingDown, 
  ShieldAlert, 
  Zap, 
  Building2, 
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrganizationGapReportView: React.FC = () => {
  const { competencies, departments, employees, addToast, setCurrentTab } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Compute gaps across all employees
  const categories = ['ALL', 'Technical & Digital', 'Governance & Regulatory', 'Domain & Strategic', 'Leadership & Behavioral'];

  const gapAnalytics = competencies.map((comp) => {
    let totalEmployeesEvaluated = 0;
    let totalGapLevel = 0;
    let criticalCount = 0;

    employees.forEach((emp) => {
      const record = emp.competencies ? emp.competencies[comp.id] : null;
      if (record) {
        totalEmployeesEvaluated++;
        const gap = Math.max(0, 3 - record.currentLevel); // target benchmark L3 default
        totalGapLevel += gap;
        if (gap >= 2) criticalCount++;
      }
    });

    const avgScore = totalEmployeesEvaluated > 0
      ? Math.round(
          employees.reduce((acc, curr) => {
            const r = curr.competencies ? curr.competencies[comp.id] : null;
            return acc + (r ? r.currentScore : 50);
          }, 0) / (totalEmployeesEvaluated || 1)
        )
      : 65;

    return {
      competency: comp,
      evaluatedCount: totalEmployeesEvaluated || employees.length,
      averageScore: avgScore,
      criticalCount: criticalCount || (avgScore < 60 ? 3 : 1),
      severity: avgScore < 60 ? 'HIGH' : avgScore < 75 ? 'MEDIUM' : 'LOW',
    };
  });

  const filteredAnalytics = gapAnalytics.filter((g) =>
    selectedCategory === 'ALL' ? true : g.competency.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0])
  );

  const handleExportReport = () => {
    addToast({
      type: 'success',
      title: 'Statutory Report Exported',
      message: 'State Competency Deficit Matrix exported to encrypted PDF/CSV format.',
    });
  };

  const handleDispatchIntervention = (compName: string) => {
    addToast({
      type: 'info',
      title: 'Targeted Nudge Broadcast',
      message: `Automated learning recommendations dispatched to all officers deficient in "${compName}".`,
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
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                Organizational Skill & Gap Intelligence
              </span>
              <span className="text-xs text-neutral-400">
                Statutory Gap Heatmap & Priority Matrix
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              Organization Competency Gap Report
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 max-w-2xl leading-relaxed">
              Comprehensive diagnosis of workforce capacity deficits across departments. Identifies critical statutory bottlenecks where training interventions are urgently needed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Statutory Report (PDF)</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-rose-600/30 border-rose-500/60 text-white shadow-md'
                : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Heatmap & Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Table / Cards */}
        <div className="lg:col-span-8 space-y-4">
          {filteredAnalytics.map((item, idx) => {
            const isHigh = item.severity === 'HIGH';
            const isMed = item.severity === 'MEDIUM';

            return (
              <motion.div
                key={item.competency.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-5 rounded-3xl border backdrop-blur-xl transition-all ${
                  isHigh
                    ? 'bg-rose-950/20 border-rose-500/30 shadow-[0_8px_25px_rgba(244,63,94,0.15)]'
                    : isMed
                    ? 'bg-amber-950/15 border-amber-500/20'
                    : 'bg-[#121214]/80 border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10">
                        {item.competency.category}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border font-mono ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isMed
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {item.severity} SEVERITY DEFICIT
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                      {item.competency.name}
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-xl">
                      {item.competency.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-neutral-400 font-bold block">Avg Score</span>
                      <strong className={`text-lg font-bold font-mono ${
                        isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {item.averageScore}%
                      </strong>
                    </div>

                    <button
                      onClick={() => handleDispatchIntervention(item.competency.name)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                      title="Dispatch Targeted Nudge"
                    >
                      <Send className="w-3.5 h-3.5 text-rose-400" />
                      <span className="hidden sm:inline">Nudge Officers</span>
                    </button>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-4">
                  <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isHigh
                          ? 'bg-gradient-to-r from-rose-500 to-red-400'
                          : isMed
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${item.averageScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-neutral-400 shrink-0">
                    {item.criticalCount} Critical Gaps
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Summary Analytics Card */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-[#121214]/80 border border-white/10 p-6 backdrop-blur-xl space-y-5"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  State-Wide Gap Summary
                </h3>
                <p className="text-[11px] text-neutral-400">Aggregated from all departments</p>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Total Competencies Audited</span>
                <span className="font-mono font-bold text-white">{competencies.length} Domains</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">High Severity Deficits</span>
                <span className="font-mono font-bold text-rose-400">
                  {gapAnalytics.filter((g) => g.severity === 'HIGH').length} Competencies
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Medium Severity Deficits</span>
                <span className="font-mono font-bold text-amber-400">
                  {gapAnalytics.filter((g) => g.severity === 'MEDIUM').length} Competencies
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Proficient Benchmark</span>
                <span className="font-mono font-bold text-emerald-400">
                  {gapAnalytics.filter((g) => g.severity === 'LOW').length} Competencies
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-300">
                <Zap className="w-3.5 h-3.5" />
                <span>Priority Action Directive</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-200/90">
                State administration should prioritize curriculum allocation to <strong>Data-Driven Policy Analytics</strong> and <strong>Cybersecurity Audit Protocols</strong> to resolve immediate compliance exposure.
              </p>
            </div>

            <button
              onClick={() => setCurrentTab('courses')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Browse Catalog & Assign Interventions</span>
            </button>
          </motion.div>
        </div>

      </div>

    </div>
  );
};

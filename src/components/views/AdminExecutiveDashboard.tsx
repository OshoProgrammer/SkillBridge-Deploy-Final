import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  FolderSync, 
  CheckCircle2, 
  ArrowUpRight, 
  Users, 
  ShieldCheck, 
  Activity,
  Layers,
  Sparkles,
  Zap,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminExecutiveDashboard: React.FC = () => {
  const { 
    organization, 
    departments, 
    employees, 
    competencies, 
    badges, 
    knowledgeResources, 
    auditLogs,
    setCurrentTab,
    switchUser
  } = useApp();

  // Aggregate organizational metrics
  const totalEmployees = employees.length;
  const avgReadiness = totalEmployees > 0 
    ? Math.round(employees.reduce((acc, e) => acc + e.overallReadiness, 0) / totalEmployees)
    : 0;

  const totalCriticalGaps = employees.reduce((acc, e) => acc + e.criticalGapsCount, 0);
  const totalBadges = badges.length;
  const totalReuses = knowledgeResources.reduce((acc, r) => acc + r.reuseCount, 0);
  const totalHoursSaved = totalReuses * 5.5;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Executive Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#161822] to-orange-950/30 border border-orange-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Executive Workforce Cockpit
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {organization?.name || 'State Digital Governance'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Workforce Competency & Readiness Index
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Real-time telemetry measuring verified competency evidence, closing operational deficits, and accelerating institutional knowledge reuse across departments.
            </p>
          </div>

          {/* Metric Comparison Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center gap-6 shadow-lg shrink-0">
            <div className="text-left">
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">LMS Completion</p>
              <p className="text-2xl font-bold text-amber-400 font-mono leading-tight">92%</p>
              <p className="text-[10px] text-slate-400">Surface Metric</p>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Audited Readiness</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono leading-tight">{avgReadiness}%</p>
              <p className="text-[10px] text-emerald-400 font-medium">Verified Evidence</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Readiness Avg</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3 font-mono">{avgReadiness}%</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+6.4%</span> vs baseline
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Deficits</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-rose-400 mt-3 font-mono">{totalCriticalGaps}</p>
          <p className="text-xs text-slate-400 mt-1">
            Officers requiring nudges
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Knowledge Reuse</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <FolderSync className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-400 mt-3 font-mono">{totalReuses}</p>
          <p className="text-xs text-slate-400 mt-1">
            ~{totalHoursSaved} hours saved
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Micro-Badges</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-400 mt-3 font-mono">{totalBadges}</p>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically signed
          </p>
        </div>

      </div>

      {/* Main Analysis Section: Departments & Priority Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Department Performance Table (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-400" />
                <span>Departmental Readiness & Deficit Index</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated scores computed from 5-pillar evidence matrices
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('organization')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>View All Wings</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {departments.map((dept) => {
              const deptEmps = employees.filter((e) => e.departmentId === dept.id);
              const deptAvg = deptEmps.length > 0 
                ? Math.round(deptEmps.reduce((acc, curr) => acc + curr.overallReadiness, 0) / deptEmps.length)
                : (dept.targetReadiness || 70);
              const gaps = deptEmps.reduce((acc, curr) => acc + curr.criticalGapsCount, 0);

              return (
                <div
                  key={dept.id}
                  onClick={() => setCurrentTab('organization')}
                  className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-orange-500/40 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Lead: {dept.headName || 'Administrator'} • {deptEmps.length} Officers
                    </p>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Readiness</span>
                      <span className={`font-mono font-bold text-sm ${
                        deptAvg >= 75 ? 'text-emerald-400' : deptAvg >= 60 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {deptAvg}%
                      </span>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Deficits</span>
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        gaps > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400'
                      }`}>
                        {gaps} Gaps
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Strategic Horizons & Fast Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Future Horizon Preview */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-orange-950/30 to-slate-900 border border-orange-500/20 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                <Compass className="w-3 h-3" />
                Vision 2027
              </span>
              <span className="text-xs font-mono text-orange-400 font-semibold">Q4 2027</span>
            </div>

            <h3 className="text-base font-bold text-white">
              Emerging Competency Horizon
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI Algorithmic Governance, Zero-Trust Quantum Cryptography, and Green Procurement readiness are forecasted for statutory mandate enforcement.
            </p>

            <button
              onClick={() => setCurrentTab('future_skills')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition-all"
            >
              <span>Explore Horizon Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Audit Trail Feed */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                Recent Evidence Proofs
              </h3>
              <button
                onClick={() => setCurrentTab('audit_logs')}
                className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold"
              >
                View Log
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-200">{log.actorName}</span>
                    <span className="font-mono">{log.timestamp.split('T')[0]}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-tight">
                    {log.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

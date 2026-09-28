import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  Sliders, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Users,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompetencyLevel } from '../../types';

export const LearnerCompetencyRadarView: React.FC = () => {
  const { currentEmployee, employees, roles, competencies, scoringWeights, setCurrentTab } = useApp();

  const defaultEmpId = currentEmployee?.id || employees[0]?.id || '';
  const [selectedEmpId, setSelectedEmpId] = useState<string>(defaultEmpId);

  const activeEmp = employees.find((e) => e.id === selectedEmpId) || currentEmployee || employees[0];
  const [selectedCompId, setSelectedCompId] = useState<string>('comp-data-analytics');

  // Competency simulator state
  const [simulatedLevel, setSimulatedLevel] = useState<number>(4);

  if (!activeEmp) {
    return (
      <div className="p-8 text-center text-slate-400 rounded-2xl bg-slate-900/60 border border-slate-800">
        <p className="font-mono text-xs">NO OFFICER RECORD LOADED</p>
      </div>
    );
  }

  // Find role safely
  const role = roles.find((r) => r.id === activeEmp.roleId) || roles[0] || {
    id: 'role-jr-gov-officer',
    title: activeEmp.designation || 'Civil Service Officer',
    requiredCompetencies: [
      { competencyId: 'comp-digital-governance', requiredLevel: 4, priority: 'Critical' },
      { competencyId: 'comp-data-analytics', requiredLevel: 4, priority: 'Critical' },
      { competencyId: 'comp-cybersecurity', requiredLevel: 3, priority: 'High' },
      { competencyId: 'comp-communication', requiredLevel: 3, priority: 'High' },
    ],
  };

  const compRecords = activeEmp.competencies || {};

  // Build Radar Data points safely
  const rawCompList = (role.requiredCompetencies && role.requiredCompetencies.length > 0)
    ? role.requiredCompetencies
    : competencies.slice(0, 4).map((c) => ({
        competencyId: c.id,
        requiredLevel: 4 as CompetencyLevel,
        priority: 'High' as const,
      }));

  const requiredCompList = rawCompList.map((rc) => {
    const comp = competencies.find((c) => c.id === rc.competencyId);
    const record = compRecords[rc.competencyId];
    const currentScore = record ? (record.calculatedEvidenceScore || 40) : 40;
    const currentLvl = record ? record.currentLevel : 1;
    const requiredLvl = rc.requiredLevel || 3;
    const gap = Math.max(0, requiredLvl - currentLvl);

    return {
      competencyId: rc.competencyId,
      name: comp?.name || rc.competencyId,
      category: comp?.category || 'Technical',
      requiredLevel: requiredLvl,
      currentLevel: currentLvl,
      currentScore,
      gap,
      priority: rc.priority || 'Medium',
      record,
    };
  });

  // Calculate radar polygon points
  const centerX = 160;
  const centerY = 160;
  const maxRadius = 115;
  const totalAngles = requiredCompList.length || 4;

  const getCoordinates = (index: number, levelVal: number) => {
    const angle = (Math.PI * 2 * index) / totalAngles - Math.PI / 2;
    const r = (levelVal / 5) * maxRadius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y, angle };
  };

  const requiredPolygonPoints = requiredCompList
    .map((item, idx) => {
      const { x, y } = getCoordinates(idx, item.requiredLevel);
      return `${x},${y}`;
    })
    .join(' ');

  const currentPolygonPoints = requiredCompList
    .map((item, idx) => {
      const { x, y } = getCoordinates(idx, item.currentLevel);
      return `${x},${y}`;
    })
    .join(' ');

  const activeCompData = requiredCompList.find((c) => c.competencyId === selectedCompId) || requiredCompList[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Geometric Gap Diagnostics
              </span>
              <span className="text-xs text-slate-400">
                {activeEmp.name} • {role.title}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Competency Gap Radar & Multi-Evidence Matrix
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Visualizing the discrepancy between target job-role expectations (Required Level) and verified officer capability (Current Level).
            </p>
          </div>

          {/* Quick Officer Selector */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl shadow-lg shrink-0">
            <Users className="w-4 h-4 text-indigo-400" />
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-slate-900 text-white">
                  {emp.name} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main Radar & Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: SVG Spider Radar Visualizer (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 backdrop-blur-xl shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Spider Radar Visualizer
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Required
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Current
              </span>
            </div>
          </div>

          {/* SVG Radar Chart */}
          <div className="relative py-4 flex items-center justify-center">
            <svg width="320" height="320" viewBox="0 0 320 320" className="overflow-visible">
              {/* Concentric Web Circles (Levels 1 to 5) */}
              {[1, 2, 3, 4, 5].map((lvl) => {
                const r = (lvl / 5) * maxRadius;
                return (
                  <circle
                    key={lvl}
                    cx={centerX}
                    cy={centerY}
                    r={r}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray={lvl === 5 ? 'none' : '2,2'}
                  />
                );
              })}

              {/* Axis Rays */}
              {requiredCompList.map((item, idx) => {
                const { x, y } = getCoordinates(idx, 5);
                return (
                  <line
                    key={idx}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Required Polygon (Indigo Blueprint) */}
              <polygon
                points={requiredPolygonPoints}
                fill="rgba(99, 102, 241, 0.15)"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4,4"
              />

              {/* Current Polygon (Emerald Actual) */}
              <polygon
                points={currentPolygonPoints}
                fill="rgba(16, 185, 129, 0.25)"
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* Corner Points & Labels */}
              {requiredCompList.map((item, idx) => {
                const reqCoords = getCoordinates(idx, item.requiredLevel);
                const curCoords = getCoordinates(idx, item.currentLevel);
                const labelCoords = getCoordinates(idx, 5.8);

                const isSelected = item.competencyId === selectedCompId;

                return (
                  <g key={idx} onClick={() => setSelectedCompId(item.competencyId)} className="cursor-pointer">
                    {/* Required Node */}
                    <circle
                      cx={reqCoords.x}
                      cy={reqCoords.y}
                      r="4"
                      fill="#6366f1"
                    />

                    {/* Current Node */}
                    <circle
                      cx={curCoords.x}
                      cy={curCoords.y}
                      r={isSelected ? '6' : '4.5'}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    {/* Text Label */}
                    <text
                      x={labelCoords.x}
                      y={labelCoords.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[10px] font-semibold transition-all ${
                        isSelected ? 'fill-indigo-300 font-bold' : 'fill-slate-400 hover:fill-slate-200'
                      }`}
                    >
                      {item.name.length > 18 ? `${item.name.slice(0, 16)}...` : item.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-mono">
            Click any competency node to inspect weighted evidence and assign learning paths
          </p>
        </div>

        {/* Right: Competency Evidence Diagnostic & Remediation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Selected Competency Card */}
          {activeCompData && (
            <motion.div
              key={activeCompData.competencyId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {activeCompData.category}
                    </span>
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                      activeCompData.priority === 'Critical'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}>
                      {activeCompData.priority} Priority
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1.5">
                    {activeCompData.name}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Gap Status</span>
                    <span className={`font-mono font-bold text-sm ${
                      activeCompData.gap > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {activeCompData.gap > 0 ? `-${activeCompData.gap} Level Deficit` : 'Benchmark Achieved'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current vs Target Comparison Tiles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <span className="text-xs text-slate-400 uppercase font-medium block">Current Level</span>
                  <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">Level {activeCompData.currentLevel} / 5</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Calculated Score: {activeCompData.currentScore}%</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <span className="text-xs text-slate-400 uppercase font-medium block">Role Required Benchmark</span>
                  <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">Level {activeCompData.requiredLevel} / 5</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Role: {role.title}</p>
                </div>
              </div>

              {/* 5-Pillar Score Breakdown */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  5-Pillar Evidence Breakdown
                </h3>
                <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Knowledge</span>
                    <span className="text-slate-200 font-bold">{activeCompData.record?.evidenceBreakdown?.knowledge || 0}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Practical</span>
                    <span className="text-slate-200 font-bold">{activeCompData.record?.evidenceBreakdown?.practical || 0}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">LMS</span>
                    <span className="text-slate-200 font-bold">{activeCompData.record?.evidenceBreakdown?.completion || 0}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Trainer</span>
                    <span className="text-slate-200 font-bold">{activeCompData.record?.evidenceBreakdown?.trainer || 0}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Self</span>
                    <span className="text-slate-200 font-bold">{activeCompData.record?.evidenceBreakdown?.self || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => setCurrentTab('learning_path')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <span>Launch Targeted Learning Path</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTab('assessments')}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  Take Diagnostic
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
};

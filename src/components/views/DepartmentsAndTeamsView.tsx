import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  Search, 
  ShieldCheck, 
  ArrowUpRight,
  UserCheck,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Department, Employee } from '../../types';

export const DepartmentsAndTeamsView: React.FC = () => {
  const { departments, employees, organization, switchUser, setCurrentTab } = useApp();

  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'dept-it-gov');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'deficit' | 'ready' | 'overdue'>('all');

  const activeDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  // Filter employees belonging to this department
  const deptEmployees = employees.filter((e) => e.departmentId === activeDept?.id);

  const filteredEmployees = deptEmployees.filter((e) => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'deficit') return e.criticalGapsCount > 0;
    if (statusFilter === 'ready') return e.overallReadiness >= 75;
    if (statusFilter === 'overdue') return e.mandatoryTrainingOverdue;
    return true;
  });

  // Department aggregate metrics
  const avgReadiness = deptEmployees.length
    ? Math.round(deptEmployees.reduce((acc, curr) => acc + curr.overallReadiness, 0) / deptEmployees.length)
    : (activeDept?.targetReadiness || 72);

  const totalCriticalGaps = deptEmployees.reduce((acc, curr) => acc + curr.criticalGapsCount, 0);
  const overdueCount = deptEmployees.filter((e) => e.mandatoryTrainingOverdue).length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Hero Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#161822] to-orange-950/30 border border-orange-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                State Administrative Wings
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {organization?.name || 'State Digital Governance'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Departments & Team Wings
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Drill down into organizational wings to inspect readiness health, competency deficit concentrations, and officer allocations.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-medium tracking-wider block">Active Departments</span>
              <p className="text-2xl font-bold text-orange-400 font-mono">{departments.length}</p>
              <span className="text-xs text-slate-400">{employees.length} Total Civil Officers</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Department Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept, idx) => {
          const isSelected = dept.id === activeDept?.id;
          const count = employees.filter((e) => e.departmentId === dept.id).length;
          const deptEmps = employees.filter((e) => e.departmentId === dept.id);
          const deptAvg = deptEmps.length
            ? Math.round(deptEmps.reduce((acc, curr) => acc + curr.overallReadiness, 0) / deptEmps.length)
            : (dept.targetReadiness || 70);

          return (
            <motion.button
              key={dept.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden backdrop-blur-xl group ${
                isSelected
                  ? 'bg-slate-900/90 border-orange-500/60 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/30'
                  : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono ${
                  isSelected ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'
                }`}>
                  {dept.code}
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {count} Officers
                </span>
              </div>

              <h3 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-orange-400 transition-colors">
                {dept.name}
              </h3>
              
              <p className="text-xs text-slate-400 mt-1 truncate">
                Head: {dept.headName || 'Administrator'}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Readiness:</span>
                <span className={`font-bold font-mono ${
                  deptAvg >= 75 ? 'text-emerald-400' : deptAvg >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {deptAvg}%
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active Department Diagnostic & Officer Roster */}
      {activeDept && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Diagnostic Card (4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 backdrop-blur-xl space-y-5 shadow-xl"
          >
            <div>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Department Profile
              </span>
              <h2 className="text-xl font-bold text-white mt-2">
                {activeDept.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official state operational wing ({activeDept.code})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Department Lead:</span>
                <span className="font-semibold text-white">{activeDept.headName || 'Administrator'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Assigned Officers:</span>
                <span className="font-mono text-white font-bold">{deptEmployees.length} Officers</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Critical Skill Deficits:</span>
                <span className="font-mono font-bold text-rose-400">{totalCriticalGaps} Deficits</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Overdue Mandatory Modules:</span>
                <span className="font-mono font-bold text-amber-400">{overdueCount} Pending</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>Average Workforce Readiness</span>
                <span className="font-mono text-indigo-400 font-bold">{avgReadiness}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    avgReadiness >= 75 ? 'bg-emerald-500' : avgReadiness >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${avgReadiness}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('roles_matrix')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span>View Role Competency Framework</span>
                <ArrowUpRight className="w-4 h-4 text-indigo-400" />
              </button>
            </div>
          </motion.div>

          {/* Right Officer Table (8 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-8 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Officer Roster & Competency Diagnostics</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {filteredEmployees.length} of {deptEmployees.length} officers displayed
                  </p>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search officer, role, code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="deficit">Has Deficits</option>
                    <option value="ready">Proficient (75%+)</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-medium">
                      <th className="pb-3 font-semibold">Officer</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Readiness</th>
                      <th className="pb-3 font-semibold">Deficits</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-white">{emp.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{emp.employeeCode}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 pr-3 text-slate-300">
                          {emp.designation}
                        </td>

                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">{emp.overallReadiness}%</span>
                            <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  emp.overallReadiness >= 75 ? 'bg-emerald-400' : 'bg-amber-400'
                                }`}
                                style={{ width: `${emp.overallReadiness}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 pr-3">
                          {emp.criticalGapsCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
                              <AlertTriangle className="w-3 h-3" />
                              {emp.criticalGapsCount} Deficits
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Compliant
                            </span>
                          )}
                        </td>

                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              switchUser(emp.id);
                              setCurrentTab('competency_radar');
                            }}
                            className="px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
                          >
                            Inspect Radar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No officers found matching your query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>

        </div>
      )}

    </div>
  );
};

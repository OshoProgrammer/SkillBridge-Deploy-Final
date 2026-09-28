import React, { useState } from 'react';
import { 
  GitFork, 
  Save, 
  AlertCircle, 
  Check, 
  HelpCircle, 
  Sliders, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { updateRoleCompetencies } from '../../services/api';
import { JobRole } from '../../types';

export const RolesAndCompetenciesMatrix: React.FC = () => {
  const { 
    roles, 
    competencies, 
    currentUser, 
    addToast, 
    refreshState, 
    setHeroStep,
    switchUser,
    setCurrentTab
  } = useApp();

  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'role-jr-digital-gov');
  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  // Local draft state for editing role required competencies
  const [editingRequirements, setEditingRequirements] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    if (selectedRole) {
      selectedRole.requiredCompetencies.forEach((rc) => {
        map[rc.competencyId] = rc.requiredLevel;
      });
    }
    return map;
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleRoleSelect = (role: JobRole) => {
    setSelectedRoleId(role.id);
    const map: Record<string, number> = {};
    role.requiredCompetencies.forEach((rc) => {
      map[rc.competencyId] = rc.requiredLevel;
    });
    setEditingRequirements(map);
  };

  const handleLevelChange = (competencyId: string, level: number) => {
    setEditingRequirements((prev) => ({
      ...prev,
      [competencyId]: level,
    }));
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    try {
      setIsSaving(true);
      const updatedArray = Object.entries(editingRequirements).map(([competencyId, requiredLevel]) => ({
        competencyId,
        requiredLevel,
      }));

      await updateRoleCompetencies(selectedRole.id, updatedArray, currentUser.name);
      await refreshState();
      addToast({
        type: 'success',
        title: 'Competency Framework Saved',
        message: `Updated required competency benchmarks for ${selectedRole.title}. Workforce gaps recomputed.`,
      });
      setHeroStep(2);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save competency framework updates.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const levelDescriptions: Record<number, { name: string; desc: string }> = {
    1: { name: 'Level 1: Novice', desc: 'Basic conceptual awareness, requires direct supervision.' },
    2: { name: 'Level 2: Beginner', desc: 'Understands core routines; can perform standard tasks with guidance.' },
    3: { name: 'Level 3: Competent', desc: 'Independent practitioner, executes departmental workflows reliably.' },
    4: { name: 'Level 4: Proficient', desc: 'Advanced subject mastery; troubleshoots exceptions and mentors peers.' },
    5: { name: 'Level 5: Expert', desc: 'Organizational authority; shapes state policy and innovative frameworks.' },
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
              SIH Hero Flow • Step 1 of 6
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mt-1 font-['Space_Grotesk']">
            Role Competency Framework & Requirements
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Map organizational roles to precise required competency proficiency levels (1-5).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving & Recomputing...' : 'Save & Recompute Gaps'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Role Selector (Left) & Competency Matrix Configuration (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Job Roles List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            State Department Roles ({roles.length})
          </h3>

          <div className="space-y-2">
            {roles.map((r) => {
              const isSelected = r.id === selectedRoleId;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/40 shadow-md'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{r.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.departmentName}</p>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1 shadow-sm shadow-indigo-400" />
                    )}
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{r.requiredCompetencies.length} Required Competencies</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Competency Level Sliders (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          
          {selectedRole && (
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    {selectedRole.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedRole.description}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {selectedRole.departmentName}
                </span>
              </div>

              {/* Competency Benchmark Matrix */}
              <div className="mt-6 space-y-5">
                {competencies.map((comp) => {
                  const currentRequired = editingRequirements[comp.id] || 3;
                  const levelInfo = levelDescriptions[currentRequired];

                  return (
                    <div
                      key={comp.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{comp.name}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                              {comp.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{comp.description}</p>
                        </div>

                        {/* Current Selected Level Badge */}
                        <div className="text-right flex-shrink-0">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono">
                            Required: Level {currentRequired} / 5
                          </span>
                        </div>
                      </div>

                      {/* Interactive 1-5 Radio Scale */}
                      <div className="grid grid-cols-5 gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                          const isLevelSelected = currentRequired === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleLevelChange(comp.id, lvl)}
                              className={`py-2 px-1 rounded-lg text-center border transition-all text-xs font-semibold ${
                                isLevelSelected
                                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                              }`}
                            >
                              <div className="text-[10px] opacity-80">L{lvl}</div>
                              <div className="text-[11px] font-bold truncate">
                                {lvl === 1 ? 'Novice' : lvl === 2 ? 'Beginner' : lvl === 3 ? 'Competent' : lvl === 4 ? 'Proficient' : 'Expert'}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Level description text */}
                      <p className="text-[11px] text-indigo-300/80 bg-indigo-950/20 px-2.5 py-1 rounded border border-indigo-900/30">
                        <strong>{levelInfo.name}:</strong> {levelInfo.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Next Step Action Guide */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Next in Hero Flow: View Learner Gap</h5>
                    <p className="text-[11px] text-slate-300">
                      Switch to Learner (Ananya Sharma) to see her real-time 42% gap in Data Analytics.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleSave();
                    switchUser('user-learner-ananya');
                    setCurrentTab('dashboard');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex-shrink-0"
                >
                  <span>Proceed to Step 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

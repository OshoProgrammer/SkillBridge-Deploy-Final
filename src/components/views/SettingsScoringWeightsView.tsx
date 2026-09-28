import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_SCORING_WEIGHTS } from '../../lib/scoring';
import { ScoringWeights } from '../../types';

export const SettingsScoringWeightsView: React.FC = () => {
  const { scoringWeights, addToast } = useApp();

  const [weights, setWeights] = useState<ScoringWeights>({ ...scoringWeights });

  const totalPercentage = Math.round(
    (weights.knowledgeAssessment +
      weights.practicalTask +
      weights.courseCompletion +
      weights.trainerEvaluation +
      weights.selfAssessment) * 100
  );

  const isValidTotal = totalPercentage === 100;

  const handleSliderChange = (key: keyof ScoringWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: val / 100,
    }));
  };

  const handleReset = () => {
    setWeights({ ...DEFAULT_SCORING_WEIGHTS });
    addToast({
      type: 'info',
      title: 'Defaults Restored',
      message: 'Formula reset to standard 30-30-20-10-10 distribution.',
    });
  };

  const handleSave = () => {
    if (!isValidTotal) {
      addToast({
        type: 'error',
        title: 'Invalid Formula Distribution',
        message: `The weights must sum to exactly 100% (Current Total: ${totalPercentage}%).`,
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Scoring Formula Weights Updated',
      message: 'New deterministic weights will be applied to all future assessment evaluations.',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
                Deterministic Engine Configuration
              </span>
              <span className="text-xs text-slate-400">
                Formula Governance
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mt-1.5 font-['Space_Grotesk']">
              Evidence-Based Scoring Formula Weights
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Configure the 5 evidentiary pillars used by the deterministic calculation engine. AI models provide explanations but are strictly barred from setting official scores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Formula</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formula Integrity Total Validator */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
        isValidTotal
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
      }`}>
        <div className="flex items-center gap-2.5">
          {isValidTotal ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <div>
            <h4 className="text-xs font-bold">
              {isValidTotal ? 'Formula Balance Valid (100%)' : `Formula Out of Balance (Current: ${totalPercentage}%)`}
            </h4>
            <p className="text-[11px] opacity-80">
              {isValidTotal
                ? 'The 5 weighted pillars satisfy complete mathematical determinism.'
                : 'Please adjust sliders so that total weight equals exactly 100%.'}
            </p>
          </div>
        </div>

        <span className="text-lg font-bold font-mono">
          {totalPercentage}%
        </span>
      </div>

      {/* Sliders Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        
        {/* Pillar 1: Knowledge Assessment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white">1. Knowledge Diagnostic & Post Assessment (MCQs)</span>
            <span className="font-mono text-indigo-300 font-bold">{Math.round(weights.knowledgeAssessment * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.knowledgeAssessment * 100)}
            onChange={(e) => handleSliderChange('knowledgeAssessment', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-[11px] text-slate-500">Evaluates conceptual domain mastery, statutory regulations, and factual retention.</p>
        </div>

        {/* Pillar 2: Practical Task */}
        <div className="space-y-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white">2. Practical Application & Action Memo Rubric</span>
            <span className="font-mono text-indigo-300 font-bold">{Math.round(weights.practicalTask * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.practicalTask * 100)}
            onChange={(e) => handleSliderChange('practicalTask', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-[11px] text-slate-500">Measures ability to solve simulated public administration scenarios and SLA diagnostics.</p>
        </div>

        {/* Pillar 3: Course Completion */}
        <div className="space-y-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white">3. Structured Course Completion & Module Coverage</span>
            <span className="font-mono text-indigo-300 font-bold">{Math.round(weights.courseCompletion * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.courseCompletion * 100)}
            onChange={(e) => handleSliderChange('courseCompletion', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-[11px] text-slate-500">Rewards participation and completion of accredited curriculum modules.</p>
        </div>

        {/* Pillar 4: Trainer Evaluation */}
        <div className="space-y-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white">4. Trainer & Master SME Evaluation</span>
            <span className="font-mono text-indigo-300 font-bold">{Math.round(weights.trainerEvaluation * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.trainerEvaluation * 100)}
            onChange={(e) => handleSliderChange('trainerEvaluation', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-[11px] text-slate-500">Direct qualitative grading from state-certified master trainers.</p>
        </div>

        {/* Pillar 5: Self-Assessment */}
        <div className="space-y-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white">5. Self-Reflective Assessment & Confidence Matrix</span>
            <span className="font-mono text-indigo-300 font-bold">{Math.round(weights.selfAssessment * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(weights.selfAssessment * 100)}
            onChange={(e) => handleSliderChange('selfAssessment', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-[11px] text-slate-500">Learner self-appraisal of operational readiness and task confidence.</p>
        </div>

      </div>

    </div>
  );
};

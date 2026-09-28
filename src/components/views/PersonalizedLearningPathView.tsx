import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Target, 
  Award, 
  Compass, 
  BrainCircuit, 
  Bot, 
  Play, 
  Youtube, 
  Globe,
  ArrowUpRight,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateRankedLearningPaths } from '../../lib/scoring';
import { explainLearningPathWithAI } from '../../services/api';
import { ExternalLecturePlayerModal } from '../ExternalLecturePlayerModal';
import { Course } from '../../types';

export const PersonalizedLearningPathView: React.FC = () => {
  const { 
    currentEmployee, 
    employees,
    roles,
    courses, 
    setCurrentTab, 
    setSelectedCourseId, 
    setSelectedAssessmentId,
    setHeroStep 
  } = useApp();

  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(true);
  const [selectedExternalCourse, setSelectedExternalCourse] = useState<Course | null>(null);

  const activeEmp = currentEmployee || employees[0];

  if (!activeEmp) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
        <p className="font-mono text-xs">NO ACTIVE OFFICER PROFILE DETECTED</p>
      </div>
    );
  }

  const currentRole = roles.find((r) => r.id === activeEmp.roleId) || roles[0] || {
    id: activeEmp.roleId || 'role-jr-gov-officer',
    title: activeEmp.designation,
    departmentId: activeEmp.departmentId,
    description: '',
    requiredCompetencies: [],
  };

  const rankedItems = generateRankedLearningPaths(currentRole, activeEmp.competencies || {}, courses);
  const topPriority = rankedItems[0];

  useEffect(() => {
    async function loadExplanation() {
      if (!topPriority) return;
      setIsLoadingAI(true);
      try {
        const res = await explainLearningPathWithAI({
          roleTitle: activeEmp.designation,
          competencyName: topPriority.competencyName,
          currentScore: topPriority.currentScore,
          requiredLevel: topPriority.requiredLevel,
        });
        setAiExplanation(res.explanation || '');
      } catch (err) {
        setAiExplanation(
          `Prioritized based on statutory gap diagnostics: ${topPriority.competencyName} requires targeted remediation to bridge Level ${topPriority.requiredLevel} benchmarks.`
        );
      } finally {
        setIsLoadingAI(false);
      }
    }
    loadExplanation();
  }, [activeEmp.id, topPriority?.competencyId]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Targeted Remediation Engine
              </span>
              <span className="text-xs text-slate-400">
                {activeEmp.name} • {currentRole.title}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Personalized Competency Pathway
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Dynamically synthesized from your verified gap radar. We eliminate redundant training by assigning only the modules needed to bridge your specific competency deficit.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-xl shadow-lg shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-medium tracking-wider block">Target Competency</span>
              <p className="text-lg font-bold text-indigo-400 truncate max-w-[180px]">
                {topPriority?.competencyName || 'Data Analytics'}
              </p>
              <span className="text-xs text-rose-400 font-mono font-semibold">Priority 1 Deficit</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Diagnostic Explanation Banner */}
      {topPriority && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 backdrop-blur-xl space-y-2 shadow-lg"
        >
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Competency Diagnostic Rationale</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {isLoadingAI ? 'Analyzing multi-evidence diagnostic scores and role benchmarks...' : aiExplanation}
          </p>
        </motion.div>
      )}

      {/* Sequenced Pathway Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Targeted Curriculum Sequence (3-Module Fast Track)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Est. Time: 6.5 Hours
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {(topPriority?.courses || courses.slice(0, 3)).map((course, idx) => {
            const isCompleted = (activeEmp.completedCourseIds || []).includes(course.id);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 backdrop-blur-xl ${
                  isCompleted 
                    ? 'bg-slate-900/40 border-slate-800 opacity-80' 
                    : 'bg-slate-900/70 border-slate-800 hover:border-indigo-500/50 shadow-xl'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `0${idx + 1}`}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {course.level}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.durationMinutes} mins
                      </span>
                      {isCompleted && (
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Completed
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mt-1.5">
                      {course.title}
                    </h3>
                    
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 w-full md:w-auto flex items-center justify-end gap-3">
                  {isCompleted ? (
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setCurrentTab('courses');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                    >
                      Review Module
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setCurrentTab('courses');
                      }}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      <span>Start Module</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Capstone Diagnostic Action Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-900 to-indigo-950/20 border border-emerald-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Ready for Post-Training Capstone Assessment?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Prove Level 4 mastery by completing the realistic public administration capstone task to earn your verifiable micro-credential badge.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setHeroStep(4);
            setSelectedAssessmentId('assess-data-post-02');
            setCurrentTab('assessments');
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/20 transition-all"
        >
          <span>Launch Capstone Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* External Player Modal */}
      {selectedExternalCourse && (
        <ExternalLecturePlayerModal
          course={selectedExternalCourse}
          onClose={() => setSelectedExternalCourse(null)}
          onComplete={() => {}}
        />
      )}

    </div>
  );
};

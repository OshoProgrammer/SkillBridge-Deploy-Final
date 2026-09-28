import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen, 
  Sparkles, 
  Play, 
  FileText, 
  Youtube, 
  Globe 
} from 'lucide-react';
import { Course } from '../types';
import { useApp } from '../context/AppContext';

interface ExternalLecturePlayerModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExternalLecturePlayerModal: React.FC<ExternalLecturePlayerModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const { currentEmployee, addToast, refreshState } = useApp();
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !course) return null;

  const handleMarkComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      addToast({
        type: 'success',
        title: 'Lecture Completed & Evidence Logged',
        message: `Course completion recorded for "${course.title}". Practical evidence points updated.`,
      });
    }, 600);
  };

  const getPlatformBrand = (plat?: string) => {
    switch (plat) {
      case 'youtube':
        return { name: 'YouTube Lecture', color: 'text-red-400', badge: 'bg-red-500/10 border-red-500/30 text-red-300' };
      case 'google_ai_studio':
        return { name: 'Google AI Studio', color: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' };
      case 'coursera':
        return { name: 'Coursera Course', color: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/30 text-blue-300' };
      case 'udemy':
        return { name: 'Udemy Masterclass', color: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/30 text-purple-300' };
      case 'linkedin_learning':
        return { name: 'LinkedIn Learning', color: 'text-sky-400', badge: 'bg-sky-500/10 border-sky-500/30 text-sky-300' };
      default:
        return { name: 'MOOC Resource', color: 'text-indigo-400', badge: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' };
    }
  };

  const brand = getPlatformBrand(course.platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Apple-style Backdrop Blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-2xl"
      />

      {/* Modal Dialog */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-4xl bg-[#121214]/95 border border-white/10 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-3xl overflow-hidden z-10 text-white flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${brand.badge}`}>
              {brand.name}
            </span>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.durationHours} Hours Duration</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Title & Instructor */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Space_Grotesk']">
              {course.title}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Instructor: <span className="text-white font-medium">{course.instructor || course.authorName}</span> • Target Level: <span className="text-indigo-400 font-semibold">Level {course.targetCompetencyLevel}</span>
            </p>
          </div>

          {/* Video Player or Interactive Sandbox Preview */}
          {course.embedUrl ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <iframe
                src={course.embedUrl}
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">External Platform Course Sandbox</h4>
                  <p className="text-xs text-neutral-400 mt-0.5 max-w-md">
                    This lecture is hosted on {brand.name}. Open the official curriculum in a focused tab to complete the modules.
                  </p>
                </div>
              </div>

              {course.externalUrl && (
                <a
                  href={course.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
                >
                  <span>Launch on {brand.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Description & Syllabus Takeaways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Curriculum Summary</span>
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Key Takeaways</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {course.modules[0]?.keyTakeaways?.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                )) || (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Mastery of core administrative frameworks and practical evidence logging.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Evidence Logging / Reflection Section */}
          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Evidence Logging & Learner Reflection</span>
              </h4>
              <span className="text-[10px] text-indigo-300 font-mono">
                Counts towards Evidence Score
              </span>
            </div>

            <textarea
              rows={2}
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              placeholder="Enter brief practical notes or takeaways demonstrating applied understanding in your department..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-indigo-500/30 text-xs text-white placeholder-neutral-500 outline-none resize-none focus:border-indigo-400"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-neutral-400">
                Logged under officer: <strong className="text-white">{currentEmployee?.name || 'Active Learner'}</strong>
              </span>

              <button
                disabled={isSubmitting || isCompleted}
                onClick={handleMarkComplete}
                className={`py-2 px-5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Evidence Verified & Saved' : isSubmitting ? 'Verifying...' : 'Mark Complete & Submit Evidence'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-black/60 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>SkillBridge Evidence Engine</span>
          <span className="text-orange-400">Training ≠ Competency</span>
        </div>
      </motion.div>
    </div>
  );
};

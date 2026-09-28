import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Play, 
  Layers, 
  PlusCircle, 
  Youtube, 
  Globe, 
  ExternalLink, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { completeCourse } from '../../services/api';
import { Course, LecturePlatform } from '../../types';
import { AddExternalLectureModal } from '../AddExternalLectureModal';
import { ExternalLecturePlayerModal } from '../ExternalLecturePlayerModal';

export const CoursesCatalogView: React.FC = () => {
  const { 
    courses, 
    currentEmployee, 
    selectedCourseId, 
    setSelectedCourseId, 
    setSelectedAssessmentId,
    setCurrentTab,
    addToast,
    refreshState 
  } = useApp();

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExternalCourse, setSelectedExternalCourse] = useState<Course | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || null;

  const handleDownloadOfflinePack = (course: Course) => {
    const offlinePacks = JSON.parse(localStorage.getItem('skillbridge_offline_packs') || '[]');
    if (!offlinePacks.some((p: any) => p.id === course.id)) {
      offlinePacks.push(course);
      localStorage.setItem('skillbridge_offline_packs', JSON.stringify(offlinePacks));
    }
    addToast({
      type: 'success',
      title: 'Offline Learning Pack Downloaded',
      message: `"${course.title}" cached locally in IndexedDB for low-connectivity field areas.`,
    });
  };

  const handleMarkCourseCompleted = async (courseId: string) => {
    if (!currentEmployee) return;
    try {
      await completeCourse(currentEmployee.id, courseId);
      await refreshState();
      addToast({
        type: 'success',
        title: 'Course Completed',
        message: 'Course completion evidence logged (20% weight satisfied). Ready for post-assessment.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update course completion.',
      });
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.instructor && c.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform =
      platformFilter === 'ALL'
        ? true
        : platformFilter === 'external'
        ? c.platform && c.platform !== 'internal'
        : c.platform === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  const getPlatformBadge = (plat?: string) => {
    switch (plat) {
      case 'youtube':
        return { label: 'YouTube Video', badge: 'bg-red-500/10 text-red-300 border-red-500/30' };
      case 'google_ai_studio':
        return { label: 'Google AI Studio', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
      case 'coursera':
        return { label: 'Coursera Course', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30' };
      case 'udemy':
        return { label: 'Udemy Masterclass', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
      case 'linkedin_learning':
        return { label: 'LinkedIn Learning', badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30' };
      default:
        return { label: 'Internal Academy', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' };
    }
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
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                Universal Curriculum Hub
              </span>
              <span className="text-xs text-neutral-400">
                Internal Modules & External Platform Aggregator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              Targeted Competency Courses & Lectures
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 max-w-2xl leading-relaxed">
              Curriculum modules linked to state competency benchmarks. Aggregate lectures from YouTube, Google AI Studio, Coursera, Udemy, or LinkedIn Learning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add External Lecture</span>
            </button>

            {activeCourse && (
              <button
                onClick={() => setSelectedCourseId(null)}
                className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                ← Back to Catalog
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter and Search Bar (When catalog is visible) */}
      {!activeCourse && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, topics, or instructors..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Platform Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'All Modules' },
                { id: 'youtube', label: 'YouTube' },
                { id: 'google_ai_studio', label: 'Google AI Studio' },
                { id: 'coursera', label: 'Coursera' },
                { id: 'udemy', label: 'Udemy' },
                { id: 'linkedin_learning', label: 'LinkedIn' },
                { id: 'internal', label: 'Internal Academy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPlatformFilter(tab.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    platformFilter === tab.id
                      ? 'bg-indigo-600/30 border-indigo-500/60 text-white shadow-md'
                      : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Reader View (When A Course is Open) */}
      {activeCourse ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Modules Outline (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl bg-[#121214]/80 border border-white/10 p-5 space-y-4 backdrop-blur-xl">
            <div className="pb-3 border-b border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Target: Level {activeCourse.targetCompetencyLevel}
              </span>
              <h3 className="text-base font-bold text-white mt-1 font-['Space_Grotesk']">
                {activeCourse.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">{activeCourse.durationHours} Hours Total</p>
            </div>

            <div className="space-y-2">
              {activeCourse.modules.map((mod, idx) => {
                const isActive = activeModuleIndex === idx;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                        : 'bg-black/40 border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">
                        Module {idx + 1}
                      </span>
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {mod.durationMinutes}m
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold mt-1 truncate">{mod.title}</h4>
                  </button>
                );
              })}
            </div>

            {/* Offline Pack Download */}
            <div className="pt-3 border-t border-white/5">
              <button
                onClick={() => handleDownloadOfflinePack(activeCourse)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Save Offline Pack (PWA)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Module Content Player (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-[#121214]/80 border border-white/10 p-6 space-y-6 flex flex-col justify-between backdrop-blur-xl">
            {activeCourse.modules[activeModuleIndex] && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    {activeCourse.modules[activeModuleIndex].title}
                  </h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-neutral-300 font-mono">
                    {activeCourse.modules[activeModuleIndex].durationMinutes} Minutes
                  </span>
                </div>

                {/* Lesson Content */}
                <div className="prose prose-invert max-w-none text-xs text-neutral-300 leading-relaxed space-y-3 font-sans whitespace-pre-line">
                  {activeCourse.modules[activeModuleIndex].content}
                </div>

                {/* Key Takeaways */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Key Practical Takeaways:
                  </h4>
                  <ul className="space-y-1 text-xs text-neutral-300 list-disc list-inside">
                    {activeCourse.modules[activeModuleIndex].keyTakeaways.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Bottom Navigation Controls */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleMarkCourseCompleted(activeCourse.id)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Module As Completed (Evidence)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAssessmentId('assess-data-analytics-post');
                  setCurrentTab('assessments');
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>Launch Post-Training Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Courses Grid Catalog */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => {
            const isCompleted = currentEmployee?.completedCourseIds.includes(course.id);
            const isExternal = !!course.platform && course.platform !== 'internal';
            const brand = getPlatformBadge(course.platform);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-3xl bg-[#121214]/80 border border-white/10 hover:border-white/20 backdrop-blur-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${brand.badge}`}>
                      {brand.label}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-3 leading-snug font-['Space_Grotesk']">
                    {course.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-neutral-500" /> {course.durationHours}h
                    </span>
                    <span>•</span>
                    <span className="font-mono">{course.modulesCount} Modules</span>
                    <span>•</span>
                    <span className="truncate">{course.instructor || course.authorName}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleDownloadOfflinePack(course)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Download offline learning pack"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (isExternal) {
                        setSelectedExternalCourse(course);
                      } else {
                        setSelectedCourseId(course.id);
                        setActiveModuleIndex(0);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{isExternal ? 'Open Lecture' : 'Open Module'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add External Lecture Modal */}
      <AddExternalLectureModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* External Player Modal */}
      {selectedExternalCourse && (
        <ExternalLecturePlayerModal
          course={selectedExternalCourse}
          isOpen={!!selectedExternalCourse}
          onClose={() => setSelectedExternalCourse(null)}
        />
      )}

    </div>
  );
};

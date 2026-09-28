import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  Youtube, 
  Globe, 
  BookOpen, 
  Sparkles, 
  Link, 
  Clock, 
  User, 
  Target, 
  X, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LecturePlatform, CompetencyLevel, Course } from '../types';

interface AddExternalLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExternalLectureModal: React.FC<AddExternalLectureModalProps> = ({ isOpen, onClose }) => {
  const { competencies, departments, addExternalCourse, currentUser, addToast } = useApp();

  const [platform, setPlatform] = useState<LecturePlatform>('youtube');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [instructor, setInstructor] = useState('');
  const [durationHours, setDurationHours] = useState(1.5);
  const [competencyId, setCompetencyId] = useState(competencies[0]?.id || 'comp-data-analytics');
  const [targetLevel, setTargetLevel] = useState<CompetencyLevel>(3);
  const [description, setDescription] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');

  if (!isOpen) return null;

  // Auto-detect platform from URL
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    const lower = newUrl.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      setPlatform('youtube');
    } else if (lower.includes('coursera.org')) {
      setPlatform('coursera');
    } else if (lower.includes('udemy.com')) {
      setPlatform('udemy');
    } else if (lower.includes('linkedin.com/learning')) {
      setPlatform('linkedin_learning');
    } else if (lower.includes('aistudio.google') || lower.includes('ai.google.dev')) {
      setPlatform('google_ai_studio');
    }
  };

  // Helper to compute YouTube embed URL if applicable
  const computeEmbedUrl = (rawUrl: string, plat: LecturePlatform): string | undefined => {
    if (plat === 'youtube') {
      try {
        if (rawUrl.includes('youtu.be/')) {
          const id = rawUrl.split('youtu.be/')[1]?.split('?')[0];
          if (id) return `https://www.youtube.com/embed/${id}`;
        }
        if (rawUrl.includes('watch?v=')) {
          const id = rawUrl.split('watch?v=')[1]?.split('&')[0];
          if (id) return `https://www.youtube.com/embed/${id}`;
        }
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please provide a lecture title and valid platform URL.',
      });
      return;
    }

    const embed = computeEmbedUrl(url, platform);
    const selectedComp = competencies.find((c) => c.id === competencyId);
    const dept = departments[0] || { id: 'dept-it-gov', name: 'IT & Digital Governance' };

    const newCourse: Omit<Course, 'id'> = {
      organizationId: 'org-state-gov',
      departmentId: dept.id,
      title: title.trim(),
      description: description.trim() || `Verified external curriculum resource from ${platform.toUpperCase()} linked to ${selectedComp?.name || 'competency'}.`,
      competencyId,
      targetCompetencyLevel: targetLevel,
      durationHours: Number(durationHours) || 1.5,
      modulesCount: 1,
      authorName: instructor.trim() || `${platform.toUpperCase()} Instructor`,
      instructor: instructor.trim() || `${platform.toUpperCase()} Expert`,
      departmentName: dept.name,
      tags: [platform.replace('_', ' ').toUpperCase(), selectedComp?.name || 'Competency', 'External MOOC'],
      isOfflineAvailable: false,
      platform,
      externalUrl: url.trim(),
      embedUrl: embed,
      thumbnailUrl:
        platform === 'youtube'
          ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
          : platform === 'google_ai_studio'
          ? 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
      modules: [
        {
          id: `mod-ext-${Date.now()}`,
          title: `Core Lecture: ${title.trim()}`,
          durationMinutes: Math.round((Number(durationHours) || 1.5) * 60),
          content: `External lecture hosted on ${platform.toUpperCase()}. Access URL: ${url.trim()}`,
          keyTakeaways: keyTakeaway.trim()
            ? [keyTakeaway.trim(), 'Understand key theoretical frameworks', 'Apply concepts to state governance']
            : ['Apply core principles to state administration', 'Pass verified evidence assessment'],
        },
      ],
    };

    addExternalCourse(newCourse);
    onClose();
  };

  const platformIcons: Record<LecturePlatform, { label: string; color: string; bg: string }> = {
    internal: { label: 'Internal Academy', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
    youtube: { label: 'YouTube Video', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    google_ai_studio: { label: 'Google AI Studio', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    coursera: { label: 'Coursera Course', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    udemy: { label: 'Udemy Masterclass', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    linkedin_learning: { label: 'LinkedIn Learning', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
    mooc_other: { label: 'Other MOOC / Portal', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative w-full max-w-xl bg-[#121214]/95 border border-white/10 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden z-10 text-white"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight font-['Space_Grotesk'] text-white">
                Add External Lecture / MOOC
              </h2>
              <p className="text-xs text-neutral-400">
                Aggregate YouTube, Coursera, Udemy, LinkedIn Learning or Google AI Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* Platform Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Source Platform
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {(['youtube', 'google_ai_studio', 'coursera', 'udemy', 'linkedin_learning', 'mooc_other'] as LecturePlatform[]).map((plat) => {
                const isSelected = platform === plat;
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPlatform(plat)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 justify-center ${
                      isSelected
                        ? `${platformIcons[plat].bg} ${platformIcons[plat].color} font-bold ring-1 ring-white/20 shadow-md`
                        : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{platformIcons[plat].label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lecture URL */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Lecture / Resource URL</span>
              <span className="text-[10px] text-neutral-400">Auto-detects platform</span>
            </label>
            <div className="relative">
              <Link className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://aistudio.google.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-white placeholder-neutral-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Lecture / Course Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Executive Data Analytics in Public Administration"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 text-sm text-white placeholder-neutral-500 outline-none transition-all"
            />
          </div>

          {/* Target Competency & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Target Competency Tag
              </label>
              <select
                value={competencyId}
                onChange={(e) => setCompetencyId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1e] border border-white/10 focus:border-indigo-500 text-xs text-white outline-none"
              >
                {competencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Target Proficiency Level
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(Number(e.target.value) as CompetencyLevel)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1e] border border-white/10 focus:border-indigo-500 text-xs text-white outline-none"
              >
                <option value={1}>Level 1 (Foundational / Awareness)</option>
                <option value={2}>Level 2 (Intermediate / Working Knowledge)</option>
                <option value={3}>Level 3 (Proficient / Practitioner)</option>
                <option value={4}>Level 4 (Advanced / Specialist)</option>
                <option value={5}>Level 5 (Expert / Strategic Architect)</option>
              </select>
            </div>
          </div>

          {/* Instructor & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Instructor / Creator / Organization
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g. Google DeepMind / Dr. Alex Freberg"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Duration (Hours)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="40"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseFloat(e.target.value) || 1)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Summary & Syllabus Overview
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of key techniques covered in this lecture..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none resize-none"
            />
          </div>

          {/* Key Takeaway */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Key Learning Outcome / Deliverable
            </label>
            <input
              type="text"
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              placeholder="e.g. Analyze 100,000 public records and export dashboard KPI variance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Link Lecture to State Competency Engine</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

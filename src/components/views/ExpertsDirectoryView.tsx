import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  Mail, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  MessageSquare, 
  Award, 
  Sparkles, 
  Send, 
  X, 
  Search, 
  Filter, 
  Star, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpertProfile } from '../../types';

export const ExpertsDirectoryView: React.FC = () => {
  const { experts, currentUser, addMentorshipRequest, addToast } = useApp();
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(null);
  const [consultationTopic, setConsultationTopic] = useState('');
  const [urgency, setUrgency] = useState<'Routine' | 'High Priority' | 'Statutory Deadline'>('High Priority');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExperts = experts.filter((exp) =>
    exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exp.departmentName && exp.departmentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (exp.specializationAreas && exp.specializationAreas.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert) return;
    if (!consultationTopic.trim()) {
      addToast({
        type: 'warning',
        title: 'Topic Required',
        message: 'Please describe the consultation objective or statutory dilemma.',
      });
      return;
    }

    addMentorshipRequest({
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      topic: consultationTopic.trim(),
      urgency,
    });

    setIsModalOpen(false);
    setConsultationTopic('');
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
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">
                Institutional Knowledge Network
              </span>
              <span className="text-xs text-neutral-400">
                Peer & Subject Matter Mentorship
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              Subject Matter Expert Directory
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 max-w-2xl leading-relaxed">
              Connect with certified state departmental experts for 1-on-1 capacity coaching, peer statutory troubleshooting, and technical guidance.
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 p-4 rounded-2xl text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Certified State SMEs</span>
            <p className="text-2xl font-bold text-cyan-400 font-mono">{experts.length} Experts</p>
            <p className="text-[10px] text-neutral-400">Across All Government Wings</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by expert name, domain, or ministry..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 outline-none focus:border-cyan-500"
        />
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperts.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="p-6 rounded-3xl bg-[#121214]/80 border border-white/10 hover:border-white/20 backdrop-blur-xl flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={exp.avatar}
                  alt={exp.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/30 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">{exp.name}</h3>
                    {exp.isAvailableForMentorship && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Available for Mentorship" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">{exp.designation}</p>
                  <p className="text-[10px] text-neutral-500">{exp.departmentName || 'State IT Wing'}</p>
                </div>
              </div>

              {/* Specializations */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block tracking-wider">
                  Expertise Areas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(exp.specializationAreas || ['Digital Governance', 'Policy Architecture']).map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/10 text-cyan-300 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Verified SOPs / Guides:</span>
                  <strong className="text-white font-mono">{exp.authoredResourcesCount || 3} Artifacts</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mentorship Hours:</span>
                  <strong className="text-emerald-400 font-mono">{exp.mentorshipHoursCompleted || 24} Hours</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-medium">
                {exp.isAvailableForMentorship ? '● Accepting Sessions' : '○ Office Hours Busy'}
              </span>

              <button
                onClick={() => {
                  setSelectedExpert(exp);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Request Mentorship</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      {isModalOpen && selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-[#121214]/95 border border-white/10 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden z-10 text-white"
          >
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Request Mentorship: {selectedExpert.name}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookConsultation} className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <img src={selectedExpert.avatar} alt={selectedExpert.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedExpert.name}</h4>
                  <p className="text-[10px] text-neutral-400">{selectedExpert.designation}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Dilemma / Technical Topic
                </label>
                <textarea
                  required
                  rows={3}
                  value={consultationTopic}
                  onChange={(e) => setConsultationTopic(e.target.value)}
                  placeholder="e.g. Guidance on ETL automated ingestion for district compliance reports..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 outline-none resize-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1e] border border-white/10 text-xs text-white outline-none"
                >
                  <option value="Routine">Routine (Within 5 working days)</option>
                  <option value="High Priority">High Priority (Within 48 hours)</option>
                  <option value="Statutory Deadline">Statutory Deadline (Urgent)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Dispatch Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  UserCheck, 
  Sparkles, 
  Briefcase, 
  ShieldCheck, 
  Star, 
  Video, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SMEProfileAndRequestsView: React.FC = () => {
  const { 
    currentUser, 
    experts, 
    mentorshipRequests, 
    updateMentorshipRequest, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'requests'>('requests');
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState('');

  // Find SME record for current user or default to Dr. Sunita Iyer / Dr. Priya Rao
  const currentSME = experts.find((e) => e.name.toLowerCase().includes(currentUser.name.toLowerCase())) || experts[0];

  const handleOpenResponse = (reqId: string) => {
    setSelectedRequestId(reqId);
    setResponseNotes('');
    setResponseModalOpen(true);
  };

  const handleConfirmSchedule = (status: 'scheduled' | 'resolved') => {
    if (!selectedRequestId) return;
    updateMentorshipRequest(selectedRequestId, status, responseNotes);
    setResponseModalOpen(false);
    setSelectedRequestId(null);
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
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                Subject Matter Expert Console
              </span>
              <span className="text-xs text-neutral-400">
                Institutional Knowledge & Mentorship Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
              My Expert Profile & Consultation Requests
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 max-w-2xl leading-relaxed">
              Manage your domain credentials, review incoming technical consultation tickets from state officers, and schedule 1-on-1 mentorship sessions.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-white/10 p-3 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Pending Requests</span>
              <p className="text-2xl font-bold text-purple-400 font-mono">
                {mentorshipRequests.filter((r) => r.status === 'pending').length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Segmented Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all border ${
            activeTab === 'requests'
              ? 'bg-purple-600/30 border-purple-500/60 text-white shadow-md'
              : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
          }`}
        >
          Consultation Requests Inbox ({mentorshipRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all border ${
            activeTab === 'profile'
              ? 'bg-purple-600/30 border-purple-500/60 text-white shadow-md'
              : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
          }`}
        >
          Expert Domain Profile
        </button>
      </div>

      {/* TAB 1: CONSULTATION REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentorshipRequests.map((req, idx) => {
              const isPending = req.status === 'pending';
              const isScheduled = req.status === 'scheduled';

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-5 rounded-3xl border backdrop-blur-xl space-y-4 flex flex-col justify-between ${
                    isPending
                      ? 'bg-purple-950/20 border-purple-500/30 shadow-[0_8px_25px_rgba(168,85,247,0.15)]'
                      : 'bg-[#121214]/80 border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        req.urgency === 'Statutory Deadline'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : req.urgency === 'High Priority'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      }`}>
                        {req.urgency}
                      </span>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isPending
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : isScheduled
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                      {req.topic}
                    </h3>

                    <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-neutral-300 space-y-1">
                      <p>
                        Requester: <strong className="text-white">{req.requesterName}</strong> ({req.requesterRole})
                      </p>
                      <p className="text-neutral-400 font-mono text-[11px]">{req.requesterEmail}</p>
                      {req.responseNotes && (
                        <p className="text-purple-300 text-[11px] pt-1 border-t border-white/5">
                          SME Response: {req.responseNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Logged {new Date(req.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {isPending && (
                        <button
                          onClick={() => handleOpenResponse(req.id)}
                          className="py-1.5 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Accept & Schedule Video Call</span>
                        </button>
                      )}

                      {isScheduled && (
                        <button
                          onClick={() => updateMentorshipRequest(req.id, 'resolved', 'Mentorship session concluded successfully.')}
                          className="py-1.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SME PROFILE */}
      {activeTab === 'profile' && currentSME && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 rounded-3xl bg-[#121214]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4"
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={currentSME.avatar}
                alt={currentSME.name}
                className="w-24 h-24 rounded-3xl object-cover ring-2 ring-purple-500/40 shadow-xl"
              />
              <h2 className="text-lg font-bold text-white mt-3 font-['Space_Grotesk']">
                {currentSME.name}
              </h2>
              <p className="text-xs text-neutral-400">{currentSME.designation}</p>
              <span className="mt-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                {currentSME.yearsOfExperience} Years State Experience
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Consultations</span>
                <span className="font-mono text-white font-bold">{currentSME.totalConsultations} Delivered</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Officer Rating</span>
                <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {currentSME.averageRating} / 5.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Office Hours</span>
                <span className="font-mono text-purple-300 font-bold">{currentSME.availabilityStatus}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 rounded-3xl bg-[#121214]/80 border border-white/10 p-6 backdrop-blur-xl space-y-5"
          >
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Verified Competency Endorsements</h3>
              <div className="flex flex-wrap gap-2">
                {currentSME.verifiedCompetencyIds.map((cId) => (
                  <span
                    key={cId}
                    className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>{cId.replace('comp-', '').replace('-', ' ').toUpperCase()}</span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-2">Expert Bio & Background</h3>
              <p className="text-xs text-neutral-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                {currentSME.bio}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-2">Published Knowledge Artifacts</h3>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-neutral-300 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>State Data Architecture & Compliance Blueprint v4.2</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Verified SOP</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Response Modal */}
      {responseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setResponseModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />
          <div className="relative w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Accept Consultation & Schedule
            </h3>
            <p className="text-xs text-neutral-400">
              Provide instructions, video meeting link, or preparatory notes for the officer.
            </p>

            <textarea
              rows={3}
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              placeholder="e.g. Confirmed for Friday 11:00 AM on Google Meet (meet.google.com/xyz). Please bring sample data schema."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 outline-none resize-none focus:border-purple-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResponseModalOpen(false)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmSchedule('scheduled')}
                className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
              >
                Confirm & Dispatch Meeting
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

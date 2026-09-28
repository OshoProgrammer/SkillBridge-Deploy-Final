import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Share2, 
  Download, 
  ExternalLink, 
  Lock, 
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompetencyBadge } from '../../types';

export const MicroCredentialsView: React.FC = () => {
  const { badges, currentEmployee, organization } = useApp();
  const [selectedBadge, setSelectedBadge] = useState<CompetencyBadge | null>(badges[0] || null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                Verifiable Competency Registry
              </span>
              <span className="text-xs text-slate-400">
                Tamper-Evident Micro-Credentials
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mt-1.5 font-['Space_Grotesk']">
              Official State Micro-Credentials & Badges
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Issued exclusively upon passing deterministic evidence thresholds (Knowledge + Practical + Evaluation). Verifiable via cryptographic hash and dynamic QR payload.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Issued Registry Count</span>
            <p className="text-xl font-bold text-amber-400 font-mono">{badges.length} Badges</p>
            <p className="text-[10px] text-slate-400">100% Cryptographically Sealed</p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-400/60 shadow-xl flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {badge.badgeCode}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-4 font-['Space_Grotesk'] leading-snug">
                {badge.competencyName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Awarded to <strong className="text-slate-200">{badge.employeeName}</strong>
              </p>

              <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Certified Level:</span>
                  <strong className="text-emerald-400 font-mono">Level {badge.achievedLevel}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verified Evidence Score:</span>
                  <strong className="text-white font-mono">{badge.scorePercentage}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuer:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{badge.issuer}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                {badge.verificationHash.substring(0, 12)}...
              </span>

              <button
                onClick={() => {
                  setSelectedBadge(badge);
                  setIsVerificationModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Verify Credential</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verification & Certificate Modal */}
      {isVerificationModalOpen && selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Certificate Presentation */}
            <div className="p-6 bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 space-y-4 text-center">
              
              <div className="flex justify-end">
                <button
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/40 mx-auto flex items-center justify-center text-amber-300 shadow-xl">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                  STATE OF DIGITAL GOVERNANCE • SKILLBRIDGE CREDENTIAL
                </span>
                <h3 className="text-lg font-bold text-white mt-1 font-['Space_Grotesk']">
                  {selectedBadge.competencyName}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Proficiency Level {selectedBadge.achievedLevel} Mastery
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <strong className="text-white">{selectedBadge.employeeName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Credential ID:</span>
                  <strong className="text-amber-300 font-mono">{selectedBadge.badgeCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issue Date:</span>
                  <span className="text-slate-300">{new Date(selectedBadge.issuedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deterministic Score:</span>
                  <strong className="text-emerald-400 font-mono">{selectedBadge.scorePercentage}% (Passing)</strong>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Verification Hash:</span>
                  <span className="text-[10px] font-mono text-orange-400">{selectedBadge.verificationHash}</span>
                </div>
              </div>

              {/* Dynamic QR Verification Representation */}
              <div className="p-3 bg-white rounded-xl inline-block shadow-lg">
                <div className="w-32 h-32 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white text-center p-2">
                  <QrCode className="w-16 h-16 text-amber-400" />
                  <span className="text-[8px] font-mono mt-1 text-slate-300">Scan to verify</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400">
                Verified against State SkillBridge Registry. Valid across all inter-departmental transfers.
              </p>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedBadge.qrPayload);
                  alert('Verification link copied to clipboard!');
                }}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Share Link</span>
              </button>

              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Send, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  UserCheck, 
  Building2,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sendManagerNudge } from '../../services/api';

export const ManagerAlertsAndNudgesView: React.FC = () => {
  const { alerts, currentUser, addToast, refreshState } = useApp();

  const [nudgeMessage, setNudgeMessage] = useState('Please complete the mandatory module within 48h to prevent department SLA breach.');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const handleAction = async (alertId: string, action: 'nudge_employee' | 'escalate_to_head' | 'resolve') => {
    try {
      await sendManagerNudge({
        alertId,
        action,
        actorName: currentUser.name,
        message: nudgeMessage,
      });
      await refreshState();

      if (action === 'nudge_employee') {
        addToast({
          type: 'warning',
          title: 'Nudge Dispatched',
          message: 'Formal capacity reminder sent to employee and logged in audit trail.',
        });
      } else if (action === 'escalate_to_head') {
        addToast({
          type: 'error',
          title: 'Escalated to Department Head',
          message: 'Alert escalated to Level 3 (Dr. Sunita Iyer) due to non-response.',
        });
      } else {
        addToast({
          type: 'success',
          title: 'Alert Resolved',
          message: 'Marked resolved following training verification.',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action Error',
        message: 'Could not update alert status.',
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                Governance & Accountability
              </span>
              <span className="text-xs text-slate-400">
                Automated Multi-Tier Escalations
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mt-1.5 font-['Space_Grotesk']">
              Manager Nudge & Escalation Console
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Automated surveillance for overdue compliance training, unaddressed critical competency gaps, and assessment failures with a 3-tier escalation workflow.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Alert Items</span>
            <p className="text-xl font-bold text-rose-400 font-mono">{alerts.length} Flagged</p>
            <p className="text-[10px] text-slate-400">3 Escalation Tiers</p>
          </div>
        </div>
      </div>

      {/* Escalation Tier Explainer Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
            L1
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Tier 1: Direct Nudge</h4>
            <p className="text-[10px] text-slate-400">Automated reminder after 14 days overdue</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-300 font-bold text-xs flex items-center justify-center">
            L2
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Tier 2: Manager Warning</h4>
            <p className="text-[10px] text-slate-400">Direct manager warning with 48h deadline</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center">
            L3
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Tier 3: Dept Head Escalation</h4>
            <p className="text-[10px] text-slate-400">Escalated to Secretary & Performance Log</p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((al) => {
          const isCritical = al.severity === 'Critical';
          const isResolved = al.status === 'resolved';

          return (
            <div
              key={al.id}
              className={`p-5 rounded-2xl border transition-all ${
                isResolved
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : isCritical
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg ring-1 ring-rose-500/20'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                    isCritical
                      ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                      : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        isCritical ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        Level {al.escalationLevel} Escalation • {al.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">
                        Target: <strong className="text-white">{al.employeeName}</strong>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1">{al.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{al.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {al.status !== 'resolved' ? (
                    <>
                      <button
                        onClick={() => handleAction(al.id, 'nudge_employee')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Nudge (Tier 2)</span>
                      </button>

                      <button
                        onClick={() => handleAction(al.id, 'escalate_to_head')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-colors flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Escalate to Head (Tier 3)</span>
                      </button>

                      <button
                        onClick={() => handleAction(al.id, 'resolve')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Resolve
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* History Timeline */}
              {al.history.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Escalation Audit Trail:</span>
                  {al.history.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-400 font-mono">
                      <span className="text-slate-500">[{new Date(h.date).toLocaleDateString()}]</span>
                      <span>{h.action} ({h.actor})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

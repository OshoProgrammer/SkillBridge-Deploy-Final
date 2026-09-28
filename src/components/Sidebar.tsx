import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GitFork,
  BookOpen,
  FolderSync,
  Compass,
  Award,
  Users,
  Target,
  FileText,
  Settings,
  Sparkles,
  WifiOff,
  UserCheck,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ArrowUpRight,
  PanelLeftClose
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { resetAppState } from '../services/api';

export const Sidebar: React.FC = () => {
  const { 
    activeRole, 
    currentTab, 
    setCurrentTab, 
    organization, 
    addToast, 
    refreshState,
    setSelectedCourseId,
    setSelectedAssessmentId,
    setHeroModalOpen,
    toggleSidebar
  } = useApp();

  const handleResetDemo = async () => {
    if (window.confirm('Reset all demo data back to initial State Digital Governance baseline?')) {
      await resetAppState();
      await refreshState();
      addToast({
        type: 'success',
        title: 'Demo State Reset',
        message: 'All scores, assessments, and knowledge resources restored to initial seed state.',
      });
    }
  };

  const navItemsByRole: Record<string, { id: string; label: string; icon: any; badge?: string }[]> = {
    super_admin: [
      { id: 'dashboard', label: 'Executive Cockpit', icon: LayoutDashboard },
      { id: 'organization', label: 'Departments & Wings', icon: Building2 },
      { id: 'roles_matrix', label: 'Roles & Competency Matrix', icon: GitFork, badge: 'CORE' },
      { id: 'courses', label: 'Curriculum & Courses', icon: BookOpen },
      { id: 'knowledge_hub', label: 'Knowledge Hub & Reuse', icon: FolderSync, badge: 'REUSE' },
      { id: 'future_skills', label: 'Future Skill Horizon', icon: Compass },
      { id: 'audit_logs', label: 'Audit Trail & Proofs', icon: FileText },
      { id: 'settings', label: 'Scoring Weight Engine', icon: Settings },
    ],
    hr_manager: [
      { id: 'dashboard', label: 'Workforce Readiness', icon: LayoutDashboard },
      { id: 'roles_matrix', label: 'Competency Frameworks', icon: GitFork },
      { id: 'org_gaps', label: 'Organization Gap Report', icon: Target },
      { id: 'effectiveness', label: 'Training Effectiveness', icon: TrendingUp },
      { id: 'future_skills', label: 'Future Skill Radar', icon: Compass },
      { id: 'badges', label: 'Micro-Credentials', icon: Award },
    ],
    manager: [
      { id: 'dashboard', label: 'Team Readiness Cockpit', icon: LayoutDashboard },
      { id: 'team_gaps', label: 'Direct Report Gaps', icon: Target },
      { id: 'alerts', label: 'Nudges & Escalations', icon: AlertTriangle, badge: 'LIVE' },
      { id: 'knowledge_hub', label: 'Department Knowledge', icon: FolderSync },
      { id: 'experts', label: 'Internal Expert Roster', icon: UserCheck },
    ],
    learner: [
      { id: 'dashboard', label: 'Readiness Cockpit', icon: LayoutDashboard, badge: 'HERO' },
      { id: 'competency_radar', label: 'Competency Gap Radar', icon: Sliders },
      { id: 'learning_path', label: 'Personalized Pathway', icon: Sparkles, badge: 'TARGETED' },
      { id: 'courses', label: 'Lectures & Academy', icon: BookOpen },
      { id: 'badges', label: 'Verifiable Badges', icon: Award },
      { id: 'knowledge_hub', label: 'Knowledge Base & SOPs', icon: FolderSync },
      { id: 'experts', label: 'Ask an Expert (SMEs)', icon: UserCheck },
      { id: 'offline_mode', label: 'PWA Offline Packs', icon: WifiOff },
    ],
    trainer: [
      { id: 'dashboard', label: 'Instructor Console', icon: LayoutDashboard },
      { id: 'content_studio', label: 'AI Knowledge Capture', icon: Sparkles, badge: 'AI STUDIO' },
      { id: 'courses', label: 'Course Catalog & Builder', icon: BookOpen },
      { id: 'approval_queue', label: 'Content Approval Queue', icon: CheckSquare },
      { id: 'knowledge_hub', label: 'Knowledge Hub & Reuse', icon: FolderSync, badge: 'HERO' },
      { id: 'learners_progress', label: 'Learner Assessments', icon: Users },
    ],
    sme: [
      { id: 'dashboard', label: 'SME Consultation Desk', icon: UserCheck },
      { id: 'content_studio', label: 'Author SOP & Briefs', icon: FileText },
      { id: 'knowledge_hub', label: 'Knowledge Repository', icon: FolderSync },
      { id: 'experts', label: 'Expert Directory & Slots', icon: Users },
    ],
  };

  const currentNav = navItemsByRole[activeRole] || navItemsByRole['super_admin'];

  return (
    <aside className="w-64 lg:w-72 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800 flex flex-col h-[calc(100vh-4.5rem)] sticky top-[4.5rem] select-none z-30 shrink-0">
      
      {/* Organization Tenant Card & Quick Remove Action */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">STATE TENANT</span>
            <p className="text-xs font-bold text-white truncate mt-0.5">
              {organization?.name || 'State Digital Governance'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">
              {organization?.code || 'SDGD'}
            </span>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-all"
              title="Remove Sidebar from view (Focus Mode)"
              aria-label="Remove Sidebar"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>NAVIGATION</span>
          <span className="font-mono text-[10px] text-slate-500">[{currentNav.length}]</span>
        </div>

        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setSelectedCourseId(null);
                setSelectedAssessmentId(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all relative ${
                isActive
                  ? 'bg-orange-500/15 text-orange-400 font-bold border border-orange-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${
                  isActive 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Controls with Explicit Remove Sidebar Option */}
      <div className="p-3.5 border-t border-slate-800/80 space-y-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-medium transition-all group"
          title="Remove navigation sidebar to maximize workspace view"
        >
          <div className="flex items-center gap-2">
            <PanelLeftClose className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors" />
            <span>Remove Sidebar</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded group-hover:text-slate-300">
            Focus Mode
          </span>
        </button>

        <button
          onClick={() => setHeroModalOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold shadow-sm transition-all"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Interactive Demo Guide</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-orange-400" />
        </button>

        <button
          onClick={handleResetDemo}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-950/20 hover:text-rose-300 text-slate-400 text-[11px] font-medium transition-all"
          title="Reset database to seed baseline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Baseline</span>
        </button>
      </div>

    </aside>
  );
};

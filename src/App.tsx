import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeft } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroFlowGuide } from './components/HeroFlowGuide';
import { TerminalLockScreen } from './components/TerminalLockScreen';
import { Toasts } from './components/Toasts';

// Views
import { AdminExecutiveDashboard } from './components/views/AdminExecutiveDashboard';
import { RolesAndCompetenciesMatrix } from './components/views/RolesAndCompetenciesMatrix';
import { LearnerDashboard } from './components/views/LearnerDashboard';
import { LearnerCompetencyRadarView } from './components/views/LearnerCompetencyRadarView';
import { PersonalizedLearningPathView } from './components/views/PersonalizedLearningPathView';
import { AssessmentPlayer } from './components/views/AssessmentPlayer';
import { KnowledgeHubAndReuse } from './components/views/KnowledgeHubAndReuse';
import { AIKnowledgeCaptureStudio } from './components/views/AIKnowledgeCaptureStudio';
import { FutureSkillRadarView } from './components/views/FutureSkillRadarView';
import { CoursesCatalogView } from './components/views/CoursesCatalogView';
import { MicroCredentialsView } from './components/views/MicroCredentialsView';
import { ManagerAlertsAndNudgesView } from './components/views/ManagerAlertsAndNudgesView';
import { TeamSkillGapsView } from './components/views/TeamSkillGapsView';
import { OrganizationGapReportView } from './components/views/OrganizationGapReportView';
import { TrainingEffectivenessIndexView } from './components/views/TrainingEffectivenessIndexView';
import { DepartmentsAndTeamsView } from './components/views/DepartmentsAndTeamsView';
import { ExpertsDirectoryView } from './components/views/ExpertsDirectoryView';
import { SMEProfileAndRequestsView } from './components/views/SMEProfileAndRequestsView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SettingsScoringWeightsView } from './components/views/SettingsScoringWeightsView';

import { AuthLandingPage } from './components/AuthLandingPage';

const MainLayout: React.FC = () => {
  const { currentTab, activeRole, isLoading, isAuthenticated, isSidebarOpen, toggleSidebar } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex flex-col items-center justify-center text-slate-300 relative overflow-hidden bg-dot-pattern">
        <div className="absolute w-96 h-96 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 border border-orange-400 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-xl shadow-orange-600/30 relative"
        >
          <span>SB</span>
        </motion.div>
        <p className="text-base font-bold text-white tracking-wider uppercase font-sans">
          Skill<span className="text-orange-500">Bridge</span>
        </p>
        <p className="text-xs text-slate-400 mt-1 font-mono tracking-wider">
          INITIALIZING COMPETENCY INTELLIGENCE ENGINE...
        </p>
      </div>
    );
  }

  // First page is Login / Create Account / 1-Click Demo Personas
  if (!isAuthenticated) {
    return (
      <>
        <AuthLandingPage />
        <Toasts />
      </>
    );
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        if (activeRole === 'learner') return <LearnerDashboard />;
        if (activeRole === 'sme') return <SMEProfileAndRequestsView />;
        return <AdminExecutiveDashboard />;

      case 'organization':
        return <DepartmentsAndTeamsView />;

      case 'roles_matrix':
        return <RolesAndCompetenciesMatrix />;

      case 'competency_radar':
        return <LearnerCompetencyRadarView />;

      case 'learning_path':
        return <PersonalizedLearningPathView />;

      case 'courses':
      case 'offline_mode':
        return <CoursesCatalogView />;

      case 'assessments':
      case 'learners_progress':
        return <AssessmentPlayer />;

      case 'knowledge_hub':
        return <KnowledgeHubAndReuse />;

      case 'content_studio':
      case 'approval_queue':
        return <AIKnowledgeCaptureStudio />;

      case 'future_skills':
        return <FutureSkillRadarView />;

      case 'badges':
        return <MicroCredentialsView />;

      case 'team_gaps':
        return activeRole === 'hr_manager' ? <OrganizationGapReportView /> : <TeamSkillGapsView />;

      case 'org_gaps':
        return <OrganizationGapReportView />;

      case 'effectiveness':
        return <TrainingEffectivenessIndexView />;

      case 'alerts':
        return <ManagerAlertsAndNudgesView />;

      case 'experts':
        return activeRole === 'sme' ? <SMEProfileAndRequestsView /> : <ExpertsDirectoryView />;

      case 'audit_logs':
        return <AuditLogsView />;

      case 'settings':
        return <SettingsScoringWeightsView />;

      default:
        if (activeRole === 'learner') return <LearnerDashboard />;
        if (activeRole === 'sme') return <SMEProfileAndRequestsView />;
        return <AdminExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      
      {/* Top Header */}
      <Header />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar (Can be removed from view by any role when not required) */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden shrink-0 z-30"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Center View Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-dot-pattern relative">
          {/* Distraction-Free / Focus Mode Indicator when sidebar is removed */}
          {!isSidebarOpen && (
            <div className="max-w-7xl mx-auto mb-4">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-md backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Full-Width Focus Mode</span>
                  <span className="text-slate-400 hidden sm:inline">• Sidebar removed for maximum workspace across all roles</span>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 hover:text-orange-300 font-semibold text-xs transition-all shadow-sm"
                  title="Restore navigation sidebar"
                >
                  <PanelLeft className="w-3.5 h-3.5" />
                  <span>Restore Sidebar</span>
                </button>
              </motion.div>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab + activeRole}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Guided Walkthrough Modal */}
      <HeroFlowGuide />

      {/* Security Terminal Lock Overlay */}
      <TerminalLockScreen />

      {/* Global Toast Notifications */}
      <Toasts />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

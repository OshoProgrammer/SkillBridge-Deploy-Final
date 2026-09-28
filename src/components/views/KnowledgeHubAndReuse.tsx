import React, { useState } from 'react';
import { 
  FolderSync, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  GitFork, 
  FileText, 
  Share2, 
  Sparkles, 
  Building2, 
  Clock, 
  ArrowRight,
  Eye,
  Copy,
  Layers,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { checkDuplicateKnowledge, executeKnowledgeAction } from '../../services/api';
import { KnowledgeResource, DuplicateDetectionResult } from '../../types';

export const KnowledgeHubAndReuse: React.FC = () => {
  const { 
    knowledgeResources, 
    currentUser, 
    competencies, 
    departments, 
    addToast, 
    refreshState,
    setHeroStep 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedCompFilter, setSelectedCompFilter] = useState('all');

  // Authoring / Upload Modal state
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('District Data Analytics & Reporting Module');
  const [newCompetencyId, setNewCompetencyId] = useState('comp-data-analytics');
  const [newTags, setNewTags] = useState('Data Analytics, Dashboards, Grievances, SLA');
  const [newDeptId, setNewDeptId] = useState('dept-egov-ops');
  const [newDocType, setNewDocType] = useState('SOP');
  const [newDescription, setNewDescription] = useState('Standard procedure for aggregating district grievance data.');

  // Duplicate Detection Trigger state
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<DuplicateDetectionResult | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Filtered resources
  const filtered = knowledgeResources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDeptFilter === 'all' || r.departmentId === selectedDeptFilter;
    const matchesComp = selectedCompFilter === 'all' || r.competencyId === selectedCompFilter;
    return matchesSearch && matchesDept && matchesComp;
  });

  const totalReuses = knowledgeResources.reduce((acc, r) => acc + r.reuseCount, 0);
  const hoursSaved = totalReuses * 5.5;

  const handleTriggerDuplicateCheck = async () => {
    try {
      setIsCheckingDuplicate(true);
      const tagsArray = newTags.split(',').map((t) => t.trim()).filter(Boolean);
      const result = await checkDuplicateKnowledge({
        title: newTitle,
        competencyId: newCompetencyId,
        tags: tagsArray,
        departmentId: newDeptId,
        description: newDescription,
      });

      setDuplicateResult(result);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Check Failed',
        message: 'Could not perform semantic duplicate check.',
      });
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  const handleExecuteAction = async (action: 'reuse' | 'adapt' | 'create_new') => {
    try {
      await executeKnowledgeAction({
        action,
        originalResourceId: duplicateResult?.matchedResource?.id,
        newResource: {
          title: newTitle,
          description: newDescription,
          competencyId: newCompetencyId,
          tags: newTags.split(',').map((t) => t.trim()),
          departmentId: newDeptId,
          departmentName: departments.find((d) => d.id === newDeptId)?.name || 'e-Governance Operations',
          documentType: newDocType,
          language: 'English',
        },
        actorName: currentUser.name,
      });

      await refreshState();
      setIsAuthorModalOpen(false);
      setDuplicateResult(null);

      if (action === 'reuse') {
        addToast({
          type: 'success',
          title: 'Institutional Knowledge Reused!',
          message: 'Adopted verified SOP directly across departments, saving ~5.5 authoring hours.',
        });
      } else if (action === 'adapt') {
        addToast({
          type: 'success',
          title: 'Resource Branch Adapted',
          message: 'Created adapted departmental branch with inherited verified baseline.',
        });
      } else {
        addToast({
          type: 'info',
          title: 'New Resource Submitted',
          message: 'Queued for trainer verification.',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: 'Could not complete requested knowledge action.',
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase">
                SIH Hero Flow • Step 6 of 6
              </span>
              <span className="text-xs text-slate-400">
                Cross-Department Knowledge Intelligence
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mt-1.5 font-['Space_Grotesk']">
              Organizational Knowledge Hub & Reuse Engine
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Eliminate redundant content authoring across state ministries. Reusing verified learning resources, SOPs, and governance checklists.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsAuthorModalOpen(true);
                handleTriggerDuplicateCheck(); // Auto trigger for immediate demo convenience
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Author / Upload New Module</span>
            </button>
          </div>
        </div>

        {/* Reuse Impact KPI Row */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Verified SOPs & Resources</span>
            <p className="text-lg font-bold text-white font-mono">{knowledgeResources.length}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Cross-Dept Reuses</span>
            <p className="text-lg font-bold text-cyan-400 font-mono">{totalReuses} Reuses</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Authoring Hours Saved</span>
            <p className="text-lg font-bold text-emerald-400 font-mono">~{Math.round(hoursSaved)} Hours</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Knowledge Fragmentation</span>
            <p className="text-lg font-bold text-indigo-300 font-mono">0% Duplication</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified SOPs, tags, topics..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedCompFilter}
            onChange={(e) => setSelectedCompFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Competencies</option>
            {competencies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((resItem) => (
          <div
            key={resItem.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-mono">
                  {resItem.documentType} • v{resItem.version}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                {resItem.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {resItem.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {resItem.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="text-[10px] text-slate-400">
                <p>Dept: <strong className="text-slate-300">{resItem.departmentName}</strong></p>
                <p>Author: {resItem.authorName}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold font-mono">
                  {resItem.reuseCount} Reuses
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Authoring & Semantic Duplicate Detection Modal (Hero Step 6 Trigger) */}
      {isAuthorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  6
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    Author / Upload Training Module
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Real-time duplicate detection checks verified organizational repositories across all state departments.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAuthorModalOpen(false);
                  setDuplicateResult(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Department:</label>
                <select
                  value={newDeptId}
                  onChange={(e) => setNewDeptId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Module / SOP Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Target Competency:</label>
                  <select
                    value={newCompetencyId}
                    onChange={(e) => setNewCompetencyId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  >
                    {competencies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Document Type:</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="SOP">Standard Operating Procedure (SOP)</option>
                    <option value="Curriculum">Curriculum Course Module</option>
                    <option value="Framework">Evaluation Rubric / Framework</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tags (comma separated):</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              {/* Duplicate Detection Alert Banner */}
              {duplicateResult && duplicateResult.hasDuplicate && duplicateResult.matchedResource && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          Semantic Match: {duplicateResult.matchScore}%
                        </span>
                        <span className="text-xs text-slate-400">Institutional Duplicate Prevention</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1">
                        Verified Resource Already Exists in {duplicateResult.matchedResource.departmentName}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {duplicateResult.reason}
                      </p>
                    </div>
                  </div>

                  {/* 4 Action Options Requested in Prompt Section F */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-500/20">
                    
                    <button
                      onClick={() => handleExecuteAction('reuse')}
                      className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>1. Reuse Existing (Recommended)</span>
                    </button>

                    <button
                      onClick={() => handleExecuteAction('adapt')}
                      className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                      <span>2. Adapt Departmental Branch</span>
                    </button>

                    <button
                      onClick={() => setIsCompareOpen(true)}
                      className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>3. Compare Side-by-Side</span>
                    </button>

                    <button
                      onClick={() => handleExecuteAction('create_new')}
                      className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-all"
                    >
                      <span>4. Create New Anyway</span>
                    </button>

                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <button
                onClick={handleTriggerDuplicateCheck}
                disabled={isCheckingDuplicate}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isCheckingDuplicate ? 'Checking...' : 'Re-run Semantic Check'}</span>
              </button>

              <button
                onClick={() => setIsAuthorModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {isCompareOpen && duplicateResult?.matchedResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Side-by-Side Knowledge Comparison
              </h3>
              <button onClick={() => setIsCompareOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400">Proposed New Content</span>
                <h4 className="text-xs font-bold text-white">{newTitle}</h4>
                <p className="text-xs text-slate-300">{newDescription}</p>
                <p className="text-[10px] text-slate-500">Department: {newDeptId}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Verified Existing Master</span>
                <h4 className="text-xs font-bold text-white">{duplicateResult.matchedResource.title}</h4>
                <p className="text-xs text-slate-300">{duplicateResult.matchedResource.contentSummary || duplicateResult.matchedResource.description}</p>
                <p className="text-[10px] text-slate-500">Author: {duplicateResult.matchedResource.authorName} ({duplicateResult.matchedResource.departmentName})</p>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsCompareOpen(false);
                  handleExecuteAction('reuse');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Adopt & Reuse Verified Master
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  Send,
  BookOpen,
  Bot,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { extractKnowledgeWithAI, advanceDraftPipeline } from '../../services/api';
import { AIDraftKnowledgeExtraction } from '../../types';

export const AIKnowledgeCaptureStudio: React.FC = () => {
  const { 
    currentUser, 
    competencies, 
    aiDrafts, 
    addToast, 
    refreshState,
    setCurrentTab 
  } = useApp();

  const [documentName, setDocumentName] = useState('Standard Operating Procedure for Administrative Data Hygiene');
  const [documentType, setDocumentType] = useState('SOP');
  const [competencyHint, setCompetencyHint] = useState('comp-data-analytics');
  const [rawText, setRawText] = useState(
    `STANDARD OPERATING PROCEDURE: DATA HYGIENE AND SLA MONITORING
Section 1: Data Sanitization Standards
All district-level data operators must ensure column standardization prior to uploading quarterly beneficiary registers into the State Citizen Portal.
Missing numeric fields must be logged as null rather than 0 to avoid distorting median disbursement calculations.
Beneficiary Aadhaar/Scheme IDs must be validated using checksum algorithms to prevent duplicate disbursement claims across overlapping welfare programs.

Section 2: Statutory SLA Escalation Thresholds
Citizen grievances under the Public Service Guarantee Charter possess a maximum disposal window of 15 business days.
Any grievance pending beyond 10 days must trigger an automated amber notification to the Sub-Divisional Magistrate (SDM).
Exceeding 15 days constitutes an SLA breach requiring a formal explanatory memorandum during the District Collector's monthly governance review.

Section 3: Executive Reporting
Weekly grievance trends must be aggregated using standardized pivot queries displaying percentage disposal variances against previous quarter benchmarks.`
  );

  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(0);

  const activeDraft = aiDrafts[selectedDraftIndex] || null;

  const handleExtract = async () => {
    try {
      setIsExtracting(true);
      const res = await extractKnowledgeWithAI({
        rawText,
        documentName,
        documentType,
        competencyHint,
      });

      await refreshState();
      setSelectedDraftIndex(0);
      addToast({
        type: 'success',
        title: 'Institutional Knowledge Captured with AI',
        message: `Extracted structured curriculum draft. Status: Draft (Awaiting Human Review).`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Extraction Error',
        message: 'Could not extract knowledge from document.',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePipelineAction = async (action: 'submit_review' | 'trainer_approve' | 'publish_to_course') => {
    try {
      const res = await advanceDraftPipeline({
        draftIndex: selectedDraftIndex,
        action,
        actorName: currentUser.name,
      });

      await refreshState();

      if (action === 'submit_review') {
        addToast({
          type: 'info',
          title: 'Submitted for Review',
          message: 'Draft sent to Subject Matter Expert for technical accuracy verification.',
        });
      } else if (action === 'trainer_approve') {
        addToast({
          type: 'success',
          title: 'Trainer Approved',
          message: 'Lead Trainer approved pedagogical rubric and question benchmarks.',
        });
      } else if (action === 'publish_to_course') {
        addToast({
          type: 'success',
          title: 'Published to Live Catalog!',
          message: 'Converted into a live verified Course & Knowledge Hub resource.',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Pipeline Error',
        message: 'Failed to update draft workflow stage.',
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
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
                Institutional Knowledge Capture Studio
              </span>
              <span className="text-xs text-slate-400">
                Powered by Gemini 2.5
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white mt-1.5 font-['Space_Grotesk']">
              AI Knowledge Ingestion & Curriculum Generator
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Transform unstructured administrative SOPs, policy memos, and expert notes into verified, auditable learning modules and assessment questions.
            </p>
          </div>

          {/* Workflow Stage Explainer Badge */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Human-in-the-Loop Safeguard:</span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-indigo-400">Draft</span> → 
              <span className="text-amber-400">Review</span> → 
              <span className="text-cyan-400">Approval</span> → 
              <span className="text-emerald-400">Published</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Raw Ingestion Input (Left) & Generated Draft Pipeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Raw Document Input (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Bot className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Input Document / SOP Content
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Document Title:</label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Document Type:</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="SOP">Standard Operating Procedure</option>
                <option value="Policy Memo">Government Policy Memo</option>
                <option value="Field Notes">SME Field Notes / Best Practices</option>
                <option value="Audit Report">Audit Remediation Guide</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Target Competency:</label>
              <select
                value={competencyHint}
                onChange={(e) => setCompetencyHint(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
              >
                {competencies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Raw Unstructured Text Content:</label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={10}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="Paste raw administrative SOP, policy clauses, or expert operational guidelines..."
            />
          </div>

          <button
            onClick={handleExtract}
            disabled={isExtracting || !rawText.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>{isExtracting ? 'Extracting with Gemini...' : 'Extract & Generate Structured Draft'}</span>
          </button>
        </div>

        {/* Right Column: Structured Draft & Approval Pipeline (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          
          {activeDraft ? (
            <div className="space-y-5">
              
              {/* Draft Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      activeDraft.status === 'Draft' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      activeDraft.status === 'Human Review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      activeDraft.status === 'Trainer Approval' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      Stage: {activeDraft.status}
                    </span>
                    <span className="text-xs text-slate-400">Target: Level {activeDraft.suggestedLevel}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {activeDraft.title}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(activeDraft.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-xs font-semibold text-slate-300 mb-1">Executive Curriculum Summary:</p>
                <p className="text-xs text-slate-400 leading-relaxed">{activeDraft.summary}</p>
              </div>

              {/* Learning Objectives & Key Concepts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-300 mb-1.5">Learning Objectives:</p>
                  <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                    {activeDraft.learningObjectives.map((obj, i) => (
                      <li key={i} className="leading-snug">{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-300 mb-1.5">Key Concepts:</p>
                  <div className="flex flex-wrap gap-1">
                    {activeDraft.keyConcepts.map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated Assessment Question Preview */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-300">
                  Auto-Generated Assessment Items ({activeDraft.generatedQuestions.length} MCQs + 1 Case Study):
                </p>
                {activeDraft.generatedQuestions.slice(0, 1).map((q, i) => (
                  <div key={i} className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <p className="font-semibold text-white">Q: {q.question}</p>
                    <p className="text-emerald-400 text-[11px] mt-1">
                      ✓ Correct Option: {q.options[q.correctOptionIndex]}
                    </p>
                    <p className="text-slate-500 text-[10px] mt-0.5 italic">Rationale: {q.explanation}</p>
                  </div>
                ))}
              </div>

              {/* Human Approval Pipeline Step-by-Step Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="text-[11px] font-semibold text-slate-400">Advance Approval Workflow:</p>
                
                <div className="flex flex-wrap gap-2">
                  {activeDraft.status === 'Draft' && (
                    <button
                      onClick={() => handlePipelineAction('submit_review')}
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors"
                    >
                      Submit for SME Technical Review
                    </button>
                  )}

                  {activeDraft.status === 'Human Review' && (
                    <button
                      onClick={() => handlePipelineAction('trainer_approve')}
                      className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
                    >
                      Approve Pedagogical Rubric (Trainer)
                    </button>
                  )}

                  {activeDraft.status === 'Trainer Approval' && (
                    <button
                      onClick={() => handlePipelineAction('publish_to_course')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      Publish to Live Organizational Course Catalog
                    </button>
                  )}

                  {activeDraft.status === 'Published' && (
                    <div className="w-full p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Published in Live Course Catalog
                      </span>
                      <button
                        onClick={() => setCurrentTab('courses')}
                        className="text-white underline text-[11px]"
                      >
                        View Course
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <FileText className="w-12 h-12 text-slate-700 mb-3" />
              <h4 className="text-sm font-bold text-slate-300">No Drafts Generated Yet</h4>
              <p className="text-xs max-w-sm mt-1">
                Paste an SOP or policy memo in the left panel and click &quot;Extract &amp; Generate Structured Draft&quot; to begin.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

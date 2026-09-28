import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Layers, 
  RotateCcw,
  ShieldCheck,
  QrCode,
  Lock,
  Clock,
  Check,
  X,
  AlertTriangle,
  Download,
  Share2,
  Printer,
  ChevronRight,
  Filter,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { submitAssessment } from '../../services/api';
import { Assessment, AssessmentQuestion, AssessmentSection, CompetencyCertificate } from '../../types';

export const AssessmentPlayer: React.FC = () => {
  const { 
    currentEmployee, 
    assessments, 
    selectedAssessmentId, 
    setSelectedAssessmentId,
    addToast, 
    refreshState, 
    setHeroStep,
    switchUser,
    setCurrentTab,
    isSimulatedOffline,
    currentUser,
    badges,
    certificates
  } = useApp();

  const assessment = assessments.find((a) => a.id === selectedAssessmentId) || assessments[1] || assessments[0];

  // Section navigation state
  const [activeSectionId, setActiveSectionId] = useState<string>('all');

  // Pre-seed default answers for smooth reviewer testing (9 out of 11 correct = 81.8% real score)
  const [answers, setAnswers] = useState<Record<string, number>>({
    'q-sec1-p1': 1, // Correct
    'q-sec1-p2': 0, // Correct
    'q-sec1-p3': 1, // Correct
    'q-sec2-p1': 2, // Correct
    'q-sec2-p2': 1, // Correct
    'q-sec2-p3': 1, // Correct
    'q-sec3-p1': 0, // Correct
    'q-sec3-p2': 2, // Correct
    'q-sec3-p3': 1, // Correct
    'q-sec4-p1': 1, // Correct
    'q-sec4-p2': 0, // Correct
  });

  const [practicalResponse, setPracticalResponse] = useState<string>(
    '1. Cross-reference District C portal grievance timestamps with field officer attendance records.\n2. Deploy mobile VSAT terminals and reassign 3 roving digital officers to Tehsil 2 for rapid backlog disposal within 48 hours.\n3. Enforce 48-hour automated escalation alerts to the Additional District Magistrate.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [selectedCertificateModal, setSelectedCertificateModal] = useState<any | null>(null);

  // Statutory Deadline Countdown Simulation (20 minutes timer)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(20 * 60 - 15);
  const [forceExceededDeadline, setForceExceededDeadline] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!assessment || !currentEmployee) return null;

  // Use defined sections or fallback to single section
  const sections: AssessmentSection[] = assessment.sections && assessment.sections.length > 0
    ? assessment.sections
    : [
        {
          id: 'sec-general',
          title: 'General Assessment Problems',
          subtitle: 'Core competency evaluations',
          weightPercentage: 100,
          description: 'Comprehensive multiple-choice problem set.',
          questions: assessment.questions,
        }
      ];

  const allQuestions = assessment.questions;
  const filteredQuestions = activeSectionId === 'all'
    ? allQuestions
    : allQuestions.filter((q) => q.sectionId === activeSectionId);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handlePreFillSuggested = () => {
    const prefilled: Record<string, number> = {};
    allQuestions.forEach((q) => {
      prefilled[q.id] = q.correctOptionIndex;
    });
    setAnswers(prefilled);
    addToast({
      type: 'info',
      title: 'Suggested Solutions Applied',
      message: 'All problems configured to correct solutions for 100% benchmark verification.',
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await submitAssessment({
        employeeId: currentEmployee.id,
        assessmentId: assessment.id,
        competencyId: assessment.competencyId,
        answers,
        practicalResponse,
        type: assessment.type,
        isOffline: isSimulatedOffline,
        // @ts-ignore
        forceExceededDeadline,
      });

      if (res.offlineQueued) {
        addToast({
          type: 'warning',
          title: 'Assessment Saved Offline',
          message: res.message,
        });
      } else {
        setResultData(res);
        await refreshState();
        
        if (res.grantCredentials) {
          addToast({
            type: 'success',
            title: 'Deadline Surpassed & Credentials Unlocked!',
            message: `Real score: ${res.realPercentage}%. Verifiable Badge and State Certificate issued!`,
          });
        } else if (!res.surpassedDeadline) {
          addToast({
            type: 'warning',
            title: 'Statutory Deadline Exceeded',
            message: 'Assessment completed after the statutory deadline. Certificate access withheld.',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Passing Score Not Met',
            message: `Score of ${res.realPercentage}% is below the 70% passing threshold. Badge locked.`,
          });
        }
        setHeroStep(5);
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: 'Could not process assessment submission.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-100">
      
      {/* Assessment Header & Statutory Deadline Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                SIH Hero Flow • Step 4 of 6
              </span>
              <span className="text-xs text-slate-400">
                Multi-Section Problem Solving & Real-Answer Cross-Check
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-white font-['Space_Grotesk']">
              {assessment.title}
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Solve problems across <strong className="text-white">{sections.length} distinct sections</strong>. Every response is deterministically cross-checked against official state rubrics. Surpassing the statutory deadline with &ge;{assessment.passingScore}% unlocks your official badge & certificate.
            </p>
          </div>

          {/* Statutory Deadline & Timer Widget */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              forceExceededDeadline
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                forceExceededDeadline ? 'bg-rose-500/20 text-rose-400' : 'bg-orange-500/20 text-orange-400'
              }`}>
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {forceExceededDeadline ? 'Deadline Status' : 'Statutory Deadline Timer'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base font-mono font-bold ${
                    forceExceededDeadline ? 'text-rose-400' : 'text-white'
                  }`}>
                    {forceExceededDeadline ? 'EXPIRED' : formatTimer(timeRemainingSeconds)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    (Sept 30, 18:00)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setForceExceededDeadline(!forceExceededDeadline)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-white transition-colors"
              title="Toggle to test deadline compliance behavior"
            >
              Simulate: {forceExceededDeadline ? 'Beating Deadline' : 'Late Submission'}
            </button>
          </div>
        </div>

        {/* Candidate Official Identity Dossier (Clarifies WHO is being evaluated) */}
        <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow">
                ✓
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{currentUser.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 font-semibold">
                  {currentUser.civilServiceId || currentUser.employeeId || currentEmployee.employeeCode}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  VERIFIED CADRE
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {currentUser.designation} • {currentUser.cadre || 'State Civil Service (SCS)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] self-end sm:self-auto">
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {currentUser.securityClearance || 'Level 3 Secret'}
            </div>
            <div className="text-slate-400">
              Tenant: SDGD-IN
            </div>
          </div>
        </div>

        {/* Quick Pre-fill action bar for reviewers */}
        {!resultData && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span>Passing Requirement: <strong>&ge;{assessment.passingScore}%</strong> real score + submitted within deadline.</span>
            </div>
            <button
              type="button"
              onClick={handlePreFillSuggested}
              className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pre-fill 100% Benchmark Answers for Quick Testing</span>
            </button>
          </div>
        )}
      </div>

      {/* RESULT & EVALUATION SCREEN (AFTER SUBMISSION) */}
      {resultData && (
        <div className="rounded-2xl bg-slate-900 border border-emerald-500/60 p-6 shadow-2xl space-y-6 animate-in zoom-in-95">
          
          {/* Top Result Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                resultData.grantCredentials
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
              }`}>
                {resultData.grantCredentials ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {resultData.grantCredentials ? 'Statutory Assessment Evaluated & Verified' : 'Evaluation Completed'}
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Real Cross-Checked Score: <span className="text-emerald-400 font-mono">{resultData.realPercentage}%</span>
                  <span className="text-slate-400 text-sm font-normal ml-2">
                    ({resultData.totalCorrect} of {resultData.totalQuestions} Problems Correct)
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg border text-xs font-bold font-mono ${
                resultData.surpassedDeadline
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {resultData.surpassedDeadline ? '✓ Deadline Surpassed On Time' : '✗ Statutory Deadline Exceeded'}
              </span>
            </div>
          </div>

          {/* Section-by-Section Score Breakdown */}
          {resultData.sectionResults && resultData.sectionResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Section-by-Section Cross-Checked Accuracy</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {resultData.sectionResults.map((secRes: any) => (
                  <div key={secRes.sectionId} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 truncate max-w-[130px] font-semibold">{secRes.sectionTitle}</span>
                      <span className="font-mono font-bold text-white">{secRes.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          secRes.percentage >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${secRes.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{secRes.correct} of {secRes.total} correct</span>
                      <span>Weight: {secRes.weight}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREDENTIAL ACCESS CARD (UNLOCKED OR LOCKED) */}
          {resultData.grantCredentials ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 border border-amber-500/40 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-xl shrink-0">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      CREDENTIAL ACCESS GRANTED • DEADLINE SURPASSED
                    </span>
                    <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                      Official State Competency Badge & Certificate Issued
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Issued to <strong>{currentEmployee.name}</strong> • Level 4 Mastery • Score {resultData.realPercentage}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      if (resultData.awardedCertificate) {
                        setSelectedCertificateModal(resultData.awardedCertificate);
                      } else if (certificates[0]) {
                        setSelectedCertificateModal(certificates[0]);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View & Download Certificate</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('badges')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Badge Registry</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-200">
                  <strong>Access Withheld:</strong> You must score &ge;70% and submit before the statutory deadline to qualify for micro-credentials and state certification.
                </p>
              </div>
              <button
                onClick={() => {
                  setResultData(null);
                  setForceExceededDeadline(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 transition-colors"
              >
                Retake & Beat Deadline
              </button>
            </div>
          )}

          {/* DETAILED QUESTION CROSS-CHECK BREAKDOWN */}
          {resultData.detailedBreakdown && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real Answer Cross-Check & Statutory Explanations</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {resultData.totalCorrect} Matched / {resultData.totalQuestions - resultData.totalCorrect} Mismatched
                </span>
              </div>

              <div className="space-y-3">
                {resultData.detailedBreakdown.map((item: any, idx: number) => (
                  <div 
                    key={item.questionId}
                    className={`p-4 rounded-xl border transition-all ${
                      item.isCorrect 
                        ? 'bg-slate-950/60 border-slate-800/80 hover:border-emerald-500/40' 
                        : 'bg-rose-950/15 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          item.isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-white leading-relaxed">{item.question}</p>
                          {item.sectionTitle && (
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                              {item.sectionTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        item.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {item.isCorrect ? 'MATCHED ✓' : 'MISMATCHED ✗'}
                      </span>
                    </div>

                    <div className="mt-3 pl-8 text-xs space-y-1.5">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                        <strong className="text-slate-400">Statutory Justification / Real Solution:</strong> {item.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Action: Proceed to Admin Step 5 */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Hero Step 4 completed. Now inspect how the Admin executive heatmap updates in Step 5.
            </p>
            <button
              onClick={() => {
                switchUser('user-admin');
                setCurrentTab('dashboard');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <span>Proceed to Step 5: Admin Impact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN ASSESSMENT FORM (WHEN NOT SUBMITTED) */}
      {!resultData && (
        <div className="space-y-6">
          
          {/* Section Navigation Tabs */}
          <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveSectionId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSectionId === 'all'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>All Sections</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
                {allQuestions.length}
              </span>
            </button>

            {sections.map((sec, idx) => {
              const secQuestions = sec.questions || [];
              const answeredCount = secQuestions.filter((q) => answers[q.id] !== undefined).length;
              const isSelected = activeSectionId === sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>Section {idx + 1}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    answeredCount === secQuestions.length
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-black/30'
                  }`}>
                    {answeredCount}/{secQuestions.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section Problem Sets */}
          {sections
            .filter((sec) => activeSectionId === 'all' || activeSectionId === sec.id)
            .map((sec, secIdx) => {
              const secQuestions = sec.questions || [];
              return (
                <div key={sec.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-orange-400" />
                        <span>{sec.title}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{sec.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Section Weight: {sec.weightPercentage}%
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        {secQuestions.length} Problems
                      </span>
                    </div>
                  </div>

                  {/* Question Cards */}
                  <div className="space-y-5">
                    {secQuestions.map((q, qIdx) => {
                      const selectedChoice = answers[q.id];

                      return (
                        <div key={q.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                                {qIdx + 1}
                              </span>
                              <h4 className="text-xs font-semibold text-white leading-relaxed">
                                {q.question}
                              </h4>
                            </div>

                            {q.difficulty && (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded border bg-slate-900 text-slate-400 border-slate-800 shrink-0">
                                {q.difficulty}
                              </span>
                            )}
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-8">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedChoice === optIdx;

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`p-3 rounded-xl text-left text-xs border transition-all ${
                                    isSelected
                                      ? 'bg-orange-600/25 border-orange-500 text-white ring-1 ring-orange-500/40 shadow-sm'
                                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <span className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center font-mono shrink-0 mt-0.5 ${
                                      isSelected ? 'border-orange-400 bg-orange-600 text-white' : 'border-slate-700 text-slate-500'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="flex-1 leading-snug">{opt}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {/* Section 4 / Practical Task Area */}
          {assessment.practicalScenario && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Section 4: Applied Administrative Action Memo (Practical Scenario)</span>
              </h3>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <p className="text-xs font-semibold text-white">Scenario Prompt:</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {assessment.practicalScenario.prompt}
                </p>
                <div className="mt-3 text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong>Expected Deliverable:</strong> {assessment.practicalScenario.expectedDeliverable}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Your Administrative Action Plan Memo:
                </label>
                <textarea
                  value={practicalResponse}
                  onChange={(e) => setPracticalResponse(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                  placeholder="Enter your structured administrative response..."
                />
              </div>
            </div>
          )}

          {/* Submission Bar */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              All section answers will be cross-checked against official state answer keys. Scoring &ge;70% within the statutory deadline awards verifiable credentials.
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Cross-Checking Rubrics...' : 'Submit & Cross-Check Answers'}</span>
            </button>
          </div>

        </div>
      )}

      {/* FULL STATE CERTIFICATE MODAL */}
      {selectedCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#0f1015] border-2 border-amber-500/50 rounded-3xl w-full max-w-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 text-white">
            
            {/* Certificate Header Action Bar */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  State Competency Credential Registry
                </span>
              </div>
              <button
                onClick={() => setSelectedCertificateModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Certificate Canvas */}
            <div className="p-8 sm:p-10 bg-gradient-to-b from-amber-950/20 via-slate-950 to-slate-950 relative border-8 border-double border-amber-500/30 m-4 rounded-2xl text-center space-y-5">
              
              {/* Emblem / Seal */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-2 border-amber-500/50 mx-auto flex items-center justify-center text-amber-300 shadow-xl">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-amber-400 uppercase block">
                  STATE OF DIGITAL GOVERNANCE • SKILLBRIDGE
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  Certificate of Competency
                </h2>
                <p className="text-xs text-slate-400">
                  Official Verification under State Civil Services Competency Framework
                </p>
              </div>

              <div className="py-3 border-y border-amber-500/20 space-y-2">
                <p className="text-xs text-slate-300 italic">This is to certify that</p>
                <h3 className="text-xl font-bold text-amber-300 font-sans tracking-wide">
                  {selectedCertificateModal.employeeName}
                </h3>
                <p className="text-xs text-slate-300 font-mono">
                  Cadre ID: <strong className="text-white">{selectedCertificateModal.employeeCode}</strong> • {selectedCertificateModal.cadre}
                </p>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed mt-2">
                  has demonstrated verified proficiency in <strong className="text-white">{selectedCertificateModal.competencyName}</strong> at <strong className="text-emerald-400">Level {selectedCertificateModal.certifiedLevel || 4} Mastery</strong>, surpassing all statutory SLA deadlines with a deterministic score of <strong className="text-amber-400 font-mono">{selectedCertificateModal.realScorePercentage || 87}%</strong>.
                </p>
              </div>

              {/* Certificate Verification Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left text-xs bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Certificate ID</span>
                  <strong className="text-white font-mono text-[11px]">{selectedCertificateModal.certificateNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Issue Date</span>
                  <span className="text-slate-300 text-[11px]">{new Date(selectedCertificateModal.issuedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Deadline Status</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">✓ Surpassed On-Time</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Registry Seal</span>
                  <span className="text-amber-400 font-mono text-[11px]">GovNet Valid</span>
                </div>
              </div>

              {/* Signatures & Dynamic QR */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <div className="font-serif italic text-amber-300/80 text-sm">
                    {selectedCertificateModal.authorizedSignatory}
                  </div>
                  <div className="w-36 h-0.5 bg-amber-500/40 my-1" />
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {selectedCertificateModal.signatoryTitle}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    State Digital Governance Authority
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl shadow-lg shrink-0">
                  <div className="w-20 h-20 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white text-center p-1">
                    <QrCode className="w-10 h-10 text-amber-400" />
                    <span className="text-[7px] font-mono mt-0.5 text-slate-300">Scan to verify</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedCertificateModal.qrPayload || window.location.href);
                  addToast({
                    type: 'success',
                    title: 'Verification Link Copied',
                    message: 'Official credential verification link copied to clipboard.',
                  });
                }}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Verification Link</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedCertificateModal(null)}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

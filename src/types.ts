export type RoleType = 'super_admin' | 'hr_manager' | 'manager' | 'learner' | 'trainer' | 'sme';

export type CompetencyLevel = 1 | 2 | 3 | 4 | 5;

export type CompetencyStatus = 'Beginner' | 'Developing' | 'Proficient' | 'Advanced' | 'Expert';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  organizationId: string;
  departmentId: string;
  designation: string;
  avatar: string;
  employeeId?: string;
  managerId?: string;
  civilServiceId?: string;
  cadre?: string;
  securityClearance?: string;
  securityClearanceLevel?: 1 | 2 | 3 | 4;
  nationalIdVerified?: boolean;
  biometricEnrolled?: boolean;
  govNetToken?: string;
  officeLocation?: string;
  phoneExtension?: string;
  accountStatus?: 'VERIFIED_ACTIVE' | 'PENDING_MFA' | 'SUSPENDED';
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  description: string;
  departmentsCount?: number;
  employeesCount?: number;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  headName: string;
  targetReadiness: number;
}

export interface JobRole {
  id: string;
  organizationId: string;
  departmentId: string;
  title: string;
  code: string;
  description: string;
  requiredCompetencies: {
    competencyId: string;
    requiredLevel: CompetencyLevel;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
  }[];
}

export interface Competency {
  id: string;
  organizationId: string;
  name: string;
  category: 'Technical' | 'Domain Governance' | 'Compliance & Security' | 'Behavioral';
  description: string;
  levels: {
    level: CompetencyLevel;
    title: string;
    description: string;
    behavioralIndicators: string[];
  }[];
}

export interface EvidenceScore {
  knowledgeAssessment: number; // 0-100 (30%)
  practicalTask: number;       // 0-100 (30%)
  courseCompletion: number;    // 0-100 (20%)
  trainerEvaluation: number;   // 0-100 (10%)
  selfAssessment: number;      // 0-100 (10%)
  calculatedOverallScore: number; // 0-100
  effectiveLevel: CompetencyLevel;
  statusLabel: CompetencyStatus;
  lastUpdated: string;
}

export interface ScoringWeights {
  knowledgeAssessment: number;
  practicalTask: number;
  courseCompletion: number;
  trainerEvaluation: number;
  selfAssessment: number;
}

export interface EmployeeCompetencyRecord {
  employeeId: string;
  competencyId: string;
  currentScore: number;        // 0-100
  currentLevel: CompetencyLevel;
  requiredLevel: CompetencyLevel;
  gap: number;                 // requiredLevel - currentLevel (negative means surplus)
  readinessPercentage: number; // (currentLevel / requiredLevel) * 100 capped at 100
  baselineScore: number;       // Pre-training score
  baselineDate: string;
  latestScore: number;         // Post-training score
  improvementPoints: number;   // latestScore - baselineScore (+percentage points)
  evidence: EvidenceScore;
  history: {
    date: string;
    score: number;
    eventType: 'baseline_assessment' | 'course_completion' | 'post_assessment' | 'practical_task' | 'trainer_review';
    notes: string;
  }[];
}

export interface Employee {
  id: string;
  organizationId: string;
  departmentId: string;
  roleId: string;
  name: string;
  email: string;
  employeeCode: string;
  designation: string;
  avatar: string;
  managerId: string;
  joinDate: string;
  civilServiceId?: string;
  cadre?: string;
  securityClearance?: string;
  securityClearanceLevel?: 1 | 2 | 3 | 4;
  nationalIdVerified?: boolean;
  biometricEnrolled?: boolean;
  officeLocation?: string;
  accountStatus?: string;
  overallReadiness: number; // 0-100%
  criticalGapsCount: number;
  mandatoryTrainingOverdue: boolean;
  competencies: Record<string, EmployeeCompetencyRecord>;
  completedCourseIds: string[];
  enrolledCourseIds: string[];
}

export type LecturePlatform = 'internal' | 'youtube' | 'coursera' | 'udemy' | 'linkedin_learning' | 'google_ai_studio' | 'mooc_other';

export interface CourseModule {
  id: string;
  title: string;
  durationMinutes: number;
  content: string;
  contentHindi?: string;
  audioVoiceoverText?: string;
  keyTakeaways: string[];
}

export interface Course {
  id: string;
  organizationId: string;
  departmentId: string;
  title: string;
  description: string;
  competencyId: string;
  targetCompetencyLevel: CompetencyLevel;
  durationHours: number;
  modulesCount: number;
  modules: CourseModule[];
  authorName: string;
  departmentName: string;
  tags: string[];
  isOfflineAvailable: boolean;
  practicalTaskPrompt?: string;
  practicalTaskRubric?: string;
  platform?: LecturePlatform;
  externalUrl?: string;
  embedUrl?: string;
  instructor?: string;
  thumbnailUrl?: string;
}

export interface MentorshipRequest {
  id: string;
  expertId: string;
  expertName: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  requesterEmail: string;
  topic: string;
  urgency: 'Routine' | 'High Priority' | 'Statutory Deadline';
  status: 'pending' | 'scheduled' | 'resolved';
  scheduledDate?: string;
  createdAt: string;
  responseNotes?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  competencyLevelTested: CompetencyLevel;
  difficulty?: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert';
  sectionId?: string;
  sectionTitle?: string;
}

export interface AssessmentSection {
  id: string;
  title: string;
  subtitle: string;
  weightPercentage: number;
  description: string;
  questions: AssessmentQuestion[];
}

export interface Assessment {
  id: string;
  courseId?: string;
  competencyId: string;
  title: string;
  type: 'baseline' | 'post_training' | 'comprehensive';
  targetLevel: CompetencyLevel;
  passingScore: number; // e.g. 70
  statutoryDeadline?: string; // ISO string e.g. 2026-09-30T18:00:00Z
  deadlineDurationMinutes?: number;
  sections?: AssessmentSection[];
  questions: AssessmentQuestion[];
  practicalScenario?: {
    prompt: string;
    expectedDeliverable: string;
    rubricPoints: string[];
  };
}

export interface AssessmentSubmission {
  id: string;
  employeeId: string;
  assessmentId: string;
  competencyId: string;
  type: 'baseline' | 'post_training';
  answers: Record<string, number>;
  practicalAnswer?: string;
  knowledgeScore: number;
  practicalScore: number;
  overallPercentage: number;
  realPercentage: number;
  totalCorrect: number;
  totalQuestions: number;
  surpassedDeadline: boolean;
  sectionResults?: {
    sectionId: string;
    sectionTitle: string;
    correct: number;
    total: number;
    percentage: number;
    weight: number;
  }[];
  detailedBreakdown?: {
    questionId: string;
    question: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation: string;
    sectionId?: string;
  }[];
  passed: boolean;
  awardedBadgeId?: string;
  awardedCertificateId?: string;
  submittedAt: string;
  isSynced: boolean;
}

export interface CompetencyCertificate {
  id: string;
  certificateNumber: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  cadre: string;
  designation: string;
  department: string;
  competencyId: string;
  competencyName: string;
  certifiedLevel: CompetencyLevel;
  realScorePercentage: number;
  completedWithinDeadline: boolean;
  deadlineDate: string;
  issuedAt: string;
  expiresAt: string;
  issuerAuthority: string;
  authorizedSignatory: string;
  signatoryTitle: string;
  verificationHash: string;
  qrPayload: string;
}

export interface RankedCompetencyPath {
  competencyId: string;
  competencyName: string;
  priorityRank: number;
  gap: number;
  currentLevel: number;
  requiredLevel: number;
  currentScore: number;
  readinessPercentage: number;
  courses: Course[];
  items: LearningPathItem[];
}

export interface LearningPathItem {
  id: string;
  courseId: string;
  course: Course;
  competencyId: string;
  competencyName: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed';
  recommendationReason: string;
  aiExplanation?: string;
  estimatedHours: number;
}

export interface KnowledgeResource {
  id: string;
  organizationId: string;
  departmentId: string;
  departmentName: string;
  title: string;
  description: string;
  competencyId: string;
  tags: string[];
  version: string;
  authorName: string;
  authorRole: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  lastUpdated: string;
  expiryDate: string;
  language: string;
  reuseCount: number;
  contentSummary: string;
  documentType: 'SOP' | 'Guidelines' | 'Technical Manual' | 'Case Study' | 'Policy Framework';
  downloadUrl?: string;
}

export interface AIDraftKnowledgeExtraction {
  title: string;
  summary: string;
  competencyId: string;
  competencyName: string;
  suggestedLevel: CompetencyLevel;
  learningObjectives: string[];
  keyConcepts: string[];
  moduleStructure: {
    title: string;
    durationMinutes: number;
    outline: string[];
  }[];
  generatedQuestions: {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  }[];
  scenarioExercise: {
    scenario: string;
    task: string;
    rubric: string;
  };
  status: 'Draft' | 'Human Review' | 'Trainer Approval' | 'Published';
  createdAt: string;
  rawSourceText?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface DuplicateDetectionResult {
  hasDuplicate: boolean;
  matchScore: number; // 0 - 100
  matchedResource?: KnowledgeResource;
  reason: string;
  suggestedActions: ('reuse' | 'adapt' | 'compare' | 'create_new')[];
}

export interface ExpertProfile {
  id: string;
  employeeId: string;
  name: string;
  departmentName: string;
  designation: string;
  avatar: string;
  verifiedCompetencies: {
    competencyId: string;
    competencyName: string;
    level: CompetencyLevel;
    verifiedSince: string;
  }[];
  authoredResourcesCount: number;
  helpedEmployeesCount: number;
  availableForConsultation: boolean;
  bio: string;
}

export interface CompetencyBadge {
  id: string;
  badgeCode: string;
  employeeId: string;
  employeeName: string;
  competencyId: string;
  competencyName: string;
  achievedLevel: CompetencyLevel;
  scorePercentage: number;
  issuedAt: string;
  expiresAt: string;
  issuer: string;
  verificationHash: string;
  qrPayload: string;
}

export interface ManagerAlert {
  id: string;
  organizationId: string;
  departmentId: string;
  employeeId: string;
  employeeName: string;
  type: 'overdue_training' | 'critical_gap' | 'assessment_failed' | 'badge_expiring';
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'nudged' | 'escalated_to_dept_head' | 'resolved';
  escalationLevel: 1 | 2 | 3; // 1: Employee Nudge, 2: Manager Follow-up, 3: Dept Head Escalation
  history: {
    date: string;
    action: string;
    actor: string;
  }[];
}

export interface FutureSkillGoal {
  id: string;
  competencyId: string;
  competencyName: string;
  targetYear: string;
  strategicTargetLevel: CompetencyLevel;
  currentWorkforceAverageLevel: number;
  projectedGap: number;
  affectedRoles: string[];
  strategicRationale: string;
  priority: 'High' | 'Critical' | 'Strategic';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: 'competency' | 'assessment' | 'role' | 'knowledge_approval' | 'weight_config' | 'nudge';
  details: string;
  organizationId: string;
}

export interface MentorshipRequest {
  id: string;
  expertId: string;
  expertName: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  requesterEmail: string;
  topic: string;
  urgency: 'Routine' | 'High Priority' | 'Statutory Deadline';
  status: 'pending' | 'scheduled' | 'resolved';
  createdAt: string;
  scheduledTime?: string;
  responseNotes?: string;
}


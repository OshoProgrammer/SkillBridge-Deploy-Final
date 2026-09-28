/**
 * SkillBridge — Deterministic Competency & Evidence Scoring Engine
 * 
 * CORE FORMULAS (Auditable & Explainable):
 * 1. Competency Score = (0.30 * Knowledge Assessment) + 
 *                       (0.30 * Practical Task) + 
 *                       (0.20 * Course Completion) + 
 *                       (0.10 * Trainer Evaluation) + 
 *                       (0.10 * Self-Assessment)
 *    (Weights are admin-configurable in Settings)
 * 
 * 2. Gap = Required Level - Current Level
 * 
 * 3. Readiness % = min(100, Math.round((Current Level / Required Level) * 100))
 * 
 * 4. Training Effectiveness = Post-Training Score - Pre-Training (Baseline) Score
 *    (Displayed as "+X percentage points")
 * 
 * Status Categories:
 * - < 40%: Beginner (L1)
 * - 40% - 59%: Developing (L2)
 * - 60% - 79%: Proficient (L3)
 * - 80% - 89%: Advanced (L4)
 * - 90% - 100%: Expert (L5)
 */

import { 
  CompetencyLevel, 
  CompetencyStatus, 
  EvidenceScore, 
  ScoringWeights, 
  EmployeeCompetencyRecord,
  JobRole,
  Course,
  LearningPathItem,
  RankedCompetencyPath
} from '../types';

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  knowledgeAssessment: 0.30,
  practicalTask: 0.30,
  courseCompletion: 0.20,
  trainerEvaluation: 0.10,
  selfAssessment: 0.10,
};

/**
 * Maps a percentage score (0-100) to standard Competency Level (L1 to L5)
 */
export function scoreToLevel(score: number): CompetencyLevel {
  if (score >= 90) return 5;
  if (score >= 80) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}

/**
 * Maps a percentage score to human-readable status label
 */
export function scoreToStatus(score: number): CompetencyStatus {
  if (score >= 90) return 'Expert';
  if (score >= 80) return 'Advanced';
  if (score >= 60) return 'Proficient';
  if (score >= 40) return 'Developing';
  return 'Beginner';
}

/**
 * Calculate deterministic weighted score from multi-source evidence
 */
export function calculateEvidenceScore(
  evidence: Omit<EvidenceScore, 'calculatedOverallScore' | 'effectiveLevel' | 'statusLabel' | 'lastUpdated'>,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): EvidenceScore {
  const normalizedSum = 
    weights.knowledgeAssessment +
    weights.practicalTask +
    weights.courseCompletion +
    weights.trainerEvaluation +
    weights.selfAssessment;

  const rawScore = 
    (evidence.knowledgeAssessment * weights.knowledgeAssessment) +
    (evidence.practicalTask * weights.practicalTask) +
    (evidence.courseCompletion * weights.courseCompletion) +
    (evidence.trainerEvaluation * weights.trainerEvaluation) +
    (evidence.selfAssessment * weights.selfAssessment);

  const calculatedOverallScore = Math.round(rawScore / (normalizedSum || 1));
  const effectiveLevel = scoreToLevel(calculatedOverallScore);
  const statusLabel = scoreToStatus(calculatedOverallScore);

  return {
    ...evidence,
    calculatedOverallScore,
    effectiveLevel,
    statusLabel,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Calculate gap and readiness % for an employee competency
 */
export function calculateCompetencyMetrics(
  currentScore: number,
  requiredLevel: CompetencyLevel,
  baselineScore: number = currentScore
): {
  currentLevel: CompetencyLevel;
  gap: number;
  readinessPercentage: number;
  improvementPoints: number;
} {
  const currentLevel = scoreToLevel(currentScore);
  const gap = Number((requiredLevel - currentLevel).toFixed(1));
  const readinessPercentage = Math.min(100, Math.round((currentLevel / requiredLevel) * 100));
  const improvementPoints = Math.round(currentScore - baselineScore);

  return {
    currentLevel,
    gap,
    readinessPercentage,
    improvementPoints,
  };
}

/**
 * Deterministic rule engine for Personalized Learning Path
 * Ranks courses targeting the single highest-priority gap first
 */
export function generatePersonalizedLearningPath(
  employeeRole: JobRole,
  competencyRecords: Record<string, EmployeeCompetencyRecord>,
  availableCourses: Course[]
): {
  primaryGapCompetencyId: string;
  primaryGapName: string;
  items: LearningPathItem[];
} {
  const priorityWeightMap: Record<string, number> = {
    'Critical': 4,
    'High': 3,
    'Medium': 2,
    'Low': 1,
  };

  // Score each required competency by: gap * priorityWeight
  const scoredRequirements = (employeeRole.requiredCompetencies || []).map(req => {
    const record = competencyRecords[req.competencyId];
    const currentScore = record ? record.currentScore : 0;
    const currentLevel = record ? record.currentLevel : 1;
    const gap = Math.max(0, req.requiredLevel - currentLevel);
    const pWeight = priorityWeightMap[req.priority] || 2;
    const weightedGapScore = gap * pWeight;

    return {
      competencyId: req.competencyId,
      requiredLevel: req.requiredLevel,
      currentLevel,
      currentScore,
      gap,
      priority: req.priority,
      weightedGapScore,
    };
  });

  scoredRequirements.sort((a, b) => b.weightedGapScore - a.weightedGapScore);

  const topRequirement = scoredRequirements[0] || {
    competencyId: 'comp-data-analytics',
    requiredLevel: 4 as CompetencyLevel,
    currentLevel: 2 as CompetencyLevel,
    currentScore: 42,
    gap: 2,
    priority: 'Critical' as const,
    weightedGapScore: 8,
  };

  const primaryGapCompId = topRequirement.competencyId;

  // Filter and rank relevant courses for this primary gap first, then other gaps
  const matchedCourses = availableCourses.filter(c => c.competencyId === primaryGapCompId);
  matchedCourses.sort((a, b) => a.targetCompetencyLevel - b.targetCompetencyLevel);

  // If we also need next steps from secondary gaps:
  const otherGapCourses: Course[] = [];
  for (let i = 1; i < scoredRequirements.length; i++) {
    const req = scoredRequirements[i];
    if (req.gap > 0) {
      const extra = availableCourses.filter(c => c.competencyId === req.competencyId);
      otherGapCourses.push(...extra);
    }
  }

  const allOrderedCourses = [...matchedCourses, ...otherGapCourses].slice(0, 5);

  const items: LearningPathItem[] = allOrderedCourses.map((course, idx) => {
    const isPrimary = course.competencyId === primaryGapCompId;
    let reason = '';
    
    if (isPrimary && idx === 0) {
      reason = `Step 1 Core Requirement: Targets your highest-priority gap in ${course.title} (Current: L${topRequirement.currentLevel} vs Required: L${topRequirement.requiredLevel}).`;
    } else if (isPrimary && idx === 1) {
      reason = `Step 2 Intermediate Mastery: Advances practical analytical and data governance proficiency to Level ${course.targetCompetencyLevel}.`;
    } else if (isPrimary) {
      reason = `Step 3 Applied Task: Capstone practice and departmental execution to verify Readiness Level ${course.targetCompetencyLevel}.`;
    } else {
      reason = `Secondary Priority: Reinforces complementary competency for ${employeeRole.title}.`;
    }

    return {
      id: `lp-item-${course.id}`,
      courseId: course.id,
      course,
      competencyId: course.competencyId,
      competencyName: course.title,
      order: idx + 1,
      status: idx === 0 ? 'in_progress' : 'not_started',
      recommendationReason: reason,
      aiExplanation: `Recommended based on deterministic gap analysis (${topRequirement.currentScore}% vs ${topRequirement.requiredLevel * 20}% benchmark) for ${employeeRole.title}.`,
      estimatedHours: course.durationHours,
    };
  });

  return {
    primaryGapCompetencyId: primaryGapCompId,
    primaryGapName: topRequirement.competencyId,
    items,
  };
}

/**
 * Generates ranked learning paths grouped by competency for rich UI presentation
 */
export function generateRankedLearningPaths(
  role: JobRole,
  competencyRecords: Record<string, EmployeeCompetencyRecord>,
  availableCourses: Course[]
): RankedCompetencyPath[] {
  const priorityWeightMap: Record<string, number> = {
    'Critical': 4,
    'High': 3,
    'Medium': 2,
    'Low': 1,
  };

  const scoredRequirements = (role.requiredCompetencies || []).map((req) => {
    const record = competencyRecords[req.competencyId];
    const currentScore = record ? record.currentScore : 0;
    const currentLevel = record ? record.currentLevel : 1;
    const gap = Math.max(0, req.requiredLevel - currentLevel);
    const pWeight = priorityWeightMap[req.priority] || 2;
    const weightedGapScore = gap * pWeight;

    const matchedCourses = availableCourses.filter((c) => c.competencyId === req.competencyId);

    const items: LearningPathItem[] = matchedCourses.map((c, idx) => ({
      id: `lp-${c.id}`,
      courseId: c.id,
      course: c,
      competencyId: c.competencyId,
      competencyName: c.title,
      order: idx + 1,
      status: idx === 0 ? 'in_progress' : 'not_started',
      recommendationReason: `Directly bridges requirement gap from L${currentLevel} to L${req.requiredLevel}`,
      estimatedHours: c.durationHours,
    }));

    return {
      competencyId: req.competencyId,
      competencyName: req.competencyId.replace('comp-', '').replace('-', ' ').toUpperCase(),
      gap,
      currentLevel,
      requiredLevel: req.requiredLevel,
      currentScore,
      readinessPercentage: record ? record.readinessPercentage : Math.round((currentScore / (req.requiredLevel * 20)) * 100),
      courses: matchedCourses,
      items,
      weightedGapScore,
    };
  });

  scoredRequirements.sort((a, b) => b.weightedGapScore - a.weightedGapScore);

  return scoredRequirements.map((req, idx) => ({
    competencyId: req.competencyId,
    competencyName: req.competencyName,
    priorityRank: idx + 1,
    gap: req.gap,
    currentLevel: req.currentLevel,
    requiredLevel: req.requiredLevel,
    currentScore: req.currentScore,
    readinessPercentage: req.readinessPercentage,
    courses: req.courses,
    items: req.items,
  }));
}

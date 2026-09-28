import { 
  Organization, 
  Department, 
  JobRole, 
  Competency, 
  Employee, 
  Course, 
  Assessment, 
  KnowledgeResource, 
  ExpertProfile, 
  CompetencyBadge, 
  ManagerAlert, 
  FutureSkillGoal,
  AuditLog,
  User
} from '../types';
import { calculateEvidenceScore, calculateCompetencyMetrics } from '../lib/scoring';

export const INITIAL_ORGANIZATION: Organization = {
  id: 'org-state-gov',
  name: 'State Digital Governance Department',
  code: 'SDGD-IN',
  description: 'Apex state authority driving digital infrastructure, public services, and capacity modernization.',
  departmentsCount: 6,
  employeesCount: 18,
};

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-it-gov',
    organizationId: 'org-state-gov',
    name: 'IT & Digital Governance',
    code: 'IT-GOV',
    headName: 'Dr. Sunita Iyer',
    targetReadiness: 85,
  },
  {
    id: 'dept-finance',
    organizationId: 'org-state-gov',
    name: 'Finance & Accounts',
    code: 'FIN-ACC',
    headName: 'Rajesh Verma',
    targetReadiness: 80,
  },
  {
    id: 'dept-hr',
    organizationId: 'org-state-gov',
    name: 'Human Resources & Capacity',
    code: 'HR-CAP',
    headName: 'Pooja Deshmukh',
    targetReadiness: 80,
  },
  {
    id: 'dept-procurement',
    organizationId: 'org-state-gov',
    name: 'Procurement & Contracts',
    code: 'PROC-CNT',
    headName: 'Vikram Singh',
    targetReadiness: 90,
  },
  {
    id: 'dept-admin',
    organizationId: 'org-state-gov',
    name: 'Administration & General Services',
    code: 'ADM-GEN',
    headName: 'Suresh Rao',
    targetReadiness: 75,
  },
  {
    id: 'dept-grievance',
    organizationId: 'org-state-gov',
    name: 'Public Grievance Cell',
    code: 'PUB-GRV',
    headName: 'Kavita Menon',
    targetReadiness: 85,
  },
];

export const INITIAL_COMPETENCIES: Competency[] = [
  {
    id: 'comp-data-analytics',
    organizationId: 'org-state-gov',
    name: 'Data Analytics',
    category: 'Technical',
    description: 'Ability to ingest, validate, analyze, and visualize administrative and governance data for evidence-based policy.',
    levels: [
      { level: 1, title: 'Foundational', description: 'Understands basic spreadsheets and clean tabular datasets.', behavioralIndicators: ['Performs basic sums and filters', 'Identifies data errors'] },
      { level: 2, title: 'Intermediate', description: 'Builds pivot tables, cleans dirty government records, and generates reports.', behavioralIndicators: ['Applies VLOOKUP/XLOOKUP', 'Cleans missing field records'] },
      { level: 3, title: 'Proficient', description: 'Creates visual interactive dashboards and interprets statistical trends for departments.', behavioralIndicators: ['Designs multi-metric dashboards', 'Tracks KPI variance over quarters'] },
      { level: 4, title: 'Advanced', description: 'Automates pipelines, conducts predictive analytics, and advises leadership on data policy.', behavioralIndicators: ['Performs multi-source SQL/Data aggregation', 'Synthesizes policy metrics'] },
      { level: 5, title: 'Expert', description: 'Architects enterprise data infrastructure and state-wide open data governance standards.', behavioralIndicators: ['Authors state data governance charters', 'Establishes automated audit data warehouses'] },
    ],
  },
  {
    id: 'comp-cybersecurity',
    organizationId: 'org-state-gov',
    name: 'Cybersecurity Awareness',
    category: 'Compliance & Security',
    description: 'Understanding of cyber threats, access control, CERT-In compliance, and secure data handling in government operations.',
    levels: [
      { level: 1, title: 'Foundational', description: 'Recognizes phishing emails and enforces strong password hygiene.', behavioralIndicators: ['Identifies suspicious links', 'Uses 2FA'] },
      { level: 2, title: 'Intermediate', description: 'Adheres to role-based access rules and secure file sharing protocols.', behavioralIndicators: ['Manages encrypted file transfers', 'Reports security incidents'] },
      { level: 3, title: 'Proficient', description: 'Audits department data permissions and enforces compliance with state security guidelines.', behavioralIndicators: ['Conducts access permission reviews', 'Applies data classification'] },
      { level: 4, title: 'Advanced', description: 'Designs incident response workflows and threat mitigation strategies.', behavioralIndicators: ['Coordinates CERT-In drills', 'Mitigates network vulnerabilities'] },
      { level: 5, title: 'Expert', description: 'Develops enterprise zero-trust security architectures for state digital platforms.', behavioralIndicators: ['Formulates state cyber defense policies', 'Audits cryptographic backbones'] },
    ],
  },
  {
    id: 'comp-digital-governance',
    organizationId: 'org-state-gov',
    name: 'Digital Governance',
    category: 'Domain Governance',
    description: 'Knowledge of e-Office, citizen service portals, API exchange standards, and public service guarantee mandates.',
    levels: [
      { level: 1, title: 'Foundational', description: 'Navigates e-Office and standard citizen service portals.', behavioralIndicators: ['Tracks digital file movement', 'Submits digital approvals'] },
      { level: 2, title: 'Intermediate', description: 'Troubleshoots digital workflow bottlenecks and citizen query lifecycles.', behavioralIndicators: ['Optimizes file disposal timelines', 'Identifies citizen SLA delays'] },
      { level: 3, title: 'Proficient', description: 'Implements service level tracking and citizen charter digital compliance.', behavioralIndicators: ['Monitors SLA compliance dashboards', 'Integrates cross-service workflows'] },
      { level: 4, title: 'Advanced', description: 'Architects end-to-end paperless digital public infrastructure programs.', behavioralIndicators: ['Designs citizen-centric digital portals', 'Automates inter-departmental API data flows'] },
      { level: 5, title: 'Expert', description: 'Drives national and state-level digital transformation policy frameworks.', behavioralIndicators: ['Standardizes state digital public goods', 'Authors digital service legislation'] },
    ],
  },
  {
    id: 'comp-communication',
    organizationId: 'org-state-gov',
    name: 'Communication',
    category: 'Behavioral',
    description: 'Effective cross-departmental memo drafting, stakeholder briefing, citizen response, and crisis communication.',
    levels: [
      { level: 1, title: 'Foundational', description: 'Drafts clear routine emails and departmental correspondence.', behavioralIndicators: ['Uses proper official etiquette', 'Summarizes meeting points'] },
      { level: 2, title: 'Intermediate', description: 'Writes structured policy briefs, cabinet notes, and circular drafts.', behavioralIndicators: ['Drafts unambiguous circulars', 'Addresses public queries respectfully'] },
      { level: 3, title: 'Proficient', description: 'Leads inter-departmental consultations and executive presentations.', behavioralIndicators: ['Presents complex data simply to leadership', 'Resolves inter-agency friction'] },
      { level: 4, title: 'Advanced', description: 'Spearheads strategic communication campaigns and high-level negotiations.', behavioralIndicators: ['Manages public media disclosures', 'Crafts state strategic vision papers'] },
      { level: 5, title: 'Expert', description: 'Sets communication governance standards and master diplomacy frameworks.', behavioralIndicators: ['Advises state ministers on policy messaging', 'Leads national stakeholder forums'] },
    ],
  },
  {
    id: 'comp-procurement',
    organizationId: 'org-state-gov',
    name: 'Procurement Compliance',
    category: 'Compliance & Security',
    description: 'Mastery of General Financial Rules (GFR), Government e-Marketplace (GeM), tender evaluation, and contract management.',
    levels: [
      { level: 1, title: 'Foundational', description: 'Understands basic purchase requisitions and quotation requests.', behavioralIndicators: ['Drafts items indent', 'Checks basic vendor invoices'] },
      { level: 2, title: 'Intermediate', description: 'Navigates GeM portal bidding, direct purchase limits, and invoice clearance.', behavioralIndicators: ['Executes GeM purchase orders', 'Checks GFR rule 149 compliance'] },
      { level: 3, title: 'Proficient', description: 'Drafts complex Request for Proposals (RFPs) and chairs technical evaluation committees.', behavioralIndicators: ['Prepares comprehensive tender documents', 'Scores vendor technical proposals'] },
      { level: 4, title: 'Advanced', description: 'Manages multi-year public-private partnership contracts and dispute resolution.', behavioralIndicators: ['Negotiates SLA contracts', 'Conducts vendor performance audits'] },
      { level: 5, title: 'Expert', description: 'Formulates state public procurement reform policies and anti-fraud protocols.', behavioralIndicators: ['Drafts state procurement acts', 'Designs automated fraud detection algorithms'] },
    ],
  },
  {
    id: 'comp-financial-reporting',
    organizationId: 'org-state-gov',
    name: 'Financial Reporting',
    category: 'Technical',
    description: 'Preparation of budget estimates, utilization certificates, audit compliance (CAG/AG), and expenditure tracking.',
    levels: [
      { level: 1, title: 'Foundational', description: 'Verifies vouchers, expenditure ledgers, and bill registers.', behavioralIndicators: ['Checks budget head codes', 'Records invoice vouchers'] },
      { level: 2, title: 'Intermediate', description: 'Prepares monthly budget utilization statements and reconciliation sheets.', behavioralIndicators: ['Reconciles treasury statements', 'Identifies budget variances'] },
      { level: 3, title: 'Proficient', description: 'Drafts comprehensive budget estimates and replies to audit paras.', behavioralIndicators: ['Prepares outcome budget drafts', 'Resolves CAG audit inquiries'] },
      { level: 4, title: 'Advanced', description: 'Conducts fiscal impact modeling and capital expenditure optimization.', behavioralIndicators: ['Forecasts 3-year state revenue flows', 'Optimizes fund disbursement tracks'] },
      { level: 5, title: 'Expert', description: 'Directs state public financial management systems and debt governance.', behavioralIndicators: ['Authors state fiscal responsibility charters', 'Advises finance commission delegations'] },
    ],
  },
  {
    id: 'comp-leadership',
    organizationId: 'org-state-gov',
    name: 'Leadership & Public Policy',
    category: 'Domain Governance',
    description: 'Strategic vision, public program execution, team mentorship, and ethical administrative leadership.',
    levels: [
      { level: 1, title: 'Foundational', description: 'Demonstrates accountability and team collaboration.', behavioralIndicators: ['Meets task deadlines', 'Supports team initiatives'] },
      { level: 2, title: 'Intermediate', description: 'Coordinates small project squads and mentors junior staff.', behavioralIndicators: ['Delegates operational tasks', 'Provides constructive feedback'] },
      { level: 3, title: 'Proficient', description: 'Leads departmental units and drives cross-functional performance.', behavioralIndicators: ['Resolves team bottlenecks', 'Implements operational improvements'] },
      { level: 4, title: 'Advanced', description: 'Directs major state mission projects and strategic change management.', behavioralIndicators: ['Manages multi-stakeholder governance boards', 'Inspires high-performance culture'] },
      { level: 5, title: 'Expert', description: 'Transforms institutional culture and delivers national benchmark governance.', behavioralIndicators: ['Pioneers state-wide administrative reforms', 'Mentors future senior civil servants'] },
    ],
  },
  {
    id: 'comp-project-management',
    organizationId: 'org-state-gov',
    name: 'Project Management',
    category: 'Technical',
    description: 'WBS planning, milestone tracking, risk registers, vendor delivery management, and post-implementation review.',
    levels: [
      { level: 1, title: 'Foundational', description: 'Tracks project activity checklists and milestone calendars.', behavioralIndicators: ['Updates status logs', 'Reports task blockers'] },
      { level: 2, title: 'Intermediate', description: 'Builds Gantt schedules and maintains departmental risk registers.', behavioralIndicators: ['Tracks critical path tasks', 'Calculates milestone burn rate'] },
      { level: 3, title: 'Proficient', description: 'Manages vendor deliverables, SLA penalties, and scope change requests.', behavioralIndicators: ['Enforces contractual milestone payments', 'Conducts sprint reviews'] },
      { level: 4, title: 'Advanced', description: 'Oversees multi-agency digital programs with agile governance methodologies.', behavioralIndicators: ['Manages PMO operations', 'Mitigates mission-critical project risks'] },
      { level: 5, title: 'Expert', description: 'Directs state mega-infrastructure portfolio governance.', behavioralIndicators: ['Authors state project delivery manuals', 'Optimizes state capital project portfolio'] },
    ],
  },
];

export const INITIAL_ROLES: JobRole[] = [
  {
    id: 'role-jr-gov-officer',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'Junior Digital Governance Officer',
    code: 'JDGO-01',
    description: 'Responsible for digital workflow optimization, e-Office analytics, citizen SLA monitoring, and data reporting.',
    requiredCompetencies: [
      { competencyId: 'comp-data-analytics', requiredLevel: 4, priority: 'Critical' },
      { competencyId: 'comp-cybersecurity', requiredLevel: 3, priority: 'High' },
      { competencyId: 'comp-digital-governance', requiredLevel: 4, priority: 'Critical' },
      { competencyId: 'comp-communication', requiredLevel: 3, priority: 'Medium' },
    ],
  },
  {
    id: 'role-jr-accounts-officer',
    organizationId: 'org-state-gov',
    departmentId: 'dept-finance',
    title: 'Junior Accounts Officer',
    code: 'JAO-02',
    description: 'Manages treasury reconciliation, budget head allocations, invoice vouchers, and audit documentation.',
    requiredCompetencies: [
      { competencyId: 'comp-financial-reporting', requiredLevel: 4, priority: 'Critical' },
      { competencyId: 'comp-procurement', requiredLevel: 3, priority: 'High' },
      { competencyId: 'comp-data-analytics', requiredLevel: 3, priority: 'Medium' },
      { competencyId: 'comp-communication', requiredLevel: 3, priority: 'Low' },
    ],
  },
  {
    id: 'role-hr-exec',
    organizationId: 'org-state-gov',
    departmentId: 'dept-hr',
    title: 'HR Executive',
    code: 'HRE-03',
    description: 'Drives workforce capacity planning, training coordination, service book maintenance, and performance appraisal.',
    requiredCompetencies: [
      { competencyId: 'comp-leadership', requiredLevel: 3, priority: 'High' },
      { competencyId: 'comp-communication', requiredLevel: 4, priority: 'Critical' },
      { competencyId: 'comp-digital-governance', requiredLevel: 3, priority: 'Medium' },
      { competencyId: 'comp-data-analytics', requiredLevel: 2, priority: 'Low' },
    ],
  },
  {
    id: 'role-it-support',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'IT Support Officer',
    code: 'ITSO-04',
    description: 'Maintains departmental LAN/WAN, endpoint security, software deployments, and CERT-In compliance checks.',
    requiredCompetencies: [
      { competencyId: 'comp-cybersecurity', requiredLevel: 4, priority: 'Critical' },
      { competencyId: 'comp-digital-governance', requiredLevel: 3, priority: 'High' },
      { competencyId: 'comp-project-management', requiredLevel: 2, priority: 'Medium' },
      { competencyId: 'comp-communication', requiredLevel: 3, priority: 'Low' },
    ],
  },
  {
    id: 'role-procurement-officer',
    organizationId: 'org-state-gov',
    departmentId: 'dept-procurement',
    title: 'Procurement Officer',
    code: 'PRO-05',
    description: 'Oversees GeM portal procurement, RFP drafting, contract SLA monitoring, and vendor evaluations.',
    requiredCompetencies: [
      { competencyId: 'comp-procurement', requiredLevel: 4, priority: 'Critical' },
      { competencyId: 'comp-financial-reporting', requiredLevel: 3, priority: 'High' },
      { competencyId: 'comp-communication', requiredLevel: 3, priority: 'Medium' },
      { competencyId: 'comp-project-management', requiredLevel: 3, priority: 'Medium' },
    ],
  },
  {
    id: 'role-admin-officer',
    organizationId: 'org-state-gov',
    departmentId: 'dept-admin',
    title: 'Administrative Officer',
    code: 'AO-06',
    description: 'Supervises general administration, protocol management, inter-agency coordination, and asset maintenance.',
    requiredCompetencies: [
      { competencyId: 'comp-leadership', requiredLevel: 4, priority: 'High' },
      { competencyId: 'comp-digital-governance', requiredLevel: 3, priority: 'Critical' },
      { competencyId: 'comp-communication', requiredLevel: 4, priority: 'High' },
      { competencyId: 'comp-procurement', requiredLevel: 3, priority: 'Medium' },
    ],
  },
];

// Helper to build initial employee competency evidence
function createSeedCompetencyRecord(
  employeeId: string, 
  competencyId: string, 
  requiredLevel: 1 | 2 | 3 | 4 | 5, 
  scores: {
    knowledge: number;
    practical: number;
    completion: number;
    trainer: number;
    self: number;
  },
  baselineScore?: number
) {
  const evidence = calculateEvidenceScore({
    knowledgeAssessment: scores.knowledge,
    practicalTask: scores.practical,
    courseCompletion: scores.completion,
    trainerEvaluation: scores.trainer,
    selfAssessment: scores.self,
  });

  const base = baselineScore !== undefined ? baselineScore : evidence.calculatedOverallScore;
  const metrics = calculateCompetencyMetrics(evidence.calculatedOverallScore, requiredLevel, base);

  return {
    employeeId,
    competencyId,
    currentScore: evidence.calculatedOverallScore,
    currentLevel: metrics.currentLevel,
    requiredLevel,
    gap: metrics.gap,
    readinessPercentage: metrics.readinessPercentage,
    baselineScore: base,
    baselineDate: '2026-08-15T09:00:00Z',
    latestScore: evidence.calculatedOverallScore,
    improvementPoints: metrics.improvementPoints,
    evidence,
    history: [
      {
        date: '2026-08-15T09:30:00Z',
        score: base,
        eventType: 'baseline_assessment' as const,
        notes: 'Initial organizational baseline diagnostic evaluation.',
      },
    ],
  };
}

export const INITIAL_EMPLOYEES: Employee[] = [
  // 1. Hero Learner: Ananya Sharma
  {
    id: 'emp-ananya-sharma',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    roleId: 'role-jr-gov-officer',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@state.gov.in',
    employeeCode: 'SDGD-EMP-101',
    designation: 'Junior Digital Governance Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    managerId: 'emp-arjun-mehta',
    joinDate: '2025-11-01',
    overallReadiness: 64,
    criticalGapsCount: 1, // Data Analytics flagged critical
    mandatoryTrainingOverdue: false,
    completedCourseIds: [],
    enrolledCourseIds: ['course-data-excel-01'],
    competencies: {
      'comp-digital-governance': createSeedCompetencyRecord('emp-ananya-sharma', 'comp-digital-governance', 4, {
        knowledge: 75, practical: 70, completion: 70, trainer: 65, self: 75 // ~71%
      }, 71),
      'comp-data-analytics': createSeedCompetencyRecord('emp-ananya-sharma', 'comp-data-analytics', 4, {
        knowledge: 40, practical: 42, completion: 45, trainer: 40, self: 45 // ~42% (CRITICAL GAP)
      }, 42),
      'comp-cybersecurity': createSeedCompetencyRecord('emp-ananya-sharma', 'comp-cybersecurity', 3, {
        knowledge: 65, practical: 60, completion: 65, trainer: 60, self: 65 // ~63%
      }, 63),
      'comp-communication': createSeedCompetencyRecord('emp-ananya-sharma', 'comp-communication', 3, {
        knowledge: 85, practical: 80, completion: 85, trainer: 80, self: 80 // ~82%
      }, 82),
    },
  },

  // 2. Manager: Arjun Mehta
  {
    id: 'emp-arjun-mehta',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    roleId: 'role-jr-gov-officer',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@state.gov.in',
    employeeCode: 'SDGD-MGR-201',
    designation: 'Senior Digital Projects Lead & Team Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    managerId: 'emp-sunita-iyer',
    joinDate: '2023-04-15',
    overallReadiness: 88,
    criticalGapsCount: 0,
    mandatoryTrainingOverdue: false,
    completedCourseIds: ['course-data-excel-01', 'course-data-viz-02'],
    enrolledCourseIds: [],
    competencies: {
      'comp-digital-governance': createSeedCompetencyRecord('emp-arjun-mehta', 'comp-digital-governance', 4, {
        knowledge: 90, practical: 88, completion: 90, trainer: 85, self: 85
      }, 88),
      'comp-data-analytics': createSeedCompetencyRecord('emp-arjun-mehta', 'comp-data-analytics', 4, {
        knowledge: 85, practical: 82, completion: 90, trainer: 85, self: 80
      }, 84),
      'comp-cybersecurity': createSeedCompetencyRecord('emp-arjun-mehta', 'comp-cybersecurity', 3, {
        knowledge: 88, practical: 85, completion: 85, trainer: 80, self: 85
      }, 85),
      'comp-communication': createSeedCompetencyRecord('emp-arjun-mehta', 'comp-communication', 3, {
        knowledge: 92, practical: 90, completion: 95, trainer: 90, self: 90
      }, 91),
    },
  },

  // 3. Trainer / SME: Dr. Sunita Iyer
  {
    id: 'emp-sunita-iyer',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    roleId: 'role-jr-gov-officer',
    name: 'Dr. Sunita Iyer',
    email: 'sunita.iyer@state.gov.in',
    employeeCode: 'SDGD-DIR-001',
    designation: 'Head of IT & Digital Governance',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    managerId: '',
    joinDate: '2021-02-10',
    overallReadiness: 96,
    criticalGapsCount: 0,
    mandatoryTrainingOverdue: false,
    completedCourseIds: ['course-data-excel-01', 'course-data-viz-02', 'course-data-capstone-03'],
    enrolledCourseIds: [],
    competencies: {
      'comp-digital-governance': createSeedCompetencyRecord('emp-sunita-iyer', 'comp-digital-governance', 4, {
        knowledge: 98, practical: 95, completion: 100, trainer: 95, self: 95
      }, 96),
      'comp-data-analytics': createSeedCompetencyRecord('emp-sunita-iyer', 'comp-data-analytics', 4, {
        knowledge: 95, practical: 96, completion: 100, trainer: 94, self: 95
      }, 95),
      'comp-cybersecurity': createSeedCompetencyRecord('emp-sunita-iyer', 'comp-cybersecurity', 3, {
        knowledge: 92, practical: 90, completion: 95, trainer: 90, self: 90
      }, 92),
      'comp-communication': createSeedCompetencyRecord('emp-sunita-iyer', 'comp-communication', 3, {
        knowledge: 95, practical: 92, completion: 95, trainer: 95, self: 90
      }, 94),
    },
  },

  // 4. Overdue Employee (in Manager's team): Rohan Kulkarni
  {
    id: 'emp-rohan-kulkarni',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    roleId: 'role-it-support',
    name: 'Rohan Kulkarni',
    email: 'rohan.kulkarni@state.gov.in',
    employeeCode: 'SDGD-EMP-104',
    designation: 'IT Support Officer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    managerId: 'emp-arjun-mehta',
    joinDate: '2025-08-01',
    overallReadiness: 48,
    criticalGapsCount: 2,
    mandatoryTrainingOverdue: true, // OVERDUE
    completedCourseIds: [],
    enrolledCourseIds: ['course-cyber-01'],
    competencies: {
      'comp-cybersecurity': createSeedCompetencyRecord('emp-rohan-kulkarni', 'comp-cybersecurity', 4, {
        knowledge: 45, practical: 40, completion: 30, trainer: 40, self: 50 // 41% (Critical gap)
      }, 41),
      'comp-digital-governance': createSeedCompetencyRecord('emp-rohan-kulkarni', 'comp-digital-governance', 3, {
        knowledge: 55, practical: 50, completion: 45, trainer: 50, self: 55 // 51%
      }, 51),
      'comp-project-management': createSeedCompetencyRecord('emp-rohan-kulkarni', 'comp-project-management', 2, {
        knowledge: 60, practical: 55, completion: 50, trainer: 50, self: 60 // 55%
      }, 55),
      'comp-communication': createSeedCompetencyRecord('emp-rohan-kulkarni', 'comp-communication', 3, {
        knowledge: 50, practical: 45, completion: 40, trainer: 45, self: 50 // 46% (Critical gap)
      }, 46),
    },
  },

  // 5. Finance Head / SME: Rajesh Verma
  {
    id: 'emp-rajesh-verma',
    organizationId: 'org-state-gov',
    departmentId: 'dept-finance',
    roleId: 'role-jr-accounts-officer',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@state.gov.in',
    employeeCode: 'SDGD-FIN-301',
    designation: 'Senior Accounts Officer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    managerId: '',
    joinDate: '2022-01-10',
    overallReadiness: 92,
    criticalGapsCount: 0,
    mandatoryTrainingOverdue: false,
    completedCourseIds: ['course-fin-01'],
    enrolledCourseIds: [],
    competencies: {
      'comp-financial-reporting': createSeedCompetencyRecord('emp-rajesh-verma', 'comp-financial-reporting', 4, {
        knowledge: 95, practical: 92, completion: 95, trainer: 90, self: 90
      }, 93),
      'comp-procurement': createSeedCompetencyRecord('emp-rajesh-verma', 'comp-procurement', 3, {
        knowledge: 85, practical: 88, completion: 90, trainer: 85, self: 85
      }, 87),
      'comp-data-analytics': createSeedCompetencyRecord('emp-rajesh-verma', 'comp-data-analytics', 3, {
        knowledge: 78, practical: 75, completion: 80, trainer: 75, self: 75
      }, 77),
      'comp-communication': createSeedCompetencyRecord('emp-rajesh-verma', 'comp-communication', 3, {
        knowledge: 85, practical: 80, completion: 85, trainer: 80, self: 80
      }, 82),
    },
  },

  // 6. Finance Learner: Meera Swaminathan
  {
    id: 'emp-meera-swami',
    organizationId: 'org-state-gov',
    departmentId: 'dept-finance',
    roleId: 'role-jr-accounts-officer',
    name: 'Meera Swaminathan',
    email: 'meera.s@state.gov.in',
    employeeCode: 'SDGD-EMP-106',
    designation: 'Junior Accounts Officer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    managerId: 'emp-rajesh-verma',
    joinDate: '2025-06-01',
    overallReadiness: 72,
    criticalGapsCount: 1,
    mandatoryTrainingOverdue: false,
    completedCourseIds: [],
    enrolledCourseIds: ['course-fin-01'],
    competencies: {
      'comp-financial-reporting': createSeedCompetencyRecord('emp-meera-swami', 'comp-financial-reporting', 4, {
        knowledge: 72, practical: 70, completion: 75, trainer: 70, self: 75
      }, 72),
      'comp-procurement': createSeedCompetencyRecord('emp-meera-swami', 'comp-procurement', 3, {
        knowledge: 65, practical: 62, completion: 65, trainer: 60, self: 65
      }, 64),
      'comp-data-analytics': createSeedCompetencyRecord('emp-meera-swami', 'comp-data-analytics', 3, {
        knowledge: 48, practical: 45, completion: 50, trainer: 45, self: 50 // 48% (Critical Gap for Finance Reporting)
      }, 48),
      'comp-communication': createSeedCompetencyRecord('emp-meera-swami', 'comp-communication', 3, {
        knowledge: 78, practical: 75, completion: 80, trainer: 75, self: 75
      }, 77),
    },
  },

  // 7. Procurement Head / SME: Vikram Singh
  {
    id: 'emp-vikram-singh',
    organizationId: 'org-state-gov',
    departmentId: 'dept-procurement',
    roleId: 'role-procurement-officer',
    name: 'Vikram Singh',
    email: 'vikram.singh@state.gov.in',
    employeeCode: 'SDGD-PROC-401',
    designation: 'Chief Procurement Officer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    managerId: '',
    joinDate: '2022-09-01',
    overallReadiness: 94,
    criticalGapsCount: 0,
    mandatoryTrainingOverdue: false,
    completedCourseIds: ['course-proc-01'],
    enrolledCourseIds: [],
    competencies: {
      'comp-procurement': createSeedCompetencyRecord('emp-vikram-singh', 'comp-procurement', 4, {
        knowledge: 96, practical: 95, completion: 98, trainer: 92, self: 95
      }, 95),
      'comp-financial-reporting': createSeedCompetencyRecord('emp-vikram-singh', 'comp-financial-reporting', 3, {
        knowledge: 90, practical: 88, completion: 90, trainer: 85, self: 85
      }, 88),
      'comp-communication': createSeedCompetencyRecord('emp-vikram-singh', 'comp-communication', 3, {
        knowledge: 88, practical: 85, completion: 90, trainer: 85, self: 85
      }, 87),
      'comp-project-management': createSeedCompetencyRecord('emp-vikram-singh', 'comp-project-management', 3, {
        knowledge: 85, practical: 82, completion: 85, trainer: 80, self: 85
      }, 84),
    },
  },

  // 8. Procurement Learner: Priya Nair (recently improved)
  {
    id: 'emp-priya-nair',
    organizationId: 'org-state-gov',
    departmentId: 'dept-procurement',
    roleId: 'role-procurement-officer',
    name: 'Priya Nair',
    email: 'priya.nair@state.gov.in',
    employeeCode: 'SDGD-EMP-108',
    designation: 'Procurement Officer',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    managerId: 'emp-vikram-singh',
    joinDate: '2024-03-15',
    overallReadiness: 86,
    criticalGapsCount: 0,
    mandatoryTrainingOverdue: false,
    completedCourseIds: ['course-proc-01'],
    enrolledCourseIds: [],
    competencies: {
      'comp-procurement': createSeedCompetencyRecord('emp-priya-nair', 'comp-procurement', 4, {
        knowledge: 88, practical: 85, completion: 90, trainer: 85, self: 85 // 87% (Improved from 52%)
      }, 52),
      'comp-financial-reporting': createSeedCompetencyRecord('emp-priya-nair', 'comp-financial-reporting', 3, {
        knowledge: 82, practical: 80, completion: 85, trainer: 80, self: 80
      }, 81),
      'comp-communication': createSeedCompetencyRecord('emp-priya-nair', 'comp-communication', 3, {
        knowledge: 80, practical: 78, completion: 80, trainer: 75, self: 80
      }, 79),
      'comp-project-management': createSeedCompetencyRecord('emp-priya-nair', 'comp-project-management', 3, {
        knowledge: 78, practical: 75, completion: 80, trainer: 75, self: 75
      }, 77),
    },
  },

  // 9. HR Manager: Pooja Deshmukh
  {
    id: 'emp-pooja-deshmukh',
    organizationId: 'org-state-gov',
    departmentId: 'dept-hr',
    roleId: 'role-hr-exec',
    name: 'Pooja Deshmukh',
    email: 'pooja.deshmukh@state.gov.in',
    employeeCode: 'SDGD-HR-501',
    designation: 'L&D and Capacity Director',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    managerId: '',
    joinDate: '2022-05-10',
    overallReadiness: 91,
    criticalGapsCount: 0,
    mandatoryTrainingOverdue: false,
    completedCourseIds: [],
    enrolledCourseIds: [],
    competencies: {
      'comp-leadership': createSeedCompetencyRecord('emp-pooja-deshmukh', 'comp-leadership', 3, {
        knowledge: 92, practical: 90, completion: 95, trainer: 90, self: 90
      }, 91),
      'comp-communication': createSeedCompetencyRecord('emp-pooja-deshmukh', 'comp-communication', 4, {
        knowledge: 95, practical: 92, completion: 95, trainer: 90, self: 95
      }, 93),
      'comp-digital-governance': createSeedCompetencyRecord('emp-pooja-deshmukh', 'comp-digital-governance', 3, {
        knowledge: 85, practical: 80, completion: 85, trainer: 80, self: 85
      }, 83),
      'comp-data-analytics': createSeedCompetencyRecord('emp-pooja-deshmukh', 'comp-data-analytics', 2, {
        knowledge: 75, practical: 70, completion: 75, trainer: 70, self: 75
      }, 73),
    },
  },

  // 10. Admin Officer: Suresh Rao
  {
    id: 'emp-suresh-rao',
    organizationId: 'org-state-gov',
    departmentId: 'dept-admin',
    roleId: 'role-admin-officer',
    name: 'Suresh Rao',
    email: 'suresh.rao@state.gov.in',
    employeeCode: 'SDGD-ADM-601',
    designation: 'Senior Administrative Officer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    managerId: '',
    joinDate: '2020-11-20',
    overallReadiness: 83,
    criticalGapsCount: 0,
    mandatoryTrainingOverdue: false,
    completedCourseIds: [],
    enrolledCourseIds: [],
    competencies: {
      'comp-leadership': createSeedCompetencyRecord('emp-suresh-rao', 'comp-leadership', 4, {
        knowledge: 85, practical: 82, completion: 85, trainer: 80, self: 85
      }, 84),
      'comp-digital-governance': createSeedCompetencyRecord('emp-suresh-rao', 'comp-digital-governance', 3, {
        knowledge: 80, practical: 75, completion: 80, trainer: 75, self: 80
      }, 78),
      'comp-communication': createSeedCompetencyRecord('emp-suresh-rao', 'comp-communication', 4, {
        knowledge: 88, practical: 85, completion: 90, trainer: 85, self: 85
      }, 87),
      'comp-procurement': createSeedCompetencyRecord('emp-suresh-rao', 'comp-procurement', 3, {
        knowledge: 75, practical: 72, completion: 75, trainer: 70, self: 75
      }, 74),
    },
  },

  // 11. Grievance Cell: Kavita Menon
  {
    id: 'emp-kavita-menon',
    organizationId: 'org-state-gov',
    departmentId: 'dept-grievance',
    roleId: 'role-admin-officer',
    name: 'Kavita Menon',
    email: 'kavita.menon@state.gov.in',
    employeeCode: 'SDGD-GRV-701',
    designation: 'Grievance Redressal Coordinator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    managerId: '',
    joinDate: '2023-08-12',
    overallReadiness: 78,
    criticalGapsCount: 1,
    mandatoryTrainingOverdue: false,
    completedCourseIds: [],
    enrolledCourseIds: [],
    competencies: {
      'comp-leadership': createSeedCompetencyRecord('emp-kavita-menon', 'comp-leadership', 4, {
        knowledge: 78, practical: 75, completion: 80, trainer: 75, self: 75
      }, 77),
      'comp-digital-governance': createSeedCompetencyRecord('emp-kavita-menon', 'comp-digital-governance', 3, {
        knowledge: 82, practical: 80, completion: 85, trainer: 80, self: 80
      }, 82),
      'comp-communication': createSeedCompetencyRecord('emp-kavita-menon', 'comp-communication', 4, {
        knowledge: 88, practical: 85, completion: 90, trainer: 85, self: 85
      }, 87),
      'comp-procurement': createSeedCompetencyRecord('emp-kavita-menon', 'comp-procurement', 3, {
        knowledge: 60, practical: 58, completion: 60, trainer: 55, self: 60
      }, 59),
    },
  },

  // 12. Super Admin User record: Ravi Shankar
  {
    id: 'emp-ravi-shankar',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    roleId: 'role-jr-gov-officer',
    name: 'Ravi Shankar',
    email: 'ravi.shankar@state.gov.in',
    employeeCode: 'SDGD-ADM-000',
    designation: 'Principal Secretary & State Admin',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    managerId: '',
    joinDate: '2020-01-01',
    overallReadiness: 98,
    criticalGapsCount: 0,
    mandatoryTrainingOverdue: false,
    completedCourseIds: [],
    enrolledCourseIds: [],
    competencies: {
      'comp-digital-governance': createSeedCompetencyRecord('emp-ravi-shankar', 'comp-digital-governance', 4, {
        knowledge: 98, practical: 98, completion: 100, trainer: 95, self: 95
      }, 97),
      'comp-data-analytics': createSeedCompetencyRecord('emp-ravi-shankar', 'comp-data-analytics', 4, {
        knowledge: 96, practical: 95, completion: 100, trainer: 95, self: 95
      }, 96),
      'comp-cybersecurity': createSeedCompetencyRecord('emp-ravi-shankar', 'comp-cybersecurity', 3, {
        knowledge: 95, practical: 92, completion: 95, trainer: 95, self: 90
      }, 94),
      'comp-communication': createSeedCompetencyRecord('emp-ravi-shankar', 'comp-communication', 3, {
        knowledge: 99, practical: 98, completion: 100, trainer: 98, self: 98
      }, 99),
    },
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-data-excel-01',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'Excel & Data Fundamentals for Public Sector',
    description: 'Practical data organization, error auditing, pivot tables, and statistical summaries for government administrative records.',
    competencyId: 'comp-data-analytics',
    targetCompetencyLevel: 2,
    durationHours: 3.5,
    modulesCount: 3,
    authorName: 'Dr. Sunita Iyer',
    departmentName: 'IT & Digital Governance',
    tags: ['Data Analytics', 'Excel', 'Data Cleaning', 'e-Governance'],
    isOfflineAvailable: true,
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Public Sector Datasets & Data Hygiene',
        durationMinutes: 45,
        content: `Government departments generate massive amounts of administrative data daily—from public grievance logs and treasury vouchers to rural development scheme disbursements.

Data Hygiene Principles:
1. Standardized Column Schema: Never merge header cells across multiple columns.
2. Consistent Data Types: Ensure dates follow ISO (YYYY-MM-DD) or DD-MM-YYYY consistently.
3. Handling Missing Fields: Clearly tag NULL vs 0. In financial registers, unallocated funds must be distinguished from zero expenditure.
4. Duplicate Deduplication: Use conditional formatting and primary employee/beneficiary ID keys.`,
        contentHindi: `सरकारी विभाग रोज़ाना भारी मात्रा में प्रशासनिक डेटा उत्पन्न करते हैं—लोक शिकायत लॉग से लेकर कोषालय वाउचर तक। डेटा स्वच्छता के सिद्धांत: तालिकाओं के शीर्षक कभी मर्ज न करें, तिथियों का मानकीकृत प्रारूप बनाए रखें और डुप्लिकेट रिकॉर्ड को तुरंत पहचानें।`,
        audioVoiceoverText: 'Welcome to Module 1. In public administration, data hygiene is the bedrock of transparent decision making. In this module, you will learn to structure tabular records without common spreadsheet corruption.',
        keyTakeaways: [
          'Maintain single-record rows without cell merges',
          'Audit and sanitize blank or non-standard entries',
          'Use VLOOKUP and XLOOKUP for reliable cross-referencing',
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Pivot Tables & Administrative Summaries',
        durationMinutes: 60,
        content: `Pivot tables allow administrators to synthesize 50,000 grievance records into district-wise disposal rates in seconds.

Core Steps for District Aggregations:
- Step 1: Create a verified tabular source range.
- Step 2: Insert PivotTable onto a dedicated summary sheet.
- Step 3: Drag 'District Name' to Rows, 'Disposal Status' to Columns, and 'Grievance ID' (Count) to Values.
- Step 4: Add calculated field: Percentage Disposed = (Disposed Cases / Total Received) * 100.`,
        contentHindi: `पिवट टेबल प्रशासकों को हज़ारों रिकॉर्ड्स को सेकंडों में सारांशित करने की सुविधा देती है। ज़िला-वार शिकायतों के निपटान प्रतिशत की गणना करने के लिए चरणबद्ध प्रक्रिया का पालन करें।`,
        audioVoiceoverText: 'Module 2 focuses on Pivot Tables. Transforming raw records into district disposal percentages empowers department heads to spot service delays proactively.',
        keyTakeaways: [
          'Generate district-wise and scheme-wise aggregations',
          'Calculate completion percentages dynamically',
          'Filter out pending or contested entries with Slicers',
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Trend Identification & Variance Analysis',
        durationMinutes: 60,
        content: `Variance analysis measures the gap between target departmental key performance indicators and actual field outcomes.

Key Indicators in State Programs:
- Quarter-on-Quarter Scheme Spend Rate
- Citizen Charter SLA Breach Rate
- Data Integrity Score: (Verified Records / Total Submissions) * 100.`,
        contentHindi: `विचरण विश्लेषण निर्धारित लक्ष्यों और वास्तविक क्षेत्रीय परिणामों के बीच अंतर को मापता है। यह नागरिक चार्टर के समयबद्ध क्रियान्वयन में महत्वपूर्ण है।`,
        audioVoiceoverText: 'In Module 3, we analyze Quarter-on-Quarter variance to understand why certain blocks encounter SLA breaches while others succeed.',
        keyTakeaways: [
          'Compute budget vs actual spend variance',
          'Set up automated threshold alerts using conditional rules',
        ],
      },
    ],
  },
  {
    id: 'course-data-viz-02',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'Data Visualization & Governance Dashboards',
    description: 'Transforming tabular spreadsheets into actionable visual dashboards for senior secretaries and district collectors.',
    competencyId: 'comp-data-analytics',
    targetCompetencyLevel: 3,
    durationHours: 4.0,
    modulesCount: 3,
    authorName: 'Dr. Sunita Iyer',
    departmentName: 'IT & Digital Governance',
    tags: ['Data Analytics', 'Dashboards', 'Visualization', 'KPI Tracking'],
    isOfflineAvailable: true,
    modules: [
      {
        id: 'mod-viz-1',
        title: 'Module 1: Dashboard Design for Public Governance',
        durationMinutes: 60,
        content: `Executive leadership needs high-level KPI cards with drill-down capabilities rather than dense rows of numbers.

Core Design Rules:
1. Golden Quadrant: Place primary KPI (State Readiness / Total Disposals) in top-left.
2. Color Semantics: Green (>= 80% SLA), Amber (60-79%), Red (< 60% Critical Action Required).
3. No Chart Junk: Avoid 3D bar graphs and unreadable pie charts with > 5 slices.`,
        contentHindi: `वरिष्ठ नेतृत्व के लिए डैशबोर्ड डिज़ाइन करते समय प्राथमिक KPI को शीर्ष-बाएँ रखें और मानकीकृत रंगों (हरा, पीला, लाल) का उपयोग करें।`,
        audioVoiceoverText: 'Executive dashboard design demands visual clarity. Senior officers require instant visual diagnosis of departmental bottlenecks.',
        keyTakeaways: [
          'Implement the 3-second diagnostic rule',
          'Use accessible high-contrast palettes',
        ],
      },
      {
        id: 'mod-viz-2',
        title: 'Module 2: Time Series & Geo-Spatial Mapping',
        durationMinutes: 60,
        content: `Visualizing scheme outcomes across 30+ districts over 12 months using heatmaps and synchronized line charts.`,
        keyTakeaways: [
          'Identify seasonal bottlenecks in public grievance filings',
          'Correlate district resource allocation with performance',
        ],
      },
      {
        id: 'mod-viz-3',
        title: 'Module 3: Automated KPI Refresh & Publishing',
        durationMinutes: 60,
        content: `Connecting data sources to live auto-refreshing pipelines for real-time review meetings.`,
        keyTakeaways: [
          'Schedule automated weekly report generation',
          'Publish audit-safe PDF summaries for cabinet review',
        ],
      },
    ],
  },
  {
    id: 'course-data-capstone-03',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'Applied Data Analysis for Governance Decision Making',
    description: 'Capstone practical task: Clean raw grievance dataset, build policy metric summary, and generate an executive recommendation report.',
    competencyId: 'comp-data-analytics',
    targetCompetencyLevel: 4,
    durationHours: 5.0,
    modulesCount: 2,
    authorName: 'Dr. Sunita Iyer',
    departmentName: 'IT & Digital Governance',
    tags: ['Data Analytics', 'Capstone', 'Policy Analysis', 'Advanced'],
    isOfflineAvailable: true,
    practicalTaskPrompt: 'Analyze the state public grievance dataset (12,500 entries across 6 districts). Identify the primary bottleneck causing SLA breaches in District C and propose two data-backed operational adjustments.',
    practicalTaskRubric: '1. Accurate calculation of SLA compliance % (30 pts), 2. Identification of root cause in District C (30 pts), 3. Feasibility of policy recommendations (40 pts).',
    modules: [
      {
        id: 'mod-cap-1',
        title: 'Module 1: Real-World Public Administration Case Studies',
        durationMinutes: 90,
        content: `Examining real interventions where data diagnostics reduced citizen wait times by 40% in municipal corporations.`,
        keyTakeaways: [
          'Frame administrative problems into quantitative inquiry',
          'Distinguish correlation from policy causation',
        ],
      },
      {
        id: 'mod-cap-2',
        title: 'Module 2: Practical Capstone Simulation & Submission',
        durationMinutes: 120,
        content: `Complete the applied task evaluation to verify Competency Level 4 proficiency.`,
        keyTakeaways: [
          'Submit structured analysis and findings',
          'Receive evidence-based score calibration',
        ],
      },
    ],
  },
  {
    id: 'course-cyber-01',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'Cyber Threats & Data Protection in e-Governance',
    description: 'CERT-In guidelines, phishing defense, data classification, and incident response for state officers.',
    competencyId: 'comp-cybersecurity',
    targetCompetencyLevel: 3,
    durationHours: 3.0,
    modulesCount: 2,
    authorName: 'Arjun Mehta',
    departmentName: 'IT & Digital Governance',
    tags: ['Cybersecurity', 'CERT-In', 'Data Privacy', 'Compliance'],
    isOfflineAvailable: true,
    modules: [
      {
        id: 'mod-cy-1',
        title: 'Module 1: CERT-In Mandatory Directives & Incident Reporting',
        durationMinutes: 60,
        content: `Mandatory reporting within 6 hours of incident detection; secure log maintenance for 180 days.`,
        keyTakeaways: ['Understand mandatory 6-hour reporting window', 'Identify spoofed email headers'],
      },
      {
        id: 'mod-cy-2',
        title: 'Module 2: Role-Based Access & Data Classification',
        durationMinutes: 60,
        content: `Classifying government documents: Public, Internal, Confidential, and Top Secret.`,
        keyTakeaways: ['Enforce principle of least privilege', 'Avoid unencrypted email attachment of PII data'],
      },
    ],
  },
  {
    id: 'course-proc-01',
    organizationId: 'org-state-gov',
    departmentId: 'dept-procurement',
    title: 'Public Procurement Compliance & GeM Portal Workflows',
    description: 'End-to-end guide to General Financial Rules (GFR 2017), GeM portal bidding, L1 evaluation, and contract invoicing.',
    competencyId: 'comp-procurement',
    targetCompetencyLevel: 4,
    durationHours: 4.5,
    modulesCount: 3,
    authorName: 'Vikram Singh',
    departmentName: 'Procurement & Contracts',
    tags: ['Procurement', 'GeM Portal', 'GFR 2017', 'Tenders'],
    isOfflineAvailable: true,
    modules: [
      {
        id: 'mod-pr-1',
        title: 'Module 1: General Financial Rules (GFR) & Thresholds',
        durationMinutes: 60,
        content: `Direct purchase thresholds up to INR 25,000; committee purchase up to INR 2,50,000; mandatory GeM bidding for larger procurements.`,
        keyTakeaways: ['Apply correct GFR clauses', 'Document proprietary certificate justifications'],
      },
      {
        id: 'mod-pr-2',
        title: 'Module 2: GeM Bidding, RA, and Technical Scoring',
        durationMinutes: 90,
        content: `Creating technical parameters on GeM, executing reverse auctions, and handling vendor disqualifications.`,
        keyTakeaways: ['Formulate non-restrictive technical specifications', 'Audit vendor compliance certificates'],
      },
      {
        id: 'mod-pr-3',
        title: 'Module 3: Contract Administration & Payment Clearance',
        durationMinutes: 60,
        content: `CRAC (Consignee Receipt and Acceptance Certificate) generation, SLA deduction, and timely bill clearance.`,
        keyTakeaways: ['Generate CRAC within 10 days of delivery', 'Calculate milestone penalty clauses accurately'],
      },
    ],
  },
  {
    id: 'course-fin-01',
    organizationId: 'org-state-gov',
    departmentId: 'dept-finance',
    title: 'Government Financial Rules & Auditing Standards',
    description: 'Treasury reconciliation, budget head allocations, outcome budgets, and CAG audit compliance.',
    competencyId: 'comp-financial-reporting',
    targetCompetencyLevel: 4,
    durationHours: 4.0,
    modulesCount: 2,
    authorName: 'Rajesh Verma',
    departmentName: 'Finance & Accounts',
    tags: ['Finance', 'Budgeting', 'CAG Audit', 'Treasury'],
    isOfflineAvailable: true,
    modules: [
      {
        id: 'mod-fin-1',
        title: 'Module 1: Budget Formulation & Head Coding',
        durationMinutes: 90,
        content: `Understanding 4-tier budget codes: Major Head, Minor Head, Sub Head, and Detailed Head.`,
        keyTakeaways: ['Prevent wrong-head re-appropriations', 'Track capital vs revenue expenditures'],
      },
      {
        id: 'mod-fin-2',
        title: 'Module 2: CAG Audit Inquiries & Utilization Certificates',
        durationMinutes: 90,
        content: `Drafting replies to audit paras with supporting bills, vouchers, and outcome metrics.`,
        keyTakeaways: ['Maintain audit-proof expenditure registers', 'Issue timely utilization certificates'],
      },
    ],
  },
  {
    id: 'ext-lecture-yt-data',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'Public Data Wrangling & Interactive Dashboards Masterclass',
    description: 'Practical video lecture on transforming dirty administrative spreadsheets into clean analytics pipelines and executive charts.',
    competencyId: 'comp-data-analytics',
    targetCompetencyLevel: 3,
    durationHours: 1.5,
    modulesCount: 1,
    authorName: 'Alex The Analyst',
    instructor: 'Alex Freberg (Senior Data Analytics Lead)',
    departmentName: 'IT & Digital Governance',
    tags: ['YouTube', 'Data Analytics', 'Dashboards', 'Spreadsheets'],
    isOfflineAvailable: false,
    platform: 'youtube',
    externalUrl: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
    embedUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-yt-1',
        title: 'Video Lecture: Practical Data Cleaning & Metrics Computation',
        durationMinutes: 90,
        content: 'Comprehensive walkthrough covering schema validation, handling null fields, calculating QoQ trends, and designing executive summary visuals.',
        keyTakeaways: ['Cleanse anomalous district data entries', 'Build reusable visual charts', 'Export audit summaries'],
      },
    ],
  },
  {
    id: 'ext-lecture-ai-studio',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'Google AI Studio: Structured Prompting for Policy Summarization',
    description: 'Official Google AI Studio guided workshop on utilizing Gemini models with JSON schemas and system instructions for public administration.',
    competencyId: 'comp-digital-governance',
    targetCompetencyLevel: 4,
    durationHours: 2.0,
    modulesCount: 1,
    authorName: 'Google Developer Experts',
    instructor: 'Google DeepMind & AI Studio Team',
    departmentName: 'IT & Digital Governance',
    tags: ['Google AI Studio', 'Gemini API', 'AI Governance', 'Prompting'],
    isOfflineAvailable: false,
    platform: 'google_ai_studio',
    externalUrl: 'https://aistudio.google.com/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-aistudio-1',
        title: 'Interactive Lab: Zero-Shot & Few-Shot Prompt Design for Civil SOPs',
        durationMinutes: 120,
        content: 'Learn how to constrain Gemini output to structured rubrics, enforce hallucination guards, and automate multi-page administrative document indexing.',
        keyTakeaways: ['Configure system instructions for governance', 'Generate structured JSON schemas', 'Evaluate model outputs with deterministic scoring'],
      },
    ],
  },
  {
    id: 'ext-lecture-coursera-cyber',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    title: 'Cybersecurity Governance & Threat Defense in Public Infrastructure',
    description: 'Certified university MOOC covering CERT-In national guidelines, ISO 27001 audit standards, and incident triage.',
    competencyId: 'comp-cybersecurity',
    targetCompetencyLevel: 3,
    durationHours: 4.0,
    modulesCount: 2,
    authorName: 'Coursera / University System',
    instructor: 'Prof. Martin Reynolds & Cyber Defense Labs',
    departmentName: 'IT & Digital Governance',
    tags: ['Coursera', 'Cybersecurity', 'CERT-In', 'Compliance'],
    isOfflineAvailable: false,
    platform: 'coursera',
    externalUrl: 'https://www.coursera.org/specializations/cyber-security-governance',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-coursera-1',
        title: 'Part 1: Access Control & Network Micro-segmentation',
        durationMinutes: 120,
        content: 'Preventing unauthorized lateral movements in government datacenters.',
        keyTakeaways: ['Enforce least-privilege RBAC', 'Configure multi-factor authentication policies'],
      },
      {
        id: 'mod-coursera-2',
        title: 'Part 2: Cyber Incident Escalation Protocols',
        durationMinutes: 120,
        content: 'Documenting security breaches and filing mandated CERT-In 6-hour incident reports.',
        keyTakeaways: ['Adhere to statutory disclosure timelines', 'Preserve forensic server logs'],
      },
    ],
  },
  {
    id: 'ext-lecture-udemy-procure',
    organizationId: 'org-state-gov',
    departmentId: 'dept-procurement',
    title: 'Public Procurement & GeM 4.0 Advanced Bidding Masterclass',
    description: 'Industry-standard practitioner course on Reverse Auctions, BoQ bid creation, dispute avoidance, and payment escrow.',
    competencyId: 'comp-procurement',
    targetCompetencyLevel: 4,
    durationHours: 3.0,
    modulesCount: 2,
    authorName: 'Udemy Certified Academy',
    instructor: 'Sanjeev Nair (Procurement Consultant)',
    departmentName: 'Procurement & Contracts',
    tags: ['Udemy', 'GeM', 'Procurement', 'Tendering'],
    isOfflineAvailable: false,
    platform: 'udemy',
    externalUrl: 'https://www.udemy.com/course/public-procurement-gem-masterclass/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-udemy-1',
        title: 'Part 1: Technical Qualification Criteria & Bid Drafting',
        durationMinutes: 90,
        content: 'Eliminating restrictive vendor conditions while guaranteeing quality standards.',
        keyTakeaways: ['Draft clear technical evaluation matrices', 'Verify turnover and experience certificates'],
      },
      {
        id: 'mod-udemy-2',
        title: 'Part 2: Dispute Resolution & Liquidated Damages Calculation',
        durationMinutes: 90,
        content: 'Handling delivery delays, default notices, and bank guarantee invocation.',
        keyTakeaways: ['Compute penalty deductions legally', 'Execute contract termination SOPs'],
      },
    ],
  },
  {
    id: 'ext-lecture-linkedin-comm',
    organizationId: 'org-state-gov',
    departmentId: 'dept-grievance',
    title: 'High-Impact Public Communications & Grievance De-escalation',
    description: 'Executive communication workshop on citizen charter negotiations, press releases, and rapid crisis management.',
    competencyId: 'comp-communication',
    targetCompetencyLevel: 4,
    durationHours: 2.0,
    modulesCount: 1,
    authorName: 'LinkedIn Learning',
    instructor: 'Brenda Bailey (Leadership Communications Coach)',
    departmentName: 'Public Grievance Cell',
    tags: ['LinkedIn Learning', 'Communication', 'Grievance', 'Leadership'],
    isOfflineAvailable: false,
    platform: 'linkedin_learning',
    externalUrl: 'https://www.linkedin.com/learning/executive-presence-public-sector',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-li-1',
        title: 'Session: Citizen-Centric Drafting & Public Press Briefings',
        durationMinutes: 120,
        content: 'Translating complex statutory rulings into plain language and maintaining public trust during service outages.',
        keyTakeaways: ['Write transparent citizen advisories', 'De-escalate contentious public hearings'],
      },
    ],
  },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-data-baseline',
    courseId: 'course-data-excel-01',
    competencyId: 'comp-data-analytics',
    title: 'Data Analytics Baseline Diagnostic Assessment',
    type: 'baseline',
    targetLevel: 4,
    passingScore: 70,
    questions: [
      {
        id: 'q-b1',
        question: 'When merging government department records across 5 years, which practice is essential for data hygiene?',
        options: [
          'Merging header cells for aesthetic presentation',
          'Maintaining a standardized schema and distinct primary ID column',
          'Replacing missing numeric cells with random averages without flags',
          'Storing dates in text format with mixed delimiters'
        ],
        correctOptionIndex: 1,
        explanation: 'A standardized schema with consistent primary keys prevents record duplication and allows automated queries.',
        competencyLevelTested: 2,
      },
      {
        id: 'q-b2',
        question: 'In a spreadsheet tracking 20,000 public grievances, what is the best tool to find the percentage of pending cases per district?',
        options: [
          'Manual counting with highlighters',
          'Pivot Table with District in Rows and Status Count normalized to % of Total',
          'Sorting the entire sheet alphabetically and taking a screenshot',
          'Deleting completed rows so only pending cases remain'
        ],
        correctOptionIndex: 1,
        explanation: 'Pivot tables dynamically aggregate categories and calculate percentage shares without altering underlying records.',
        competencyLevelTested: 2,
      },
      {
        id: 'q-b3',
        question: 'What constitutes an administrative SLA breach in citizen charter grievance handling?',
        options: [
          'Any citizen inquiry submitted after 5 PM',
          'A case remaining unresolved beyond the statutory time limit without justified escalation',
          'A citizen filing multiple unrelated requests on the same day',
          'When the department receives more than 100 cases a week'
        ],
        correctOptionIndex: 1,
        explanation: 'Statutory limits define citizen entitlement; exceeding limits without authorized extension constitutes an SLA breach.',
        competencyLevelTested: 3,
      },
      {
        id: 'q-b4',
        question: 'Why should 3D charts generally be avoided in executive governance dashboards?',
        options: [
          'Because senior leadership only reads paper printouts',
          'They distort visual proportions and make optical comparisons difficult',
          'Spreadsheets do not support 3D rendering',
          'They require extra government permissions to export'
        ],
        correctOptionIndex: 1,
        explanation: '3D perspectives distort angles and slice areas, leading to inaccurate optical assessment of data metrics.',
        competencyLevelTested: 3,
      },
      {
        id: 'q-b5',
        question: 'What is the primary indicator of a successful data-driven policy adjustment in public services?',
        options: [
          'Higher volume of internal circulars issued',
          'Statistically verified reduction in citizen turnaround time and grievance volume',
          'Purchasing newer server hardware',
          'Renaming the department dashboard'
        ],
        correctOptionIndex: 1,
        explanation: 'True policy success is proven by measurable improvements in public outcomes and reduced friction.',
        competencyLevelTested: 4,
      },
    ],
    practicalScenario: {
      prompt: 'Describe how you would clean an unverified department grievance dataset where 15% of district entries are misspelled and 8% of dates are missing.',
      expectedDeliverable: 'Step-by-step cleaning methodology using fuzzy lookup / standardized validation lists and explicit NULL flagging.',
      rubricPoints: ['Identification of validation lists', 'Proper handling of missing dates without fabricating values', 'Auditable backup of raw data before cleaning'],
    },
  },

  {
    id: 'assess-data-post',
    courseId: 'course-data-capstone-03',
    competencyId: 'comp-data-analytics',
    title: 'Data Analytics Post-Training Capstone Assessment',
    type: 'post_training',
    targetLevel: 4,
    passingScore: 70,
    statutoryDeadline: '2026-09-30T18:00:00.000Z',
    deadlineDurationMinutes: 20,
    sections: [
      {
        id: 'sec-1-analytics',
        title: 'Section 1: Data Analytics & Quantitative KPI Diagnostics',
        subtitle: 'Core statistical aggregation, ETL pipelines, and visual encoding',
        weightPercentage: 30,
        description: 'Evaluates proficiency in constructing automated data pipelines, computing variance metrics, and designing executive dashboard visual encodings.',
        questions: [
          {
            id: 'q-sec1-p1',
            sectionId: 'sec-1-analytics',
            sectionTitle: 'Section 1: Data Analytics & Quantitative KPI Diagnostics',
            question: 'When constructing an automated data pipeline for state-wide e-Office analytics across 30+ districts, how should data pipeline anomalies and corrupt records be handled?',
            options: [
              'Silently discard corrupted records without recording incident logs',
              'Implement automated schema validation that routes invalid records to an auditable exception queue while processing valid rows',
              'Pause the entire state-wide server pipeline indefinitely until manual inspection',
              'Disable type checking to force corrupted rows into the analytics database'
            ],
            correctOptionIndex: 1,
            explanation: 'An auditable exception queue preserves data lineage, ensures zero silent data loss, and protects executive dashboards from corrupted metrics.',
            competencyLevelTested: 4,
            difficulty: 'Advanced',
          },
          {
            id: 'q-sec1-p2',
            sectionId: 'sec-1-analytics',
            sectionTitle: 'Section 1: Data Analytics & Quantitative KPI Diagnostics',
            question: 'In multi-metric public performance variance tracking, what is the mathematically sound formula for Quarter-on-Quarter (QoQ) SLA improvement velocity?',
            options: [
              '((Current Quarter SLA % - Previous Quarter SLA %) / Previous Quarter SLA %) * 100',
              '(Current Quarter SLA % + Previous Quarter SLA %) / 2',
              'Total Grievances Resolved / Total Working Days in Quarter',
              'Max District SLA Score - Min District SLA Score'
            ],
            correctOptionIndex: 0,
            explanation: 'Relative percentage difference accurately measures improvement velocity and normalizes for scale across successive reporting quarters.',
            competencyLevelTested: 4,
            difficulty: 'Intermediate',
          },
          {
            id: 'q-sec1-p3',
            sectionId: 'sec-1-analytics',
            sectionTitle: 'Section 1: Data Analytics & Quantitative KPI Diagnostics',
            question: 'Which visual encoding standard is recognized by state executive guidelines for comparing budget utilization across 6 administrative departments against target benchmarks?',
            options: [
              'Stacked 3D donut graph with bright saturated neon gradients',
              'Horizontal bullet bar chart featuring reference benchmark lines and status threshold coloring (Green >= 80%, Amber 60-79%, Red < 60%)',
              '3D exploded pie chart with 25 unlabelled departmental slices',
              'Raw multi-page unformatted CSV dump printed on paper'
            ],
            correctOptionIndex: 1,
            explanation: 'Horizontal bullet charts with clear benchmark lines enable instantaneous cognitive comparison without visual distortion.',
            competencyLevelTested: 3,
            difficulty: 'Intermediate',
          },
        ],
      },
      {
        id: 'sec-2-policy',
        title: 'Section 2: Policy Compliance & Statutory Deadlines',
        subtitle: 'Public Service Guarantee Acts, citizen charters, and GFR procurement rules',
        weightPercentage: 25,
        description: 'Tests knowledge of legal SLA escalation timelines, citizen grievance mandates, and General Financial Rules (GFR 2017).',
        questions: [
          {
            id: 'q-sec2-p1',
            sectionId: 'sec-2-policy',
            sectionTitle: 'Section 2: Policy Compliance & Statutory Deadlines',
            question: 'Under the State Right to Public Services Guarantee Act, if a land record mutation grievance remains unaddressed past 30 statutory days, what is the mandatory automated system action?',
            options: [
              'Mark the ticket as closed and notify the citizen to re-apply next quarter',
              'Delete the citizen record to prevent department audit penalties',
              'Trigger Tier-2 Automated Escalation to the Additional District Magistrate (ADM) with an alert to the Department Head',
              'Transfer the grievance to an unmonitored general spam category'
            ],
            correctOptionIndex: 2,
            explanation: 'Statutory citizen charter acts mandate automated upward administrative escalation upon SLA expiration to guarantee officer accountability.',
            competencyLevelTested: 4,
            difficulty: 'Advanced',
          },
          {
            id: 'q-sec2-p2',
            sectionId: 'sec-2-policy',
            sectionTitle: 'Section 2: Policy Compliance & Statutory Deadlines',
            question: 'Under General Financial Rules (GFR 2017) and GeM procurement guidelines, which threshold mandates a transparent online competitive bidding process rather than direct purchase?',
            options: [
              'Any purchase above INR 500',
              'Goods and services exceeding INR 25,000 threshold (and mandatory reverse auction above INR 5,00,000)',
              'Only contracts exceeding INR 100 Crores',
              'Direct purchase is permitted for any amount without documentation'
            ],
            correctOptionIndex: 1,
            explanation: 'GFR Rule 149 specifies direct purchase limits up to INR 25,000; procurement beyond this mandates GeM competitive bidding and reverse auction protocols.',
            competencyLevelTested: 4,
            difficulty: 'Intermediate',
          },
          {
            id: 'q-sec2-p3',
            sectionId: 'sec-2-policy',
            sectionTitle: 'Section 2: Policy Compliance & Statutory Deadlines',
            question: 'If District C exhibits a sudden 45% spike in unresolved citizen complaints in July, what must be the officer’s primary investigative step before proposing policy sanctions?',
            options: [
              'Immediately suspend junior field personnel without reviewing records',
              'Disaggregate grievance data by sub-divisional tehsils, category, and local circulars to identify the root cause bottleneck',
              'Suppress the July dataset from state executive review meetings',
              'Declare the district portal temporarily offline for maintenance'
            ],
            correctOptionIndex: 1,
            explanation: 'Disaggregation isolates whether the bottleneck is structural (e.g. single tehsil vacancy or infrastructure outage) versus systemic.',
            competencyLevelTested: 4,
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'sec-3-security',
        title: 'Section 3: Cybersecurity, CERT-In & Role-Based Access',
        subtitle: 'Digital Personal Data Protection (DPDP Act), zero trust, and audit logging',
        weightPercentage: 25,
        description: 'Examines comprehension of cyber incident disclosure timelines, citizen privacy safeguards, and role clearance enforcement.',
        questions: [
          {
            id: 'q-sec3-p1',
            sectionId: 'sec-3-security',
            sectionTitle: 'Section 3: Cybersecurity, CERT-In & Role-Based Access',
            question: 'According to national CERT-In cybersecurity directives, within what statutory timeframe must a government organization report a detected data security breach?',
            options: [
              'Within 6 hours of noticing or being brought to notice of the incident',
              'Within 30 calendar days at end-of-month review',
              'Only if loss of funds exceeds INR 1 Crore',
              'No reporting is required for state internal networks'
            ],
            correctOptionIndex: 0,
            explanation: 'CERT-In guidelines mandate cybersecurity incident reporting to the national nodal agency within 6 hours of incident detection.',
            competencyLevelTested: 4,
            difficulty: 'Expert',
          },
          {
            id: 'q-sec3-p2',
            sectionId: 'sec-3-security',
            sectionTitle: 'Section 3: Cybersecurity, CERT-In & Role-Based Access',
            question: 'Under the Digital Personal Data Protection (DPDP) Act 2023, how must citizen identifiable records (such as Aadhaar and contact numbers) be handled in public analytics dashboards?',
            options: [
              'Publish unmasked citizen records openly to promote crowd-sourced data verification',
              'Sell citizen contact records to third-party marketing companies to fund state projects',
              'Apply cryptographic hashing, pseudonymization, or k-anonymity so individuals cannot be identified from aggregate trends',
              'Store citizen passwords in unencrypted plain text files'
            ],
            correctOptionIndex: 2,
            explanation: 'The DPDP Act strictly mandates purpose limitation and data anonymization/pseudonymization to protect citizen privacy in analytical reporting.',
            competencyLevelTested: 4,
            difficulty: 'Advanced',
          },
          {
            id: 'q-sec3-p3',
            sectionId: 'sec-3-security',
            sectionTitle: 'Section 3: Cybersecurity, CERT-In & Role-Based Access',
            question: 'What is the core operational principle of Role-Based Access Control (RBAC) in civil service administrative portals?',
            options: [
              'Grant all officers Super Admin access to eliminate permission request bottlenecks',
              'Enforce the Principle of Least Privilege: officers receive only the permissions strictly required for their verified cadre and official responsibilities',
              'Share a single shared password across the entire department',
              'Allow officers to view and alter records of all other state departments at will'
            ],
            correctOptionIndex: 1,
            explanation: 'Least Privilege RBAC prevents unauthorized lateral movement, data leakage, and improper record alterations across departmental silos.',
            competencyLevelTested: 3,
            difficulty: 'Intermediate',
          },
        ],
      },
      {
        id: 'sec-4-casestudy',
        title: 'Section 4: Operational Case Study & Administrative Decision Making',
        subtitle: 'Synthesizing evidence for executive decision making and capstone delivery',
        weightPercentage: 20,
        description: 'Evaluates the officer’s capability to translate analytical findings into decisive administrative action memos under strict deadlines.',
        questions: [
          {
            id: 'q-sec4-p1',
            sectionId: 'sec-4-casestudy',
            sectionTitle: 'Section 4: Operational Case Study & Administrative Decision Making',
            question: 'District C has 850 backlogged land mutation applications with a pending SLA deadline of 72 hours. Your data reveals Tehsil 2 accounts for 78% of the delay due to a server failure. What is the most effective administrative remedy?',
            options: [
              'Order a full biometric shutdown of all tehsils in the state',
              'Deploy a mobile disaster-recovery VSAT terminal and reassign 3 roving digital officers to Tehsil 2 for rapid backlog disposal within 48 hours',
              'Issue public press release blaming citizen applicants for late submissions',
              'Cancel all 850 applications and require citizens to pay new filing fees'
            ],
            correctOptionIndex: 1,
            explanation: 'Targeted operational surge (mobile VSAT connectivity + roving personnel) directly eliminates the root constraint before statutory SLA expiration.',
            competencyLevelTested: 4,
            difficulty: 'Expert',
          },
          {
            id: 'q-sec4-p2',
            sectionId: 'sec-4-casestudy',
            sectionTitle: 'Section 4: Operational Case Study & Administrative Decision Making',
            question: 'To guarantee tamper-evidence and audit compliance for executive cabinet memorandums, how should the final diagnostic findings be preserved?',
            options: [
              'Generate an immutable cryptographic verification hash (e.g. SHA-256) registered in the state digital ledger and audit log',
              'Write findings on a whiteboard and erase at the end of the meeting',
              'Save the file as a draft without author name or timestamp',
              'Distribute unofficial copies via personal social media channels'
            ],
            correctOptionIndex: 0,
            explanation: 'Cryptographic hashing combined with immutable audit logs guarantees legal non-repudiation and evidentiary integrity for state decision memos.',
            competencyLevelTested: 4,
            difficulty: 'Advanced',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'q-sec1-p1',
        sectionId: 'sec-1-analytics',
        sectionTitle: 'Section 1: Data Analytics & Quantitative KPI Diagnostics',
        question: 'When constructing an automated data pipeline for state-wide e-Office analytics across 30+ districts, how should data pipeline anomalies and corrupt records be handled?',
        options: [
          'Silently discard corrupted records without recording incident logs',
          'Implement automated schema validation that routes invalid records to an auditable exception queue while processing valid rows',
          'Pause the entire state-wide server pipeline indefinitely until manual inspection',
          'Disable type checking to force corrupted rows into the analytics database'
        ],
        correctOptionIndex: 1,
        explanation: 'An auditable exception queue preserves data lineage, ensures zero silent data loss, and protects executive dashboards from corrupted metrics.',
        competencyLevelTested: 4,
        difficulty: 'Advanced',
      },
      {
        id: 'q-sec1-p2',
        sectionId: 'sec-1-analytics',
        sectionTitle: 'Section 1: Data Analytics & Quantitative KPI Diagnostics',
        question: 'In multi-metric public performance variance tracking, what is the mathematically sound formula for Quarter-on-Quarter (QoQ) SLA improvement velocity?',
        options: [
          '((Current Quarter SLA % - Previous Quarter SLA %) / Previous Quarter SLA %) * 100',
          '(Current Quarter SLA % + Previous Quarter SLA %) / 2',
          'Total Grievances Resolved / Total Working Days in Quarter',
          'Max District SLA Score - Min District SLA Score'
        ],
        correctOptionIndex: 0,
        explanation: 'Relative percentage difference accurately measures improvement velocity and normalizes for scale across successive reporting quarters.',
        competencyLevelTested: 4,
        difficulty: 'Intermediate',
      },
      {
        id: 'q-sec1-p3',
        sectionId: 'sec-1-analytics',
        sectionTitle: 'Section 1: Data Analytics & Quantitative KPI Diagnostics',
        question: 'Which visual encoding standard is recognized by state executive guidelines for comparing budget utilization across 6 administrative departments against target benchmarks?',
        options: [
          'Stacked 3D donut graph with bright saturated neon gradients',
          'Horizontal bullet bar chart featuring reference benchmark lines and status threshold coloring (Green >= 80%, Amber 60-79%, Red < 60%)',
          '3D exploded pie chart with 25 unlabelled departmental slices',
          'Raw multi-page unformatted CSV dump printed on paper'
        ],
        correctOptionIndex: 1,
        explanation: 'Horizontal bullet charts with clear benchmark lines enable instantaneous cognitive comparison without visual distortion.',
        competencyLevelTested: 3,
        difficulty: 'Intermediate',
      },
      {
        id: 'q-sec2-p1',
        sectionId: 'sec-2-policy',
        sectionTitle: 'Section 2: Policy Compliance & Statutory Deadlines',
        question: 'Under the State Right to Public Services Guarantee Act, if a land record mutation grievance remains unaddressed past 30 statutory days, what is the mandatory automated system action?',
        options: [
          'Mark the ticket as closed and notify the citizen to re-apply next quarter',
          'Delete the citizen record to prevent department audit penalties',
          'Trigger Tier-2 Automated Escalation to the Additional District Magistrate (ADM) with an alert to the Department Head',
          'Transfer the grievance to an unmonitored general spam category'
        ],
        correctOptionIndex: 2,
        explanation: 'Statutory citizen charter acts mandate automated upward administrative escalation upon SLA expiration to guarantee officer accountability.',
        competencyLevelTested: 4,
        difficulty: 'Advanced',
      },
      {
        id: 'q-sec2-p2',
        sectionId: 'sec-2-policy',
        sectionTitle: 'Section 2: Policy Compliance & Statutory Deadlines',
        question: 'Under General Financial Rules (GFR 2017) and GeM procurement guidelines, which threshold mandates a transparent online competitive bidding process rather than direct purchase?',
        options: [
          'Any purchase above INR 500',
          'Goods and services exceeding INR 25,000 threshold (and mandatory reverse auction above INR 5,00,000)',
          'Only contracts exceeding INR 100 Crores',
          'Direct purchase is permitted for any amount without documentation'
        ],
        correctOptionIndex: 1,
        explanation: 'GFR Rule 149 specifies direct purchase limits up to INR 25,000; procurement beyond this mandates GeM competitive bidding and reverse auction protocols.',
        competencyLevelTested: 4,
        difficulty: 'Intermediate',
      },
      {
        id: 'q-sec2-p3',
        sectionId: 'sec-2-policy',
        sectionTitle: 'Section 2: Policy Compliance & Statutory Deadlines',
        question: 'If District C exhibits a sudden 45% spike in unresolved citizen complaints in July, what must be the officer’s primary investigative step before proposing policy sanctions?',
        options: [
          'Immediately suspend junior field personnel without reviewing records',
          'Disaggregate grievance data by sub-divisional tehsils, category, and local circulars to identify the root cause bottleneck',
          'Suppress the July dataset from state executive review meetings',
          'Declare the district portal temporarily offline for maintenance'
        ],
        correctOptionIndex: 1,
        explanation: 'Disaggregation isolates whether the bottleneck is structural (e.g. single tehsil vacancy or infrastructure outage) versus systemic.',
        competencyLevelTested: 4,
        difficulty: 'Advanced',
      },
      {
        id: 'q-sec3-p1',
        sectionId: 'sec-3-security',
        sectionTitle: 'Section 3: Cybersecurity, CERT-In & Role-Based Access',
        question: 'According to national CERT-In cybersecurity directives, within what statutory timeframe must a government organization report a detected data security breach?',
        options: [
          'Within 6 hours of noticing or being brought to notice of the incident',
          'Within 30 calendar days at end-of-month review',
          'Only if loss of funds exceeds INR 1 Crore',
          'No reporting is required for state internal networks'
        ],
        correctOptionIndex: 0,
        explanation: 'CERT-In guidelines mandate cybersecurity incident reporting to the national nodal agency within 6 hours of incident detection.',
        competencyLevelTested: 4,
        difficulty: 'Expert',
      },
      {
        id: 'q-sec3-p2',
        sectionId: 'sec-3-security',
        sectionTitle: 'Section 3: Cybersecurity, CERT-In & Role-Based Access',
        question: 'Under the Digital Personal Data Protection (DPDP) Act 2023, how must citizen identifiable records (such as Aadhaar and contact numbers) be handled in public analytics dashboards?',
        options: [
          'Publish unmasked citizen records openly to promote crowd-sourced data verification',
          'Sell citizen contact records to third-party marketing companies to fund state projects',
          'Apply cryptographic hashing, pseudonymization, or k-anonymity so individuals cannot be identified from aggregate trends',
          'Store citizen passwords in unencrypted plain text files'
        ],
        correctOptionIndex: 2,
        explanation: 'The DPDP Act strictly mandates purpose limitation and data anonymization/pseudonymization to protect citizen privacy in analytical reporting.',
        competencyLevelTested: 4,
        difficulty: 'Advanced',
      },
      {
        id: 'q-sec3-p3',
        sectionId: 'sec-3-security',
        sectionTitle: 'Section 3: Cybersecurity, CERT-In & Role-Based Access',
        question: 'What is the core operational principle of Role-Based Access Control (RBAC) in civil service administrative portals?',
        options: [
          'Grant all officers Super Admin access to eliminate permission request bottlenecks',
          'Enforce the Principle of Least Privilege: officers receive only the permissions strictly required for their verified cadre and official responsibilities',
          'Share a single shared password across the entire department',
          'Allow officers to view and alter records of all other state departments at will'
        ],
        correctOptionIndex: 1,
        explanation: 'Least Privilege RBAC prevents unauthorized lateral movement, data leakage, and improper record alterations across departmental silos.',
        competencyLevelTested: 3,
        difficulty: 'Intermediate',
      },
      {
        id: 'q-sec4-p1',
        sectionId: 'sec-4-casestudy',
        sectionTitle: 'Section 4: Operational Case Study & Administrative Decision Making',
        question: 'District C has 850 backlogged land mutation applications with a pending SLA deadline of 72 hours. Your data reveals Tehsil 2 accounts for 78% of the delay due to a server failure. What is the most effective administrative remedy?',
        options: [
          'Order a full biometric shutdown of all tehsils in the state',
          'Deploy a mobile disaster-recovery VSAT terminal and reassign 3 roving digital officers to Tehsil 2 for rapid backlog disposal within 48 hours',
          'Issue public press release blaming citizen applicants for late submissions',
          'Cancel all 850 applications and require citizens to pay new filing fees'
        ],
        correctOptionIndex: 1,
        explanation: 'Targeted operational surge (mobile VSAT connectivity + roving personnel) directly eliminates the root constraint before statutory SLA expiration.',
        competencyLevelTested: 4,
        difficulty: 'Expert',
      },
      {
        id: 'q-sec4-p2',
        sectionId: 'sec-4-casestudy',
        sectionTitle: 'Section 4: Operational Case Study & Administrative Decision Making',
        question: 'To guarantee tamper-evidence and audit compliance for executive cabinet memorandums, how should the final diagnostic findings be preserved?',
        options: [
          'Generate an immutable cryptographic verification hash (e.g. SHA-256) registered in the state digital ledger and audit log',
          'Write findings on a whiteboard and erase at the end of the meeting',
          'Save the file as a draft without author name or timestamp',
          'Distribute unofficial copies via personal social media channels'
        ],
        correctOptionIndex: 0,
        explanation: 'Cryptographic hashing combined with immutable audit logs guarantees legal non-repudiation and evidentiary integrity for state decision memos.',
        competencyLevelTested: 4,
        difficulty: 'Advanced',
      },
    ],
    practicalScenario: {
      prompt: 'Formulate an executive briefing note based on your cross-section analysis of the state public grievance dataset. State the root cause of District C SLA breaches and specify 2 data-backed corrective mitigation steps within the statutory deadline.',
      expectedDeliverable: 'A structured 3-part briefing: 1. Executive Summary with quantitative variance, 2. Root Cause Analysis (distinguishing process bottleneck vs staffing), 3. Actionable mitigation roadmap with 48-hour completion milestones.',
      rubricPoints: [
        'Quantitative backing of findings (25%)',
        'Root cause clarity distinguishing process vs capacity (35%)',
        'Actionable, high-impact policy recommendations within statutory deadline (40%)',
      ],
    },
  },
];

export const INITIAL_KNOWLEDGE_RESOURCES: KnowledgeResource[] = [
  {
    id: 'res-data-gov-verified-01',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    departmentName: 'IT & Digital Governance',
    title: 'Data Analytics & Governance Dashboard Standards v2.1',
    description: 'Comprehensive state standard operating procedure for data ingestion, cleaning, KPI formula standardization, and executive dashboard templates.',
    competencyId: 'comp-data-analytics',
    tags: ['Data Analytics', 'Dashboards', 'Governance Standards', 'Excel', 'KPIs', 'Reporting'],
    version: '2.1.0',
    authorName: 'Dr. Sunita Iyer',
    authorRole: 'Head of IT & Digital Governance',
    verified: true,
    verifiedBy: 'State Chief Secretary Office',
    verifiedAt: '2026-06-15',
    lastUpdated: '2026-07-20',
    expiryDate: '2027-12-31',
    language: 'English & Hindi',
    reuseCount: 14,
    documentType: 'SOP',
    contentSummary: 'Standardized guidelines for state administrative data collection, validation pipelines, data dictionaries, standard color codes for dashboards, and audit procedures.',
  },
  {
    id: 'res-cyber-sop-02',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    departmentName: 'IT & Digital Governance',
    title: 'State Cybersecurity SOP & Incident Response Guidelines',
    description: 'Official CERT-In compliant standard operating procedures for data access, phishing isolation, password rotation, and emergency response.',
    competencyId: 'comp-cybersecurity',
    tags: ['Cybersecurity', 'CERT-In', 'Incident Response', 'SOP'],
    version: '3.0.1',
    authorName: 'Arjun Mehta',
    authorRole: 'Senior IT Security Officer',
    verified: true,
    verifiedBy: 'State Cyber Security Directorate',
    verifiedAt: '2026-04-10',
    lastUpdated: '2026-05-18',
    expiryDate: '2027-06-30',
    language: 'English',
    reuseCount: 22,
    documentType: 'SOP',
    contentSummary: 'Step-by-step incident containment protocol, 6-hour CERT-In alert template, and audit checklist for all department heads.',
  },
  {
    id: 'res-gem-procure-03',
    organizationId: 'org-state-gov',
    departmentId: 'dept-procurement',
    departmentName: 'Procurement & Contracts',
    title: 'GeM Portal Procurement Manual & GFR 2017 Compliance Checklist',
    description: 'Practical handbook for bidding on GeM, drafting customized technical specifications without single-vendor bias, and CRAC generation.',
    competencyId: 'comp-procurement',
    tags: ['Procurement', 'GeM', 'GFR 2017', 'Tenders', 'Contracts'],
    version: '1.4.0',
    authorName: 'Vikram Singh',
    authorRole: 'Chief Procurement Officer',
    verified: true,
    verifiedBy: 'Finance & General Administration Department',
    verifiedAt: '2026-02-01',
    lastUpdated: '2026-03-12',
    expiryDate: '2028-01-01',
    language: 'English & Hindi',
    reuseCount: 19,
    documentType: 'Guidelines',
    contentSummary: 'Step-by-step procurement threshold matrix, GeM custom bid template, and penalty calculation tables for delayed deliveries.',
  },
  {
    id: 'res-eoffice-manual-04',
    organizationId: 'org-state-gov',
    departmentId: 'dept-admin',
    departmentName: 'Administration & General Services',
    title: 'e-Office File Movement & Citizen Grievance Redressal Manual',
    description: 'Procedural guidance on e-Files, digital signing, urgent markings, and citizen public service guarantee timelines.',
    competencyId: 'comp-digital-governance',
    tags: ['Digital Governance', 'e-Office', 'Citizen Charter', 'Administration'],
    version: '2.0.0',
    authorName: 'Suresh Rao',
    authorRole: 'Senior Administrative Officer',
    verified: true,
    verifiedBy: 'State e-Governance Mission',
    verifiedAt: '2026-01-15',
    lastUpdated: '2026-02-10',
    expiryDate: '2027-12-31',
    language: 'English & Hindi',
    reuseCount: 31,
    documentType: 'Technical Manual',
    contentSummary: 'Standard file movement protocols, digital escalation rules for pendency > 7 days, and disposal audit requirements.',
  },
];

export const INITIAL_EXPERTS: ExpertProfile[] = [
  {
    id: 'exp-sunita-iyer',
    employeeId: 'emp-sunita-iyer',
    name: 'Dr. Sunita Iyer',
    departmentName: 'IT & Digital Governance',
    designation: 'Head of IT & State Chief Data Officer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    verifiedCompetencies: [
      { competencyId: 'comp-data-analytics', competencyName: 'Data Analytics', level: 5, verifiedSince: '2022-04-01' },
      { competencyId: 'comp-digital-governance', competencyName: 'Digital Governance', level: 5, verifiedSince: '2021-08-15' },
    ],
    authoredResourcesCount: 6,
    helpedEmployeesCount: 48,
    availableForConsultation: true,
    bio: 'Pioneered state open data initiatives and executive dashboard systems. Available for department-level analytics consultations and data policy mentoring.',
  },
  {
    id: 'exp-vikram-singh',
    employeeId: 'emp-vikram-singh',
    name: 'Vikram Singh',
    departmentName: 'Procurement & Contracts',
    designation: 'Chief Procurement Officer & GeM Master Trainer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    verifiedCompetencies: [
      { competencyId: 'comp-procurement', competencyName: 'Procurement Compliance', level: 5, verifiedSince: '2023-01-10' },
      { competencyId: 'comp-financial-reporting', competencyName: 'Financial Reporting', level: 4, verifiedSince: '2023-05-20' },
    ],
    authoredResourcesCount: 4,
    helpedEmployeesCount: 37,
    availableForConsultation: true,
    bio: '15+ years experience in public procurement, high-value tenders, and dispute arbitration. Leads state GeM capacity training.',
  },
  {
    id: 'exp-arjun-mehta',
    employeeId: 'emp-arjun-mehta',
    name: 'Arjun Mehta',
    departmentName: 'IT & Digital Governance',
    designation: 'Senior IT Security Officer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verifiedCompetencies: [
      { competencyId: 'comp-cybersecurity', competencyName: 'Cybersecurity Awareness', level: 4, verifiedSince: '2024-02-15' },
      { competencyId: 'comp-digital-governance', competencyName: 'Digital Governance', level: 4, verifiedSince: '2024-06-01' },
    ],
    authoredResourcesCount: 3,
    helpedEmployeesCount: 29,
    availableForConsultation: true,
    bio: 'Certified ethical hacker and CERT-In coordinator. Helps teams conduct data classification audits and secure cloud configurations.',
  },
  {
    id: 'exp-rajesh-verma',
    employeeId: 'emp-rajesh-verma',
    name: 'Rajesh Verma',
    departmentName: 'Finance & Accounts',
    designation: 'Senior Financial Advisor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    verifiedCompetencies: [
      { competencyId: 'comp-financial-reporting', competencyName: 'Financial Reporting', level: 5, verifiedSince: '2022-09-10' },
      { competencyId: 'comp-procurement', competencyName: 'Procurement Compliance', level: 4, verifiedSince: '2023-03-12' },
    ],
    authoredResourcesCount: 5,
    helpedEmployeesCount: 42,
    availableForConsultation: true,
    bio: 'Specialist in outcome budgeting, treasury reconciliation, and resolving complex CAG audit queries.',
  },
];

export const INITIAL_BADGES: CompetencyBadge[] = [
  {
    id: 'badge-priya-proc-01',
    badgeCode: 'BADGE-SDGD-2026-8891',
    employeeId: 'emp-priya-nair',
    employeeName: 'Priya Nair',
    competencyId: 'comp-procurement',
    competencyName: 'Procurement Compliance',
    achievedLevel: 4,
    scorePercentage: 87,
    issuedAt: '2026-08-10T14:30:00Z',
    expiresAt: '2028-08-10T14:30:00Z',
    issuer: 'State Skill & L&D Board',
    verificationHash: '0x8f2d9c1b4e7a3f059a68bc43d891e2b4',
    qrPayload: 'https://skillbridge.gov.in/verify/BADGE-SDGD-2026-8891',
  },
  {
    id: 'badge-arjun-cyber-02',
    badgeCode: 'BADGE-SDGD-2026-7732',
    employeeId: 'emp-arjun-mehta',
    employeeName: 'Arjun Mehta',
    competencyId: 'comp-cybersecurity',
    competencyName: 'Cybersecurity Awareness',
    achievedLevel: 4,
    scorePercentage: 85,
    issuedAt: '2026-07-15T11:00:00Z',
    expiresAt: '2028-07-15T11:00:00Z',
    issuer: 'State Cyber Defense Council',
    verificationHash: '0x3c9a1e7f8b4d2c051a68bc43d891f9a1',
    qrPayload: 'https://skillbridge.gov.in/verify/BADGE-SDGD-2026-7732',
  },
];

export const INITIAL_ALERTS: ManagerAlert[] = [
  {
    id: 'alert-rohan-overdue',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    employeeId: 'emp-rohan-kulkarni',
    employeeName: 'Rohan Kulkarni',
    type: 'overdue_training',
    severity: 'Critical',
    title: 'Mandatory Cybersecurity Compliance Training Overdue (18 Days)',
    description: 'Rohan Kulkarni has not completed the mandatory CERT-In Threat Protection module assigned on 2026-07-15.',
    createdAt: '2026-08-20T10:00:00Z',
    status: 'pending',
    escalationLevel: 1, // Ready for Manager Nudge
    history: [
      { date: '2026-08-20T10:00:00Z', action: 'System identified 18-day overdue mandatory module', actor: 'SkillBridge Engine' },
    ],
  },
  {
    id: 'alert-ananya-gap',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    employeeId: 'emp-ananya-sharma',
    employeeName: 'Ananya Sharma',
    type: 'critical_gap',
    severity: 'Warning',
    title: 'Critical Competency Gap: Data Analytics (Current L2 / Required L4)',
    description: 'Baseline assessment confirmed 42% proficiency against required 80% benchmark for Junior Digital Governance Officer role.',
    createdAt: '2026-08-15T10:00:00Z',
    status: 'nudged',
    escalationLevel: 1,
    history: [
      { date: '2026-08-15T10:00:00Z', action: 'Baseline diagnostic completed (Score: 42%)', actor: 'Assessment Engine' },
      { date: '2026-08-16T11:00:00Z', action: 'Personalized Learning Path assigned automatically', actor: 'Arjun Mehta (Manager)' },
    ],
  },
];

export const INITIAL_FUTURE_SKILLS: FutureSkillGoal[] = [
  {
    id: 'future-ai-gov-2027',
    competencyId: 'comp-data-analytics',
    competencyName: 'AI & Algorithmic Governance',
    targetYear: '2027',
    strategicTargetLevel: 4,
    currentWorkforceAverageLevel: 2.1,
    projectedGap: 1.9,
    affectedRoles: ['Junior Digital Governance Officer', 'IT Support Officer', 'Administrative Officer'],
    strategicRationale: 'State digital public service guarantee will transition to automated citizen query triage; officers must audit algorithmic fairness and explainability.',
    priority: 'Critical',
  },
  {
    id: 'future-zero-trust-2027',
    competencyId: 'comp-cybersecurity',
    competencyName: 'Zero-Trust Architecture & Quantum-Safe Crypto',
    targetYear: '2027',
    strategicTargetLevel: 4,
    currentWorkforceAverageLevel: 2.4,
    projectedGap: 1.6,
    affectedRoles: ['IT Support Officer', 'Junior Digital Governance Officer'],
    strategicRationale: 'National cyber mandate requires all state intranets to migrate to micro-segmentation and multi-factor hardware keys.',
    priority: 'High',
  },
  {
    id: 'future-green-procure-2027',
    competencyId: 'comp-procurement',
    competencyName: 'Sustainable & Green Public Procurement',
    targetYear: '2027',
    strategicTargetLevel: 3,
    currentWorkforceAverageLevel: 1.8,
    projectedGap: 1.2,
    affectedRoles: ['Procurement Officer', 'Junior Accounts Officer'],
    strategicRationale: 'Mandatory carbon footprint and lifecycle costing criteria in all public infrastructure tenders above INR 1 Crore.',
    priority: 'Strategic',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-28T09:15:00Z',
    actorName: 'Ravi Shankar',
    actorRole: 'Super Admin',
    action: 'ROLE_COMPETENCY_UPDATED',
    entityType: 'role',
    details: 'Updated required competency for Junior Digital Governance Officer: Data Analytics set to Level 4 (Critical).',
    organizationId: 'org-state-gov',
  },
  {
    id: 'log-002',
    timestamp: '2026-08-27T14:20:00Z',
    actorName: 'Priya Nair',
    actorRole: 'Learner',
    action: 'POST_ASSESSMENT_COMPLETED',
    entityType: 'assessment',
    details: 'Completed Procurement Compliance Post-Assessment (Score moved 52% -> 87%, +35 percentage points). Badge BADGE-SDGD-2026-8891 issued.',
    organizationId: 'org-state-gov',
  },
  {
    id: 'log-003',
    timestamp: '2026-08-26T11:00:00Z',
    actorName: 'Dr. Sunita Iyer',
    actorRole: 'Trainer / SME',
    action: 'KNOWLEDGE_RESOURCE_VERIFIED',
    entityType: 'knowledge_approval',
    details: 'Approved and published Data Analytics & Governance Dashboard Standards v2.1 for cross-department reuse.',
    organizationId: 'org-state-gov',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-learner',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@state.gov.in',
    role: 'learner',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    designation: 'Junior Digital Governance Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    employeeId: 'emp-ananya-sharma',
    managerId: 'emp-arjun-mehta',
    civilServiceId: 'SDGD-CADRE-101',
    cadre: 'State Civil Service (SCS) — Digital Cadre Batch 2024',
    securityClearance: 'LEVEL 3 — SECRET / RESTRICTED',
    securityClearanceLevel: 3,
    nationalIdVerified: true,
    biometricEnrolled: true,
    govNetToken: 'GOVNET-SEC-SESSION-7f3b891a2c',
    officeLocation: 'State Secretariat, Block 4, 3rd Floor, IT Wing',
    phoneExtension: '+91-11-2309-4101',
    accountStatus: 'VERIFIED_ACTIVE',
  },
  {
    id: 'user-admin',
    name: 'Ravi Shankar',
    email: 'ravi.shankar@state.gov.in',
    role: 'super_admin',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    designation: 'Principal Secretary & State Admin',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    employeeId: 'emp-ravi-shankar',
    civilServiceId: 'SDGD-IAS-004',
    cadre: 'Indian Administrative Service (IAS) — Apex Cadre Batch 2002',
    securityClearance: 'LEVEL 4 — TOP SECRET (GovNet Apex)',
    securityClearanceLevel: 4,
    nationalIdVerified: true,
    biometricEnrolled: true,
    govNetToken: 'GOVNET-SEC-SESSION-8e4a901b3d',
    officeLocation: 'Chief Secretariat, Cabinet Secretariat Suite A',
    phoneExtension: '+91-11-2309-1001',
    accountStatus: 'VERIFIED_ACTIVE',
  },
  {
    id: 'user-hr',
    name: 'Pooja Deshmukh',
    email: 'pooja.deshmukh@state.gov.in',
    role: 'hr_manager',
    organizationId: 'org-state-gov',
    departmentId: 'dept-hr',
    designation: 'L&D and Capacity Director',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    employeeId: 'emp-pooja-deshmukh',
    civilServiceId: 'SDGD-HR-202',
    cadre: 'State Human Capital & Training Service — Batch 2011',
    securityClearance: 'LEVEL 3 — SECRET / L&D CONFIDENTIAL',
    securityClearanceLevel: 3,
    nationalIdVerified: true,
    biometricEnrolled: true,
    govNetToken: 'GOVNET-SEC-SESSION-5b2c789d1f',
    officeLocation: 'State Training Directorate, Vikas Bhavan 2nd Floor',
    phoneExtension: '+91-11-2309-2202',
    accountStatus: 'VERIFIED_ACTIVE',
  },
  {
    id: 'user-manager',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@state.gov.in',
    role: 'manager',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    designation: 'Senior Projects Lead & Team Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    employeeId: 'emp-arjun-mehta',
    civilServiceId: 'SDGD-MGR-305',
    cadre: 'State Digital Infrastructure Cadre — Batch 2016',
    securityClearance: 'LEVEL 3 — SECRET / OPERATIONAL RESTRICTED',
    securityClearanceLevel: 3,
    nationalIdVerified: true,
    biometricEnrolled: true,
    govNetToken: 'GOVNET-SEC-SESSION-4a1b678c0e',
    officeLocation: 'State Data Center Wing, Technology Bhavan Floor 4',
    phoneExtension: '+91-11-2309-3305',
    accountStatus: 'VERIFIED_ACTIVE',
  },
  {
    id: 'user-trainer',
    name: 'Dr. Sunita Iyer',
    email: 'sunita.iyer@state.gov.in',
    role: 'trainer',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    designation: 'Head of IT & Content Creator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    employeeId: 'emp-sunita-iyer',
    civilServiceId: 'SDGD-DIR-001',
    cadre: 'Chief Technical Advisory Cadre — PhD Public Informatics',
    securityClearance: 'LEVEL 4 — TOP SECRET (Content & Framework)',
    securityClearanceLevel: 4,
    nationalIdVerified: true,
    biometricEnrolled: true,
    govNetToken: 'GOVNET-SEC-SESSION-9c5d123e4a',
    officeLocation: 'State Administrative Academy, Hall 1',
    phoneExtension: '+91-11-2309-0012',
    accountStatus: 'VERIFIED_ACTIVE',
  },
  {
    id: 'user-sme',
    name: 'Vikram Singh',
    email: 'vikram.singh@state.gov.in',
    role: 'sme',
    organizationId: 'org-state-gov',
    departmentId: 'dept-procurement',
    designation: 'Chief Procurement Officer & SME',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    employeeId: 'emp-vikram-singh',
    civilServiceId: 'SDGD-PROC-002',
    cadre: 'State Financial & Commercial Procurement Service',
    securityClearance: 'LEVEL 3 — SECRET / STATUTORY PROCUREMENT',
    securityClearanceLevel: 3,
    nationalIdVerified: true,
    biometricEnrolled: true,
    govNetToken: 'GOVNET-SEC-SESSION-3f8e456b7c',
    officeLocation: 'Finance & GeM Operations Wing, Room 312',
    phoneExtension: '+91-11-2309-5002',
    accountStatus: 'VERIFIED_ACTIVE',
  },
];

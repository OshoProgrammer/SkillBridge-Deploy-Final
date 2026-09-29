import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Organization,
  Department,
  Competency,
  JobRole,
  Employee,
  Course,
  Assessment,
  KnowledgeResource,
  ExpertProfile,
  CompetencyBadge,
  CompetencyCertificate,
  ManagerAlert,
  FutureSkillGoal,
  AuditLog,
  User,
  ScoringWeights,
  AIDraftKnowledgeExtraction,
  RoleType,
  MentorshipRequest,
} from '../types';
import {
  fetchAppState,
  syncOfflineSubmissions,
  submitAssessment,
  sendGmailOtp,
  verifyGmailOtp,
  loginOfficer,
  loginAsDemoPersona as loginAsDemoPersonaRequest,
  setAuthToken,
} from '../services/api';
import { isDemoPersonaId } from '../data/demoPersonas';

export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED';

export type Language = 'en' | 'hi';

export interface SessionSecurity {
  encrypted: boolean;
  protocol: string;
  token: string;
  expiresAt: string;
  clearanceLevel: string;
  verifiedGovNetId: string;
  isMfaVerified: boolean;
  ipAddress: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Application Data
  organization: Organization | null;
  departments: Department[];
  competencies: Competency[];
  roles: JobRole[];
  employees: Employee[];
  courses: Course[];
  assessments: Assessment[];
  knowledgeResources: KnowledgeResource[];
  experts: ExpertProfile[];
  badges: CompetencyBadge[];
  certificates: CompetencyCertificate[];
  alerts: ManagerAlert[];
  futureSkills: FutureSkillGoal[];
  auditLogs: AuditLog[];
  users: User[];
  scoringWeights: ScoringWeights;
  aiDrafts: AIDraftKnowledgeExtraction[];
  mentorshipRequests: MentorshipRequest[];

  // Active Persona & Session
  isAuthenticated: boolean;
  /** True when the active session was started via a predefined Demo Persona (no credentials/OTP). */
  isDemoSession: boolean;
  currentUser: User;
  currentEmployee: Employee | null;
  activeRole: RoleType;
  switchUser: (userId: string) => void;
  /** Starts a credential-free sandbox session for a predefined Demo Persona only. */
  loginAsDemoPersona: (personaId: string) => Promise<{ success: boolean; error?: string }>;
  switchRole: (role: RoleType) => void;
  logout: () => void;
  loginWithCredentials: (
    identifier: string,
    role?: RoleType,
    password?: string,
    skipMfa?: boolean
  ) => Promise<{ success: boolean; requiresMfa?: boolean; error?: string; requiresRegistration?: boolean }>;
  verifyMfa: (code: string) => boolean;
  cancelMfa: () => void;
  mfaPendingUser: User | null;
  sessionSecurity: SessionSecurity;
  isSessionLocked: boolean;
  lockSession: () => void;
  unlockSession: (passkey: string) => boolean;
  failedLoginAttempts: number;
  isRateLimited: boolean;
  rateLimitCountdown: number;
  findUserByIdentifier: (identifier: string) => User | undefined;
  requestGmailOtp: (details: {
    name: string;
    email: string;
    role: RoleType;
    departmentId: string;
    designation: string;
    employeeCode: string;
    password?: string;
  }) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    accountExists?: boolean;
    deliveredToMailbox?: boolean;
    sandboxOtp?: string;
    smtpConfigured?: boolean;
  }>;
  confirmGmailOtp: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; error?: string }>;
  registerNewAccount: (details: {
    name: string;
    email: string;
    role: RoleType;
    departmentId: string;
    designation: string;
    employeeCode: string;
  }) => void;
  addExternalCourse: (newCourse: Omit<Course, 'id'>) => Course;
  addMentorshipRequest: (req: {
    expertId: string;
    expertName: string;
    topic: string;
    urgency: 'Routine' | 'High Priority' | 'Statutory Deadline';
  }) => void;
  updateMentorshipRequest: (id: string, status: 'pending' | 'scheduled' | 'resolved', responseNotes?: string) => void;

  // Active View Navigation
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedAssessmentId: string | null;
  setSelectedAssessmentId: (id: string | null) => void;

  // Hero Flow Demo State
  heroStep: number;
  setHeroStep: (step: number) => void;
  heroModalOpen: boolean;
  setHeroModalOpen: (open: boolean) => void;
  resetHeroWalkthrough: (launchImmediately?: boolean) => void;

  // Offline / Network State
  networkStatus: NetworkStatus;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  syncNow: () => Promise<void>;
  pendingOfflineCount: number;

  // Multilingual & Accessibility
  language: Language;
  setLanguage: (lang: Language) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;

  // Loading & Toasts
  isLoading: boolean;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  refreshState: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [knowledgeResources, setKnowledgeResources] = useState<KnowledgeResource[]>([]);
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [badges, setBadges] = useState<CompetencyBadge[]>([]);
  const [certificates, setCertificates] = useState<CompetencyCertificate[]>([]);
  const [alerts, setAlerts] = useState<ManagerAlert[]>([]);
  const [futureSkills, setFutureSkills] = useState<FutureSkillGoal[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>({
    knowledgeAssessment: 0.3,
    practicalTask: 0.3,
    courseCompletion: 0.2,
    trainerEvaluation: 0.1,
    selfAssessment: 0.1,
  });
  const [aiDrafts, setAiDrafts] = useState<AIDraftKnowledgeExtraction[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([
    {
      id: 'req-01',
      expertId: 'exp-sunita-iyer',
      expertName: 'Dr. Sunita Iyer',
      requesterId: 'emp-ananya-sharma',
      requesterName: 'Ananya Sharma',
      requesterRole: 'Junior Digital Governance Officer',
      requesterEmail: 'ananya.sharma@state.gov.in',
      topic: 'Advice on automated ETL pipelines for District e-Office analytics',
      urgency: 'High Priority',
      status: 'scheduled',
      scheduledDate: '2026-09-05T11:00:00Z',
      createdAt: '2026-09-01T04:30:00Z',
      responseNotes: 'Confirmed video sync for Friday 11:00 AM. Please bring sample dataset.',
    },
    {
      id: 'req-02',
      expertId: 'exp-vikram-singh',
      expertName: 'Vikram Singh',
      requesterId: 'emp-priya-nair',
      requesterName: 'Priya Nair',
      requesterRole: 'Procurement Officer',
      requesterEmail: 'priya.nair@state.gov.in',
      topic: 'Handling custom BoQ specification challenges during GeM reverse auctions',
      urgency: 'Statutory Deadline',
      status: 'pending',
      createdAt: '2026-09-01T05:15:00Z',
    },
  ]);

  // Navigation & View
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('skillbridge_sidebar_open');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('skillbridge_sidebar_open', String(next));
      } catch (e) {
        // ignore
      }
      addToast({
        type: 'info',
        title: next ? 'Sidebar Visible' : 'Sidebar Removed (Focus Mode)',
        message: next
          ? 'Navigation sidebar restored.'
          : 'Sidebar removed. Enjoy full-width distraction-free view for your role.',
      });
      return next;
    });
  };

  // Active User / Persona Session (First page starts unauthenticated so user sees login/register/demo personas)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDemoSession, setIsDemoSession] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-learner',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@state.gov.in',
    role: 'learner',
    organizationId: 'org-state-gov',
    departmentId: 'dept-it-gov',
    designation: 'Junior Digital Governance Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    employeeId: 'emp-ananya-sharma',
    civilServiceId: 'SDGD-CADRE-101',
    cadre: 'State Civil Service (SCS) — Digital Cadre',
    securityClearance: 'LEVEL 3 — SECRET / RESTRICTED',
    securityClearanceLevel: 3,
    nationalIdVerified: true,
    biometricEnrolled: true,
  });

  const [activeRole, setActiveRole] = useState<RoleType>('learner');

  // Security & Identity Management
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);
  const [mfaPendingUser, setMfaPendingUser] = useState<User | null>(null);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(0);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0);

  const [sessionSecurity, setSessionSecurity] = useState<SessionSecurity>({
    encrypted: true,
    protocol: 'TLS 1.3 • AES-256-GCM (GovNet Apex)',
    token: 'GOVNET-SEC-SESSION-7f3b891a2c',
    expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    clearanceLevel: 'LEVEL 3 — SECRET / RESTRICTED',
    verifiedGovNetId: 'SDGD-CADRE-101',
    isMfaVerified: true,
    ipAddress: '10.42.19.88 (NIC Secure Gateway)',
  });

  // Hero Flow Step Tracking (1 through 6)
  const [heroStep, setHeroStep] = useState<number>(1);
  const [heroModalOpen, setHeroModalOpen] = useState<boolean>(false);

  // Offline / Network Simulation
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('ONLINE');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [pendingOfflineCount, setPendingOfflineCount] = useState<number>(0);

  // Multilingual & Theme
  const [language, setLanguage] = useState<Language>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Rate limit countdown effect
  useEffect(() => {
    let timer: any;
    if (isRateLimited && rateLimitCountdown > 0) {
      timer = setInterval(() => {
        setRateLimitCountdown((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false);
            setFailedLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRateLimited, rateLimitCountdown]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAppState();
      setOrganization(data.organization);
      setDepartments(data.departments || []);
      setCompetencies(data.competencies || []);
      setRoles(data.roles || []);
      setEmployees(data.employees || []);
      setCourses(data.courses || []);
      setAssessments(data.assessments || []);
      setKnowledgeResources(data.knowledgeResources || []);
      setExperts(data.experts || []);
      setBadges(data.badges || []);
      if (data.certificates) setCertificates(data.certificates);
      setAlerts(data.alerts || []);
      setFutureSkills(data.futureSkills || []);
      setAuditLogs(data.auditLogs || []);
      setUsers(data.users || []);
      if (data.scoringWeights) setScoringWeights(data.scoringWeights);
      if (data.aiDrafts) setAiDrafts(data.aiDrafts);

      // Check offline queue
      const queue = JSON.parse(localStorage.getItem('skillbridge_offline_queue') || '[]');
      setPendingOfflineCount(queue.length);
    } catch (err) {
      console.error('Error fetching state in AppContext:', err);
      addToast({
        type: 'error',
        title: 'Connection Notice',
        message: 'Loaded data from local storage.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      setNetworkStatus(next ? 'OFFLINE' : 'ONLINE');
      addToast({
        type: next ? 'warning' : 'success',
        title: next ? 'Simulated Offline Enabled' : 'Live Connection Restored',
        message: next
          ? 'Network disabled. Local cache and offline queue active.'
          : 'Reconnected to GovNet Apex server.',
      });
      return next;
    });
  };

  const syncNow = async () => {
    try {
      const queue = JSON.parse(localStorage.getItem('skillbridge_offline_queue') || '[]');
      if (queue.length === 0) {
        addToast({
          type: 'info',
          title: 'Sync Complete',
          message: 'All records are up to date with the GovNet database.',
        });
        return;
      }
      for (const item of queue) {
        await submitAssessment({
          employeeId: item.employeeId,
          assessmentId: item.assessmentId,
          competencyId: item.competencyId,
          answers: item.answers,
          practicalResponse: item.practicalResponse,
          type: item.type,
          isOffline: false,
        });
      }
      localStorage.removeItem('skillbridge_offline_queue');
      setPendingOfflineCount(0);
      await loadData();
      addToast({
        type: 'success',
        title: 'Offline Queue Synchronized',
        message: `Synced ${queue.length} offline assessment records.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Sync Failed',
        message: 'Could not sync offline queue. Server unreachable.',
      });
    }
  };

  useEffect(() => {
    // Reset guided walkthrough to 1st step every time website is visited/loaded
    setHeroStep(1);
    loadData();
  }, []);

  const finalizeUserLogin = (user: User, token: string, expiresAt: string, role?: RoleType, isDemo: boolean = false) => {
    setCurrentUser(user);
    setActiveRole(role || user.role);
    setIsAuthenticated(true);
    setIsDemoSession(isDemo);
    setIsSessionLocked(false);
    setSessionSecurity({
      encrypted: true,
      protocol: isDemo ? 'Demo Sandbox • Isolated Persona Session' : 'TLS 1.3 • AES-256-GCM (GovNet Apex)',
      token,
      expiresAt,
      clearanceLevel: user.securityClearance || 'LEVEL 3 — SECRET / RESTRICTED',
      verifiedGovNetId: user.civilServiceId || user.employeeId || 'SDGD-CADRE-101',
      isMfaVerified: !isDemo,
      ipAddress: '10.42.19.88 (NIC Secure Gateway)',
    });

    const secLog: AuditLog = {
      id: `log-sec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: user.name,
      actorRole: user.role,
      action: isDemo ? 'DEMO_PERSONA_SESSION_STARTED' : 'SECURITY_AUTH_MFA_SUCCESS',
      entityType: 'competency',
      details: isDemo
        ? `Demo persona ${user.name} (${user.civilServiceId || user.id}) entered the isolated demo sandbox without credentials.`
        : `Officer ${user.name} (${user.civilServiceId || user.email}) authenticated via a server-issued session.`,
      organizationId: organization?.id || 'org-state-gov',
    };
    setAuditLogs((prev) => [secLog, ...prev]);

    addToast({
      type: 'success',
      title: isDemo ? 'Demo Persona Activated' : 'GovNet Session Authenticated',
      message: isDemo
        ? `Signed in as ${user.name} — isolated demo session (no credentials required).`
        : `Identity verified: ${user.name} (${user.securityClearance || 'Level 3 Clearance'})`,
    });
  };

  /**
   * Demo Persona exception: starts a credential-free sandbox session for the
   * predefined demo personas ONLY. No email, password, OTP or officer ID is
   * requested. Real / newly registered accounts are rejected here and must use
   * the normal `loginWithCredentials` or `requestGmailOtp` + `confirmGmailOtp`.
   */
  const loginAsDemoPersona = async (personaId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isDemoPersonaId(personaId)) {
      return { success: false, error: 'Not a predefined Demo Persona. Credentials are required.' };
    }

    try {
      const response = await loginAsDemoPersonaRequest(personaId);
      if (!response.success || !response.user || !response.token || !response.expiresAt) {
        addToast({
          type: 'error',
          title: 'Demo Session Failed',
          message: response.error || 'Could not start the demo session. Please retry.',
        });
        return { success: false, error: response.error || 'Could not start the demo session.' };
      }
      setAuthToken(response.token);
      setFailedLoginAttempts(0);
      finalizeUserLogin(response.user, response.token, response.expiresAt, response.user.role, true);
      return { success: true };
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not reach the demo session gateway. Please retry.',
      });
      return { success: false, error: 'Network connection failed.' };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setIsDemoSession(false);
    setMfaPendingUser(null);
    setIsSessionLocked(false);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Officer session terminated securely. Encrypted cache preserved.',
    });
  };

  const switchUser = (userId: string) => {
    // Demo Personas are the credential-free exception to the auth flow.
    if (isDemoPersonaId(userId)) {
      void loginAsDemoPersona(userId);
      return;
    }
    addToast({ type: 'warning', title: 'Authentication Required', message: 'Sign in with that officer’s credentials to change accounts.' });
  };

  const switchRole = (role: RoleType) => {
    setActiveRole(role);
    const userForRole = users.find((u) => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
    }
    addToast({
      type: 'info',
      title: 'Active Role Changed',
      message: `Switched dashboard perspective to ${role.replace('_', ' ').toUpperCase()}`,
    });
  };

  const lockSession = () => {
    setIsSessionLocked(true);
    addToast({
      type: 'warning',
      title: 'Session Locked',
      message: 'Terminal locked for officer security. Enter passkey to resume.',
    });
  };

  const unlockSession = (passkey: string): boolean => {
    if (!passkey || passkey.trim().length < 4) {
      addToast({
        type: 'error',
        title: 'Unlock Failed',
        message: 'Invalid passkey. Use demo passkey: demo1234',
      });
      return false;
    }
    setIsSessionLocked(false);
    addToast({
      type: 'success',
      title: 'Terminal Unlocked',
      message: `Session restored for ${currentUser.name}.`,
    });
    return true;
  };

  const findUserByIdentifier = (identifier: string): User | undefined => {
    if (!identifier) return undefined;
    const clean = identifier.trim().toLowerCase();
    return users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.id.toLowerCase() === clean ||
        (u.civilServiceId && u.civilServiceId.toLowerCase() === clean) ||
        (u.employeeId && u.employeeId.toLowerCase() === clean) ||
        u.name.toLowerCase() === clean ||
        u.name.toLowerCase().includes(clean)
    );
  };

  const loginWithCredentials = async (
    identifier: string,
    role?: RoleType,
    password?: string,
    skipMfa?: boolean
  ): Promise<{ success: boolean; requiresMfa?: boolean; error?: string; requiresRegistration?: boolean }> => {
    if (isRateLimited) {
      return {
        success: false,
        error: `Security Lockout Active: Too many failed password attempts. Please wait ${rateLimitCountdown} seconds.`,
      };
    }

    const response = await loginOfficer({ identifier, password, role });
    if (!response.success || !response.user || !response.token || !response.expiresAt) return { success: false, error: response.error || 'Authentication failed.', requiresRegistration: response.requiresRegistration };
    setAuthToken(response.token);
    setFailedLoginAttempts(0);
    finalizeUserLogin(response.user, response.token, response.expiresAt, response.user.role);
    return { success: true, requiresMfa: false };
  };

  const requestGmailOtp = async (details: {
    name: string;
    email: string;
    role: RoleType;
    departmentId: string;
    designation: string;
    employeeCode: string;
    password?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    accountExists?: boolean;
    deliveredToMailbox?: boolean;
    sandboxOtp?: string;
    smtpConfigured?: boolean;
  }> => {
    try {
      const res = await sendGmailOtp(details);
      if (res.success) {
        addToast({
          type: res.deliveredToMailbox ? 'success' : 'info',
          title: res.deliveredToMailbox ? 'Verification Email Dispatched' : 'Verification Code Generated',
          message: res.deliveredToMailbox
            ? `An email has been sent directly to ${details.email}. Check inbox & spam folder.`
            : `Code generated for ${details.email}. See sandbox dispatch code below.`,
        });
        return {
          success: true,
          message: res.message,
          deliveredToMailbox: res.deliveredToMailbox,
          sandboxOtp: res.sandboxOtp,
          smtpConfigured: res.smtpConfigured,
        };
      } else {
        addToast({
          type: 'error',
          title: 'Registration Rejected',
          message: res.error || 'Failed to dispatch verification code.',
        });
        return { success: false, error: res.error, accountExists: res.accountExists };
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to authentication gateway.',
      });
      return { success: false, error: 'Network connection failed.' };
    }
  };

  const confirmGmailOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await verifyGmailOtp({ email, otp });
      if (res.success && res.user) {
        setUsers((prev) => [res.user, ...prev.filter((u) => u.id !== res.user.id)]);
        if (res.employee) {
          setEmployees((prev) => [res.employee, ...prev.filter((e) => e.id !== res.employee.id)]);
        }
        if (!res.token || !res.expiresAt) return { success: false, error: 'Authentication session was not created.' };
        setAuthToken(res.token);
        finalizeUserLogin(res.user, res.token, res.expiresAt, res.user.role);
        addToast({
          type: 'success',
          title: 'Gmail Verified & Account Created',
          message: `Welcome, ${res.user.name}! Official civil cadre profile enrolled successfully.`,
        });
        return { success: true };
      } else {
        addToast({
          type: 'error',
          title: 'Verification Failed',
          message: res.error || 'Invalid 6-digit verification code. Please check your Gmail.',
        });
        return { success: false, error: res.error };
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Verification Error',
        message: 'Failed to verify OTP code.',
      });
      return { success: false, error: 'Verification network error.' };
    }
  };

  const verifyMfa = (code: string): boolean => {
    if (!mfaPendingUser) return false;
    const cleanCode = code.replace(/\s+/g, '');
    if (!/^\d{6}$/.test(cleanCode)) {
      addToast({
        type: 'error',
        title: 'MFA Code Invalid',
        message: 'Please enter a valid 6-digit State TOTP Authenticator code (or click Use Demo Code).',
      });
      return false;
    }

    addToast({ type: 'error', title: 'MFA Unavailable', message: 'Authenticator verification must be completed by the server.' });
    return false;
  };

  const cancelMfa = () => {
    setMfaPendingUser(null);
  };

  const registerNewAccount = (details: {
    name: string;
    email: string;
    role: RoleType;
    departmentId: string;
    designation: string;
    employeeCode: string;
  }) => {
    const dept = departments.find((d) => d.id === details.departmentId) || departments[0];
    const newEmpId = `emp-${Date.now()}`;
    const newUserId = `user-${Date.now()}`;

    const newUser: User = {
      id: newUserId,
      name: details.name,
      email: details.email,
      role: details.role,
      organizationId: organization?.id || 'org-state-gov',
      departmentId: details.departmentId || dept?.id || 'dept-it-gov',
      designation: details.designation || 'State Officer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      employeeId: newEmpId,
    };

    // If role is learner or has employee record, create an employee entry
    const newEmployee: Employee = {
      id: newEmpId,
      organizationId: organization?.id || 'org-state-gov',
      departmentId: details.departmentId || dept?.id || 'dept-it-gov',
      roleId: roles[0]?.id || 'role-jr-gov-officer',
      name: details.name,
      email: details.email,
      employeeCode: details.employeeCode || `SDGD-${Date.now().toString().slice(-4)}`,
      designation: details.designation || 'State Officer',
      avatar: newUser.avatar,
      managerId: employees[0]?.id || '',
      joinDate: new Date().toISOString().split('T')[0],
      overallReadiness: 65,
      criticalGapsCount: 1,
      mandatoryTrainingOverdue: false,
      completedCourseIds: [],
      enrolledCourseIds: ['course-data-excel-01'],
      competencies: {},
    };

    setUsers((prev) => [newUser, ...prev]);
    setEmployees((prev) => [newEmployee, ...prev]);
    setCurrentUser(newUser);
    setActiveRole(details.role);
    setIsAuthenticated(true);

    addToast({
      type: 'success',
      title: 'Account Registered',
      message: `Account created for ${details.name}. Tenant profile initialized.`,
    });
  };

  const addExternalCourse = (newCourseData: Omit<Course, 'id'>): Course => {
    const id = `course-ext-${Date.now()}`;
    const fullCourse: Course = {
      ...newCourseData,
      id,
    };
    setCourses((prev) => [fullCourse, ...prev]);
    addToast({
      type: 'success',
      title: 'External Lecture Added',
      message: `"${fullCourse.title}" successfully integrated from ${fullCourse.platform?.toUpperCase() || 'MOOC'}.`,
    });
    return fullCourse;
  };

  const addMentorshipRequest = (req: {
    expertId: string;
    expertName: string;
    topic: string;
    urgency: 'Routine' | 'High Priority' | 'Statutory Deadline';
  }) => {
    const newReq: MentorshipRequest = {
      id: `req-${Date.now()}`,
      expertId: req.expertId,
      expertName: req.expertName,
      requesterId: currentUser.employeeId || currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.designation,
      requesterEmail: currentUser.email,
      topic: req.topic,
      urgency: req.urgency,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setMentorshipRequests((prev) => [newReq, ...prev]);
    addToast({
      type: 'success',
      title: 'Mentorship Requested',
      message: `Consultation request routed to ${req.expertName}.`,
    });
  };

  const updateMentorshipRequest = (
    id: string,
    status: 'pending' | 'scheduled' | 'resolved',
    responseNotes?: string
  ) => {
    setMentorshipRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              responseNotes: responseNotes || r.responseNotes,
              scheduledDate: status === 'scheduled' ? new Date(Date.now() + 86400000 * 2).toISOString() : r.scheduledDate,
            }
          : r
      )
    );
    addToast({
      type: 'info',
      title: 'Mentorship Request Updated',
      message: `Request status changed to ${status.toUpperCase()}.`,
    });
  };

  const resetHeroWalkthrough = (launchImmediately: boolean = true) => {
    setHeroStep(1);
    if (launchImmediately) {
      setHeroModalOpen(true);
    }
  };

  const currentEmployee = employees.find((e) => e.id === currentUser.employeeId) || null;

  return (
    <AppContext.Provider
      value={{
        organization,
        departments,
        competencies,
        roles,
        employees,
        courses,
        assessments,
        knowledgeResources,
        experts,
        badges,
        certificates,
        alerts,
        futureSkills,
        auditLogs,
        users,
        scoringWeights,
        aiDrafts,
        mentorshipRequests,

        isAuthenticated,
        isDemoSession,
        currentUser,
        currentEmployee,
        activeRole,
        switchUser,
        loginAsDemoPersona,
        switchRole,
        logout,
        loginWithCredentials,
        verifyMfa,
        cancelMfa,
        mfaPendingUser,
        sessionSecurity,
        isSessionLocked,
        lockSession,
        unlockSession,
        failedLoginAttempts,
        isRateLimited,
        rateLimitCountdown,
        findUserByIdentifier,
        requestGmailOtp,
        confirmGmailOtp,
        registerNewAccount,
        addExternalCourse,
        addMentorshipRequest,
        updateMentorshipRequest,

        currentTab,
        setCurrentTab,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        selectedCourseId,
        setSelectedCourseId,
        selectedAssessmentId,
        setSelectedAssessmentId,

        heroStep,
        setHeroStep,
        heroModalOpen,
        setHeroModalOpen,
        resetHeroWalkthrough,

        networkStatus,
        isSimulatedOffline,
        toggleSimulatedOffline,
        syncNow,
        pendingOfflineCount,

        language,
        setLanguage,
        highContrast,
        setHighContrast,

        isLoading,
        toasts,
        addToast,
        removeToast,
        refreshState: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

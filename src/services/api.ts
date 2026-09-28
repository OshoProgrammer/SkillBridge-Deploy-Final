let authToken: string | null = null;
export function setAuthToken(token: string | null) { authToken = token; }
function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (authToken) headers.set('Authorization', `Bearer ${authToken}`);
  return fetch(input, { ...init, headers });
}

/**
 * SkillBridge — API Service Client
 * Handles server communication, offline caching, and PWA synchronization.
 */

export async function fetchAppState() {
  try {
    const res = await apiFetch('/api/state');
    if (!res.ok) throw new Error('Failed to fetch state');
    const data = await res.json();
    // Cache snapshot in localStorage for offline availability
    localStorage.setItem('skillbridge_offline_state', JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('Network unavailable, loading offline cached state:', err);
    const cached = localStorage.getItem('skillbridge_offline_state');
    if (cached) {
      return JSON.parse(cached);
    }
    throw err;
  }
}

export async function resetAppState() {
  const res = await apiFetch('/api/reset-state', { method: 'POST' });
  return res.json();
}

export async function updateRoleCompetencies(roleId: string, requiredCompetencies: any[], actorName?: string) {
  const res = await apiFetch(`/api/roles/${roleId}/competencies`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requiredCompetencies, actorName }),
  });
  return res.json();
}

export async function submitAssessment(payload: {
  employeeId: string;
  assessmentId: string;
  competencyId: string;
  answers: Record<string, number>;
  practicalResponse?: string;
  type: 'baseline' | 'post_training';
  isOffline?: boolean;
  forceExceededDeadline?: boolean;
}) {
  if (payload.isOffline) {
    // Queue offline submission
    const queue = JSON.parse(localStorage.getItem('skillbridge_offline_queue') || '[]');
    queue.push({
      ...payload,
      id: `offline-sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('skillbridge_offline_queue', JSON.stringify(queue));
    return {
      success: true,
      offlineQueued: true,
      message: 'Assessment saved locally. Will automatically sync when reconnected.',
    };
  }

  const res = await apiFetch(`/api/employees/${payload.employeeId}/assessments/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function completeCourse(employeeId: string, courseId: string) {
  const res = await apiFetch(`/api/employees/${employeeId}/courses/${courseId}/complete`, {
    method: 'POST',
  });
  return res.json();
}

export async function checkDuplicateKnowledge(payload: {
  title: string;
  competencyId?: string;
  tags: string[];
  departmentId?: string;
  description?: string;
}) {
  const res = await apiFetch('/api/knowledge/check-duplicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function executeKnowledgeAction(payload: {
  action: 'reuse' | 'adapt' | 'create_new';
  originalResourceId?: string;
  newResource?: any;
  actorName?: string;
}) {
  const res = await apiFetch('/api/knowledge/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function extractKnowledgeWithAI(payload: {
  rawText: string;
  documentName: string;
  documentType: string;
  competencyHint?: string;
}) {
  const res = await apiFetch('/api/ai/extract-knowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function advanceDraftPipeline(payload: {
  draftIndex: number;
  action: 'submit_review' | 'trainer_approve' | 'publish_to_course';
  reviewNotes?: string;
  actorName?: string;
}) {
  const res = await apiFetch('/api/ai/drafts/pipeline-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sendManagerNudge(payload: {
  alertId: string;
  action: 'nudge_employee' | 'escalate_to_head' | 'resolve';
  actorName?: string;
  message?: string;
}) {
  const res = await apiFetch('/api/manager/nudge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function syncOfflineSubmissions() {
  const queue = JSON.parse(localStorage.getItem('skillbridge_offline_queue') || '[]');
  if (queue.length === 0) return { success: true, syncedCount: 0 };

  const res = await apiFetch('/api/offline/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissions: queue }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.removeItem('skillbridge_offline_queue');
  }
  return data;
}

export async function explainLearningPathWithAI(payload: {
  roleTitle: string;
  competencyName: string;
  currentScore: number;
  requiredLevel: number;
}) {
  try {
    const res = await apiFetch('/api/ai/explain-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (err) {
    return {
      explanation: `Targeted to elevate ${payload.competencyName} from ${payload.currentScore}% to Level ${payload.requiredLevel} readiness benchmark.`,
    };
  }
}

export async function loginOfficer(payload: {
  identifier: string;
  password?: string;
  role?: string;
}) {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sendGmailOtp(payload: {
  email: string;
  name: string;
  role: string;
  departmentId: string;
  designation: string;
  employeeCode: string;
  password?: string;
}) {
  const res = await apiFetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function verifyGmailOtp(payload: {
  email: string;
  otp: string;
}) {
  const res = await apiFetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getSmtpStatus() {
  const res = await fetch('/api/auth/smtp-status');
  return res.json();
}

export async function configureSmtp(payload: {
  user: string;
  pass: string;
  host?: string;
  port?: number;
}) {
  const res = await fetch('/api/auth/smtp-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

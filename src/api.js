// API Client for ITE Damascus University Marks Portal
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://damascus-ite-marks-api.onrender.com/api' : '/api');

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};

export const getUser = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};
export const setUser = (user) => {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
};

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    if (res.status === 401) {
      setAuthToken(null);
      setUser(null);
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      return res.blob();
    }
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.error || 'حدث خطأ في استجابة الخادم');
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  auth: {
    register: (phone_number, full_name, password, email) =>
      request('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ phone_number, full_name, password, email }),
      }),
    login: (phone_number, password) =>
      request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ phone_number, password }),
      }),
    getMe: () => request('/auth/me/'),
    forgotPassword: (phone_number_or_email) =>
      request('/auth/forgot-password/', {
        method: 'POST',
        body: JSON.stringify({ phone_number_or_email }),
      }),
    resetPassword: (phone_number, otp_code, new_password) =>
      request('/auth/reset-password/', {
        method: 'POST',
        body: JSON.stringify({ phone_number, otp_code, new_password }),
      }),
  },

  // Smart Match
  students: {
    smartMatch: () => request('/students/smart-match/'),
    claimIdentity: (student_university_id) =>
      request('/students/claim-identity/', {
        method: 'POST',
        body: JSON.stringify({ student_university_id }),
      }),
  },

  // Search
  search: {
    searchStudents: (params = {}) => {
      const p = new URLSearchParams();
      if (params.query) p.append('name', params.query);
      if (params.name) p.append('name', params.name);
      if (params.student_id) p.append('student_id', params.student_id);
      if (params.course) p.append('course_name', params.course);
      if (params.course_name) p.append('course_name', params.course_name);
      if (params.year) p.append('academic_year', params.year);
      if (params.academic_year) p.append('academic_year', params.academic_year);
      return request(`/search/students/?${p.toString()}`);
    },
    searchCourses: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/search/courses/?${q}`);
    },
  },

  // Analytics & Syrian Grace Marks
  analytics: {
    getStudentSummary: (student_id, name = '') => {
      const p = new URLSearchParams();
      if (name) p.append('name', name);
      const q = p.toString() ? `?${p.toString()}` : '';
      return request(`/analytics/student/${encodeURIComponent(student_id)}/summary/${q}`);
    },
  },

  // Leaderboards
  leaderboards: {
    getTop30: (params = {}) => {
      const p = new URLSearchParams();
      if (params.year) p.append('year_id', params.year);
      if (params.year_id) p.append('year_id', params.year_id);
      if (params.specialization) p.append('department_id', params.specialization);
      if (params.department_id) p.append('department_id', params.department_id);
      return request(`/leaderboards/top30/?${p.toString()}`);
    },
    getCourseToppers: (params = {}) => {
      const p = new URLSearchParams();
      if (params.year) p.append('year_id', params.year);
      if (params.year_id) p.append('year_id', params.year_id);
      if (params.specialization) p.append('department_id', params.specialization);
      if (params.department_id) p.append('department_id', params.department_id);
      return request(`/leaderboards/course-toppers/?${p.toString()}`);
    },
  },

  reports: {
    getMarkPdfUrl: (mark_id) => `${API_BASE}/reports/mark/${mark_id}/pdf/`,
    getCareerPdfUrl: (student_id, name = '') => {
      const p = new URLSearchParams();
      if (name) p.append('name', name);
      const q = p.toString() ? `?${p.toString()}` : '';
      return `${API_BASE}/reports/career/${encodeURIComponent(student_id)}/pdf/${q}`;
    },
  },

  // Google Drive Sync
  sync: {
    triggerGDrive: () => request('/sync/gdrive/trigger/', { method: 'POST' }),
  },

  // Lectures Management
  lectures: {
    getTree: (params = {}) => {
      const p = new URLSearchParams();
      if (params.year) p.append('year', params.year);
      if (params.study_year) p.append('study_year', params.study_year);
      return request(`/lectures/tree/?${p.toString()}`);
    },
    getYears: () => request('/lectures/years/'),
    getSubjects: (params = {}) => {
      const p = new URLSearchParams();
      if (params.year) p.append('year', params.year);
      if (params.study_year) p.append('study_year', params.study_year);
      return request(`/lectures/subjects/?${p.toString()}`);
    },
    getFiles: (params = {}) => {
      const p = new URLSearchParams();
      if (params.subject_id) p.append('subject_id', params.subject_id);
      if (params.year) p.append('year', params.year);
      if (params.study_year) p.append('study_year', params.study_year);
      if (params.search) p.append('search', params.search);
      return request(`/lectures/files/?${p.toString()}`);
    },
    syncLectures: () => request('/lectures/sync/', { method: 'POST' }),
  },
};

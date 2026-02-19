import api from '@/lib/api';

export const superadminService = {
  // ==================== DASHBOARD ====================
  getDashboardStats: () => api.get('/superadmin/dashboardRoutes/getDashboardStats'),

  // ==================== PROFILE ====================
  getProfile: () => api.get('/auth/me'),

  updateProfile: (data) => api.put('/auth/profile', data),

  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  // ==================== ADMIN MANAGEMENT ====================
  getAllAdmins: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/adminManagementRoutes/getAllAdmins${queryString ? `?${queryString}` : ''}`);
  },

  getAdminById: (id) => api.get(`/superadmin/adminManagementRoutes/getAdminById/${id}`),

  createAdmin: (data) => api.post('/superadmin/adminManagementRoutes/createAdmin', data),

  updateAdmin: (id, data) => api.put(`/superadmin/adminManagementRoutes/updateAdmin/${id}`, data),

  resetAdminPassword: (id, newPassword) =>
    api.put(`/superadmin/adminManagementRoutes/resetAdminPassword/${id}`, { newPassword }),

  toggleAdminStatus: (id, status) =>
    api.put(`/superadmin/adminManagementRoutes/toggleAdminStatus/${id}`, { status }),

  deleteAdmin: (id) => api.delete(`/superadmin/adminManagementRoutes/deleteAdmin/${id}`),

  // ==================== SUPERADMIN MANAGEMENT ====================
  getAllSuperAdmins: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/superadminManagementRoutes/getAllSuperAdmins${queryString ? `?${queryString}` : ''}`);
  },

  getSuperAdminById: (id) => api.get(`/superadmin/superadminManagementRoutes/getSuperAdminById/${id}`),

  createSuperAdmin: (data) => api.post('/superadmin/superadminManagementRoutes/createSuperAdmin', data),

  updateSuperAdmin: (id, data) => api.put(`/superadmin/superadminManagementRoutes/updateSuperAdmin/${id}`, data),

  resetSuperAdminPassword: (id, newPassword) =>
    api.put(`/superadmin/superadminManagementRoutes/resetSuperAdminPassword/${id}`, { newPassword }),

  toggleSuperAdminStatus: (id, status) =>
    api.put(`/superadmin/superadminManagementRoutes/toggleSuperAdminStatus/${id}`, { status }),

  deleteSuperAdmin: (id) => api.delete(`/superadmin/superadminManagementRoutes/deleteSuperAdmin/${id}`),

  // ==================== BRANCH MANAGEMENT ====================
  getAllBranches: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/branchManagementRoutes/getAllBranches${queryString ? `?${queryString}` : ''}`);
  },

  createBranch: (data) => api.post('/superadmin/branchManagementRoutes/createBranch', data),

  updateBranch: (id, data) => api.put(`/superadmin/branchManagementRoutes/updateBranch/${id}`, data),

  deleteBranch: (id) => api.delete(`/superadmin/branchManagementRoutes/deleteBranch/${id}`),

  // ==================== MEMBERSHIP PLAN MANAGEMENT ====================
  // Get application-level membership plans (branchId: null)
  getAllMembershipPlans: () => api.get('/superadmin/membershipPlanRoutes/getAllMembershipPlans'),

  // Get all membership plans across all clubs (for analytics/reporting)
  getAllMembershipPlansAcrossClubs: () => api.get('/superadmin/membershipPlanRoutes/getAllPlansAcrossClubs'),

  createMembershipPlan: (data) => api.post('/superadmin/membershipPlanRoutes/createMembershipPlan', data),

  updateMembershipPlan: (id, data) => api.put(`/superadmin/membershipPlanRoutes/updateMembershipPlan/${id}`, data),

  deleteMembershipPlan: (id) => api.delete(`/superadmin/membershipPlanRoutes/deleteMembershipPlan/${id}`),

  // ==================== AUDIT LOGS ====================
  getAuditLogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/auditAnalyticsRoutes/getAuditLogs${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== ANALYTICS ====================
  getSystemAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/auditAnalyticsRoutes/getSystemAnalytics${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== DATA EXPORT ====================
  exportSystemData: (type) => api.get(`/superadmin/auditAnalyticsRoutes/exportSystemData?type=${type}`),

  // ==================== SYSTEM SETTINGS ====================
  getSystemSettings: () => api.get('/superadmin/systemSettingsRoutes/getSystemSettings'),

  updateSystemSettings: (data) => api.put('/superadmin/systemSettingsRoutes/updateSystemSettings', data),

  // ==================== MASTER DATA ====================
  // Sports Types
  getSportsTypes: () => api.get('/superadmin/masterDataRoutes/sports'),

  createSportType: (data) => api.post('/superadmin/masterDataRoutes/sports', data),

  updateSportType: (id, data) => api.put(`/superadmin/masterDataRoutes/sports/${id}`, data),

  deleteSportType: (id) => api.delete(`/superadmin/masterDataRoutes/sports/${id}`),

  // Facility Types
  getFacilityTypes: () => api.get('/superadmin/masterDataRoutes/facility-types'),

  createFacilityType: (data) => api.post('/superadmin/masterDataRoutes/facility-types', data),

  updateFacilityType: (id, data) => api.put(`/superadmin/masterDataRoutes/facility-types/${id}`, data),

  deleteFacilityType: (id) => api.delete(`/superadmin/masterDataRoutes/facility-types/${id}`),

  // ==================== ATTENDANCE ====================
  getAttendance: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/attendanceRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getAttendanceStats: () => api.get('/superadmin/attendanceRoutes/stats'),

  // ==================== HEALTH RECORDS ====================
  getHealthRecords: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/healthRecordRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getHealthRecordByMemberId: (memberId) => api.get(`/superadmin/healthRecordRoutes/${memberId}`),

  getHealthStats: () => api.get('/superadmin/healthRecordRoutes/stats'),

  // ==================== SESSIONS ====================
  getSessions: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/sessionRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getSessionStats: () => api.get('/superadmin/sessionRoutes/stats'),

  deleteSession: (id) => api.delete(`/superadmin/sessionRoutes/${id}`),

  // ==================== TRAINING PLANS ====================
  getTrainingPlans: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/trainingPlanRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getTrainingPlanStats: () => api.get('/superadmin/trainingPlanRoutes/stats'),

  // ==================== RESOURCES ====================
  getResources: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/resourceRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getResourceStats: () => api.get('/superadmin/resourceRoutes/stats'),

  deleteResource: (id) => api.delete(`/superadmin/resourceRoutes/${id}`),

  toggleResourceFeatured: (id) => api.put(`/superadmin/resourceRoutes/${id}/toggle-featured`),

  // ==================== LEADERBOARD ====================
  getLeaderboard: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/leaderboardRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getLeaderboardStats: () => api.get('/superadmin/leaderboardRoutes/stats'),

  // ==================== MEMBERS ====================
  getMembers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/memberRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getMemberStats: () => api.get('/superadmin/memberRoutes/stats'),

  // ==================== ANNOUNCEMENTS ====================
  getAnnouncements: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/announcementRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getAnnouncementStats: () => api.get('/superadmin/announcementRoutes/stats'),

  // ==================== EVENTS ====================
  getEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/superadmin/eventRoutes${queryString ? `?${queryString}` : ''}`);
  },

  getEventStats: () => api.get('/superadmin/eventRoutes/stats'),
};

export default superadminService;
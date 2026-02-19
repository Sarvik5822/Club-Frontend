import { api } from '@/lib/api';

const adminService = {
  // ==================== Dashboard ====================
  getDashboard: async () => {
    return api.get('/admin/dashboardRoutes/getDashboardStats');
  },

  // ==================== Reports ====================
  getRevenueReport: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/reportsRoutes/getRevenueReport${queryString ? `?${queryString}` : ''}`);
  },

  getAttendanceReport: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/reportsRoutes/getAttendanceReport${queryString ? `?${queryString}` : ''}`);
  },

  getMemberReport: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/reportsRoutes/getMemberReport${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== Branch Management ====================
  getBranch: async () => {
    try {
      return await api.get('/admin/branchRoutes/getBranchInfo');
    } catch (error) {
      // If branch info fails (e.g., admin has no branchId), return empty data
      console.warn('Branch info not available:', error.message);
      return { data: { branch: null } };
    }
  },

  updateBranch: async (data) => {
    return api.put('/admin/branchRoutes/updateBranchInfo', data);
  },

  // Get all branches (for dropdowns) - returns current branch as array
  getBranches: async () => {
    try {
      const response = await api.get('/admin/branchRoutes/getBranchInfo');
      // Wrap single branch in array format for dropdown compatibility
      if (response.data && response.data.branch) {
        return { data: { branches: [response.data.branch] } };
      }
      return { data: { branches: [] } };
    } catch (error) {
      // Silently handle error - branches dropdown will just be empty
      console.warn('Branches not available:', error.message);
      return { data: { branches: [] } };
    }
  },

  // ==================== Member Management ====================
  getMembers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/memberRoutes/getAllMembers${queryString ? `?${queryString}` : ''}`);
  },

  getMemberById: async (id) => {
    return api.get(`/admin/memberRoutes/getMemberById/${id}`);
  },

  createMember: async (data) => {
    return api.post('/admin/memberRoutes/createMember', data);
  },

  updateMember: async (id, data) => {
    return api.put(`/admin/memberRoutes/updateMember/${id}`, data);
  },

  deleteMember: async (id) => {
    return api.delete(`/admin/memberRoutes/deleteMember/${id}`);
  },

  approveMember: async (id, data) => {
    return api.put(`/admin/memberRoutes/approveMember/${id}`, data);
  },

  updateMemberStatus: async (id, data) => {
    return api.put(`/admin/memberRoutes/updateMemberStatus/${id}`, data);
  },

  // ==================== Coach Management ====================
  getCoaches: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/coachRoutes/getAllCoaches${queryString ? `?${queryString}` : ''}`);
  },

  getCoachById: async (id) => {
    return api.get(`/admin/coachRoutes/getCoachById/${id}`);
  },

  createCoach: async (data) => {
    return api.post('/admin/coachRoutes/createCoach', data);
  },

  updateCoach: async (id, data) => {
    return api.put(`/admin/coachRoutes/updateCoach/${id}`, data);
  },

  deleteCoach: async (id) => {
    return api.delete(`/admin/coachRoutes/deleteCoach/${id}`);
  },

  resetCoachPassword: async (id, data) => {
    return api.put(`/admin/coachRoutes/resetCoachPassword/${id}`, data);
  },

  toggleCoachStatus: async (id, data) => {
    return api.put(`/admin/coachRoutes/toggleCoachStatus/${id}`, data);
  },

  getCoachPerformance: async (id) => {
    return api.get(`/admin/coachRoutes/getCoachPerformance/${id}`);
  },

  assignCoachToMember: async (coachId, data) => {
    return api.post(`/admin/coachRoutes/assignCoachToMember/${coachId}`, data);
  },

  // ==================== Announcement Management ====================
  getAnnouncements: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/announcementRoutes/getAllAnnouncements${queryString ? `?${queryString}` : ''}`);
  },

  getAnnouncementStats: async () => {
    return api.get('/admin/announcementRoutes/getAnnouncementStats');
  },

  getAnnouncementById: async (id) => {
    return api.get(`/admin/announcementRoutes/getAnnouncementById/${id}`);
  },

  createAnnouncement: async (data) => {
    return api.post('/admin/announcementRoutes/createAnnouncement', data);
  },

  updateAnnouncement: async (id, data) => {
    return api.put(`/admin/announcementRoutes/updateAnnouncement/${id}`, data);
  },

  deleteAnnouncement: async (id) => {
    return api.delete(`/admin/announcementRoutes/deleteAnnouncement/${id}`);
  },

  publishAnnouncement: async (id) => {
    return api.put(`/admin/announcementRoutes/publishAnnouncement/${id}`);
  },

  archiveAnnouncement: async (id) => {
    return api.put(`/admin/announcementRoutes/archiveAnnouncement/${id}`);
  },

  // ==================== Facility Management ====================
  getFacilities: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/facilityRoutes/getAllFacilities${queryString ? `?${queryString}` : ''}`);
  },

  getAvailableFacilities: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/facilityRoutes/available${queryString ? `?${queryString}` : ''}`);
  },

  getFacilityById: async (id) => {
    return api.get(`/admin/facilityRoutes/getFacilityById/${id}`);
  },

  getFacilityStats: async (id) => {
    return api.get(`/admin/facilityRoutes/${id}/stats`);
  },

  createFacility: async (data) => {
    return api.post('/admin/facilityRoutes/createFacility', data);
  },

  updateFacility: async (id, data) => {
    return api.put(`/admin/facilityRoutes/updateFacility/${id}`, data);
  },

  updateFacilityOccupancy: async (id, data) => {
    return api.put(`/admin/facilityRoutes/updateFacilityOccupancy/${id}`, data);
  },

  deleteFacility: async (id) => {
    return api.delete(`/admin/facilityRoutes/deleteFacility/${id}`);
  },

  // ==================== Session Management ====================
  getSessions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/sessionRoutes/getAllSessions${queryString ? `?${queryString}` : ''}`);
  },

  getSessionStats: async () => {
    return api.get('/admin/sessionRoutes/getSessionStats');
  },

  getSessionById: async (id) => {
    return api.get(`/admin/sessionRoutes/${id}`);
  },

  createSession: async (data) => {
    return api.post('/admin/sessionRoutes/createSession', data);
  },

  updateSession: async (id, data) => {
    return api.put(`/admin/sessionRoutes/updateSession/${id}`, data);
  },

  deleteSession: async (id) => {
    return api.delete(`/admin/sessionRoutes/deleteSession/${id}`);
  },

  markSessionAttendance: async (id, data) => {
    return api.put(`/admin/sessionRoutes/markSessionAttendance/${id}`, data);
  },

  // ==================== Event Management ====================
  getEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/eventRoutes/getAllEvents${queryString ? `?${queryString}` : ''}`);
  },

  getUpcomingEvents: async () => {
    return api.get('/admin/eventRoutes/upcoming');
  },

  getEventStats: async () => {
    return api.get('/admin/eventRoutes/getEventStats');
  },

  getEventById: async (id) => {
    return api.get(`/admin/eventRoutes/getEventById/${id}`);
  },

  createEvent: async (data) => {
    return api.post('/admin/eventRoutes/createEvent', data);
  },

  updateEvent: async (id, data) => {
    return api.put(`/admin/eventRoutes/updateEvent/${id}`, data);
  },

  deleteEvent: async (id) => {
    return api.delete(`/admin/eventRoutes/deleteEvent/${id}`);
  },

  publishEvent: async (id) => {
    return api.put(`/admin/eventRoutes/${id}/publish`);
  },

  updateEventResults: async (id, data) => {
    return api.put(`/admin/eventRoutes/${id}/results`, data);
  },

  // ==================== Complaint Management ====================
  getComplaints: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/complaintRoutes/getAllComplaints${queryString ? `?${queryString}` : ''}`);
  },

  getComplaintStats: async () => {
    return api.get('/admin/complaintRoutes/getComplaintStats');
  },

  getComplaintById: async (id) => {
    return api.get(`/admin/complaintRoutes/${id}`);
  },

  updateComplaint: async (id, data) => {
    return api.put(`/admin/complaintRoutes/updateComplaint/${id}`, data);
  },

  resolveComplaint: async (id, data) => {
    return api.put(`/admin/complaintRoutes/resolveComplaint/${id}`, data);
  },

  assignComplaint: async (id, data) => {
    return api.put(`/admin/complaintRoutes/assignComplaint/${id}`, data);
  },

  // ==================== Payment Management ====================
  getPayments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/paymentRoutes/getAllPayments${queryString ? `?${queryString}` : ''}`);
  },

  getPaymentStats: async () => {
    return api.get('/admin/paymentRoutes/getPaymentStats');
  },

  getPaymentById: async (id) => {
    return api.get(`/admin/paymentRoutes/${id}`);
  },

  createPayment: async (data) => {
    return api.post('/admin/paymentRoutes/createPayment', data);
  },

  updatePaymentStatus: async (id, data) => {
    return api.put(`/admin/paymentRoutes/updatePaymentStatus/${id}`, data);
  },

  processRefund: async (id, data) => {
    return api.put(`/admin/paymentRoutes/processRefund/${id}`, data);
  },

  generateInvoice: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/paymentRoutes/${id}/invoice`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate invoice');
    }

    return response.blob();
  },

  // ==================== Notification Management ====================
  createNotification: async (data) => {
    return api.post('/admin/notificationRoutes', data);
  },

  // ==================== Health Record Management ====================
  getHealthRecords: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/healthRecordRoutes/getAllHealthRecords${queryString ? `?${queryString}` : ''}`);
  },

  getHealthStats: async () => {
    return api.get('/admin/healthRecordRoutes/getHealthStats');
  },

  getHealthRecordByMemberId: async (memberId) => {
    return api.get(`/admin/healthRecordRoutes/getHealthRecordByMemberId/${memberId}`);
  },

  createHealthRecord: async (data) => {
    return api.post('/admin/healthRecordRoutes/createOrUpdateHealthRecord', data);
  },

  updateBasicInfo: async (memberId, data) => {
    return api.put(`/admin/healthRecordRoutes/updateBasicInfo/${memberId}`, data);
  },

  addMedicalCondition: async (memberId, data) => {
    return api.post(`/admin/healthRecordRoutes/addMedicalCondition/${memberId}`, data);
  },

  addAllergy: async (memberId, data) => {
    return api.post(`/admin/healthRecordRoutes/addAllergy/${memberId}`, data);
  },

  addInjury: async (memberId, data) => {
    return api.post(`/admin/healthRecordRoutes/addInjury/${memberId}`, data);
  },

  addMeasurement: async (memberId, data) => {
    return api.post(`/admin/healthRecordRoutes/addMeasurement/${memberId}`, data);
  },

  updateFitnessAssessment: async (memberId, data) => {
    return api.put(`/admin/healthRecordRoutes/updateFitnessAssessment/${memberId}`, data);
  },

  updateEmergencyContact: async (memberId, data) => {
    return api.put(`/admin/healthRecordRoutes/updateEmergencyContact/${memberId}`, data);
  },

  addExerciseRestriction: async (memberId, data) => {
    return api.post(`/admin/healthRecordRoutes/addExerciseRestriction/${memberId}`, data);
  },

  // ==================== Leaderboard Management ====================
  addPoints: async (data) => {
    return api.post('/admin/leaderboardRoutes/add-points', data);
  },

  awardBadge: async (data) => {
    return api.post('/admin/leaderboardRoutes/award-badge', data);
  },

  updateAttendanceStreak: async (data) => {
    return api.post('/admin/leaderboardRoutes/update-streak', data);
  },

  // ==================== Resource Management ====================
  getResourceStats: async () => {
    return api.get('/admin/resourceRoutes/stats');
  },

  createResource: async (data) => {
    return api.post('/admin/resourceRoutes', data);
  },

  updateResource: async (id, data) => {
    return api.put(`/admin/resourceRoutes/${id}`, data);
  },

  deleteResource: async (id) => {
    return api.delete(`/admin/resourceRoutes/${id}`);
  },

  toggleFeaturedResource: async (id) => {
    return api.put(`/admin/resourceRoutes/${id}/toggle-featured`);
  },

  // ==================== Attendance Management ====================
  getAttendance: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/attendanceRoutes/getAllAttendance${queryString ? `?${queryString}` : ''}`);
  },

  getAttendanceStats: async () => {
    return api.get('/admin/attendanceRoutes/getAttendanceStats');
  },

  // ==================== Settings Management ====================
  getAdminSettings: async () => {
    return api.get('/admin/settingsRoutes/getAdminSettings');
  },

  updateGeneralSettings: async (data) => {
    return api.put('/admin/settingsRoutes/updateGeneralSettings', data);
  },

  updateNotificationSettings: async (data) => {
    return api.put('/admin/settingsRoutes/updateNotificationSettings', data);
  },

  updateSecuritySettings: async (data) => {
    return api.put('/admin/settingsRoutes/updateSecuritySettings', data);
  },

  // ==================== Profile Management ====================
  getAdminProfile: async () => {
    return api.get('/admin/profileRoutes/getAdminProfile');
  },

  updateAdminProfile: async (data) => {
    return api.put('/admin/profileRoutes/updateAdminProfile', data);
  },

  // ==================== Training Plan Management ====================
  getTrainingPlans: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/trainingPlanRoutes/getAllTrainingPlans${queryString ? `?${queryString}` : ''}`);
  },

  getTrainingPlanById: async (id) => {
    return api.get(`/admin/trainingPlanRoutes/getTrainingPlanById/${id}`);
  },

  createTrainingPlan: async (data) => {
    return api.post('/admin/trainingPlanRoutes/createTrainingPlan', data);
  },

  updateTrainingPlan: async (id, data) => {
    return api.put(`/admin/trainingPlanRoutes/updateTrainingPlan/${id}`, data);
  },

  deleteTrainingPlan: async (id) => {
    return api.delete(`/admin/trainingPlanRoutes/deleteTrainingPlan/${id}`);
  },

  // ==================== Club Join Request Management ====================
  getJoinRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/clubJoinRoutes/getAllJoinRequests${queryString ? `?${queryString}` : ''}`);
  },

  approveJoinRequest: async (id) => {
    return api.put(`/admin/clubJoinRoutes/approveJoinRequest/${id}`);
  },

  rejectJoinRequest: async (id, data) => {
    return api.put(`/admin/clubJoinRoutes/rejectJoinRequest/${id}`, data);
  },

  // ==================== Membership Plan Management ====================
  getMembershipPlans: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/membershipPlanRoutes/getAllMembershipPlans${queryString ? `?${queryString}` : ''}`);
  },

  getMembershipPlanById: async (id) => {
    return api.get(`/admin/membershipPlanRoutes/getMembershipPlan/${id}`);
  },

  createMembershipPlan: async (data) => {
    return api.post('/admin/membershipPlanRoutes/createMembershipPlan', data);
  },

  updateMembershipPlan: async (id, data) => {
    return api.put(`/admin/membershipPlanRoutes/updateMembershipPlan/${id}`, data);
  },

  deleteMembershipPlan: async (id) => {
    return api.delete(`/admin/membershipPlanRoutes/deleteMembershipPlan/${id}`);
  },
};

export default adminService;
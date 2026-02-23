import { api } from '@/lib/api';

const memberService = {
  // ==================== Club Join Requests ====================
  getAvailableClubs: async () => {
    return api.get('/member/clubJoinRequestRoutes/getAvailableClubs');
  },

  requestJoinClub: async (data) => {
    return api.post('/member/clubJoinRequestRoutes/requestJoinClub', data);
  },

  getMyJoinRequests: async () => {
    return api.get('/member/clubJoinRequestRoutes/getMyJoinRequests');
  },

  cancelJoinRequest: async (id) => {
    return api.delete(`/member/clubJoinRequestRoutes/cancelJoinRequest/${id}`);
  },

  // ==================== Dashboard ====================
  getDashboard: async () => {
    return api.get('/member/dashboardRoutes/getMemberDashboard');
  },

  // ==================== Profile ====================
  getProfile: async () => {
    return api.get('/member/profileRoutes/getMemberProfile');
  },

  updateProfile: async (data) => {
    return api.put('/member/profileRoutes/updateMemberProfile', data);
  },

  changePassword: async (data) => {
    return api.put('/member/profileRoutes/password', data);
  },

  // ==================== Attendance ====================
  getAttendance: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/attendanceRoutes/getMemberAttendance${queryString ? `?${queryString}` : ''}`);
  },

  getAttendanceStats: async () => {
    return api.get('/member/attendanceRoutes/getMemberAttendanceStats');
  },

  punchIn: async (data) => {
    return api.post('/member/attendanceRoutes/punchIn', data);
  },

  punchOut: async (data) => {
    return api.post('/member/attendanceRoutes/punchOut', data);
  },

  // ==================== Facilities ====================
  getFacilities: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/facilityRoutes/getMemberFacilities${queryString ? `?${queryString}` : ''}`);
  },

  getFacilityById: async (id) => {
    return api.get(`/member/facilityRoutes/getFacilityById/${id}`);
  },

  // ==================== Payments ====================
  getPayments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/paymentRoutes/getPayments${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== Announcements ====================
  getAnnouncements: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/announcementRoutes/getMemberAnnouncements${queryString ? `?${queryString}` : ''}`);
  },

  getAnnouncementById: async (id) => {
    return api.get(`/member/announcementRoutes/getAnnouncementById/${id}`);
  },

  // ==================== Feedback ====================
  getFeedbackStats: async () => {
    return api.get('/member/feedbackRoutes/getFeedbackStats');
  },

  getMyFeedback: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/feedbackRoutes/getMyFeedback${queryString ? `?${queryString}` : ''}`);
  },

  getFeedbackById: async (id) => {
    return api.get(`/member/feedbackRoutes/getFeedbackById/${id}`);
  },

  submitFeedback: async (data) => {
    return api.post('/member/feedbackRoutes/submitFeedback', data);
  },

  updateFeedback: async (id, data) => {
    return api.put(`/member/feedbackRoutes/updateFeedback/${id}`, data);
  },

  deleteFeedback: async (id) => {
    return api.delete(`/member/feedbackRoutes/deleteFeedback/${id}`);
  },

  // ==================== Messages ====================
  getMessages: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/messageRoutes/getMemberMessages${queryString ? `?${queryString}` : ''}`);
  },

  getMessageById: async (id) => {
    return api.get(`/member/messageRoutes/getMessageById/${id}`);
  },

  sendMessage: async (data) => {
    return api.post('/member/messageRoutes/sendMessage', data);
  },

  markMessageAsRead: async (id) => {
    return api.put(`/member/messageRoutes/markMessageAsRead/${id}`, {});
  },

  // ==================== Health Records ====================
  getHealthRecords: async () => {
    return api.get('/member/healthRecordRoutes/getMemberHealthRecords');
  },

  uploadHealthRecord: async (data) => {
    return api.post('/member/healthRecordRoutes/uploadHealthRecord', data);
  },

  updateHealthRecord: async (id, data) => {
    return api.put(`/member/healthRecordRoutes/updateHealthRecord/${id}`, data);
  },

  getWaivers: async () => {
    return api.get('/member/healthRecordRoutes/getWaivers');
  },

  acknowledgeWaiver: async (data) => {
    return api.post('/member/healthRecordRoutes/waivers/acknowledgeWaiver', data);
  },

  // ==================== Membership ====================
  getMembership: async () => {
    return api.get('/member/membershipRoutes/getMembershipDetails');
  },

  getAvailablePlans: async () => {
    return api.get('/member/membershipRoutes/getAvailablePlans');
  },

  requestUpgrade: async (data) => {
    return api.post('/member/membershipRoutes/requestUpgrade', data);
  },

  renewMembership: async () => {
    return api.post('/member/membershipRoutes/renewMembership');
  },

  // ==================== Sessions ====================
  getSessions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/sessionRoutes/getSessions${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== Training Plans ====================
  getTrainingPlans: async () => {
    return api.get('/member/trainingPlanRoutes/getTrainingPlans');
  },

  // ==================== Events ====================
  getEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/eventRoutes/getAllEvents${queryString ? `?${queryString}` : ''}`);
  },

  getEventById: async (id) => {
    return api.get(`/member/eventRoutes/getEventById/${id}`);
  },

  getMyEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/eventRoutes/getMyEvents${queryString ? `?${queryString}` : ''}`);
  },

  registerForEvent: async (id) => {
    return api.post(`/member/eventRoutes/registerForEvent/${id}`);
  },

  unregisterFromEvent: async (id) => {
    return api.delete(`/member/eventRoutes/unregisterFromEvent/${id}`);
  },

  // ==================== Leaderboard ====================
  getLeaderboard: async () => {
    return api.get('/member/leaderboardRoutes/getLeaderboard');
  },

  // ==================== Settings ====================
  getSettings: async () => {
    return api.get('/member/settingsRoutes/getMemberSettings');
  },

  updateNotificationSettings: async (data) => {
    return api.put('/member/settingsRoutes/updateNotificationSettings', data);
  },

  updatePrivacySettings: async (data) => {
    return api.put('/member/settingsRoutes/updatePrivacySettings', data);
  },

  toggle2FA: async (data) => {
    return api.post('/member/settingsRoutes/toggle2FA', data);
  },
};

export default memberService;
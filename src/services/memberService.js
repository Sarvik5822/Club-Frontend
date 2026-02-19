import { api } from '@/lib/api';

const memberService = {
  // ==================== Club Join Requests ====================
  getAvailableClubs: async () => {
    return api.get('/member/club-join/available-clubs');
  },

  requestJoinClub: async (data) => {
    return api.post('/member/club-join/request', data);
  },

  getMyJoinRequests: async () => {
    return api.get('/member/club-join/my-requests');
  },

  cancelJoinRequest: async (id) => {
    return api.delete(`/member/club-join/request/${id}`);
  },

  // ==================== Dashboard ====================
  getDashboard: async () => {
    return api.get('/member/dashboard');
  },

  // ==================== Profile ====================
  getProfile: async () => {
    return api.get('/member/profile');
  },

  updateProfile: async (data) => {
    return api.put('/member/profile', data);
  },

  // ==================== Attendance ====================
  getAttendance: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/attendance${queryString ? `?${queryString}` : ''}`);
  },

  punchIn: async (data) => {
    return api.post('/member/attendance/punch-in', data);
  },

  punchOut: async (data) => {
    return api.post('/member/attendance/punch-out', data);
  },

  // ==================== Facilities ====================
  getFacilities: async () => {
    return api.get('/member/facilities');
  },

  // ==================== Payments ====================
  getPayments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/payments${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== Announcements ====================
  getAnnouncements: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/member/announcements${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== Feedback ====================
  submitFeedback: async (data) => {
    return api.post('/member/feedback', data);
  },

  // ==================== Messages ====================
  getMessages: async () => {
    return api.get('/member/messages');
  },

  sendMessage: async (data) => {
    return api.post('/member/messages', data);
  },

  // ==================== Membership ====================
  getMembership: async () => {
    return api.get('/member/membership');
  },
};

export default memberService;
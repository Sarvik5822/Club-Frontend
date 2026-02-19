import { api } from '@/lib/api';

const coachService = {
    // ==================== Dashboard ====================
    getDashboard: async () => {
        return api.get('/coach/dashboardRoutes/getCoachDashboard');
    },

    // ==================== Member Management ====================
    getMembers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/memberRoutes/getCoachMembers${queryString ? `?${queryString}` : ''}`);
    },

    // ==================== Session Management ====================
    getSessions: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/sessionRoutes/getCoachSessions${queryString ? `?${queryString}` : ''}`);
    },

    getSchedule: async () => {
        return api.get('/coach/sessionRoutes/getCoachSchedule');
    },

    createSession: async (data) => {
        return api.post('/coach/sessionRoutes/createCoachSession', data);
    },

    updateSession: async (id, data) => {
        return api.put(`/coach/sessionRoutes/updateCoachSession/${id}`, data);
    },

    deleteSession: async (id) => {
        return api.delete(`/coach/sessionRoutes/deleteCoachSession/${id}`);
    },

    updateSchedule: async (data) => {
        return api.put('/coach/sessionRoutes/updateCoachSchedule', data);
    },

    // ==================== Training Plan Management ====================
    getTrainingPlans: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/trainingPlanRoutes/getCoachTrainingPlans${queryString ? `?${queryString}` : ''}`);
    },

    createTrainingPlan: async (data) => {
        return api.post('/coach/trainingPlanRoutes/createCoachTrainingPlan', data);
    },

    updateTrainingPlan: async (id, data) => {
        return api.put(`/coach/trainingPlanRoutes/updateCoachTrainingPlan/${id}`, data);
    },

    deleteTrainingPlan: async (id) => {
        return api.delete(`/coach/trainingPlanRoutes/deleteCoachTrainingPlan/${id}`);
    },

    // ==================== Profile Management ====================
    getProfile: async () => {
        return api.get('/coach/profileRoutes/getCoachProfile');
    },

    updateProfile: async (data) => {
        return api.put('/coach/profileRoutes/updateCoachProfile', data);
    },

    // ==================== Attendance Management ====================
    getAttendance: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/attendanceRoutes/getCoachAttendance${queryString ? `?${queryString}` : ''}`);
    },

    // ==================== Health Record Management ====================
    getHealthRecords: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/healthRecordRoutes/getCoachMemberHealthRecords${queryString ? `?${queryString}` : ''}`);
    },

    getHealthRecordByMemberId: async (memberId) => {
        return api.get(`/coach/healthRecordRoutes/getCoachMemberHealthRecord/${memberId}`);
    },

    // ==================== Resource Management ====================
    getResources: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/resourceRoutes/getCoachResources${queryString ? `?${queryString}` : ''}`);
    },

    createResource: async (data) => {
        return api.post('/coach/resourceRoutes/createCoachResource', data);
    },

    updateResource: async (id, data) => {
        return api.put(`/coach/resourceRoutes/updateCoachResource/${id}`, data);
    },

    // ==================== Leaderboard Management ====================
    addPoints: async (data) => {
        return api.post('/coach/leaderboardRoutes/addPointsToMember', data);
    },

    awardBadge: async (data) => {
        return api.post('/coach/leaderboardRoutes/awardBadgeToMember', data);
    },

    // ==================== Message Management ====================
    getMessages: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/messageRoutes/getCoachMessages${queryString ? `?${queryString}` : ''}`);
    },

    getMessageById: async (id) => {
        return api.get(`/coach/messageRoutes/${id}`);
    },

    sendMessage: async (data) => {
        return api.post('/coach/messageRoutes/sendMessage', data);
    },

    markMessageAsRead: async (id) => {
        return api.put(`/coach/messageRoutes/${id}/read`);
    },

    // ==================== Report Management ====================
    getAttendanceReport: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/reportRoutes/getAttendanceReport${queryString ? `?${queryString}` : ''}`);
    },

    getPerformanceReport: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/reportRoutes/getPerformanceReport${queryString ? `?${queryString}` : ''}`);
    },

    generateReport: async (data) => {
        return api.post('/coach/reportRoutes/generateReport', data);
    },

    exportReport: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/reportRoutes/exportReport${queryString ? `?${queryString}` : ''}`);
    },

    // ==================== Incident Management ====================
    getIncidents: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/coach/incidentRoutes/getAllIncidents${queryString ? `?${queryString}` : ''}`);
    },

    getIncidentStats: async () => {
        return api.get('/coach/incidentRoutes/getIncidentStats');
    },

    getIncidentById: async (id) => {
        return api.get(`/coach/incidentRoutes/getIncidentById/${id}`);
    },

    createIncident: async (data) => {
        return api.post('/coach/incidentRoutes/createIncident', data);
    },

    updateIncident: async (id, data) => {
        return api.put(`/coach/incidentRoutes/updateIncident/${id}`, data);
    },

    deleteIncident: async (id) => {
        return api.delete(`/coach/incidentRoutes/deleteIncident/${id}`);
    },

    resolveIncident: async (id, data) => {
        return api.put(`/coach/incidentRoutes/resolveIncident/${id}`, data);
    },

    // ==================== Settings Management ====================
    getSettings: async () => {
        return api.get('/coach/settingsRoutes/getCoachSettings');
    },

    updateSettings: async (data) => {
        return api.put('/coach/settingsRoutes/updateSettings', data);
    },
};

export default coachService;
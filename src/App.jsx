import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    MessageSquare,
    CreditCard,
    User,
    Settings,
    Users,
    Dumbbell,
    Building,
    Bell,
    AlertCircle,
    Shield,
    IndianRupee,
    Database,
    BarChart3,
    Flag,
    Heart,
    Award,
    Star,
    Upload,
    Clock,
    Calendar,
} from 'lucide-react';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MemberAttendance from './pages/member/Attendance';
import Profile from './pages/member/Profile';
import Facilities from './pages/member/Facilities';
import HealthSafety from './pages/member/HealthSafety';
import MemberSettings from './pages/member/Settings';
import MemberAnnouncements from './pages/member/Announcements';
import Membership from './pages/member/Membership';
import Feedback from './pages/member/Feedback';
import Payments from './pages/member/Payments';
import MemberMessages from './pages/member/Messages';

// Coach Pages - UPDATED for walk-in model
import CoachDashboard from './pages/coach/Dashboard';
import Members from './pages/coach/Members';
import MemberDetail from './pages/coach/MemberDetail';
import TrainingPlans from './pages/coach/TrainingPlans';
import CoachReports from './pages/coach/Reports';
import CoachProfile from './pages/coach/Profile';
import CoachSettings from './pages/coach/Settings';
import CoachMessages from './pages/coach/Messages';
import Incidents from './pages/coach/Incidents';
import Resources from './pages/coach/Resources';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminMemberDetail from './pages/admin/MemberDetail';
import Coaches from './pages/admin/Coaches';
import AdminFacilities from './pages/admin/Facilities';
import AdminPayments from './pages/admin/Payments';
import Announcements from './pages/admin/Announcements';
import Complaints from './pages/admin/Complaints';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminHealthSafety from './pages/admin/HealthSafety';
import AdminProfile from './pages/admin/Profile';
import AdminAttendance from './pages/admin/Attendance';
import AdminEvents from './pages/admin/Events';
import AdminMembershipPlans from './pages/admin/MembershipPlans';

// Superadmin Pages
import SuperadminDashboard from './pages/superadmin/Dashboard';
import Admins from './pages/superadmin/Admins';
import Roles from './pages/superadmin/Roles';
import Branches from './pages/superadmin/Branches';
import Pricing from './pages/superadmin/Pricing';
import PaymentGateways from './pages/superadmin/PaymentGateways';
import MasterData from './pages/superadmin/MasterData';
import AuditLogs from './pages/superadmin/AuditLogs';
import Analytics from './pages/superadmin/Analytics';
import SuperadminProfile from './pages/superadmin/Profile';

import Layout from './components/layout/Layout';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return <>{children}</>;
}

// Navigation items for each role - UPDATED for walk-in model
const memberNavItems = [
    { label: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard },
    { label: 'Sports & Facilities', href: '/member/facilities', icon: Building },
    { label: 'Attendance', href: '/member/attendance', icon: Award },
    { label: 'Membership', href: '/member/membership', icon: CreditCard },
    { label: 'Payments', href: '/member/payments', icon: IndianRupee },
    { label: 'Messages', href: '/member/messages', icon: MessageSquare },
    { label: 'Announcements', href: '/member/announcements', icon: Bell },
    { label: 'Feedback', href: '/member/feedback', icon: Star },
    { label: 'Health & Safety', href: '/member/health-safety', icon: Heart },
    { label: 'Profile', href: '/member/profile', icon: User },
    { label: 'Settings', href: '/member/settings', icon: Settings },
];

// UPDATED: Coach navigation for walk-in model
const coachNavItems = [
    { label: 'Dashboard', href: '/coach/dashboard', icon: LayoutDashboard },
    { label: 'Members', href: '/coach/members', icon: Users },
    { label: 'Training Plans', href: '/coach/training-plans', icon: Dumbbell },
    { label: 'Training Resources', href: '/coach/resources', icon: Upload },
    { label: 'Messages', href: '/coach/messages', icon: MessageSquare },
    { label: 'Reports', href: '/coach/reports', icon: BarChart3 },
    { label: 'Incident Reports', href: '/coach/incidents', icon: AlertCircle },
    { label: 'Profile', href: '/coach/profile', icon: User },
    { label: 'Settings', href: '/coach/settings', icon: Settings },
];

const adminNavItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Members', href: '/admin/members', icon: Users },
    { label: 'Coaches', href: '/admin/coaches', icon: Dumbbell },
    { label: 'Membership Plans', href: '/admin/membership-plans', icon: IndianRupee },
    { label: 'Attendance', href: '/admin/attendance', icon: Clock },
    { label: 'Events', href: '/admin/events', icon: Calendar },
    { label: 'Facilities', href: '/admin/facilities', icon: Building },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Announcements', href: '/admin/announcements', icon: Bell },
    { label: 'Complaints', href: '/admin/complaints', icon: AlertCircle },
    { label: 'Health & Safety', href: '/admin/health-safety', icon: Heart },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Profile', href: '/admin/profile', icon: User },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const superadminNavItems = [
    { label: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
    { label: 'Admins & Roles', href: '/superadmin/admins', icon: Shield },
    { label: 'Branches', href: '/superadmin/branches', icon: Building },
    { label: 'Pricing Plans', href: '/superadmin/pricing', icon: IndianRupee },
    { label: 'Payment Gateways', href: '/superadmin/payment-gateways', icon: CreditCard },
    { label: 'Master Data', href: '/superadmin/master-data', icon: Database },
    { label: 'Audit Logs', href: '/superadmin/audit-logs', icon: Flag },
    { label: 'Analytics', href: '/superadmin/analytics', icon: BarChart3 },
    { label: 'Profile', href: '/superadmin/profile', icon: User },
    { label: 'Settings', href: '/superadmin/settings', icon: Settings },
];

const App = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Member Routes - UPDATED: Removed booking and schedule routes */}
                        <Route path="/member" element={<ProtectedRoute allowedRoles={['member']}><Layout sidebarItems={memberNavItems} /></ProtectedRoute>}>
                            <Route path="dashboard" element={<MemberDashboard />} />
                            <Route path="facilities" element={<Facilities />} />
                            <Route path="attendance" element={<MemberAttendance />} />
                            <Route path="membership" element={<Membership />} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="messages" element={<MemberMessages />} />
                            <Route path="announcements" element={<MemberAnnouncements />} />
                            <Route path="feedback" element={<Feedback />} />
                            <Route path="health-safety" element={<HealthSafety />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<MemberSettings />} />
                        </Route>

                        {/* Coach Routes - UPDATED for walk-in model */}
                        <Route path="/coach" element={<ProtectedRoute allowedRoles={['coach']}><Layout sidebarItems={coachNavItems} /></ProtectedRoute>}>
                            <Route path="dashboard" element={<CoachDashboard />} />
                            <Route path="members" element={<Members />} />
                            <Route path="members/:id" element={<MemberDetail />} />
                            <Route path="training-plans" element={<TrainingPlans />} />
                            <Route path="resources" element={<Resources />} />
                            <Route path="messages" element={<CoachMessages />} />
                            <Route path="reports" element={<CoachReports />} />
                            <Route path="incidents" element={<Incidents />} />
                            <Route path="profile" element={<CoachProfile />} />
                            <Route path="settings" element={<CoachSettings />} />
                        </Route>

                        {/* Admin Routes - UPDATED: Added Events and Membership Plans routes */}
                        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout sidebarItems={adminNavItems} /></ProtectedRoute>}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="members" element={<AdminMembers />} />
                            <Route path="members/:id" element={<AdminMemberDetail />} />
                            <Route path="coaches" element={<Coaches />} />
                            <Route path="membership-plans" element={<AdminMembershipPlans />} />
                            <Route path="attendance" element={<AdminAttendance />} />
                            <Route path="events" element={<AdminEvents />} />
                            <Route path="facilities" element={<AdminFacilities />} />
                            <Route path="payments" element={<AdminPayments />} />
                            <Route path="announcements" element={<Announcements />} />
                            <Route path="complaints" element={<Complaints />} />
                            <Route path="health-safety" element={<AdminHealthSafety />} />
                            <Route path="reports" element={<AdminReports />} />
                            <Route path="profile" element={<AdminProfile />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Route>

                        {/* Superadmin Routes */}
                        <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin']}><Layout sidebarItems={superadminNavItems} /></ProtectedRoute>}>
                            <Route path="dashboard" element={<SuperadminDashboard />} />
                            <Route path="admins" element={<Admins />} />
                            <Route path="roles" element={<Roles />} />
                            <Route path="branches" element={<Branches />} />
                            <Route path="pricing" element={<Pricing />} />
                            <Route path="payment-gateways" element={<PaymentGateways />} />
                            <Route path="master-data" element={<MasterData />} />
                            <Route path="audit-logs" element={<AuditLogs />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="profile" element={<SuperadminProfile />} />
                            <Route path="settings" element={<MemberSettings />} />
                        </Route>

                        {/* Default Routes */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
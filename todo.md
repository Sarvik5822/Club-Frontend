<!-- # Multi-Sports Club Management System - Development Plan

## Design Guidelines

### Design References
- **Dribbble Fitness Dashboards**: Modern, clean layouts with card-based designs
- **Strava/MyFitnessPal**: User-friendly fitness tracking interfaces
- **Style**: Modern Minimalism + Dark/Light Mode + Health & Fitness Aesthetic

### Color Palette
- Primary: #10b981 (Emerald Green - energetic & health)
- Accent: #3b82f6 (Blue - actions & links)
- Success: #22c55e (Green - confirmations)
- Warning: #f59e0b (Amber - alerts)
- Danger: #ef4444 (Red - destructive actions)
- Neutral Light: #f9fafb (gray-50 - backgrounds)
- Neutral Dark: #111827 (gray-900 - dark mode backgrounds)
- Text Light: #1f2937 (gray-800)
- Text Dark: #f9fafb (gray-50)

### Typography
- Font Family: Inter (clean, modern sans-serif)
- Heading1: font-weight 700 (36px)
- Heading2: font-weight 600 (30px)
- Heading3: font-weight 600 (24px)
- Heading4: font-weight 600 (20px)
- Body/Normal: font-weight 400 (14px)
- Body/Emphasis: font-weight 600 (14px)
- Small: font-weight 400 (12px)

### Key Component Styles
- **Buttons**: Rounded-md (6px), primary uses emerald-600, hover: emerald-700, transitions 150ms
- **Cards**: White/gray-800 background, shadow-sm, rounded-lg (8px), border subtle
- **Inputs**: Border-gray-300/gray-700, focus: ring-2 ring-emerald-500, rounded-md
- **Badges**: Rounded-full, small padding, color-coded by status
- **Tables**: Striped rows, hover effects, sticky headers
- **Modals**: Backdrop blur, slide-in animation, max-w-2xl

### Layout & Spacing
- Sidebar: Fixed 256px desktop, collapsible mobile with overlay
- Navbar: 64px height, sticky top
- Content padding: 24px (p-6)
- Card gaps: 16px-24px (gap-4 to gap-6)
- Section margins: 32px (space-y-8)
- Responsive breakpoints: 640px (sm), 1024px (lg), 1280px (xl)

### Images to Generate
1. **hero-fitness-dashboard.jpg** - Modern fitness dashboard hero image with charts and activity (Style: photorealistic, vibrant, energetic)
2. **sports-equipment-collage.jpg** - Various sports equipment (dumbbells, yoga mat, tennis racket, swimming goggles) (Style: photorealistic, bright lighting)
3. **coach-training-session.jpg** - Professional coach training a client in gym setting (Style: photorealistic, motivational)
4. **member-workout-progress.jpg** - Person tracking workout progress on tablet/phone (Style: photorealistic, modern tech)

---

## Development Tasks

### Phase 1: Core Setup & Authentication (Files 1-8)
1. **tailwind.config.ts** - Update with custom colors (emerald primary, blue accent), Inter font, custom animations
2. **src/index.css** - Add global styles, scrollbar customization, dark mode variables
3. **src/lib/auth.ts** - Auth context with role management (member/coach/admin/superadmin), login/logout functions
4. **src/lib/types.ts** - TypeScript interfaces for User, Member, Coach, Session, Booking, Payment, etc.
5. **src/lib/mock-data.ts** - Mock data for all entities (users, sessions, bookings, payments, facilities)
6. **src/components/layout/Navbar.tsx** - Global navbar with search, notifications bell, avatar dropdown, theme toggle, role switcher
7. **src/components/layout/Sidebar.tsx** - Collapsible sidebar with role-based navigation items
8. **src/components/layout/Layout.tsx** - Main layout wrapper combining navbar + sidebar + content area

### Phase 2: Authentication Pages (Files 9-11)
9. **src/pages/auth/Login.tsx** - Login page with role tabs (Member/Coach/Admin/Superadmin), email/password form
10. **src/pages/auth/Register.tsx** - Member registration form with personal info, membership selection
11. **src/pages/auth/ForgotPassword.tsx** - Password reset request form

### Phase 3: Member Portal (Files 12-20)
12. **src/pages/member/Dashboard.tsx** - Welcome card, membership status, upcoming sessions, quick stats, notifications feed
13. **src/pages/member/BookSessions.tsx** - Filters (sport/date/coach/location), calendar view, class cards with booking
14. **src/pages/member/MySchedule.tsx** - Full calendar with booked sessions, color-coded by sport, cancel/reschedule
15. **src/pages/member/Progress.tsx** - Charts for attendance, weight tracking, calories burned, workout streak
16. **src/pages/member/Messages.tsx** - Inbox/sent messages, conversation view, compose new message
17. **src/pages/member/Payments.tsx** - Invoice list, payment history, upcoming payments, download receipts
18. **src/pages/member/Profile.tsx** - Tabs: Personal info, Health data, Emergency contacts, Documents upload
19. **src/components/member/SessionCard.tsx** - Reusable session card component with booking button
20. **src/components/member/BookingModal.tsx** - Modal for session details and booking confirmation

### Phase 4: Coach Portal (Files 21-28)
21. **src/pages/coach/Dashboard.tsx** - Today's agenda timeline, KPI cards (clients today, completion rate), quick actions
22. **src/pages/coach/Schedule.tsx** - Calendar with drag-drop, availability block editor, session management
23. **src/pages/coach/Clients.tsx** - Client list/grid with search, filters, click for detail view
24. **src/pages/coach/ClientDetail.tsx** - Tabs: Overview stats, Performance history charts, Training notes, Health docs
25. **src/pages/coach/SessionDetail.tsx** - Participant list with attendance checkboxes, notes field, end session button
26. **src/pages/coach/TrainingPlans.tsx** - Create/edit training plan templates, assign to clients
27. **src/pages/coach/Reports.tsx** - Generate reports with filters, export to PDF/Excel
28. **src/components/coach/AttendanceMarker.tsx** - Quick attendance marking component

### Phase 5: Admin Portal (Files 29-37)
29. **src/pages/admin/Dashboard.tsx** - KPI cards (active members, revenue, occupancy), sparkline charts, activity feed
30. **src/pages/admin/Members.tsx** - Advanced table with search/sort/filter, bulk actions, status management
31. **src/pages/admin/MemberDetail.tsx** - Full profile editor, membership change, activity log, notes
32. **src/pages/admin/Coaches.tsx** - Coach management table, approval workflow, certification tracking
33. **src/pages/admin/Facilities.tsx** - Master calendar (resource view), create/edit class templates, drag-drop scheduling
34. **src/pages/admin/Payments.tsx** - Invoice list with status filters, refund processing, payment method management
35. **src/pages/admin/Announcements.tsx** - Create/edit announcements, target audience selection, scheduling
36. **src/pages/admin/Complaints.tsx** - Complaint list with priority/status, assignment to staff, resolution tracking
37. **src/components/admin/MemberModal.tsx** - Add/edit member modal with form validation

### Phase 6: Superadmin Portal (Files 38-46)
38. **src/pages/superadmin/Dashboard.tsx** - Multi-club overview, global KPIs, revenue charts, per-branch cards
39. **src/pages/superadmin/Admins.tsx** - Admin user management, role assignment, 2FA status, last login tracking
40. **src/pages/superadmin/Roles.tsx** - RBAC matrix view (role vs permission toggles), create custom roles
41. **src/pages/superadmin/Branches.tsx** - Branch/club management, add new locations, settings per branch
42. **src/pages/superadmin/Pricing.tsx** - Membership plan cards, create/edit plans with features, trial periods
43. **src/pages/superadmin/PaymentGateways.tsx** - Configure payment providers (Stripe, PayPal), API keys management
44. **src/pages/superadmin/MasterData.tsx** - Manage sports types, facility types, tags, categories
45. **src/pages/superadmin/AuditLogs.tsx** - Filterable audit log table with timestamp, actor, action, changes diff
46. **src/pages/superadmin/Analytics.tsx** - Customizable dashboard with drag-drop widgets, pre-built reports

### Phase 7: Shared Components (Files 47-55)
47. **src/components/ui/SearchBar.tsx** - Global search with contextual results
48. **src/components/ui/NotificationCenter.tsx** - Notification dropdown with mark as read, clear all
49. **src/components/ui/ThemeToggle.tsx** - Dark/light mode toggle button
50. **src/components/ui/StatCard.tsx** - Reusable KPI card with icon, value, trend indicator
51. **src/components/ui/DataTable.tsx** - Advanced table with sorting, filtering, pagination, bulk actions
52. **src/components/ui/CalendarView.tsx** - Full calendar component with event handling
53. **src/components/ui/ConfirmDialog.tsx** - Reusable confirmation dialog for destructive actions
54. **src/components/ui/LoadingSkeleton.tsx** - Loading skeleton for various content types
55. **src/components/ui/EmptyState.tsx** - Empty state component with icon and call-to-action

### Phase 8: Routing & Final Integration (Files 56-58)
56. **src/App.tsx** - Update with all routes, protected route wrapper, role-based redirects
57. **src/pages/NotFound.tsx** - 404 page with navigation back to dashboard
58. **index.html** - Update title, meta tags, favicon

### Phase 9: Mobile Optimization
59. **src/components/layout/MobileNav.tsx** - Bottom navigation bar for mobile (4-5 primary actions per role)
60. **src/components/layout/MobileMenu.tsx** - Full-screen mobile menu overlay

---

## Implementation Notes

- All forms include validation with error messages
- Optimistic UI updates for better UX (booking, attendance marking)
- Toast notifications for success/error feedback
- Loading states with skeletons for all data fetching
- Responsive design with mobile-first approach
- Dark mode support throughout
- Accessibility: proper ARIA labels, keyboard navigation
- Mock data simulates real backend responses with delays
- Local storage for auth state persistence
- Role-based route protection and UI element visibility -->

# Multi-Sports Club Management System - Walk-in Model Update

## Updated Member Portal Requirements

### Key Changes from Previous Version:
- **REMOVED**: Session booking functionality (BookSessions, MySchedule)
- **REMOVED**: Progress tracking with calories/workout stats
- **REMOVED**: Leaderboard and Events
- **UPDATED**: Attendance now uses biometric punch-in/punch-out
- **UPDATED**: Dashboard focuses on facility access and membership info
- **KEPT**: Profile, Payments, Health & Safety, Messages, Settings

---

## Member Portal Structure (Walk-in Model)

### 1️⃣ Dashboard (Home)
- Welcome message + profile snapshot
- Membership type & expiry date
- **Biometric Punch-in / Punch-out button**
- Last visit time & total hours (week/month)
- Notifications & announcements feed
- Quick stats: visits this week/month, total hours

### 2️⃣ Profile Section
- Personal info: Name, DOB, gender, contact, address
- Membership info: Plan details, activities/sports included, multi-club access
- Health & medical info: Allergies, conditions, fitness certificates
- Emergency contact(s)
- Update personal info (with admin approval if needed)

### 3️⃣ Sports & Facilities
- List of accessible sports/activities under membership
- Facility details (pool type, gym equipment, mats, etc.)
- Safety rules, max occupancy, age restrictions
- Coach/trainer info (for guidance, not scheduling)

### 4️⃣ Attendance / Punch-in & Punch-out
- **Self-marked attendance** using biometric fingerprint
- Records for each visit:
  - Punch-in time
  - Punch-out time
  - Total duration
- Works across all clubs with same activity/plan
- Attendance history: Daily, weekly, monthly summaries

### 5️⃣ Payments & Membership
- View active membership plan(s) & benefits
- Online payment / renewal / upgrade
- Payment history & downloadable invoices/receipts
- Renewal reminders and alerts

### 6️⃣ Communication / Notifications
- Club announcements and updates
- Support / feedback / complaints submission

### 7️⃣ Health & Safety Section
- View / upload medical certificates
- Acknowledge liability waivers
- Emergency contacts for incident handling

### 8️⃣ Settings / Preferences
- Change password / security settings / 2FA
- Notification preferences (email / push)
- Privacy and consent settings

---

## Files to Update/Remove

### Files to Remove:
- src/pages/member/BookSessions.jsx (no booking needed)
- src/pages/member/MySchedule.jsx (no scheduled sessions)
- src/pages/member/Progress.jsx (simplified stats in dashboard)
- src/pages/member/Leaderboard.jsx (not needed)
- src/pages/member/Events.jsx (not needed)
- src/pages/member/Schedule.jsx (no schedules)

### Files to Update:
- src/App.jsx (remove routes for deleted pages)
- src/pages/member/Dashboard.jsx (add biometric punch, remove booking)
- src/pages/member/Attendance.jsx (update to biometric punch-in/out model)
- src/pages/member/Facilities.jsx (show accessible facilities)
- src/pages/member/Profile.jsx (update with membership details)
- src/pages/member/Membership.jsx (show plan details, multi-club access)
- src/pages/member/Payments.jsx (keep as is)
- src/pages/member/HealthSafety.jsx (keep as is)
- src/pages/member/Messages.jsx (keep as is)
- src/pages/member/Announcements.jsx (keep as is)
- src/pages/member/Feedback.jsx (keep as is)
- src/pages/member/Settings.jsx (keep as is)

### Mock Data Updates:
- src/lib/mockData.js (add biometric attendance records, remove bookings)

---

## Implementation Plan

1. Update mockData.js with biometric attendance records
2. Update Dashboard with punch-in/out functionality
3. Update Attendance page with biometric records
4. Update Facilities page to show accessible facilities
5. Update Membership page with multi-club access info
6. Update App.jsx to remove deleted page routes
7. Remove obsolete files